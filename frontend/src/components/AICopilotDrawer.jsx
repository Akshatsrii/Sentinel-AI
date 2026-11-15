import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  Send, 
  Sparkles, 
  Cpu
} from 'lucide-react';
import { api } from '../services/api';

export default function AICopilotDrawer({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Executive Copilot online. I have live RAG indexing over all ${2} connected inboxes.\n\nYou can query pending client decisions, summarize today's correspondence, or isolate urgent bottlenecks.`
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-zinc-950/60 backdrop-blur-2xs flex justify-end font-sans">
      <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-zinc-200 flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-900 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center text-emerald-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-tight">AI Executive Copilot</h3>
              <p className="text-[10px] font-mono text-zinc-400">Contextual In-Memory RAG Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick prompt chips */}
        <div className="p-2.5 bg-zinc-50 border-b border-zinc-200 overflow-x-auto whitespace-nowrap scrollbar-none flex space-x-1.5">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-2 py-1 bg-white hover:bg-zinc-100 border border-zinc-200 rounded text-[11px] font-medium text-zinc-700 transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[92%] p-3 rounded-lg leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-900 border border-zinc-200/80'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 mt-1 px-1">
                {msg.role === 'user' ? 'You' : 'AuraPA Copilot'}
              </span>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center space-x-2 text-xs text-zinc-600 font-mono p-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-zinc-900" />
              <span>Indexing inbox database...</span>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="p-3.5 border-t border-zinc-200 bg-white">
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
              placeholder="Query pending decisions, meetings, senders..."
              className="flex-1 px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:bg-white text-zinc-900"
            />
            <button
              type="submit"
              disabled={isThinking || !inputQuery.trim()}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md shadow-xs disabled:opacity-50 transition-all cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="text-[10px] font-mono text-zinc-400 mt-2 text-center">
            Enterprise isolated • Zero external training retention
          </div>
        </div>

      </div>
    </div>
  );
}
