import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AssistantDashboard from './components/AssistantDashboard';
import ClientPortal from './components/ClientPortal';
import AccountsModal from './components/AccountsModal';
import AICopilotDrawer from './components/AICopilotDrawer';
import { api } from './services/api';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

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

  // Simulate Incoming Email with Real-Time AI Toast
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        onOpenAccounts={() => setIsAccountsModalOpen(true)}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        onSimulateEmail={handleSimulateIncoming}
        onResetDemo={handleResetDemo}
        isSimulating={isSimulating}
        unreadCount={stats.unread}
        clientPendingCount={stats.clientToReply}
      />

      {/* Real-time AI Simulation Toast Notification */}
      {simulationToast && (
        <div className="fixed top-20 right-6 z-50 max-w-md bg-white rounded-2xl shadow-2xl border-2 border-indigo-500 p-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-600 animate-spin" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  New Incoming Email Received & Classified
                </span>
                <button
                  onClick={() => setSimulationToast(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              </div>
              <h4 className="text-xs font-bold text-slate-900 mt-0.5">{simulationToast.subject}</h4>
              <p className="text-[11px] text-slate-500">From: {simulationToast.sender}</p>

              <div className="mt-2 p-2 bg-indigo-50/70 rounded-lg text-xs">
                <span className="font-bold text-indigo-900">AI Classification: </span>
                <span className="font-semibold text-indigo-700">{simulationToast.responsibility}</span>
                <p className="text-[11px] text-slate-600 mt-0.5">{simulationToast.reason}</p>
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
