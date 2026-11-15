import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';

export default function AccountsModal({ isOpen, onClose, accounts = [], onConnectAccount }) {
  const [connectingProvider, setConnectingProvider] = useState(null);
  const [newEmailInput, setNewEmailInput] = useState('');
  const [step, setStep] = useState('list'); // 'list' | 'oauth_sim'

  if (!isOpen) return null;

  const handleStartConnect = (provider) => {
    setConnectingProvider(provider);
    setStep('oauth_sim');
  };

  const handleCompleteConnect = () => {
    onConnectAccount(connectingProvider, newEmailInput);
    setConnectingProvider(null);
    setNewEmailInput('');
    setStep('list');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-2xs flex items-center justify-center p-4 font-sans">
      <div className="relative bg-white rounded-xl max-w-lg w-full shadow-2xl border border-zinc-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Connected Inboxes & Credentials</h3>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">Sandboxed read & draft OAuth synchronization</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {step === 'list' ? (
            <>
              <div>
                <div className="flex items-center justify-between mb-2 text-xs">
                  <span className="font-mono uppercase text-zinc-500 font-semibold">Active Inboxes ({accounts.length})</span>
                  <span className="inline-flex items-center font-mono text-[11px] text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                    Continuous Stream
                  </span>
                </div>

                <div className="space-y-2.5">
                  {accounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="p-3.5 rounded-lg border border-zinc-200 bg-white flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded bg-zinc-100 border border-zinc-200 flex items-center justify-center font-mono font-bold text-xs text-zinc-700">
                          {acc.provider === 'google' ? 'G' : 'M'}
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-900">{acc.name}</div>
                          <p className="text-[11px] font-mono text-zinc-500">{acc.email}</p>
                        </div>
                      </div>

                      <div className="text-right font-mono text-[11px]">
                        <div className="text-emerald-600 font-medium">Active</div>
                        <div className="text-zinc-400 text-[10px] mt-0.5">{acc.lastSynced}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Connection */}
              <div>
                <div className="text-xs font-mono uppercase text-zinc-500 font-semibold mb-2">
                  Connect Additional Inbox
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleStartConnect('google')}
                    className="p-3 rounded-lg border border-dashed border-zinc-300 hover:border-zinc-900 hover:bg-zinc-50 text-left transition-all cursor-pointer"
                  >
                    <div className="font-semibold text-xs text-zinc-900">Google Workspace</div>
                    <div className="text-[10px] font-mono text-zinc-500 mt-0.5">Gmail API (OAuth2)</div>
                  </button>

                  <button
                    onClick={() => handleStartConnect('microsoft')}
                    className="p-3 rounded-lg border border-dashed border-zinc-300 hover:border-zinc-900 hover:bg-zinc-50 text-left transition-all cursor-pointer"
                  >
                    <div className="font-semibold text-xs text-zinc-900">Microsoft 365</div>
                    <div className="text-[10px] font-mono text-zinc-500 mt-0.5">MS Graph API (OAuth2)</div>
                  </button>
                </div>
              </div>

              {/* Security info note */}
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 flex items-start space-x-2 text-xs text-zinc-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Enterprise isolation:</strong> All messages are tokenized in memory and audited against company privacy policies. No training retention.
                </p>
              </div>
            </>
          ) : (
            /* OAuth Simulation Flow */
            <div className="py-4 space-y-4 text-center text-xs">
              <div className="w-12 h-12 rounded-lg mx-auto flex items-center justify-center font-bold text-base bg-zinc-100 text-zinc-900 border border-zinc-300">
                {connectingProvider === 'google' ? 'Google' : 'Outlook'}
              </div>

              <div>
                <h4 className="text-sm font-bold text-zinc-900">
                  Authorize {connectingProvider === 'google' ? 'Google Workspace' : 'Microsoft 365'}
                </h4>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                  AuraPA requires read-metadata and draft permissions to generate approved replies.
                </p>
              </div>

              <div className="text-left max-w-xs mx-auto">
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Account Email</label>
                <input
                  type="email"
                  value={newEmailInput}
                  onChange={(e) => setNewEmailInput(e.target.value)}
                  placeholder={connectingProvider === 'google' ? 'alex.personal@gmail.com' : 'alex@corporate.com'}
                  className="w-full px-3 py-1.5 text-xs border border-zinc-300 rounded focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div className="flex items-center justify-center space-x-2 pt-2">
                <button
                  onClick={() => setStep('list')}
                  className="px-3.5 py-1.5 text-xs text-zinc-600 hover:text-zinc-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteConnect}
                  className="px-4 py-1.5 text-xs font-semibold bg-zinc-900 text-white hover:bg-zinc-800 rounded flex items-center space-x-1"
                >
                  <span>Authorize</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>Client: Alex Vance</span>
          <span>Assistant: Sarah Jenkins</span>
        </div>

      </div>
    </div>
  );
}
