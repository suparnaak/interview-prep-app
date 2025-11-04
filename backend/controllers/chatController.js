const Chat = require("../models/Chat");
const Document = require("../models/Document");
const { generateText } = require("../utils/geminiService");
const PROMPTS = require('../constants/prompts');
const MESSAGES = require('../constants/messages');
const STATUS_CODES = require('../constants/statusCodes');
const CONSTANTS = require('../constants/otherConstants');
const { sendSuccess, sendError } = require("../utils/helpers");


// Helper to clean AI response
const cleanAIResponse = (text) => {
  if (!text) return text;
  return text.replace(/```json|```/g, "").trim();
};


exports.startChat = async (req, res) => {
  try {
    const userId = req.userId;
    const jdDoc = await Document.findOne({ userId, type: CONSTANTS.DOC.TYPES.JD });
    const resumeDoc = await Document.findOne({ userId, type: CONSTANTS.DOC.TYPES.RESUME });

    if (!jdDoc || !resumeDoc) {
      return sendError(res, STATUS_CODES.BAD_REQUEST, MESSAGES.DOCUMENT.REQUIRED);
    }

    const jdText = jdDoc.chunks.map((c) => c.text).join("\n");
    const prompt = PROMPTS.initialQuestionsFromJD(jdText);
    let aiResponse = await generateText(prompt);
    aiResponse = cleanAIResponse(aiResponse);

    const { questions } = JSON.parse(aiResponse);

    const chat = await Chat.create({
      userId,
      initialQuestions: questions, 
      messages: [{ role: CONSTANTS.ROLE.AI, content: questions[0] }], 
    });

    return sendSuccess(res, STATUS_CODES.OK, null, { chatId: chat._id, questions }, true);
  } catch (error) {
    console.error("Error in startChat:", error);
    return sendError(res, STATUS_CODES.INTERNAL_SERVER_ERROR, MESSAGES.SERVER.CHAT_START_ERROR);
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;
    const userId = req.userId;

    if (!chatId || !message) {
      return sendError(res, STATUS_CODES.BAD_REQUEST, MESSAGES.CHAT.MISSING_FIELDS);
    }

    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return sendError(res, STATUS_CODES.BAD_REQUEST, MESSAGES.CHAT.NOT_FOUND);
    }

    const resumeDoc = await Document.findOne({ userId, type: CONSTANTS.DOC.TYPES.RESUME });
    const resumeChunks = resumeDoc?.chunks?.slice(0, 5) || [];

    const lastQuestion = chat.messages
      .filter(msg => msg.role === CONSTANTS.ROLE.AI && !msg.content.includes('feedback'))
      .slice(-1)[0]?.content;

    const evalPrompt = PROMPTS.evaluateAnswerWithResume(lastQuestion, message, resumeChunks);
    let evalResponse = await generateText(evalPrompt);
    evalResponse = cleanAIResponse(evalResponse);

    let reply;
    try {
      reply = JSON.parse(evalResponse);
    } catch {
      reply = { feedback: MESSAGES.AI.INVALID_FORMAT, score: 0 };
    }

    chat.messages.push({ role: CONSTANTS.ROLE.USER, content: message });
    chat.messages.push({ 
      role: CONSTANTS.ROLE.AI, 
      content: `**Feedback:** ${reply.feedback}\n\n**Score:** ${reply.score}/10` 
    });

    let nextQuestion = null;
    const questionCount = chat.messages.filter(msg => 
      msg.role === CONSTANTS.ROLE.AI && !msg.content.includes('Feedback')
    ).length;

    if (questionCount < chat.initialQuestions.length) {
      nextQuestion = chat.initialQuestions[questionCount]; 
      chat.messages.push({ role: CONSTANTS.ROLE.AI, content: nextQuestion });
    }

    await chat.save();
    return sendSuccess(res, STATUS_CODES.OK, null, { reply, nextQuestion }, true);

  } catch (error) {
    console.error("Error in sendMessage:", error);
    return sendError(res, STATUS_CODES.INTERNAL_SERVER_ERROR, MESSAGES.SERVER.CHAT_SEND_ERROR);
  }
};