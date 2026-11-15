import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  RefreshCw, 
  Plus, 
  ShieldCheck, 
  Mail, 
  ExternalLink,
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Email Inboxes & Synchronization</h3>
            <p className="text-xs text-slate-500">Connect and manage client email accounts for automated AI classification</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {step === 'list' ? (
            <>
              {/* Active Connected Inboxes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Connected Inboxes ({accounts.length})
                  </h4>
                  <span className="inline-flex items-center text-xs font-medium text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                    Continuous Auto-Sync Active
                  </span>
                </div>

                <div className="space-y-3">
                  {accounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                          acc.provider === 'google'
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : 'bg-blue-50 text-blue-600 border border-blue-200'
                        }`}>
                          {acc.provider === 'google' ? 'G' : 'M'}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-sm text-slate-800">{acc.name}</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                              {acc.provider}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{acc.email}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center text-xs font-medium text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                          <span>Synced</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{acc.lastSynced}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Connection */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  Connect Another Account
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleStartConnect('google')}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/40 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm mb-2 group-hover:scale-105 transition-transform">
                      G
                    </div>
                    <span className="text-xs font-semibold text-slate-700">Connect Google</span>
                    <span className="text-[10px] text-slate-400">Gmail & Workspace</span>
                  </button>

                  <button
                    onClick={() => handleStartConnect('microsoft')}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/40 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm mb-2 group-hover:scale-105 transition-transform">
                      M
                    </div>
                    <span className="text-xs font-semibold text-slate-700">Connect Outlook</span>
                    <span className="text-[10px] text-slate-400">Microsoft 365</span>
                  </button>
                </div>
              </div>

              {/* Security info note */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-start space-x-2.5">
                <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Zero data retention for training:</strong> AuraPA accesses emails via sandboxed OAuth2 credentials with read-only & draft permissions. Only authorized assistants and the client can review classified emails.
                </p>
              </div>
            </>
          ) : (
            /* OAuth Simulation Flow */
            <div className="py-4 space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center font-bold text-xl shadow-md bg-indigo-50 text-indigo-600 border border-indigo-200">
                {connectingProvider === 'google' ? 'Google' : 'Outlook'}
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-800">
                  Authorize {connectingProvider === 'google' ? 'Google Workspace' : 'Microsoft 365'}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  AuraPA requires permission to read incoming messages and draft contextual email responses on your behalf.
                </p>
              </div>

              <div className="text-left max-w-xs mx-auto">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Account Email</label>
                <input
                  type="email"
                  value={newEmailInput}
                  onChange={(e) => setNewEmailInput(e.target.value)}
                  placeholder={connectingProvider === 'google' ? 'alex.personal@gmail.com' : 'alex@corporate.com'}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-center space-x-3 pt-4">
                <button
                  onClick={() => setStep('list')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteConnect}
                  className="px-5 py-2 text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-xs flex items-center space-x-1.5"
                >
                  <span>Complete Authorization</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Client: Alex Vance (CEO)</span>
          <span>Assistant: Sarah Jenkins</span>
        </div>

      </div>
    </div>
  );
}
