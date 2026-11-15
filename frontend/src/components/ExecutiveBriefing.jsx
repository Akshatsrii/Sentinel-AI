import React, { useState } from 'react';
import { 
  CheckCircle2, 
  CornerDownRight, 
  MessageSquare, 
  UserCheck, 
  Mic, 
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';

export default function ExecutiveBriefing({
  emails = [],
  onRefresh,
  onSwitchToAssistant
}) {
  const [selectedThreadForReview, setSelectedThreadForReview] = useState(null);
  const [delegatingThreadId, setDelegatingThreadId] = useState(null);
  const [delegateNote, setDelegateNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const clientEmails = emails.filter(
    (e) => e.ai?.responsibility === 'Client to Reply' && e.status !== 'handled' && !e.isArchived
  );

  const handledEmails = emails.filter(
    (e) => e.ai?.responsibility === 'Client to Reply' && e.status === 'handled' && !e.isArchived
  );

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

  const handleSimulateVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setDelegateNote('Sarah, please confirm 1-year cliff with Wilson Sonsini and schedule a quick 15-min call for Friday morning.');
      setIsRecording(false);
    }, 1200);
  };

  return (
    <div className="flex-1 bg-zinc-50 overflow-y-auto h-screen p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Executive Memo Header */}
        <div className="border-b border-zinc-200 pb-5">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-1">
            <span>EXECUTIVE BRIEFING • ALEX VANCE</span>
            <span>ASSISTANT: SARAH JENKINS (ACTIVE)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            {clientEmails.length === 0
              ? 'All Executive Actions Handled'
              : `${clientEmails.length} Pending Matters Requiring Personal Authority`}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Filtered by Autonomous AI Agent. Operational scheduling, invoices, and logistics are resolved by Sarah.
          </p>
        </div>

        {/* Action Items List */}
        {clientEmails.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-lg border border-zinc-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-zinc-900">Inbox Zero on Executive Decisions</h3>
            <p className="text-xs text-zinc-500 mt-1">
              No outstanding term sheets, legal signatures, or equity decisions pending your review.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {clientEmails.map((email) => (
              <div
                key={email.id}
                className="bg-white rounded-lg border border-zinc-200 shadow-2xs hover:border-zinc-300 transition-all overflow-hidden"
              >
                {/* Header */}
                <div className="p-5 border-b border-zinc-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-zinc-900 text-sm">
                          {email.sender?.name}
                        </span>
                        {email.sender?.company && (
                          <span className="text-[11px] font-mono text-zinc-500">
                            ({email.sender.company})
                          </span>
                        )}
                        <span className="px-1.5 py-0.2 rounded font-mono text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                          Client Decision
                        </span>
                        {email.ai?.priority === 'Urgent' && (
                          <span className="px-1.5 py-0.2 rounded font-mono text-[10px] font-bold bg-rose-50 text-rose-700">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-zinc-400 mt-0.5">
                        Received {new Date(email.date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900 mt-2.5">
                    {email.subject}
                  </h3>

                  {/* Why input required */}
                  <div className="mt-3 p-3 bg-zinc-50 rounded border border-zinc-200 text-xs">
                    <span className="font-mono text-[10px] uppercase font-bold text-zinc-500 block mb-0.5">
                      Why Your Input Is Needed:
                    </span>
                    <p className="text-zinc-800 leading-relaxed font-medium">
                      {email.ai?.reason}
                    </p>
                  </div>

                  {/* Summary */}
                  {email.ai?.summary?.discussion && (
                    <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                      <strong className="text-zinc-900">Summary: </strong>
                      {email.ai.summary.discussion}
                    </p>
                  )}
                </div>

                {/* Delegation Bar */}
                {delegatingThreadId === email.id && (
                  <div className="p-3 bg-zinc-900 text-zinc-100 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold">Instruction for Sarah Jenkins:</span>
                      <button
                        onClick={() => setDelegatingThreadId(null)}
                        className="text-zinc-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={delegateNote}
                        onChange={(e) => setDelegateNote(e.target.value)}
                        placeholder="e.g. Schedule call for Friday or confirm legal review..."
                        className="w-full px-3 py-1.5 pr-8 text-xs bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-hidden"
                      />
                      <button
                        onClick={handleSimulateVoice}
                        title="Simulate Voice Dictation"
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white ${
                          isRecording ? 'text-rose-400 animate-pulse' : ''
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDelegate(email.id)}
                        disabled={isSubmitting}
                        className="px-3 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded cursor-pointer"
                      >
                        {isSubmitting ? 'Transferring...' : 'Transfer to Assistant Queue'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Footer */}
                <div className="p-3 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setSelectedThreadForReview(email)}
                    className="font-medium text-zinc-600 hover:text-zinc-900 flex items-center space-x-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>View Conversation ({email.messages?.length || 1})</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setDelegatingThreadId(email.id);
                        setDelegateNote('');
                      }}
                      className="px-2.5 py-1.5 rounded border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-800 font-medium cursor-pointer"
                    >
                      Delegate to Sarah
                    </button>

                    <button
                      onClick={() => handleMarkHandled(email.id)}
                      disabled={isSubmitting}
                      className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-white font-semibold cursor-pointer"
                    >
                      Mark Resolved
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Recently Resolved */}
        {handledEmails.length > 0 && (
          <div className="pt-4 border-t border-zinc-200">
            <h4 className="text-xs font-mono uppercase text-zinc-400 mb-2">
              Recently Handled by Alex ({handledEmails.length})
            </h4>
            <div className="space-y-1 text-xs">
              {handledEmails.map((e) => (
                <div
                  key={e.id}
                  className="p-2.5 bg-white rounded border border-zinc-200 flex items-center justify-between"
                >
                  <span className="font-medium text-zinc-800 truncate mr-2">{e.subject}</span>
                  <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                    Resolved
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Review Dialog */}
      {selectedThreadForReview && (
        <div className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-xl w-full shadow-2xl border border-zinc-200 max-h-[85vh] flex flex-col overflow-hidden text-xs">
            <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <h3 className="font-bold text-zinc-900">{selectedThreadForReview.subject}</h3>
              <button
                onClick={() => setSelectedThreadForReview(null)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {selectedThreadForReview.messages?.map((msg, i) => (
                <div key={i} className="p-3 bg-zinc-50 rounded border border-zinc-200">
                  <div className="font-semibold text-zinc-800 mb-1">{msg.sender}</div>
                  <div className="text-zinc-700 whitespace-pre-wrap leading-relaxed">{msg.body}</div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-zinc-200 bg-zinc-50 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedThreadForReview(null)}
                className="px-3 py-1.5 text-zinc-600 hover:bg-zinc-200 rounded font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleMarkHandled(selectedThreadForReview.id);
                  setSelectedThreadForReview(null);
                }}
                className="px-3 py-1.5 bg-zinc-900 text-white hover:bg-zinc-800 rounded font-semibold"
              >
                Mark as Resolved
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
