import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  CornerDownRight, 
  Send, 
  FileText, 
  MessageSquare, 
  Clock, 
  AlertCircle, 
  UserCheck, 
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  ThumbsUp,
  X,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';

export default function ClientPortal({
  emails = [],
  onRefresh,
  onOpenThreadInAssistant
}) {
  const [selectedThreadForReview, setSelectedThreadForReview] = useState(null);
  const [delegatingThreadId, setDelegatingThreadId] = useState(null);
  const [delegateNote, setDelegateNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [approvedReplyThreadId, setApprovedReplyThreadId] = useState(null);
  const [customReplyText, setCustomReplyText] = useState('');

  // Only emails requiring Client attention
  const clientEmails = emails.filter(
    (e) => e.ai?.responsibility === 'Client to Reply' && e.status !== 'handled' && !e.isArchived
  );

  const handledEmails = emails.filter(
    (e) => e.ai?.responsibility === 'Client to Reply' && e.status === 'handled' && !e.isArchived
  );

  // One-click "Mark as Handled"
  const handleMarkHandled = async (id) => {
    try {
      setIsSubmitting(true);
      await api.updateStatus(id, { status: 'handled', isUnread: false });
      await onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delegate to Assistant with instruction note
  const handleDelegate = async (id) => {
    try {
      setIsSubmitting(true);
      await api.delegateToAssistant(id, delegateNote || 'Please handle this on my behalf.');
      setDelegatingThreadId(null);
      setDelegateNote('');
      await onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Approve AI Draft
  const handleQuickApproveDraft = async (id, draftText) => {
    try {
      setIsSubmitting(true);
      await api.sendReply(id, draftText, 'client');
      setApprovedReplyThreadId(null);
      await onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Executive Welcome Card */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <UserCheck className="w-4 h-4" />
            <span>Executive Decision Hub • Alex Vance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {clientEmails.length === 0
              ? 'Inbox Zero! All client matters handled.'
              : `You have ${clientEmails.length} high-priority email${clientEmails.length === 1 ? '' : 's'} requiring decision.`}
          </h1>
          <p className="text-purple-200 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
            Distraction-free portal. Routine scheduling, logistics, and newsletters are managed by Sarah Jenkins. Only items needing your personal approval or signature appear here.
          </p>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Main Attention List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
            <span>Pending Client Attention</span>
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
          </h2>
          <span className="text-xs text-slate-400">
            Auto-filtered by AI Email Intelligence
          </span>
        </div>

        {clientEmails.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">You are all caught up!</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              No pending approvals, term sheets, or executive negotiations require your input. Sarah has full visibility on operational emails.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {clientEmails.map((email) => (
              <div
                key={email.id}
                className="bg-white rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {/* Header row */}
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={email.sender?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={email.sender?.name}
                        className="w-10 h-10 rounded-full object-cover border border-purple-200"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                            {email.sender?.name}
                          </h3>
                          {email.sender?.company && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {email.sender.company}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Received {new Date(email.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        Client to Reply
                      </span>
                      {email.ai?.priority === 'Urgent' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase">
                          Urgent
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-slate-800 mt-3 leading-snug">
                    {email.subject}
                  </h4>

                  {/* AI Why input needed callout */}
                  <div className="mt-4 p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/80">
                    <div className="flex items-center space-x-2 text-purple-900 font-bold text-xs mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>Why your response is needed:</span>
                    </div>
                    <p className="text-xs text-purple-900/90 leading-relaxed font-medium">
                      {email.ai?.reason}
                    </p>
                  </div>

                  {/* AI TL;DR Summary */}
                  {email.ai?.summary?.discussion && (
                    <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                      <strong className="text-slate-800">Summary: </strong>
                      {email.ai.summary.discussion}
                    </div>
                  )}
                </div>

                {/* Delegation form if open */}
                {delegatingThreadId === email.id && (
                  <div className="p-4 bg-indigo-50/50 border-b border-indigo-100 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-900">
                        Delegate to Sarah (Personal Assistant):
                      </span>
                      <button
                        onClick={() => setDelegatingThreadId(null)}
                        className="text-slate-400 hover:text-slate-600 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                    <input
                      type="text"
                      value={delegateNote}
                      onChange={(e) => setDelegateNote(e.target.value)}
                      placeholder="e.g. Please decline politely or schedule for next Tuesday..."
                      className="w-full px-3 py-2 text-xs bg-white border border-indigo-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleDelegate(email.id)}
                        disabled={isSubmitting}
                        className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-xs"
                      >
                        {isSubmitting ? 'Delegating...' : 'Transfer to Assistant Queue'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer Action Buttons */}
                <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedThreadForReview(email)}
                    className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center space-x-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>View Conversation ({email.messages?.length || 1})</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    {/* Delegate button */}
                    <button
                      onClick={() => {
                        setDelegatingThreadId(email.id);
                        setDelegateNote('');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-all flex items-center space-x-1.5"
                    >
                      <CornerDownRight className="w-3.5 h-3.5 text-slate-500" />
                      <span>Delegate to Sarah</span>
                    </button>

                    {/* Mark as Handled */}
                    <button
                      onClick={() => handleMarkHandled(email.id)}
                      disabled={isSubmitting}
                      className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Handled</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Recently Handled Section */}
        {handledEmails.length > 0 && (
          <div className="pt-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Recently Handled by You ({handledEmails.length})
            </h3>
            <div className="space-y-2 opacity-75 hover:opacity-100 transition-opacity">
              {handledEmails.map((email) => (
                <div
                  key={email.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold text-slate-800">{email.subject}</span>
                    <span className="text-slate-400">({email.sender?.name})</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Resolved
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modal for Viewing Full Conversation from Client Perspective */}
      {selectedThreadForReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-800">{selectedThreadForReview.subject}</h3>
                <p className="text-xs text-slate-500">From: {selectedThreadForReview.sender?.name}</p>
              </div>
              <button
                onClick={() => setSelectedThreadForReview(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {selectedThreadForReview.messages?.map((msg, i) => (
                <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="font-semibold text-slate-700 mb-1">{msg.sender}</div>
                  <div className="text-slate-800 whitespace-pre-wrap leading-relaxed">{msg.body}</div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedThreadForReview(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleMarkHandled(selectedThreadForReview.id);
                  setSelectedThreadForReview(null);
                }}
                className="px-4 py-2 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg"
              >
                Mark as Handled
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
