import React from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  ChevronRight, 
  Mail,
  Flame,
  CheckCircle2
} from 'lucide-react';

export default function ThreadList({
  emails = [],
  selectedEmail,
  onSelectEmail,
  searchQuery,
  setSearchQuery,
  priorityFilter,
  setPriorityFilter,
  isLoading
}) {
  const getBadgeStyle = (resp) => {
    switch (resp) {
      case 'Client to Reply':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Assistant to Reply':
        return 'text-sky-700 bg-sky-50 border-sky-200';
      case 'Needs Review':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'No Reply Needed':
      default:
        return 'text-zinc-500 bg-zinc-100 border-zinc-200';
    }
  };

  return (
    <div className="w-80 sm:w-96 border-r border-zinc-200 bg-white flex flex-col h-screen select-none shrink-0 font-sans">
      
      {/* 1. Search Bar */}
      <div className="p-3 border-b border-zinc-200 bg-white">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages, senders, AI tags..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:bg-white text-zinc-900 placeholder:text-zinc-400 font-sans"
          />
        </div>

        {/* Priority Filter chips */}
        <div className="flex items-center space-x-1.5 mt-2 pt-1 text-[11px] font-medium text-zinc-600 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setPriorityFilter('all')}
            className={`px-2 py-0.5 rounded cursor-pointer ${
              priorityFilter === 'all'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setPriorityFilter('Urgent')}
            className={`px-2 py-0.5 rounded cursor-pointer ${
              priorityFilter === 'Urgent'
                ? 'bg-rose-600 text-white font-semibold'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
            }`}
          >
            Urgent
          </button>
          <button
            onClick={() => setPriorityFilter('High')}
            className={`px-2 py-0.5 rounded cursor-pointer ${
              priorityFilter === 'High'
                ? 'bg-amber-600 text-white font-semibold'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
            }`}
          >
            High
          </button>
          <button
            onClick={() => setPriorityFilter('Medium')}
            className={`px-2 py-0.5 rounded cursor-pointer ${
              priorityFilter === 'Medium'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
            }`}
          >
            Medium
          </button>
        </div>
      </div>

      {/* 2. Thread Rows List */}
      <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-zinc-400 font-mono">
            Loading conversations...
          </div>
        ) : emails.length === 0 ? (
          <div className="p-8 text-center">
            <Mail className="w-6 h-6 text-zinc-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-zinc-700">No conversations found</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">Try clearing your search query</p>
          </div>
        ) : (
          emails.map((email) => {
            const isSelected = selectedEmail?.id === email.id;

            return (
              <div
                key={email.id}
                onClick={() => onSelectEmail(email)}
                className={`p-3.5 transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-zinc-100 border-l-4 border-l-zinc-900'
                    : 'hover:bg-zinc-50/80 bg-white'
                }`}
              >
                {/* Header: Sender & Date */}
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center space-x-2 truncate pr-2">
                    {email.isUnread && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                    )}
                    <span className={`font-semibold truncate ${email.isUnread ? 'text-zinc-900 font-bold' : 'text-zinc-800'}`}>
                      {email.sender?.name}
                    </span>
                    {email.sender?.company && (
                      <span className="text-[10px] text-zinc-400 truncate">
                        • {email.sender.company}
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                    {new Date(email.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                {/* Subject */}
                <h4 className={`text-xs truncate mb-1 ${email.isUnread ? 'font-bold text-zinc-900' : 'font-medium text-zinc-800'}`}>
                  {email.subject}
                </h4>

                {/* Snippet */}
                <p className="text-[11px] text-zinc-500 line-clamp-1 leading-relaxed mb-2">
                  {email.messages?.[email.messages.length - 1]?.body || email.ai?.reason}
                </p>

                {/* Metadata Pills */}
                <div className="flex items-center justify-between text-[10px]">
                  <span className={`px-1.5 py-0.2 rounded font-mono font-medium border ${getBadgeStyle(email.ai?.responsibility)}`}>
                    {email.ai?.responsibility}
                  </span>

                  {email.ai?.priority === 'Urgent' && (
                    <span className="font-mono text-rose-600 font-bold">
                      URGENT
                    </span>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
