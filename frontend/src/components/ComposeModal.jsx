import React, { useState } from 'react';
import { X, Send, Sparkles, User, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';
import { api } from '../services/api';

const QUICK_CONTACTS = [
  { name: 'Marcus Sterling', email: 'm.sterling@apexventures.com', role: 'Apex Ventures (VC)' },
  { name: 'Evelyn Reed', email: 'evelyn.reed@sequoiahorizon.com', role: 'Sequoia Horizon (Board)' },
  { name: 'David Chen', email: 'dchen@gunder.com', role: 'Legal Counsel' },
  { name: 'Jonathan Miller', email: 'jmiller@vancecapital.io', role: 'CFO' },
  { name: 'Elena Rostova', email: 'elena.rostova@vancetech.io', role: 'VP of Engineering' },
  { name: 'Sophia Laurent', email: 'slaurent@forbes.com', role: 'Forbes Global' }
];

export default function ComposeModal({ isOpen, onClose, onEmailSent, currentRole = 'assistant' }) {
  const [to, setTo] = useState('');
  const [toName, setToName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [senderRole, setSenderRole] = useState(currentRole);
  const [priority, setPriority] = useState('Normal');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTone, setAiTone] = useState('Professional');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showAiBar, setShowAiBar] = useState(true);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSelectContact = (contact) => {
    setTo(contact.email);
    setToName(contact.name);
  };

  const handleGenerateAIDraft = async () => {
    if (!aiPrompt.trim()) {
      setError('Please enter a short instruction for the AI (e.g., "Schedule dinner with Marcus").');
      return;
    }
    setError('');
    setIsGeneratingAI(true);
    try {
      const res = await api.aiDraftNew({
        prompt: aiPrompt,
        tone: aiTone,
        recipientName: toName || to,
        senderRole: senderRole
      });
      if (res.draft) {
        if (!subject && res.draft.subject) {
          setSubject(res.draft.subject);
        }
        setBody(res.draft.body);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to generate draft via Gemini. Please write directly or retry.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!to.trim()) {
      setError('Please provide a recipient email address.');
      return;
    }
    if (!subject.trim()) {
      setError('Please add an email subject.');
      return;
    }
    if (!body.trim()) {
      setError('Email body cannot be empty.');
      return;
    }

    setError('');
    setIsSending(true);
    try {
      const res = await api.composeEmail({
        to,
        toName: toName || to.split('@')[0],
        subject,
        body,
        senderRole,
        priority
      });
      if (res.success && res.email) {
        onEmailSent(res.email);
        onClose();
      } else {
        setError(res.error || 'Failed to dispatch email.');
      }
    } catch (err) {
      console.error(err);
      setError('Error dispatching email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-zinc-200 max-w-2xl w-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-zinc-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <h3 className="text-sm font-semibold tracking-tight">New Message</h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              Sentinel Outbox
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Sender Persona Switcher */}
            <div className="flex items-center space-x-1.5 bg-zinc-800 px-2 py-1 rounded-lg border border-zinc-700 text-xs">
              <span className="text-zinc-400 text-[11px]">From:</span>
              <select
                value={senderRole}
                onChange={(e) => setSenderRole(e.target.value)}
                className="bg-transparent text-white font-medium text-xs focus:outline-hidden cursor-pointer"
              >
                <option value="client" className="bg-zinc-800 text-white">Alex Vance (CEO)</option>
                <option value="assistant" className="bg-zinc-800 text-white">Sarah Jenkins (PA)</option>
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSend} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Recipient Picker */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
                To / Recipient:
              </label>
              <span className="text-[10px] text-zinc-400">Click below for quick executive contact:</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2">
              {QUICK_CONTACTS.map((c) => (
                <button
                  type="button"
                  key={c.email}
                  onClick={() => handleSelectContact(c)}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                    to === c.email
                      ? 'bg-zinc-900 text-white border-zinc-900 font-medium shadow-xs'
                      : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@company.com"
              className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-hidden focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 transition-all font-mono"
              required
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-1">
              Subject:
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Q4 Executive Budget Review / Follow-up"
              className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-hidden focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 transition-all font-medium"
              required
            />
          </div>

          {/* AI Drafting Assistant (Gemini powered) */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-indigo-900 font-semibold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                <span>Gemini AI Drafting Assistant</span>
              </div>
              <div className="flex items-center space-x-1">
                {['Professional', 'Friendly', 'Direct', 'Urgent'].map((tone) => (
                  <button
                    type="button"
                    key={tone}
                    onClick={() => setAiTone(tone)}
                    className={`text-[9px] px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                      aiTone === tone
                        ? 'bg-indigo-600 text-white font-medium'
                        : 'bg-white text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleGenerateAIDraft())}
                placeholder="What should this email say? E.g., 'Confirm meeting at 4 PM and send agenda'"
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-indigo-200 rounded-lg focus:outline-hidden focus:border-indigo-600 text-zinc-800 placeholder-zinc-400"
              />
              <button
                type="button"
                onClick={handleGenerateAIDraft}
                disabled={isGeneratingAI}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3 h-3" />
                <span>{isGeneratingAI ? 'Drafting...' : 'Generate with AI'}</span>
              </button>
            </div>
          </div>

          {/* Email Body */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-1">
              Body:
            </label>
            <textarea
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your email here, or use the AI Assistant above to draft one automatically..."
              className="w-full p-3 text-xs border border-zinc-200 rounded-lg focus:outline-hidden focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 transition-all font-sans leading-relaxed text-zinc-800"
              required
            />
          </div>

          {/* Footer Controls */}
          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-zinc-500 font-medium">Priority:</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="text-xs bg-zinc-100 border border-zinc-200 rounded-md px-2 py-1 text-zinc-800 focus:outline-hidden cursor-pointer"
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Sending...' : 'Send Email'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
