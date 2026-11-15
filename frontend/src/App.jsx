import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AssistantDashboard from './components/AssistantDashboard';
import ClientPortal from './components/ClientPortal';
import AccountsModal from './components/AccountsModal';
import AICopilotDrawer from './components/AICopilotDrawer';
import AgentActivityDrawer from './components/AgentActivityDrawer';
import { api } from './services/api';
import { Cpu, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState('assistant'); // 'assistant' | 'client'
  const [emails, setEmails] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [activeSegment, setActiveSegment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [accountFilter, setAccountFilter] = useState('all');
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Drawers
  const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isAgentDrawerOpen, setIsAgentDrawerOpen] = useState(false);
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
        }, 6000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Reset Demo to fresh state
  const handleResetDemo = async () => {
    try {
      await api.resetDemo();
      await loadEmails();
      setActiveSegment('all');
      setSearchQuery('');
      setPriorityFilter('all');
      setAccountFilter('all');
    } catch (err) {
      console.error(err);
    }
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
    <div className="min-h-screen bg-zinc-100 text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        onOpenAccounts={() => setIsAccountsModalOpen(true)}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        onOpenAgentDrawer={() => setIsAgentDrawerOpen(true)}
        onSimulateEmail={handleSimulateIncoming}
        onResetDemo={handleResetDemo}
        isSimulating={isSimulating}
        unreadCount={stats.unread}
        clientPendingCount={stats.clientToReply}
      />

      {/* Real-time Agent Stream Toast */}
      {simulationToast && (
        <div className="fixed top-16 right-5 z-50 max-w-sm bg-zinc-900 text-zinc-100 rounded-lg shadow-2xl border border-zinc-700 p-3.5 animate-in slide-in-from-top-3 duration-200 font-sans">
          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4 animate-pulse" />
            </div>
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
              <h4 className="text-xs font-semibold text-zinc-100 mt-0.5">{simulationToast.subject}</h4>
              <p className="text-[11px] text-zinc-400 font-mono">From: {simulationToast.sender}</p>

              <div className="mt-2 p-2 bg-zinc-950 rounded border border-zinc-800 text-xs">
                <div className="flex items-center space-x-1 font-mono text-[11px]">
                  <span className="text-zinc-400">Routed to: </span>
                  <span className="text-emerald-400 font-semibold">{simulationToast.responsibility}</span>
                </div>
                <p className="text-[11px] text-zinc-300 mt-1 leading-snug">{simulationToast.reason}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content: Dual Persona Switch */}
      <main className="flex-1">
        {currentRole === 'assistant' ? (
          <AssistantDashboard
            emails={emails}
            stats={stats}
            selectedEmail={selectedEmail}
            onSelectEmail={setSelectedEmail}
            activeSegment={activeSegment}
            setActiveSegment={setActiveSegment}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            accountFilter={accountFilter}
            setAccountFilter={setAccountFilter}
            onRefreshEmail={handleRefreshSingleEmail}
            onOpenAgentDrawer={() => setIsAgentDrawerOpen(true)}
            isLoading={isLoading}
          />
        ) : (
          <ClientPortal
            emails={emails}
            onRefresh={loadEmails}
            onOpenThreadInAssistant={(email) => {
              setSelectedEmail(email);
              setCurrentRole('assistant');
            }}
          />
        )}
      </main>

      {/* Autonomous Agent Drawer */}
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

    </div>
  );
}
