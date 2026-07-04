import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Trash2, Plus, MessageSquare, Clock } from "lucide-react";
import api from "../services/api";
import { ChatMessage } from "../types";
import toast from "react-hot-toast";

const SUGGESTIONS = [
  "What schemes am I eligible for?",
  "मुझे कौन सी योजनाएं मिल सकती हैं?",
  "PM Kisan Yojana ke baare mein batao",
  "How to apply for Ayushman Bharat?",
];

const GREETING: ChatMessage = {
  role: "assistant",
  content: "Namaste! 🙏 I am JanSahayak AI. I can help you find government schemes you're eligible for, explain application processes, and answer your questions in Hindi or English. How can I help you today?",
};

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
}

const SESSIONS_KEY = "jansahayak_sessions";
const ACTIVE_KEY = "jansahayak_active_session";

function loadSessions(): ChatSession[] {
  try {
    const saved = localStorage.getItem(SESSIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

function getTitle(messages: ChatMessage[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "New Chat";
  return first.content.length > 40 ? first.content.slice(0, 40) + "…" : first.content;
}

export default function ChatBot() {
  const [sessions, setSessions] = useState<ChatSession[]>(loadSessions);
  const [activeId, setActiveId] = useState<string>(() => {
    return localStorage.getItem(ACTIVE_KEY) || "";
  });
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const id = localStorage.getItem(ACTIVE_KEY);
    if (id) {
      const sessions = loadSessions();
      const session = sessions.find((s) => s.id === id);
      if (session) return session.messages;
    }
    return [GREETING];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // persist messages into active session
  useEffect(() => {
    if (messages.length <= 1) return;
    setSessions((prev) => {
      const existing = prev.find((s) => s.id === activeId);
      let updated: ChatSession[];
      if (existing) {
        updated = prev.map((s) => s.id === activeId ? { ...s, messages, title: getTitle(messages) } : s);
      } else {
        const newSession: ChatSession = {
          id: activeId || Date.now().toString(),
          title: getTitle(messages),
          messages,
          createdAt: Date.now(),
        };
        if (!activeId) setActiveId(newSession.id);
        localStorage.setItem(ACTIVE_KEY, newSession.id);
        updated = [newSession, ...prev];
      }
      saveSessions(updated);
      return updated;
    });
  }, [messages]);

  const switchSession = (session: ChatSession) => {
    setActiveId(session.id);
    setMessages(session.messages);
    localStorage.setItem(ACTIVE_KEY, session.id);
  };

  const newChat = () => {
    const id = Date.now().toString();
    setActiveId(id);
    setMessages([GREETING]);
    localStorage.setItem(ACTIVE_KEY, id);
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      saveSessions(updated);
      return updated;
    });
    if (activeId === id) {
      newChat();
    }
  };

  const send = async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;
    setInput("");

    const newMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const firstUserIdx = newMessages.findIndex((m) => m.role === "user");
      const { data } = await api.post("/chat", { messages: newMessages.slice(firstUserIdx) });
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch {
      toast.error("AI service error. Please try again.");
      setMessages(newMessages.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full max-h-[calc(100vh-8rem)] gap-4">

      {/* History Sidebar */}
      <div className="w-60 flex-shrink-0 flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-gray-800">
          <button
            onClick={newChat}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
          >
            <Plus size={15} />
            New Chat
          </button>
        </div>

        <div className="px-3 py-2 flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
          <Clock size={11} />
          History
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
          {sessions.length === 0 && (
            <p className="text-xs text-gray-600 text-center py-6 px-3">No chat history yet. Start a conversation!</p>
          )}
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => switchSession(session)}
              className={`group flex items-start gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                activeId === session.id
                  ? "bg-blue-600/20 border border-blue-500/30"
                  : "hover:bg-gray-800 border border-transparent"
              }`}
            >
              <MessageSquare size={13} className="text-gray-500 flex-shrink-0 mt-0.5" />
              <span className={`text-xs flex-1 leading-relaxed line-clamp-2 ${
                activeId === session.id ? "text-blue-300" : "text-gray-400"
              }`}>
                {session.title}
              </span>
              <button
                onClick={(e) => deleteSession(e, session.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all flex-shrink-0 mt-0.5"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white">JanSahayak AI Copilot</h1>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
              Online · Powered by Gemini
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={14} className="text-blue-400" />
                </div>
              )}
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-sm"
                  : "bg-gray-800 text-gray-100 rounded-tl-sm border border-gray-700"
              }`}>
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <User size={14} className="text-orange-400" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                <Bot size={14} className="text-blue-400" />
              </div>
              <div className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)}
                className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-3 py-1.5 rounded-full transition-colors">
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-3">
          <input
            className="input flex-1"
            placeholder="Ask about government schemes, eligibility, or application process..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            disabled={loading}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="w-11 h-11 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg flex items-center justify-center transition-all flex-shrink-0"
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
