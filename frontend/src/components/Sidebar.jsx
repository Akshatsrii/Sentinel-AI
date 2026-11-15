import React from 'react';
import { 
  Inbox, 
  ShieldCheck, 
  UserCheck, 
  Calendar, 
  Archive, 
  AlertCircle, 
  PlusCircle, 
  Settings, 
  Cpu, 
  Sparkles,
  CheckCircle2,
  ChevronDown,
  Layers,
  Flame,
  Bot
} from 'lucide-react';

export default function Sidebar({
  currentRole,
  setCurrentRole,
  activeSegment,
  setActiveSegment,
  stats = {},
  accounts = [],
  onOpenAccounts,
  onOpenAgentDrawer,
  onOpenCopilot,
  onSimulateEmail,
  isSimulating
}) {
  const mailboxes = [
    { id: 'all', label: 'All Inboxes', count: stats.total, icon: Inbox },
    { id: 'assistant', label: 'Assigned to PA (Sarah)', count: stats.assistantToReply, pill: 'bg-sky-100 text-sky-800', icon: ShieldCheck },
    { id: 'client', label: 'Client Decisions (Alex)', count: stats.clientToReply, pill: 'bg-purple-100 text-purple-800', icon: UserCheck },
    { id: 'action_required', label: 'Action Required', count: stats.actionRequired, pill: 'bg-orange-100 text-orange-800', icon: Flame },
    { id: 'meetings', label: 'Calendar & Logistics', count: stats.upcomingMeetings, icon: Calendar },
    { id: 'no_reply', label: 'Low Priority / FYIs', count: stats.noReplyNeeded, icon: CheckCircle2 },
    { id: 'needs_review', label: 'Flagged for Review', count: stats.needsReview, pill: 'bg-amber-100 text-amber-800', icon: AlertCircle }
  ];

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col h-screen text-zinc-300 font-sans select-none shrink-0">
      
      {/* 1. Workspace Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-white">
            V
          </div>
          <div>
            <h2 className="text-xs font-semibold text-white tracking-tight leading-tight">Vance Capital</h2>
            <p className="text-[10px] text-zinc-400 font-mono">Alex Vance & Sarah Jenkins</p>
          </div>
        </div>

        <button
          onClick={onOpenAccounts}
          title="Account Settings"
          className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Persona Switcher (Authentic Toggle) */}
      <div className="p-3 border-b border-zinc-800">
        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 px-1 font-semibold">
          Active Workspace View
        </div>
        <div className="grid grid-cols-2 gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800/90 text-xs">
          <button
            onClick={() => setCurrentRole('assistant')}
            className={`py-1.5 px-2 rounded-md font-medium flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              currentRole === 'assistant'
                ? 'bg-zinc-800 text-white shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span className="truncate">Assistant</span>
          </button>

          <button
            onClick={() => setCurrentRole('client')}
            className={`py-1.5 px-2 rounded-md font-medium flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              currentRole === 'client'
                ? 'bg-zinc-800 text-white shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-purple-400" />
            <span className="truncate">Executive</span>
          </button>
        </div>
      </div>

      {/* 3. Mailboxes Navigation */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 text-xs">
        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1 px-2 font-semibold">
          Smart Inboxes
        </div>

        {mailboxes.map((item) => {
          const Icon = item.icon;
          const isActive = activeSegment === item.id && currentRole === 'assistant';
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveSegment(item.id);
                if (currentRole !== 'assistant') setCurrentRole('assistant');
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors cursor-pointer ${
                isActive
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.count !== undefined && item.count !== null && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  item.pill || (isActive ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-800 text-zinc-400')
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}

        {/* Inboxes Section */}
        <div className="pt-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 px-2 font-semibold flex items-center justify-between">
            <span>Synced Accounts</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </div>

          <div className="space-y-1">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="px-2.5 py-1 rounded text-[11px] text-zinc-400 flex items-center justify-between hover:bg-zinc-800/30"
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className="font-mono text-[10px] text-zinc-400">{acc.provider === 'google' ? 'G' : 'M'}</span>
                  <span className="truncate">{acc.email.split('@')[0]}</span>
                </div>
                <span className="font-mono text-[10px] text-zinc-400">{acc.unreadCount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Autonomous Agent Status & Simulation Footer */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-950 space-y-2">
        
        {/* Agent Sentinel Button */}
        <button
          onClick={onOpenAgentDrawer}
          className="w-full p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 flex items-center justify-between text-left transition-all cursor-pointer group"
        >
          <div className="flex items-center space-x-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <div>
              <div className="text-xs font-semibold text-zinc-200 group-hover:text-white">AI Agent Sentinel</div>
              <div className="text-[10px] font-mono text-zinc-400">Autonomous Triage Active</div>
            </div>
          </div>
          <Cpu className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
        </button>

        {/* Quick Simulation Trigger */}
        <button
          onClick={onSimulateEmail}
          disabled={isSimulating}
          className="w-full py-1.5 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/80 text-xs font-medium text-zinc-200 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
        >
          <PlusCircle className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-emerald-400' : 'text-zinc-400'}`} />
          <span>{isSimulating ? 'Processing...' : 'Simulate Incoming Mail'}</span>
        </button>

      </div>

    </aside>
  );
}
