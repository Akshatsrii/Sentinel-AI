import React, { useState } from 'react';
import { 
  Inbox, 
  UserCheck, 
  ShieldCheck, 
  Calendar, 
  Star, 
  Archive, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  ChevronRight,
  Flame,
  Mail,
  Cpu,
  Layers
} from 'lucide-react';
import EmailDetailView from './EmailDetailView';

export default function AssistantDashboard({
  emails = [],
  stats = {},
  selectedEmail,
  onSelectEmail,
  activeSegment,
  setActiveSegment,
  searchQuery,
  setSearchQuery,
  priorityFilter,
  setPriorityFilter,
  accountFilter,
  setAccountFilter,
  onRefreshEmail,
  onOpenAgentDrawer,
  isLoading
}) {
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  const segments = [
    { id: 'all', label: 'All Inboxes', count: stats.total, icon: Inbox },
    { id: 'assistant', label: 'Assistant to Reply', count: stats.assistantToReply, badge: 'text-sky-400 bg-sky-950/60 border-sky-800', icon: ShieldCheck },
    { id: 'client', label: 'Client to Reply', count: stats.clientToReply, badge: 'text-purple-400 bg-purple-950/60 border-purple-800', icon: UserCheck },
    { id: 'no_reply', label: 'No Reply Needed', count: stats.noReplyNeeded, badge: 'text-zinc-400 bg-zinc-800 border-zinc-700', icon: CheckCircle2 },
    { id: 'needs_review', label: 'Needs Review', count: stats.needsReview, badge: 'text-amber-400 bg-amber-950/60 border-amber-800', icon: AlertCircle },
    { id: 'action_required', label: 'Action Required', count: stats.actionRequired, badge: 'text-orange-400 bg-orange-950/60 border-orange-800', icon: Flame },
    { id: 'meetings', label: 'Calendar & Meetings', count: stats.upcomingMeetings, badge: 'text-emerald-400 bg-emerald-950/60 border-emerald-800', icon: Calendar },
    { id: 'important', label: 'Starred VIP', count: null, badge: 'text-amber-400', icon: Star }
  ];

  const handleEmailClick = (email) => {
    onSelectEmail(email);
    setMobileDetailOpen(true);
  };

  const getResponsibilityPill = (resp) => {
    switch (resp) {
      case 'Client to Reply':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-purple-50 text-purple-800 border border-purple-200">
            Client to Reply
          </span>
        );
      case 'Assistant to Reply':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-sky-50 text-sky-800 border border-sky-200">
            Assistant to Reply
          </span>
        );
      case 'Needs Review':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200">
            Needs Review
          </span>
        );
      case 'No Reply Needed':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
            No Reply Needed
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5 font-sans">
      
      {/* 1. Senior Executive Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div 
          onClick={() => setActiveSegment('all')}
          className={`p-3 rounded-lg border transition-all cursor-pointer ${
            activeSegment === 'all'
              ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
              : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-300'
          }`}
        >
          <div className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Total Indexed</div>
          <div className="text-xl font-bold mt-1 font-mono">{stats.total || 0}</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">{stats.unread || 0} unread</div>
        </div>

        <div 
          onClick={() => setActiveSegment('assistant')}
          className={`p-3 rounded-lg border transition-all cursor-pointer ${
            activeSegment === 'assistant'
              ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
              : 'bg-white text-zinc-900 border-zinc-200 hover:border-sky-300'
          }`}
        >
          <div className="text-[11px] font-medium text-sky-600 uppercase tracking-wider flex items-center justify-between">
            <span>PA Queue</span>
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold mt-1 font-mono text-zinc-900">{stats.assistantToReply || 0}</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Assigned to Sarah</div>
        </div>

        <div 
          onClick={() => setActiveSegment('client')}
          className={`p-3 rounded-lg border transition-all cursor-pointer ${
            activeSegment === 'client'
              ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
              : 'bg-white text-zinc-900 border-zinc-200 hover:border-purple-300'
          }`}
        >
          <div className="text-[11px] font-medium text-purple-600 uppercase tracking-wider flex items-center justify-between">
            <span>Client Action</span>
            <UserCheck className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold mt-1 font-mono text-zinc-900">{stats.clientToReply || 0}</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Needs Alex Vance</div>
        </div>

        <div 
          onClick={() => setActiveSegment('action_required')}
          className={`p-3 rounded-lg border transition-all cursor-pointer ${
            activeSegment === 'action_required'
              ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
              : 'bg-white text-zinc-900 border-zinc-200 hover:border-orange-300'
          }`}
        >
          <div className="text-[11px] font-medium text-orange-600 uppercase tracking-wider flex items-center justify-between">
            <span>Action Required</span>
            <Flame className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold mt-1 font-mono text-zinc-900">{stats.actionRequired || 0}</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Pending decisions</div>
        </div>

        <div 
          onClick={() => setActiveSegment('no_reply')}
          className={`p-3 rounded-lg border transition-all cursor-pointer ${
            activeSegment === 'no_reply'
              ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
              : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-300'
          }`}
        >
          <div className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider flex items-center justify-between">
            <span>No Reply Needed</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold mt-1 font-mono text-zinc-700">{stats.noReplyNeeded || 0}</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Automated / FYIs</div>
        </div>

        <div 
          onClick={() => setActiveSegment('meetings')}
          className={`p-3 rounded-lg border transition-all cursor-pointer ${
            activeSegment === 'meetings'
              ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
              : 'bg-white text-zinc-900 border-zinc-200 hover:border-emerald-300'
          }`}
        >
          <div className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider flex items-center justify-between">
            <span>Schedule Requests</span>
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold mt-1 font-mono text-zinc-900">{stats.upcomingMeetings || 0}</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Board / VIP Dinners</div>
        </div>
      </div>

      {/* 2. Linear-Style Segment Navigation */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none border-b border-zinc-200 text-xs">
        {segments.map((seg) => {
          const Icon = seg.icon;
          const isActive = activeSegment === seg.id;
          return (
            <button
              key={seg.id}
              onClick={() => setActiveSegment(seg.id)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-zinc-900 text-zinc-100 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5 opacity-80" />
              <span>{seg.label}</span>
              {seg.count !== null && (
                <span className={`px-1.5 py-0.2 rounded font-mono text-[10px] ${
                  isActive ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'
                }`}>
                  {seg.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Search and Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-white p-2 rounded-lg border border-zinc-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search threads, senders, AI reasons..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:bg-white text-zinc-900 placeholder:text-zinc-400"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-md font-medium text-zinc-700 focus:outline-hidden"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-md font-medium text-zinc-700 focus:outline-hidden"
          >
            <option value="all">All Inboxes (Google & Microsoft)</option>
            <option value="alex.vance@vancecapital.io">Alex Vance (Google)</option>
            <option value="alex.vance@outlook.com">Alex Vance (Outlook)</option>
          </select>

          <button
            onClick={onOpenAgentDrawer}
            className="px-2.5 py-1.5 text-xs font-mono font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-md border border-zinc-200 flex items-center space-x-1.5 transition-all"
            title="Inspect autonomous agent execution logs"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Telemetry</span>
          </button>
        </div>
      </div>

      {/* 4. Split Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[640px]">
        
        {/* Left Column: Email Cards List (5 cols) */}
        <div className="lg:col-span-5 space-y-2 max-h-[750px] overflow-y-auto pr-1">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-zinc-400 font-mono">Indexing threads...</div>
          ) : emails.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-lg border border-zinc-200">
              <Mail className="w-6 h-6 text-zinc-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-zinc-800">No conversations in this view</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Reset demo or clear filters</p>
            </div>
          ) : (
            emails.map((email) => {
              const isSelected = selectedEmail?.id === email.id;

              return (
                <div
                  key={email.id}
                  onClick={() => handleEmailClick(email)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                      : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-900'
                  }`}
                >
                  {/* Unread indicator */}
                  {email.isUnread && (
                    <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-emerald-500"></span>
                  )}

                  {/* Sender & Timestamp */}
                  <div className="flex items-center justify-between text-xs mb-1.5 pr-4">
                    <div className="flex items-center space-x-2 truncate">
                      <img
                        src={email.sender?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={email.sender?.name}
                        className="w-5 h-5 rounded-full object-cover border border-zinc-300"
                      />
                      <span className={`font-semibold truncate text-xs ${isSelected ? 'text-zinc-100' : 'text-zinc-900'}`}>
                        {email.sender?.name}
                      </span>
                      {email.sender?.company && (
                        <span className={`text-[10px] truncate ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                          • {email.sender.company}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-mono shrink-0 ${isSelected ? 'text-zinc-400' : 'text-zinc-400'}`}>
                      {new Date(email.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  {/* Subject */}
                  <h4 className={`text-xs font-bold line-clamp-1 mb-1 ${isSelected ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    {email.subject}
                  </h4>

                  {/* AI Snippet Reason */}
                  <p className={`text-[11px] line-clamp-2 leading-relaxed mb-2.5 ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                    {email.ai?.reason || email.messages?.[email.messages.length - 1]?.body}
                  </p>

                  {/* Badges Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100/10 text-[10px]">
                    <div className="flex items-center space-x-1.5">
                      {isSelected ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-200 border border-zinc-700">
                          {email.ai?.responsibility}
                        </span>
                      ) : (
                        getResponsibilityPill(email.ai?.responsibility)
                      )}

                      {email.ai?.priority === 'Urgent' && (
                        <span className="px-1.5 py-0.2 rounded font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Urgent
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 text-[10px] font-mono opacity-60">
                      <span>{email.messages?.length || 1} msg</span>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Email Detail View (7 cols) */}
        <div className="hidden lg:block lg:col-span-7">
          <EmailDetailView
            email={selectedEmail}
            onRefreshEmail={onRefreshEmail}
            currentRole="assistant"
          />
        </div>

      </div>

      {/* Mobile Drawer/Modal for Detail View */}
      {mobileDetailOpen && selectedEmail && (
        <div className="fixed inset-0 z-40 bg-zinc-950/70 lg:hidden p-3 overflow-y-auto flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-lg h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-zinc-200">
            <div className="p-2.5 border-b border-zinc-200 flex justify-end bg-zinc-50">
              <button
                onClick={() => setMobileDetailOpen(false)}
                className="px-3 py-1 text-xs font-semibold bg-zinc-200 rounded text-zinc-800"
              >
                Close View
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <EmailDetailView
                email={selectedEmail}
                onRefreshEmail={onRefreshEmail}
                currentRole="assistant"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
