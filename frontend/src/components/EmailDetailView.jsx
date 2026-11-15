import React, { useState, useEffect } from 'react';
import { 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  FileText, 
  User, 
  RotateCcw, 
  Edit3, 
  CornerUpRight,
  ChevronDown,
  Inbox,
  Copy,
  Check,
  Cpu,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export default function EmailDetailView({
  email,
  onRefreshEmail,
  currentRole = 'assistant'
}) {
  const [activeTab, setActiveTab] = useState('conversation'); // 'conversation' | 'summary' | 'actions'
  const [selectedTone, setSelectedTone] = useState('Professional');
  const [customInstructions, setCustomInstructions] = useState('');
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [isReclassifying, setIsReclassifying] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [overrideDropdownOpen, setOverrideDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Clear draft when email changes
  useEffect(() => {
    setGeneratedDraft('');
    setCustomInstructions('');
  }, [email?.id]);

  if (!email) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg border border-zinc-200">
        <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900">No thread selected</h3>
        <p className="text-xs text-zinc-500 max-w-xs mt-1">
          Select a conversation from the index to review AI classification, conversation history, and agent proposed actions.
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
        `Manually overridden by ${currentRole === 'client' ? 'Client (Alex)' : 'Personal Assistant (Sarah)'}`,
        currentRole
      );
      await onRefreshEmail(email.id);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle AI Reply Draft Generation
  const handleGenerateReply = async () => {
    try {
      setIsGeneratingReply(true);
      const res = await api.generateReply(email.id, selectedTone, customInstructions);
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

  return (
    <div className="h-full flex flex-col bg-white rounded-lg border border-zinc-200 overflow-hidden font-sans">
      
      {/* 1. Header with Subject & Core Metadata */}
      <div className="p-4 border-b border-zinc-200 bg-zinc-50/70">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 mb-1.5 flex-wrap gap-y-1">
              <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-xs font-mono font-semibold bg-zinc-900 text-zinc-100 border border-zinc-800">
                <span>{email.ai?.responsibility || 'Unclassified'}</span>
                {email.ai?.confidence && (
                  <span className="text-zinc-400 font-normal">({email.ai.confidence}%)</span>
                )}
              </span>

              {email.ai?.priority && (
                <span className={`px-1.5 py-0.2 rounded font-mono text-[10px] uppercase font-bold ${
                  email.ai.priority === 'Urgent'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : email.ai.priority === 'High'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-zinc-100 text-zinc-600'
                }`}>
                  {email.ai.priority}
                </span>
              )}

              {email.status === 'handled' && (
                <span className="inline-flex items-center px-1.5 py-0.2 rounded font-mono text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Resolved
                </span>
              )}
            </div>

            <h2 className="text-base font-bold text-zinc-900 leading-snug">
              {email.subject}
            </h2>
          </div>

          {/* Quick Override Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setOverrideDropdownOpen(!overrideDropdownOpen)}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-all cursor-pointer"
            >
              <Edit3 className="w-3 h-3 text-zinc-500" />
              <span>Change Status</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {overrideDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-zinc-200 py-1 z-20 font-sans">
                <div className="px-3 py-1 text-[10px] font-mono uppercase text-zinc-400">
                  Override Assignment
                </div>
                <button
                  onClick={() => handleOverride('Assistant to Reply')}
                  className="w-full text-left px-3 py-1.5 text-xs text-sky-900 hover:bg-sky-50 font-medium flex items-center space-x-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                  <span>Assistant to Reply</span>
                </button>
                <button
                  onClick={() => handleOverride('Client to Reply')}
                  className="w-full text-left px-3 py-1.5 text-xs text-purple-900 hover:bg-purple-50 font-medium flex items-center space-x-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  <span>Client to Reply</span>
                </button>
                <button
                  onClick={() => handleOverride('Needs Review')}
                  className="w-full text-left px-3 py-1.5 text-xs text-amber-900 hover:bg-amber-50 font-medium flex items-center space-x-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>Needs Review</span>
                </button>
                <button
                  onClick={() => handleOverride('No Reply Needed')}
                  className="w-full text-left px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 font-medium flex items-center space-x-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                  <span>No Reply Needed</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sender details */}
        <div className="mt-2.5 flex items-center justify-between text-xs text-zinc-600 pt-2.5 border-t border-zinc-200/80">
          <div className="flex items-center space-x-2 truncate">
            <img
              src={email.sender?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={email.sender?.name}
              className="w-5 h-5 rounded-full object-cover border border-zinc-300"
            />
            <span className="font-semibold text-zinc-900">{email.sender?.name}</span>
            <span className="text-zinc-400 text-[11px] truncate">({email.sender?.email})</span>
            {email.sender?.company && (
              <span className="text-zinc-500 text-[11px]">• {email.sender.company}</span>
            )}
          </div>

          <span className="text-[11px] font-mono text-zinc-400 shrink-0">
            {new Date(email.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* 2. AI Agent Reasoning Trace Box */}
      <div className="p-3 bg-zinc-900 text-zinc-100 border-b border-zinc-800 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center space-x-1.5 text-[11px] font-mono text-emerald-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI AGENT REASONING ENGINE</span>
          </div>

          <button
            onClick={handleReclassify}
            disabled={isReclassifying}
            className="text-[11px] font-mono text-zinc-400 hover:text-zinc-200 flex items-center space-x-1"
          >
            <RotateCcw className={`w-3 h-3 ${isReclassifying ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isReclassifying ? 'Re-auditing...' : 'Re-run Agent'}</span>
          </button>
        </div>

        <p className="text-zinc-300 leading-relaxed font-sans text-xs">
          <strong>Decision:</strong> {email.ai?.reason}
        </p>

        {email.ai?.suggestedAction && (
          <div className="mt-1.5 text-[11px] text-zinc-300 font-mono bg-zinc-950 p-2 rounded border border-zinc-800">
            <span className="text-emerald-400">↳ Proposed Action: </span>
            {email.ai.suggestedAction}
          </div>
        )}
      </div>

      {/* 3. Navigation Tabs */}
      <div className="px-4 border-b border-zinc-200 flex items-center space-x-5 bg-white text-xs font-medium">
        <button
          onClick={() => setActiveTab('conversation')}
          className={`py-2.5 border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'conversation'
              ? 'border-zinc-900 text-zinc-900 font-semibold'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Thread ({email.messages?.length || 1})</span>
        </button>

        <button
          onClick={() => setActiveTab('summary')}
          className={`py-2.5 border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'summary'
              ? 'border-zinc-900 text-zinc-900 font-semibold'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Executive Summary</span>
        </button>

        <button
          onClick={() => setActiveTab('actions')}
          className={`py-2.5 border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'actions'
              ? 'border-zinc-900 text-zinc-900 font-semibold'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Extracted Tasks ({email.ai?.actionItems?.length || 0})</span>
        </button>
      </div>

      {/* 4. Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'conversation' && (
          <div className="space-y-3">
            {email.messages?.map((msg, index) => (
              <div
                key={msg.id || index}
                className="p-3.5 rounded-lg border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center font-mono font-bold text-[10px]">
                      {msg.sender?.charAt(0) || 'U'}
                    </div>
                    <span className="text-xs font-semibold text-zinc-900">{msg.sender}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-xs text-zinc-800 whitespace-pre-wrap leading-relaxed">
                  {msg.body}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 space-y-3 text-xs">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
                Core Topic
              </div>
              <p className="text-zinc-800 leading-relaxed font-medium">
                {email.ai?.summary?.discussion || 'No summary available.'}
              </p>
            </div>

            {email.ai?.summary?.keyUpdates?.length > 0 && (
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
                  Critical Updates
                </div>
                <ul className="space-y-1">
                  {email.ai.summary.keyUpdates.map((item, idx) => (
                    <li key={idx} className="text-zinc-700 flex items-start space-x-2">
                      <span className="w-1 h-1 rounded-full bg-zinc-900 mt-1.5 shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <div className="p-2.5 bg-white rounded border border-zinc-200">
                <span className="text-[10px] font-mono uppercase text-zinc-400">Pending Bottleneck</span>
                <p className="text-xs font-semibold text-zinc-800 mt-0.5">
                  {email.ai?.summary?.pendingAction || 'None'}
                </p>
              </div>
              <div className="p-2.5 bg-white rounded border border-zinc-200">
                <span className="text-[10px] font-mono uppercase text-emerald-600">Recommended Step</span>
                <p className="text-xs font-semibold text-zinc-900 mt-0.5">
                  {email.ai?.summary?.nextStep || email.ai?.suggestedAction}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-2">
            {email.ai?.actionItems?.length > 0 ? (
              email.ai.actionItems.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-lg border border-zinc-200 bg-white flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <input
                      type="checkbox"
                      defaultChecked={act.isCompleted}
                      className="w-3.5 h-3.5 rounded text-zinc-900 focus:ring-0 border-zinc-300"
                    />
                    <div>
                      <p className="font-medium text-zinc-900">{act.task}</p>
                      <div className="flex items-center space-x-2 text-[10px] text-zinc-500 font-mono mt-0.5">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span>Deadline: {act.deadline}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                    act.assignee === 'client'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-sky-100 text-sky-800'
                  }`}>
                    {act.assignee}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-400 p-4 text-center">
                No actionable items extracted from this thread.
              </p>
            )}
          </div>
        )}

        {/* 5. Context-Aware AI Reply Studio */}
        <div className="pt-3 border-t border-zinc-200">
          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-600 font-semibold">
                AI Contextual Reply Generator
              </span>

              <div className="flex items-center space-x-1">
                {['Professional', 'Friendly', 'Short & Direct', 'Polite Decline'].map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setSelectedTone(tone)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all cursor-pointer ${
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

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Custom instruction: e.g. Offer Friday 10:30 AM instead, or confirm legal review..."
                className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-zinc-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
              />
              <button
                onClick={handleGenerateReply}
                disabled={isGeneratingReply}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer shrink-0"
              >
                <span>{isGeneratingReply ? 'Synthesizing...' : 'Draft Response'}</span>
              </button>
            </div>

            {generatedDraft && (
              <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span className="font-mono text-[11px]">Preview ({selectedTone})</span>
                  <button
                    onClick={copyToClipboard}
                    className="p-1 hover:text-zinc-800 flex items-center space-x-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <textarea
                  value={generatedDraft}
                  onChange={(e) => setGeneratedDraft(e.target.value)}
                  rows={6}
                  className="w-full p-2.5 text-xs bg-white border border-zinc-300 rounded-md font-sans leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono text-zinc-400">
                    Human-in-the-loop: user approval required
                  </span>
                  <button
                    onClick={handleSendReply}
                    disabled={isSendingReply}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <Send className={`w-3 h-3 ${isSendingReply ? 'animate-spin' : ''}`} />
                    <span>{isSendingReply ? 'Dispatching...' : 'Approve & Send'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
