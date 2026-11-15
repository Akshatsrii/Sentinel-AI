import React from 'react';
import { 
  Inbox, 
  ShieldCheck, 
  UserCheck, 
  Calendar, 
  AlertCircle, 
  PlusCircle, 
  Settings, 
  Cpu, 
  CheckCircle2, 
  PanelLeftClose, 
  PanelLeft, 
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
  isSimulating,
  isCollapsed,
  setIsCollapsed
}) {
  const mailboxes = [
    { id: 'all', label: 'All Inboxes', count: stats.total, icon: Inbox },
    { id: 'assistant', label: 'Assigned to PA', count: stats.assistantToReply, pill: 'bg-sky-100 text-sky-800', icon: ShieldCheck },
    { id: 'client', label: 'Client Decisions', count: stats.clientToReply, pill: 'bg-purple-100 text-purple-800', icon: UserCheck },
    { id: 'action_required', label: 'Action Required', count: stats.actionRequired, pill: 'bg-orange-100 text-orange-800', icon: Flame },
    { id: 'meetings', label: 'Calendar & Logistics', count: stats.upcomingMeetings, icon: Calendar },
    { id: 'no_reply', label: 'Low Priority / FYIs', count: stats.noReplyNeeded, icon: CheckCircle2 },
    { id: 'needs_review', label: 'Flagged for Review', count: stats.needsReview, pill: 'bg-amber-100 text-amber-800', icon: AlertCircle }
  ];

  return (
    <aside
      className={`bg-zinc-900 border-r border-zinc-800 flex flex-col h-screen text-zinc-300 font-sans select-none shrink-0 transition-all duration-200 z-20 ${
        isCollapsed ? 'w-16' : 'w-56 xl:w-60'
      }`}
    >
      {/* 1. Workspace Header */}
      <div className="p-3 border-b border-zinc-800 flex items-center justify-between h-13">
        {!isCollapsed && (
          <div className="flex items-center space-x-2 truncate">
            <div className="w-6 h-6 rounded bg-emerald-600 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs">
              S
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-1.5">
                <h2 className="text-xs font-bold text-white tracking-tight leading-tight truncate">Sentinel</h2>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1 rounded border border-emerald-800">AI</span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono truncate">Alex Vance & Sarah</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors cursor-pointer mx-auto"
        >
          {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. Persona Switcher */}
      {!isCollapsed ? (
        <div className="p-2.5 border-b border-zinc-800">
          <div className="grid grid-cols-2 gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800/90 text-xs">
            <button
              onClick={() => setCurrentRole('assistant')}
              className={`py-1 px-1.5 rounded-md font-medium flex items-center justify-center space-x-1 transition-all cursor-pointer truncate ${
                currentRole === 'assistant'
                  ? 'bg-zinc-800 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-sky-400 shrink-0" />
              <span className="truncate text-[11px]">Assistant</span>
            </button>

            <button
              onClick={() => setCurrentRole('client')}
              className={`py-1 px-1.5 rounded-md font-medium flex items-center justify-center space-x-1 transition-all cursor-pointer truncate ${
                currentRole === 'client'
                  ? 'bg-zinc-800 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <UserCheck className="w-3 h-3 text-purple-400 shrink-0" />
              <span className="truncate text-[11px]">Executive</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="py-2 flex flex-col items-center space-y-1 border-b border-zinc-800">
          <button
            onClick={() => setCurrentRole('assistant')}
            title="Assistant Workspace"
            className={`p-2 rounded-lg cursor-pointer ${currentRole === 'assistant' ? 'bg-zinc-800 text-sky-400' : 'text-zinc-400 hover:bg-zinc-800'}`}
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentRole('client')}
            title="Executive Workspace"
            className={`p-2 rounded-lg cursor-pointer ${currentRole === 'client' ? 'bg-zinc-800 text-purple-400' : 'text-zinc-400 hover:bg-zinc-800'}`}
          >
            <UserCheck className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Mailboxes Navigation */}
      <div className="flex-1 overflow-y-auto px-1.5 py-2.5 space-y-0.5 text-xs">
        {!isCollapsed && (
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1 px-2 font-semibold">
            Inboxes
          </div>
        )}

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
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2' : 'justify-between px-2.5 py-1.5'} rounded-md text-left transition-colors cursor-pointer ${
                isActive
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center space-x-2 truncate">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                {!isCollapsed && <span className="truncate text-xs">{item.label}</span>}
              </div>

              {!isCollapsed && item.count !== undefined && item.count !== null && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                  item.pill || (isActive ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-800 text-zinc-400')
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}

        {/* Inboxes Section */}
        {!isCollapsed && (
          <div className="pt-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1 px-2 font-semibold flex items-center justify-between">
              <span>Accounts</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>

            <div className="space-y-0.5">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="px-2 py-1 rounded text-[11px] text-zinc-400 flex items-center justify-between hover:bg-zinc-800/30 truncate"
                >
                  <div className="flex items-center space-x-1.5 truncate">
                    <span className="font-mono text-[10px] text-zinc-400">{acc.provider === 'google' ? 'G' : 'M'}</span>
                    <span className="truncate text-[11px]">{acc.email.split('@')[0]}</span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-400 shrink-0">{acc.unreadCount}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Footer & Actions */}
      <div className="p-2 border-t border-zinc-800 bg-zinc-950 space-y-1.5">
        
        {/* Agent Sentinel Button */}
        <button
          onClick={onOpenAgentDrawer}
          title="Sentinel Agent Engine"
          className={`w-full p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} text-left transition-all cursor-pointer`}
        >
          <div className="flex items-center space-x-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            {!isCollapsed && (
              <div className="truncate">
                <div className="text-[11px] font-semibold text-zinc-200 truncate">Sentinel Agent</div>
                <div className="text-[9px] font-mono text-zinc-400 truncate">Autonomous Active</div>
              </div>
            )}
          </div>
          {!isCollapsed && <Cpu className="w-3 h-3 text-zinc-400 shrink-0" />}
        </button>

        {/* Quick Simulation Trigger */}
        <button
          onClick={onSimulateEmail}
          disabled={isSimulating}
          title="Simulate incoming mail"
          className={`w-full py-1.5 px-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/80 text-[11px] font-medium text-zinc-200 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-1.5 justify-center'} transition-all cursor-pointer`}
        >
          <PlusCircle className={`w-3.5 h-3.5 shrink-0 ${isSimulating ? 'animate-spin text-emerald-400' : 'text-zinc-400'}`} />
          {!isCollapsed && <span className="truncate">{isSimulating ? 'Processing...' : 'Simulate Mail'}</span>}
        </button>

        {/* Copilot button */}
        <button
          onClick={onOpenCopilot}
          title="Ask Sentinel Copilot"
          className={`w-full py-1.5 px-2 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800/80 text-[11px] font-medium text-indigo-300 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-1.5 justify-center'} transition-all cursor-pointer`}
        >
          <Bot className="w-3.5 h-3.5 shrink-0" />
          {!isCollapsed && <span className="truncate">Sentinel Copilot</span>}
        </button>

      </div>

    </aside>
  );
}
