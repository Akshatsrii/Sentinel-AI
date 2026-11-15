import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  Send, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  Flame, 
  Calendar, 
  UserCheck, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

export default function AICopilotDrawer({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello Sarah & Alex! I am your **Executive Email Copilot**. I have indexed all your connected inboxes and can help you prioritize, summarize threads, identify urgent bottlenecks, or check pending client approvals.\n\nTry asking me a question or click one of the quick suggestions below.`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    "Which emails need client attention?",
    "Summarize today's emails",
    "Show urgent & high priority emails",
    "What emails are assigned to the assistant?",
    "Upcoming meetings & calendar requests"
  ];

  const handleSend = async (queryText) => {
    const text = queryText || inputQuery;
    if (!text.trim()) return;

    const userMsg = { role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    try {
      const res = await api.aiChat(text);
      const botMsg = {
        role: 'assistant',
        text: res.answer || "I've reviewed your inbox records, but couldn't generate a specific response."
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: "⚠️ Error querying AI engine. Please ensure backend is running." }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-2xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-indigo-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold flex items-center space-x-1.5">
                <span>AI Inbox Copilot</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </h3>
              <p className="text-[11px] text-indigo-200">Live Gemini / RAG Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-indigo-200 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick prompt chips */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none flex space-x-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-lg text-[11px] font-medium text-slate-700 transition-colors shrink-0 shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-xs'
                    : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.role === 'user' ? 'You' : 'Copilot'}
              </span>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center space-x-2 text-xs text-indigo-600 p-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Scanning MongoDB email records...</span>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about client emails, deadlines..."
              className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={isThinking || !inputQuery.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs disabled:opacity-50 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            Powered by Gemini API with structured knowledge indexing.
          </p>
        </div>

      </div>
    </div>
  );
}
