import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
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
  ShieldAlert,
  ChevronDown,
  ThumbsUp,
  Inbox,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';
import { api } from '../services/api';

export default function EmailDetailView({
  email,
  onRefreshEmail,
  onClose,
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
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <Inbox className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No email selected</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Select an email thread from the inbox to review AI classification, conversation history, and generate approved replies.
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

  // Color styles based on responsibility
  const getBadgeStyles = (resp) => {
    switch (resp) {
      case 'Client to Reply':
        return {
          bg: 'bg-purple-50',
          text: 'text-purple-700',
          border: 'border-purple-200',
          iconColor: 'text-purple-600',
          dot: 'bg-purple-500'
        };
      case 'Assistant to Reply':
        return {
          bg: 'bg-indigo-50',
          text: 'text-indigo-700',
          border: 'border-indigo-200',
          iconColor: 'text-indigo-600',
          dot: 'bg-indigo-500'
        };
      case 'Needs Review':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          iconColor: 'text-amber-600',
          dot: 'bg-amber-500'
        };
      case 'No Reply Needed':
      default:
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-600',
          border: 'border-slate-200',
          iconColor: 'text-slate-500',
          dot: 'bg-slate-400'
        };
    }
  };

  const badgeStyle = getBadgeStyles(email.ai?.responsibility);

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* 1. Header with Subject & Core Metadata */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5 flex-wrap gap-y-1">
              <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeStyle.bg} ${badgeStyle.text} border ${badgeStyle.border}`}>
                <span className={`w-2 h-2 rounded-full ${badgeStyle.dot}`}></span>
                <span>{email.ai?.responsibility || 'Unclassified'}</span>
                {email.ai?.confidence && (
                  <span className="opacity-70 font-normal">({email.ai.confidence}%)</span>
                )}
              </span>

              {email.ai?.priority && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  email.ai.priority === 'Urgent'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : email.ai.priority === 'High'
                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {email.ai.priority} Priority
                </span>
              )}

              {email.status === 'handled' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Resolved
                </span>
              )}
            </div>

            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              {email.subject}
            </h2>
          </div>

          {/* Quick Override Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setOverrideDropdownOpen(!overrideDropdownOpen)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Change Responsibility</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {overrideDropdownOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-20 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400">
                  Override AI Responsibility
                </div>
                <button
                  onClick={() => handleOverride('Assistant to Reply')}
                  className="w-full text-left px-3 py-1.5 text-xs text-indigo-700 hover:bg-indigo-50 font-medium flex items-center space-x-2"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>Assistant to Reply</span>
                </button>
                <button
                  onClick={() => handleOverride('Client to Reply')}
                  className="w-full text-left px-3 py-1.5 text-xs text-purple-700 hover:bg-purple-50 font-medium flex items-center space-x-2"
                >
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <span>Client to Reply</span>
                </button>
                <button
                  onClick={() => handleOverride('Needs Review')}
                  className="w-full text-left px-3 py-1.5 text-xs text-amber-700 hover:bg-amber-50 font-medium flex items-center space-x-2"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Needs Review</span>
                </button>
                <button
                  onClick={() => handleOverride('No Reply Needed')}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 font-medium flex items-center space-x-2"
                >
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  <span>No Reply Needed</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sender details row */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-200/60">
          <div className="flex items-center space-x-2.5">
            <img
              src={email.sender?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={email.sender?.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200"
            />
            <div>
              <span className="font-semibold text-slate-800">{email.sender?.name}</span>
              <span className="text-slate-400 ml-1.5">({email.sender?.email})</span>
              {email.sender?.company && (
                <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-medium">
                  {email.sender.company}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 text-slate-400">
            <span>{new Date(email.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* 2. AI Intelligence Banner (Reason & Next Action) */}
      <div className={`p-4 border-b border-slate-200 ${badgeStyle.bg}/60 flex items-start justify-between gap-4`}>
        <div className="flex items-start space-x-3">
          <div className={`w-8 h-8 rounded-xl bg-white flex items-center justify-center shrink-0 border ${badgeStyle.border} shadow-2xs`}>
            <Sparkles className={`w-4 h-4 ${badgeStyle.iconColor}`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-800">AI Intelligence Analysis</span>
              {email.ai?.isManualOverride && (
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                  Manual Override
                </span>
              )}
            </div>
            <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
              <strong>Why:</strong> {email.ai?.reason}
            </p>
            {email.ai?.suggestedAction && (
              <p className="text-xs text-indigo-900 font-medium mt-1">
                👉 <strong>Suggested Action:</strong> {email.ai.suggestedAction}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleReclassify}
          disabled={isReclassifying}
          title="Re-run Gemini AI live analysis on thread"
          className="shrink-0 p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all text-xs flex items-center space-x-1"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isReclassifying ? 'animate-spin text-indigo-600' : ''}`} />
          <span className="text-[11px] font-semibold">{isReclassifying ? 'Analyzing...' : 'Re-analyze'}</span>
        </button>
      </div>

      {/* 3. Navigation Tabs within Detail View */}
      <div className="px-5 border-b border-slate-200 flex items-center space-x-6 bg-white text-xs font-semibold">
        <button
          onClick={() => setActiveTab('conversation')}
          className={`py-3 border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'conversation'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Full Conversation ({email.messages?.length || 1})</span>
        </button>

        <button
          onClick={() => setActiveTab('summary')}
          className={`py-3 border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'summary'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Structured AI Summary</span>
        </button>

        <button
          onClick={() => setActiveTab('actions')}
          className={`py-3 border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'actions'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Extracted Actions ({email.ai?.actionItems?.length || 0})</span>
        </button>
      </div>

      {/* 4. Scrollable Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {activeTab === 'conversation' && (
          <div className="space-y-4">
            {email.messages?.map((msg, index) => (
              <div
                key={msg.id || index}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700">
                      {msg.sender?.charAt(0) || 'U'}
                    </div>
                    <span className="text-xs font-bold text-slate-800">{msg.sender}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {msg.body}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="p-5 rounded-2xl bg-indigo-50/30 border border-indigo-100 space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Core Discussion</span>
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {email.ai?.summary?.discussion || 'No summary generated yet.'}
              </p>
            </div>

            {email.ai?.summary?.keyUpdates?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Key Updates & Points
                </h4>
                <ul className="space-y-1.5">
                  {email.ai.summary.keyUpdates.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold uppercase text-slate-400">Pending Action</span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">
                  {email.ai?.summary?.pendingAction || 'None'}
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold uppercase text-indigo-500">Recommended Next Step</span>
                <p className="text-xs font-semibold text-indigo-900 mt-0.5">
                  {email.ai?.summary?.nextStep || email.ai?.suggestedAction}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-3">
            {email.ai?.actionItems?.length > 0 ? (
              email.ai.actionItems.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      defaultChecked={act.isCompleted}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{act.task}</p>
                      <div className="flex items-center space-x-2 mt-0.5 text-[11px] text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Deadline: {act.deadline}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    act.assignee === 'client'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {act.assignee}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic p-4 text-center">
                No actionable deadlines or calendar events extracted from this thread.
              </p>
            )}
          </div>
        )}

        {/* 5. AI Reply Generator Section (Core Feature) */}
        <div className="pt-4 border-t border-slate-200">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  AI Context-Aware Reply Generator
                </h4>
              </div>

              {/* Tone Selection Pills */}
              <div className="flex items-center space-x-1.5">
                {['Professional', 'Friendly', 'Short & Direct', 'Polite Decline'].map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setSelectedTone(tone)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      selectedTone === tone
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom instruction optional prompt */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Optional instruction: e.g. Offer Friday 10:30am instead, or confirm legal review..."
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={handleGenerateReply}
                disabled={isGeneratingReply}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all shrink-0"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGeneratingReply ? 'animate-spin' : ''}`} />
                <span>{isGeneratingReply ? 'Drafting...' : 'Generate AI Draft'}</span>
              </button>
            </div>

            {/* Draft Output Box */}
            {generatedDraft && (
              <div className="space-y-2 pt-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Review Draft ({selectedTone} Tone)</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-1 hover:text-slate-800 flex items-center space-x-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <textarea
                  value={generatedDraft}
                  onChange={(e) => setGeneratedDraft(e.target.value)}
                  rows={6}
                  className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl font-sans leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    Mandatory review: Reply will not be dispatched without user approval.
                  </span>
                  <button
                    onClick={handleSendReply}
                    disabled={isSendingReply}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all"
                  >
                    <Send className={`w-3.5 h-3.5 ${isSendingReply ? 'animate-spin' : ''}`} />
                    <span>{isSendingReply ? 'Sending...' : 'Approve & Send Reply'}</span>
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
