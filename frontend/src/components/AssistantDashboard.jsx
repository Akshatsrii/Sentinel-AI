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
  ArrowUpDown,
  Mail
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
  isLoading
}) {
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  const segments = [
    { id: 'all', label: 'All Inboxes', count: stats.total, icon: Inbox },
    { id: 'assistant', label: 'Assistant to Reply', count: stats.assistantToReply, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200', icon: ShieldCheck },
    { id: 'client', label: 'Client to Reply', count: stats.clientToReply, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200', icon: UserCheck },
    { id: 'no_reply', label: 'No Reply Needed', count: stats.noReplyNeeded, color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200', icon: CheckCircle2 },
    { id: 'needs_review', label: 'Needs Review', count: stats.needsReview, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', icon: AlertCircle },
    { id: 'action_required', label: 'Action Required', count: stats.actionRequired, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', icon: Flame },
    { id: 'meetings', label: 'Meetings & Calendar', count: stats.upcomingMeetings, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', icon: Calendar },
    { id: 'important', label: 'Important', count: null, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200', icon: Star }
  ];

  const handleEmailClick = (email) => {
    onSelectEmail(email);
    setMobileDetailOpen(true);
  };

  const getResponsibilityBadge = (resp) => {
    switch (resp) {
      case 'Client to Reply':
        return {
          label: 'Client to Reply',
          bg: 'bg-purple-50 text-purple-700 border-purple-200'
        };
      case 'Assistant to Reply':
        return {
          label: 'Assistant to Reply',
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200'
        };
      case 'Needs Review':
        return {
          label: 'Needs Review',
          bg: 'bg-amber-50 text-amber-700 border-amber-200'
        };
      case 'No Reply Needed':
      default:
        return {
          label: 'No Reply Needed',
          bg: 'bg-slate-100 text-slate-600 border-slate-200'
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* 1. Quick Stats Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div 
          onClick={() => setActiveSegment('all')}
          className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 cursor-pointer transition-all"
        >
          <div className="text-xs text-slate-500 font-medium">Total Emails</div>
          <div className="text-xl font-bold text-slate-800 mt-1">{stats.total || 0}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{stats.unread || 0} unread</div>
        </div>

        <div 
          onClick={() => setActiveSegment('assistant')}
          className="p-3.5 bg-white rounded-xl border border-indigo-100 shadow-2xs hover:border-indigo-300 cursor-pointer transition-all"
        >
          <div className="text-xs text-indigo-600 font-semibold flex items-center justify-between">
            <span>Assistant Reply</span>
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold text-indigo-900 mt-1">{stats.assistantToReply || 0}</div>
          <div className="text-[10px] text-indigo-500 mt-0.5">Assigned to you</div>
        </div>

        <div 
          onClick={() => setActiveSegment('client')}
          className="p-3.5 bg-white rounded-xl border border-purple-100 shadow-2xs hover:border-purple-300 cursor-pointer transition-all"
        >
          <div className="text-xs text-purple-600 font-semibold flex items-center justify-between">
            <span>Client Reply</span>
            <UserCheck className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold text-purple-900 mt-1">{stats.clientToReply || 0}</div>
          <div className="text-[10px] text-purple-500 mt-0.5">Needs Alex Vance</div>
        </div>

        <div 
          onClick={() => setActiveSegment('no_reply')}
          className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 cursor-pointer transition-all"
        >
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>No Reply Needed</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold text-slate-700 mt-1">{stats.noReplyNeeded || 0}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Receipts & updates</div>
        </div>

        <div 
          onClick={() => setActiveSegment('action_required')}
          className="p-3.5 bg-white rounded-xl border border-orange-100 shadow-2xs hover:border-orange-300 cursor-pointer transition-all"
        >
          <div className="text-xs text-orange-600 font-semibold flex items-center justify-between">
            <span>Action Required</span>
            <Flame className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold text-orange-900 mt-1">{stats.actionRequired || 0}</div>
          <div className="text-[10px] text-orange-500 mt-0.5">Pending responses</div>
        </div>

        <div 
          onClick={() => setActiveSegment('meetings')}
          className="p-3.5 bg-white rounded-xl border border-emerald-100 shadow-2xs hover:border-emerald-300 cursor-pointer transition-all"
        >
          <div className="text-xs text-emerald-600 font-semibold flex items-center justify-between">
            <span>Calendar Requests</span>
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold text-emerald-900 mt-1">{stats.upcomingMeetings || 0}</div>
          <div className="text-[10px] text-emerald-500 mt-0.5">Meetings & dining</div>
        </div>
      </div>

      {/* 2. Segmentation Tabs Bar */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {segments.map((seg) => {
          const Icon = seg.icon;
          const isActive = activeSegment === seg.id;
          return (
            <button
              key={seg.id}
              onClick={() => setActiveSegment(seg.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{seg.label}</span>
              {seg.count !== null && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'
                }`}>
                  {seg.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Search and Filters Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects, senders, companies, or AI reasons..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        {/* Priority & Account Filters */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-hidden"
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
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Inboxes (Google & Outlook)</option>
            <option value="alex.vance@vancecapital.io">Alex Vance (Google)</option>
            <option value="alex.vance@outlook.com">Alex Vance (Outlook)</option>
          </select>
        </div>
      </div>

      {/* 4. Split Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px]">
        
        {/* Left Column: Email Cards List (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading inbox...</div>
          ) : emails.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <Mail className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">No emails in this segment</p>
              <p className="text-[11px] text-slate-400 mt-1">Try clearing filters or simulating a new email</p>
            </div>
          ) : (
            emails.map((email) => {
              const badge = getResponsibilityBadge(email.ai?.responsibility);
              const isSelected = selectedEmail?.id === email.id;

              return (
                <div
                  key={email.id}
                  onClick={() => handleEmailClick(email)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-indigo-50/40 border-indigo-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  {/* Unread indicator */}
                  {email.isUnread && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-indigo-600 ring-4 ring-indigo-100"></span>
                  )}

                  {/* Sender & Timestamp */}
                  <div className="flex items-center justify-between text-xs mb-1.5 pr-4">
                    <div className="flex items-center space-x-2">
                      <img
                        src={email.sender?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={email.sender?.name}
                        className="w-6 h-6 rounded-full object-cover border border-slate-200"
                      />
                      <span className="font-bold text-slate-900">{email.sender?.name}</span>
                      {email.sender?.company && (
                        <span className="text-[10px] text-slate-400">
                          • {email.sender.company}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(email.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  {/* Subject */}
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mb-1">
                    {email.subject}
                  </h4>

                  {/* AI Snippet Reason */}
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {email.ai?.reason || email.messages?.[email.messages.length - 1]?.body}
                  </p>

                  {/* Badges Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                      <span className={`px-2 py-0.5 rounded-full font-bold border ${badge.bg}`}>
                        {badge.label}
                      </span>
                      {email.ai?.priority === 'Urgent' && (
                        <span className="px-1.5 py-0.2 rounded font-bold bg-red-100 text-red-700">
                          Urgent
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 text-slate-400">
                      <span>{email.messages?.length || 1} msg</span>
                      <ChevronRight className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden p-4 overflow-y-auto flex items-center justify-center">
          <div className="bg-white rounded-2xl w-full max-w-lg h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-3 border-b border-slate-200 flex justify-end">
              <button
                onClick={() => setMobileDetailOpen(false)}
                className="px-3 py-1 text-xs font-semibold bg-slate-100 rounded-lg text-slate-700"
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
