import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchDocumentsApi } from "../api/documentApi";
import { startChatApi, sendMessageApi } from "../api/chatApi";

const Chat = () => {
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Init chat
  useEffect(() => {
    const initChat = async () => {
      try {
        const docs = await fetchDocumentsApi();
        console.log("full res",docs)
        const hasResume = docs?.data?.some(d => d.type === "resume");
        const hasJD = docs?.data?.some(d => d.type === "jd");

        if (!hasResume || !hasJD) {
          toast.error("Please upload both Resume and Job Description first.");
          return;
        }

        const res = await startChatApi();
        setSessionId(res.chatId);

        if (res.questions?.length > 0) {
          setQuestions(res.questions);
          setMessages([{ role: "ai", content: res.questions[0] }]);
          setCurrentQuestionIndex(0);
        }
      } catch (err) {
        console.error("Init chat error:", err);
        toast.error("Failed to start chat. Try again.");
      }
    };

    initChat();
  }, []);

  // Send answer to backend
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!sessionId) {
      toast.error("Chat session not initialized!");
      return;
    }

    if (currentQuestionIndex >= questions.length) {
      toast.info("✅ You have completed all interview questions!");
      return;
    }

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessageApi(sessionId, input);
      if (!res || !res.reply) {
        toast.error("Unexpected server response");
        setLoading(false);
        return;
      }

      const { reply, nextQuestion } = res;

      const feedbackMessage = {
        role: "ai",
        content: `**Feedback:** ${reply.feedback || "No feedback"}\n\n**Score:** ${reply.score ?? "N/A"}/10`,
      };
      setMessages(prev => [...prev, feedbackMessage]);

      if (nextQuestion) {
        setMessages(prev => [...prev, { role: "ai", content: nextQuestion }]);
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setCurrentQuestionIndex(questions.length);
        toast.success("🎉 Interview completed! Great job!");
      }
    } catch (err) {
      console.error("Send message error:", err);
      toast.error("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseChat = () => {
    navigate("/upload");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-indigo-600">AI Interview Chat</h1>
          {questions.length > 0 && (
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Question {Math.min(currentQuestionIndex + 1, questions.length)} of {questions.length}
            </span>
          )}
        </div>
        <span className="text-sm text-gray-600">
          {user?.name ? `Welcome, ${user.name}` : ""}
        </span>
        <button
          onClick={handleCloseChat}
          className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Close Chat
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-line ${
                msg.role === "user" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-900"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {currentQuestionIndex >= questions.length && messages.length > 0 && (
          <div className="flex justify-center">
            <div className="bg-green-100 text-green-800 px-6 py-3 rounded-2xl text-sm font-medium">
              🎉 Interview Completed! You answered all {questions.length} questions.
            </div>
          </div>
        )}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-700 px-4 py-2 rounded-2xl animate-pulse">
              AI is typing...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            currentQuestionIndex >= questions.length 
              ? "Interview completed!" 
              : "Type your answer..."
          }
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={loading || currentQuestionIndex >= questions.length}
        />
        <button
          type="submit"
          disabled={loading || !input.trim() || currentQuestionIndex >= questions.length}
          className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 disabled:opacity-50"
        >
          {currentQuestionIndex >= questions.length ? "Completed" : "Send"}
        </button>
      </form>
    </div>
  );
};

export default Chat;