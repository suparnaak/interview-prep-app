const { GoogleGenerativeAI } = require("@google/generative-ai"); // ✅ Correct package
const { AI } = require('../constants/otherConstants');
const MESSAGES = require("../constants/messages");

if (!process.env.GEMINI_API_KEY) {
  throw new Error(MESSAGES.AI.NO_KEY);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chatModel = genAI.getGenerativeModel({ model: AI.GEMINI_CHAT_MODEL });
const embeddingModel = genAI.getGenerativeModel({ model: AI.GEMINI_EMBEDDING_MODEL });

const generateText = async (prompt) => {
  const result = await chatModel.generateContent(prompt);
  return result.response.text().trim();
};

const getEmbedding = async (text) => {
  const result = await embeddingModel.embedContent(text);
  return result.embedding?.values || [];
};

module.exports = {
  genAI,
  chatModel,
  embeddingModel,
  generateText,
  getEmbedding,
};
