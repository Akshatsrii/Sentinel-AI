import React from 'react';
import { 
  Sparkles, 
  Mail, 
  UserCheck, 
  ShieldCheck, 
  RefreshCw, 
  PlusCircle, 
  Bot, 
  CheckCircle2, 
  Layers, 
  Settings,
  ChevronDown
} from 'lucide-react';

export default function Navbar({
  currentRole,
  setCurrentRole,
  onOpenAccounts,
  onOpenAIChat,
  onSimulateEmail,
  onResetDemo,
  isSimulating,
  unreadCount = 0,
  clientPendingCount = 0
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand & Status */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">AuraPA</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  AI Email Suite
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Executive & Personal Assistant Platform</p>
            </div>
          </div>

          {/* Center: Dual Persona Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
            <button
              onClick={() => setCurrentRole('assistant')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                currentRole === 'assistant'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Assistant Dashboard</span>
              {unreadCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentRole('client')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                currentRole === 'client'
                  ? 'bg-white text-purple-700 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4 text-purple-600" />
              <span>Client Portal</span>
              {clientPendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 animate-pulse">
                  {clientPendingCount} need attention
                </span>
              )}
            </button>
          </div>

          {/* Right: Quick Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Live Email Simulation Button */}
            <button
              onClick={onSimulateEmail}
              disabled={isSimulating}
              title="Simulate receiving an incoming email to test AI classification in real-time"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all shadow-xs"
            >
              <PlusCircle className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">{isSimulating ? 'Classifying...' : 'Simulate Email'}</span>
            </button>

            {/* AI Copilot Button */}
            <button
              onClick={onOpenAIChat}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-xs shadow-indigo-500/20 transition-all"
            >
              <Bot className="w-3.5 h-3.5 text-indigo-200" />
              <span className="hidden sm:inline">Ask AI Copilot</span>
            </button>

            {/* Connected Accounts */}
            <button
              onClick={onOpenAccounts}
              className="flex items-center space-x-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 text-xs font-medium transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden md:inline">2 Inboxes Synced</span>
              <Settings className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Reset Demo */}
            <button
              onClick={onResetDemo}
              title="Reset sample inbox to original state"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
