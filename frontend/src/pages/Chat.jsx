import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchDocumentsApi } from "../api/documentApi";
import api from "../utils/axiosInstance";
import { startChatApi, sendMessageApi } from "../api/chatApi";

const Chat = () => {
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const initChat = async () => {
      try {
        const docs = await fetchDocumentsApi();
        const hasResume = docs.documents?.some((d) => d.type === "resume");
        const hasJD = docs.documents?.some((d) => d.type === "jd");
        
        if (!hasResume || !hasJD) {
          toast.error("Please upload both Resume and Job Description first.");
          return;
        }

        const res = await startChatApi();  
        setSessionId(res.data.sessionId);
        setMessages(
          res.data.questions.map((q) => ({ role: "assistant", content: q }))
        );
      } catch (err) {
        console.error('Init chat error:', err);
        toast.error("Failed to start chat. Try again.");
      }
    };
    initChat();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessageApi(sessionId, input);

      const botMessage = {
        role: "assistant",
        content: `${res.data.reply}\n\n**Score:** ${res.data.score}/10`,
        citations: res.data.citations,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Send message error:', err);
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
        <h1 className="text-lg font-semibold text-indigo-600">AI Interview Chat</h1>
        <span className="text-sm text-gray-600">
          {user?.name ? `Welcome, ${user.name}` : ""}
        </span>
         <button
            onClick={handleCloseChat}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Close chat and go back to dashboard"
          >
            Close Chat
          </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {msg.content}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-2 text-xs text-blue-600 underline">
                  {msg.citations.map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() => alert(`Resume snippet: ${c.text}`)}
                      className="mr-2 hover:text-blue-800"
                    >
                      [View {idx + 1}]
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-700 px-4 py-2 rounded-2xl animate-pulse">
              AI is typing...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="p-4 bg-white shadow-inner flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
};
export default Chat;
