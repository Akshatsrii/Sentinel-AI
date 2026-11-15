import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Archive, 
  CornerUpLeft, 
  CornerUpRight, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  RotateCcw, 
  Edit3, 
  Copy, 
  Check, 
  Sparkles, 
  ChevronDown, 
  Inbox,
  User,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { api } from '../services/api';

export default function EmailDetail({
  email,
  onRefreshEmail,
  currentRole = 'assistant'
}) {
  const [selectedTone, setSelectedTone] = useState('Professional');
  const [customInstructions, setCustomInstructions] = useState('');
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [isReclassifying, setIsReclassifying] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [overrideDropdownOpen, setOverrideDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  useEffect(() => {
    setGeneratedDraft('');
    setCustomInstructions('');
    setIsComposerOpen(false);
  }, [email?.id]);

  if (!email) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-zinc-50 select-none">
        <div className="w-12 h-12 rounded-lg bg-zinc-200/80 flex items-center justify-center text-zinc-400 mb-3">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900">Select an email to read</h3>
        <p className="text-xs text-zinc-500 max-w-xs mt-1">
          Review conversation history, AI responsibility analysis, and draft executive responses.
        </p>
      </div>
    );
  }

  // Handle AI Re-classification
  const handleReclassify = async () => {
    try {
      setIsReclassifying(true);
      await api.classifyEmail(email.id);
      await onRefreshEmail(email.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsReclassifying(false);
    }
  };

  // Handle Manual Classification Override
  const handleOverride = async (newResponsibility) => {
    try {
      setOverrideDropdownOpen(false);
      await api.overrideClassification(
        email.id,
        newResponsibility,
        `Manually overridden by ${currentRole === 'client' ? 'Client (Alex Vance)' : 'Personal Assistant (Sarah Jenkins)'}`,
        currentRole
      );
      await onRefreshEmail(email.id);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle AI Reply Draft Generation
  const handleGenerateReply = async (tone = selectedTone) => {
    try {
      setIsGeneratingReply(true);
      setIsComposerOpen(true);
      const res = await api.generateReply(email.id, tone, customInstructions);
      if (res.replyData?.replyText) {
        setGeneratedDraft(res.replyData.replyText);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingReply(false);
    }
  };

  // Handle Send Approved Reply
  const handleSendReply = async () => {
    if (!generatedDraft.trim()) return;
    try {
      setIsSendingReply(true);
      await api.sendReply(email.id, generatedDraft, currentRole);
      setGeneratedDraft('');
      setIsComposerOpen(false);
      await onRefreshEmail(email.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingReply(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getResponsibilityPill = (resp) => {
    switch (resp) {
      case 'Client to Reply':
        return 'text-purple-800 bg-purple-50 border-purple-200';
      case 'Assistant to Reply':
        return 'text-sky-800 bg-sky-50 border-sky-200';
      case 'Needs Review':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'No Reply Needed':
      default:
        return 'text-zinc-600 bg-zinc-100 border-zinc-200';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-white overflow-hidden font-sans">
      
      {/* 1. Top Action Toolbar */}
      <div className="p-3 border-b border-zinc-200 bg-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsComposerOpen(true)}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <CornerUpLeft className="w-3.5 h-3.5" />
            <span>Reply</span>
          </button>

          <button
            onClick={() => handleGenerateReply('Professional')}
            disabled={isGeneratingReply}
            className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-md text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingReply ? 'animate-spin text-zinc-900' : 'text-zinc-600'}`} />
            <span>AI Draft</span>
          </button>
        </div>

        {/* Change Responsibility Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOverrideDropdownOpen(!overrideDropdownOpen)}
            className="px-2.5 py-1.5 border border-zinc-200 rounded-md text-xs font-medium text-zinc-700 hover:bg-zinc-50 flex items-center space-x-1.5 cursor-pointer"
          >
            <Edit3 className="w-3 h-3 text-zinc-400" />
            <span>Reclassify Responsibility</span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>

          {overrideDropdownOpen && (
            <div className="absolute right-0 mt-1 w-52 bg-white rounded-lg shadow-xl border border-zinc-200 py-1 z-30 text-xs">
              <div className="px-3 py-1 text-[10px] font-mono uppercase text-zinc-400">
                Override Assignment
              </div>
              <button
                onClick={() => handleOverride('Assistant to Reply')}
                className="w-full text-left px-3 py-1.5 text-sky-900 hover:bg-sky-50 flex items-center space-x-2 cursor-pointer font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                <span>Assistant to Reply</span>
              </button>
              <button
                onClick={() => handleOverride('Client to Reply')}
                className="w-full text-left px-3 py-1.5 text-purple-900 hover:bg-purple-50 flex items-center space-x-2 cursor-pointer font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                <span>Client to Reply</span>
              </button>
              <button
                onClick={() => handleOverride('Needs Review')}
                className="w-full text-left px-3 py-1.5 text-amber-900 hover:bg-amber-50 flex items-center space-x-2 cursor-pointer font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>Needs Review</span>
              </button>
              <button
                onClick={() => handleOverride('No Reply Needed')}
                className="w-full text-left px-3 py-1.5 text-zinc-700 hover:bg-zinc-100 flex items-center space-x-2 cursor-pointer font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                <span>No Reply Needed</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Scrollable Thread & Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Subject Header */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${getResponsibilityPill(email.ai?.responsibility)}`}>
              {email.ai?.responsibility}
            </span>
            {email.ai?.priority === 'Urgent' && (
              <span className="px-1.5 py-0.2 rounded font-mono text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                URGENT
              </span>
            )}
            {email.status === 'handled' && (
              <span className="px-1.5 py-0.2 rounded font-mono text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                RESOLVED
              </span>
            )}
          </div>

          <h1 className="text-xl font-bold text-zinc-900 tracking-tight leading-snug">
            {email.subject}
          </h1>

          {/* Senders & Recipients Metadata */}
          <div className="mt-4 p-3 bg-zinc-50 rounded-lg border border-zinc-200/80 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-zinc-900">{email.sender?.name}</span>
                <span className="text-zinc-500">&lt;{email.sender?.email}&gt;</span>
                {email.sender?.company && (
                  <span className="text-[10px] font-mono text-zinc-400 bg-white px-1.5 py-0.2 rounded border border-zinc-200">
                    {email.sender.company}
                  </span>
                )}
              </div>
              <span className="font-mono text-zinc-400 text-[11px]">
                {new Date(email.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="text-zinc-500 text-[11px] flex items-center space-x-2">
              <span>To: {email.recipients?.join(', ')}</span>
              {email.cc?.length > 0 && <span>• Cc: {email.cc.join(', ')}</span>}
            </div>
          </div>
        </div>

        {/* 3. Executive AI Briefing Box (Senior Integration) */}
        <div className="p-4 rounded-lg bg-zinc-900 text-zinc-100 text-xs space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-emerald-400 font-semibold flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EXECUTIVE AI TRIAGE BRIEFING</span>
            </span>
            <button
              onClick={handleReclassify}
              disabled={isReclassifying}
              className="text-zinc-400 hover:text-white flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className={`w-3 h-3 ${isReclassifying ? 'animate-spin' : ''}`} />
              <span>{isReclassifying ? 'Auditing...' : 'Re-audit Thread'}</span>
            </button>
          </div>

          <p className="text-zinc-200 leading-relaxed font-sans text-xs">
            <strong>Decision Rationale:</strong> {email.ai?.reason}
          </p>

          {email.ai?.suggestedAction && (
            <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-300">
              <span className="text-emerald-400">↳ Recommended Action: </span>
              {email.ai.suggestedAction}
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="pt-1 flex items-center space-x-2 flex-wrap gap-y-1">
            <button
              onClick={() => handleGenerateReply('Professional')}
              className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-medium border border-zinc-700 cursor-pointer"
            >
              Draft Formal Response
            </button>
            <button
              onClick={() => handleGenerateReply('Short & Direct')}
              className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-medium border border-zinc-700 cursor-pointer"
            >
              Draft Quick Confirmation
            </button>
          </div>
        </div>

        {/* 4. Message Thread Stream */}
        <div className="space-y-4 pt-2">
          {email.messages?.map((msg, index) => (
            <div
              key={msg.id || index}
              className="p-4 rounded-lg border border-zinc-200 bg-white text-xs leading-relaxed"
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-100">
                <span className="font-semibold text-zinc-900">{msg.sender}</span>
                <span className="font-mono text-zinc-400 text-[10px]">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="text-zinc-800 whitespace-pre-wrap font-sans text-xs leading-relaxed">
                {msg.body}
              </div>
            </div>
          ))}
        </div>

        {/* 5. Realistic Docked Composer */}
        {isComposerOpen && (
          <div className="p-4 rounded-lg border border-zinc-300 bg-zinc-50 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs">
              <div className="font-semibold text-zinc-900">
                Reply from: <span className="font-mono text-zinc-600 font-normal">Sarah Jenkins (PA on behalf of Alex Vance)</span>
              </div>

              {/* Tone Selection */}
              <div className="flex items-center space-x-1">
                {['Professional', 'Friendly', 'Short & Direct', 'Polite Decline'].map((tone) => (
                  <button
                    key={tone}
                    onClick={() => {
                      setSelectedTone(tone);
                      handleGenerateReply(tone);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium cursor-pointer ${
                      selectedTone === tone
                        ? 'bg-zinc-900 text-white'
                        : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom instruction prompt */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Optional AI instruction: e.g. Confirm 10:30 AM or ask for updated draft..."
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-zinc-200 rounded focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
              />
              <button
                onClick={() => handleGenerateReply()}
                disabled={isGeneratingReply}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-medium cursor-pointer shrink-0"
              >
                {isGeneratingReply ? 'Generating...' : 'Regenerate'}
              </button>
            </div>

            {/* Editable reply body */}
            <textarea
              value={generatedDraft}
              onChange={(e) => setGeneratedDraft(e.target.value)}
              placeholder="Write your email reply here..."
              rows={7}
              className="w-full p-3 text-xs bg-white border border-zinc-300 rounded font-sans leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
            />

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setIsComposerOpen(false)}
                className="text-xs text-zinc-500 hover:text-zinc-800"
              >
                Discard Draft
              </button>

              <button
                onClick={handleSendReply}
                disabled={isSendingReply || !generatedDraft.trim()}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Send className={`w-3.5 h-3.5 ${isSendingReply ? 'animate-spin' : ''}`} />
                <span>{isSendingReply ? 'Dispatching...' : 'Approve & Send Email'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
