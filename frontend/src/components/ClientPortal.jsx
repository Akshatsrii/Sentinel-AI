import React, { useState } from 'react';
import { 
  CheckCircle2, 
  CornerDownRight, 
  Send, 
  FileText, 
  MessageSquare, 
  Clock, 
  UserCheck, 
  ArrowRight, 
  X, 
  Mic, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
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
  const [isRecording, setIsRecording] = useState(false);

  // Filter only emails requiring Client attention
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

  // Voice note simulation
  const handleSimulateVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setDelegateNote('Sarah, please review the valuation clause with Wilson Sonsini and schedule a 15-min call for Friday.');
      setIsRecording(false);
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 font-sans">
      
      {/* Executive Command Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-7 text-zinc-100 shadow-xl mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-zinc-400 text-xs font-mono mb-1">
              <UserCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>EXECUTIVE ACTION DESK • ALEX VANCE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {clientEmails.length === 0
                ? 'Inbox Zero • No Pending Decisions'
                : `${clientEmails.length} High-Stakes Item${clientEmails.length === 1 ? '' : 's'} Requiring Decision`}
            </h1>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Executive Assistant</span>
            <div className="text-xs font-semibold text-zinc-300">Sarah Jenkins (Active)</div>
          </div>
        </div>

        <p className="text-zinc-400 text-xs mt-2 max-w-xl leading-relaxed">
          Operational scheduling, flight receipts, and routine supplier logistics are handled by Sarah. Only items requiring your personal authority, signature, or strategic approval appear here.
        </p>
      </div>

      {/* Main Attention List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
          <span className="uppercase tracking-wider">Pending Executive Review</span>
          <span>Filtered by Autonomous Agent</span>
        </div>

        {clientEmails.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-xl border border-zinc-200">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900">All Executive Matters Resolved</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              No outstanding term sheets, contracts, or candidate counter-offers require your sign-off.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {clientEmails.map((email) => (
              <div
                key={email.id}
                className="bg-white rounded-xl border border-zinc-200 shadow-2xs hover:border-zinc-300 transition-all overflow-hidden"
              >
                {/* Header */}
                <div className="p-5 border-b border-zinc-100">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={email.sender?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={email.sender?.name}
                        className="w-9 h-9 rounded-full object-cover border border-zinc-300"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-zinc-900 text-sm">
                            {email.sender?.name}
                          </h3>
                          {email.sender?.company && (
                            <span className="text-[11px] font-mono text-zinc-500">
                              • {email.sender.company}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                          Received {new Date(email.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-50 text-purple-800 border border-purple-200">
                        Client to Reply
                      </span>
                      {email.ai?.priority === 'Urgent' && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-rose-50 text-rose-700 uppercase">
                          Urgent
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-zinc-900 mt-2.5 leading-snug">
                    {email.subject}
                  </h4>

                  {/* Why client response needed */}
                  <div className="mt-3 p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs">
                    <div className="text-[10px] font-mono uppercase font-bold text-purple-900 mb-0.5">
                      Why Your Authority Is Required:
                    </div>
                    <p className="text-zinc-800 leading-relaxed font-medium">
                      {email.ai?.reason}
                    </p>
                  </div>

                  {/* Summary */}
                  {email.ai?.summary?.discussion && (
                    <div className="mt-2 text-xs text-zinc-600">
                      <strong className="text-zinc-900">Summary: </strong>
                      {email.ai.summary.discussion}
                    </div>
                  )}
                </div>

                {/* Delegation form */}
                {delegatingThreadId === email.id && (
                  <div className="p-3.5 bg-zinc-900 text-zinc-100 border-b border-zinc-800 space-y-2.5 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-200">
                        Direct Instruction for Sarah Jenkins:
                      </span>
                      <button
                        onClick={() => setDelegatingThreadId(null)}
                        className="text-zinc-400 hover:text-zinc-200"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={delegateNote}
                        onChange={(e) => setDelegateNote(e.target.value)}
                        placeholder="e.g. Please decline politely or schedule for next Tuesday..."
                        className="w-full px-3 py-2 pr-10 text-xs bg-zinc-800 border border-zinc-700 rounded text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-400"
                      />
                      <button
                        onClick={handleSimulateVoice}
                        title="Simulate Voice Dictation"
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-emerald-400 ${
                          isRecording ? 'text-rose-400 animate-pulse' : ''
                        }`}
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleDelegate(email.id)}
                        disabled={isSubmitting}
                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-all cursor-pointer"
                      >
                        {isSubmitting ? 'Transferring...' : 'Transfer to Assistant Queue'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions Footer */}
                <div className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => setSelectedThreadForReview(email)}
                    className="font-medium text-zinc-600 hover:text-zinc-900 flex items-center space-x-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Review Full Thread ({email.messages?.length || 1})</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setDelegatingThreadId(email.id);
                        setDelegateNote('');
                      }}
                      className="px-3 py-1.5 font-medium rounded border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-800 transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                    >
                      <CornerDownRight className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Delegate to Sarah</span>
                    </button>

                    <button
                      onClick={() => handleMarkHandled(email.id)}
                      disabled={isSubmitting}
                      className="px-3 py-1.5 font-semibold rounded bg-zinc-900 hover:bg-zinc-800 text-white transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
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

        {/* Recently Resolved */}
        {handledEmails.length > 0 && (
          <div className="pt-6">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Recently Resolved by Alex ({handledEmails.length})
            </h3>
            <div className="space-y-1.5">
              {handledEmails.map((email) => (
                <div
                  key={email.id}
                  className="p-3 rounded-lg border border-zinc-200 bg-white flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2 truncate mr-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-medium text-zinc-800 truncate">{email.subject}</span>
                    <span className="text-zinc-400 text-[11px] truncate">({email.sender?.name})</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
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
          <div className="bg-white rounded-xl max-w-xl w-full shadow-2xl border border-zinc-200 max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">{selectedThreadForReview.subject}</h3>
                <p className="text-xs text-zinc-500 font-mono">From: {selectedThreadForReview.sender?.name}</p>
              </div>
              <button
                onClick={() => setSelectedThreadForReview(null)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5 flex-1 text-xs">
              {selectedThreadForReview.messages?.map((msg, i) => (
                <div key={i} className="p-3 bg-zinc-50 rounded border border-zinc-200">
                  <div className="font-semibold text-zinc-800 mb-1">{msg.sender}</div>
                  <div className="text-zinc-700 whitespace-pre-wrap leading-relaxed">{msg.body}</div>
                </div>
              ))}
            </div>

            <div className="p-3.5 border-t border-zinc-200 bg-zinc-50 flex justify-end space-x-2 text-xs">
              <button
                onClick={() => setSelectedThreadForReview(null)}
                className="px-3.5 py-1.5 font-medium text-zinc-600 hover:bg-zinc-200 rounded"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleMarkHandled(selectedThreadForReview.id);
                  setSelectedThreadForReview(null);
                }}
                className="px-3.5 py-1.5 font-semibold bg-zinc-900 text-white hover:bg-zinc-800 rounded"
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
