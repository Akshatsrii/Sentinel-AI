import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ThreadList from './components/ThreadList';
import EmailDetail from './components/EmailDetail';
import ExecutiveBriefing from './components/ExecutiveBriefing';
import AccountsModal from './components/AccountsModal';
import AICopilotDrawer from './components/AICopilotDrawer';
import AgentActivityDrawer from './components/AgentActivityDrawer';
import ComposeModal from './components/ComposeModal';
import { api } from './services/api';
import fallbackEmails from './data/fallbackEmails';
import { Cpu, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState('assistant'); // 'assistant' | 'client'
  const [emails, setEmails] = useState(fallbackEmails);
  const [stats, setStats] = useState({
    total: fallbackEmails.length,
    unread: fallbackEmails.filter((e) => e.isUnread).length,
    assistantToReply: fallbackEmails.filter((e) => e.ai?.responsibility === 'Assistant to Reply').length,
    clientToReply: fallbackEmails.filter((e) => e.ai?.responsibility === 'Client to Reply').length,
    needsReview: fallbackEmails.filter((e) => e.ai?.responsibility === 'Needs Review').length,
    noReplyNeeded: fallbackEmails.filter((e) => e.ai?.responsibility === 'No Reply Needed').length,
    actionRequired: fallbackEmails.filter((e) => e.ai?.actionRequired).length,
  });
  const [selectedEmail, setSelectedEmail] = useState(fallbackEmails[0]);
  const [activeSegment, setActiveSegment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [accountFilter, setAccountFilter] = useState('all');
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Modals & Drawers
  const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isAgentDrawerOpen, setIsAgentDrawerOpen] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationToast, setSimulationToast] = useState(null);

  // Fetch accounts on load
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const data = await api.getAccounts();
      if (data.accounts) {
        setAccounts(data.accounts);
      }
    } catch (err) {
      console.error('Failed to load accounts:', err);
    }
  };

  // Fetch emails whenever filters change
  useEffect(() => {
    loadEmails();
  }, [activeSegment, searchQuery, priorityFilter, accountFilter]);

  // Keyboard navigation (J / K navigation like Superhuman)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (emails.length > 0) {
          const currentIndex = emails.findIndex((e) => e.id === selectedEmail?.id);
          const nextIndex = currentIndex < emails.length - 1 ? currentIndex + 1 : 0;
          setSelectedEmail(emails[nextIndex]);
        }
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (emails.length > 0) {
          const currentIndex = emails.findIndex((e) => e.id === selectedEmail?.id);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : emails.length - 1;
          setSelectedEmail(emails[prevIndex]);
        }
      } else if (e.key === 'c' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsComposeOpen(true);
      } else if (e.key === 'Escape') {
        setIsAccountsModalOpen(false);
        setIsAIChatOpen(false);
        setIsAgentDrawerOpen(false);
        setIsComposeOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [emails, selectedEmail]);

  const loadEmails = async () => {
    setIsLoading(true);
    try {
      const data = await api.getEmails({
        segment: activeSegment,
        search: searchQuery,
        priority: priorityFilter,
        account: accountFilter
      });

      if (data.emails) {
        setEmails(data.emails);
        setStats(data.stats || {});

        // Keep selected email updated or select first one
        if (!selectedEmail && data.emails.length > 0) {
          setSelectedEmail(data.emails[0]);
        } else if (selectedEmail) {
          const updated = data.emails.find((e) => e.id === selectedEmail.id);
          if (updated) setSelectedEmail(updated);
        }
      }
    } catch (err) {
      console.error('Error fetching emails:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh single thread
  const handleRefreshSingleEmail = async (id) => {
    try {
      const data = await api.getEmailById(id);
      if (data.email) {
        setSelectedEmail(data.email);
        loadEmails();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Simulate Incoming Email with Real-Time Senior Agent Toast
  const handleSimulateIncoming = async () => {
    try {
      setIsSimulating(true);
      const res = await api.simulateIncomingEmail();
      if (res.email) {
        setSimulationToast({
          subject: res.email.subject,
          sender: res.email.sender?.name,
          responsibility: res.email.ai?.responsibility,
          reason: res.email.ai?.reason
        });
        await loadEmails();
        setSelectedEmail(res.email);

        setTimeout(() => {
          setSimulationToast(null);
        }, 5000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Handle new email sent from Compose Modal
  const handleEmailSent = (newEmail) => {
    setEmails((prev) => [newEmail, ...prev]);
    setSelectedEmail(newEmail);
    setSimulationToast({
      subject: newEmail.subject,
      sender: 'Sentinel Outbox',
      responsibility: 'Dispatched to ' + (newEmail.recipients?.[0] || 'Recipient'),
      reason: 'Executive email successfully dispatched and synced to database.'
    });
    setTimeout(() => {
      setSimulationToast(null);
    }, 4000);
    loadEmails();
  };

  // Connect new account
  const handleConnectAccount = async (provider, email) => {
    try {
      const res = await api.connectAccount(provider, email);
      if (res.accounts) {
        setAccounts(res.accounts);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-zinc-900 font-sans antialiased">
      
      {/* 1. Left Nav Rail (Sidebar) */}
      <Sidebar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeSegment={activeSegment}
        setActiveSegment={setActiveSegment}
        stats={stats}
        accounts={accounts}
        onOpenAccounts={() => setIsAccountsModalOpen(true)}
        onOpenAgentDrawer={() => setIsAgentDrawerOpen(true)}
        onOpenCopilot={() => setIsAIChatOpen(true)}
        onOpenCompose={() => setIsComposeOpen(true)}
        onSimulateEmail={handleSimulateIncoming}
        isSimulating={isSimulating}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* 2. Middle & Right Panes */}
      {currentRole === 'assistant' ? (
        <>
          {/* Column 2: Thread List */}
          <ThreadList
            emails={emails}
            selectedEmail={selectedEmail}
            onSelectEmail={setSelectedEmail}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            isLoading={isLoading}
          />

          {/* Column 3: Email Detail / Reading Pane */}
          <EmailDetail
            email={selectedEmail}
            onRefreshEmail={handleRefreshSingleEmail}
            currentRole="assistant"
          />
        </>
      ) : (
        /* Executive Briefing Mode (Client Persona) */
        <ExecutiveBriefing
          emails={emails}
          onRefresh={loadEmails}
          onSwitchToAssistant={() => setCurrentRole('assistant')}
        />
      )}

      {/* Real-time Agent Stream Toast */}
      {simulationToast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm bg-zinc-900 text-zinc-100 rounded-lg shadow-2xl border border-zinc-700 p-3.5 animate-in slide-in-from-bottom-3 duration-200 font-sans">
          <div className="flex items-start space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0 animate-pulse"></span>
            <div className="flex-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 uppercase">
                <span>Autonomous Sentinel Event</span>
                <button
                  onClick={() => setSimulationToast(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <h4 className="text-xs font-semibold text-white mt-0.5 truncate">{simulationToast.subject}</h4>
              <p className="text-[11px] text-zinc-400 font-mono">From: {simulationToast.sender}</p>

              <div className="mt-2 p-2 bg-zinc-950 rounded border border-zinc-800 text-xs">
                <div className="font-mono text-[11px] text-emerald-400 font-semibold">
                  {simulationToast.responsibility}
                </div>
                <p className="text-[11px] text-zinc-300 mt-0.5 leading-snug">{simulationToast.reason}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Autonomous Agent Telemetry Drawer */}
      <AgentActivityDrawer
        isOpen={isAgentDrawerOpen}
        onClose={() => setIsAgentDrawerOpen(false)}
        onActionExecuted={loadEmails}
      />

      {/* Accounts & Onboarding Modal */}
      <AccountsModal
        isOpen={isAccountsModalOpen}
        onClose={() => setIsAccountsModalOpen(false)}
        accounts={accounts}
        onConnectAccount={handleConnectAccount}
      />

      {/* AI Copilot Drawer */}
      <AICopilotDrawer
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />

      {/* Compose Email Modal */}
      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onEmailSent={handleEmailSent}
        currentRole={currentRole}
      />

    </div>
  );
}
