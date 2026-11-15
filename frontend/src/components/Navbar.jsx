import React from 'react';
import { 
  Bot, 
  ShieldCheck, 
  UserCheck, 
  Cpu, 
  PlusCircle, 
  RefreshCw, 
  Settings, 
  Command,
  Activity,
  Layers
} from 'lucide-react';

export default function Navbar({
  currentRole,
  setCurrentRole,
  onOpenAccounts,
  onOpenAIChat,
  onOpenAgentDrawer,
  onSimulateEmail,
  onResetDemo,
  isSimulating,
  unreadCount = 0,
  clientPendingCount = 0
}) {
  return (
    <header className="sticky top-0 z-30 bg-zinc-900 border-b border-zinc-800 text-zinc-100 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Left: Brand & Status */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-200">
              <span className="font-mono font-bold text-xs tracking-wider text-emerald-400">α</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm text-zinc-100 tracking-tight">AuraPA</span>
                <span className="px-1.5 py-0.2 rounded font-mono text-[10px] bg-zinc-800 text-zinc-400 border border-zinc-700">
                  v2.4
                </span>
              </div>
            </div>

            {/* Separator */}
            <div className="h-4 w-px bg-zinc-800 hidden sm:block"></div>

            {/* AI Agent Status Pill */}
            <button
              onClick={onOpenAgentDrawer}
              className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 transition-all cursor-pointer"
              title="Inspect autonomous agent reasoning traces and tool executions"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Agent: Autonomous</span>
              <Activity className="w-3 h-3 text-emerald-400 ml-0.5" />
            </button>
          </div>

          {/* Center: Dual Persona Switcher */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setCurrentRole('assistant')}
              className={`flex items-center space-x-2 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                currentRole === 'assistant'
                  ? 'bg-zinc-800 text-zinc-100 shadow-xs border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Assistant Command</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-zinc-700 text-zinc-200">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentRole('client')}
              className={`flex items-center space-x-2 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                currentRole === 'client'
                  ? 'bg-zinc-800 text-zinc-100 shadow-xs border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Executive Portal</span>
              {clientPendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800">
                  {clientPendingCount} action
                </span>
              )}
            </button>
          </div>

          {/* Right: Quick Actions */}
          <div className="flex items-center space-x-2">
            
            {/* Live Email Simulation */}
            <button
              onClick={onSimulateEmail}
              disabled={isSimulating}
              title="Simulate receiving an incoming email to test AI classification in real-time"
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all"
            >
              <PlusCircle className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-emerald-400' : 'text-zinc-400'}`} />
              <span className="hidden md:inline">{isSimulating ? 'Classifying...' : 'Simulate Mail'}</span>
            </button>

            {/* AI Agent Telemetry Drawer Button */}
            <button
              onClick={onOpenAgentDrawer}
              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 transition-all"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Agent Trace</span>
            </button>

            {/* AI Copilot Button */}
            <button
              onClick={onOpenAIChat}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 transition-all"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copilot</span>
            </button>

            {/* Connected Inboxes */}
            <button
              onClick={onOpenAccounts}
              title="Manage connected Google & Microsoft inboxes"
              className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md border border-transparent hover:border-zinc-700 transition-all"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Reset Demo */}
            <button
              onClick={onResetDemo}
              title="Reset sample inbox to original state"
              className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
