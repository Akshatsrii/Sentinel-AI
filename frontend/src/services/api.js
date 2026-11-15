// REST API Service for Proxxy AI Email Platform

// Automatically route to Render live backend when hosted on Vercel or custom domain
const API_BASE = 
  import.meta.env.VITE_API_BASE_URL || 
  (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app') 
    ? 'https://proxxy-3ooz.onrender.com/api' 
    : '/api');

export const api = {
  // Get emails with optional filters
  async getEmails(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/emails?${query}`);
    return res.json();
  },

  // Get single email details
  async getEmailById(id) {
    const res = await fetch(`${API_BASE}/emails/${id}`);
    return res.json();
  },

  // Trigger live AI re-classification
  async classifyEmail(id) {
    const res = await fetch(`${API_BASE}/emails/${id}/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
  },

  // Trigger AI summary
  async summarizeEmail(id) {
    const res = await fetch(`${API_BASE}/emails/${id}/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
  },

  // Generate contextual AI reply
  async generateReply(id, tone, customInstructions) {
    const res = await fetch(`${API_BASE}/emails/${id}/generate-reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tone, customInstructions })
    });
    return res.json();
  },

  // Send/Approve reply
  async sendReply(id, replyText, senderRole = 'assistant') {
    const res = await fetch(`${API_BASE}/emails/${id}/send-reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ replyText, senderRole })
    });
    return res.json();
  },

  // Manual classification override
  async overrideClassification(id, responsibility, reason, overrideBy = 'assistant') {
    const res = await fetch(`${API_BASE}/emails/${id}/override`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responsibility, reason, overrideBy })
    });
    return res.json();
  },

  // Delegate from Client to Assistant
  async delegateToAssistant(id, note) {
    const res = await fetch(`${API_BASE}/emails/${id}/delegate`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note })
    });
    return res.json();
  },

  // Update status (mark handled, archive, important, unread)
  async updateStatus(id, updates) {
    const res = await fetch(`${API_BASE}/emails/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  // Compose brand new email
  async composeEmail(payload) {
    const res = await fetch(`${API_BASE}/emails/compose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // AI Draft for new email
  async aiDraftNew(payload) {
    const res = await fetch(`${API_BASE}/emails/ai-draft-new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Simulate incoming email in real-time
  async simulateIncomingEmail(customData = null) {
    const res = await fetch(`${API_BASE}/emails/simulate-incoming`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customData || {})
    });
    return res.json();
  },

  // Autonomous Agent Methods
  async getAgentStatus() {
    const res = await fetch(`${API_BASE}/agent/status`);
    return res.json();
  },

  async getAgentLogs() {
    const res = await fetch(`${API_BASE}/agent/logs`);
    return res.json();
  },

  async executeAgentAction(actionId) {
    const res = await fetch(`${API_BASE}/agent/execute-action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionId })
    });
    return res.json();
  },

  async runAutonomousTriage() {
    const res = await fetch(`${API_BASE}/agent/run-autonomous-triage`, {
      method: 'POST'
    });
    return res.json();
  },

  // AI Copilot Chat
  async aiChat(query) {
    const res = await fetch(`${API_BASE}/emails/ai-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    return res.json();
  },

  // Accounts
  async getAccounts() {
    const res = await fetch(`${API_BASE}/accounts`);
    return res.json();
  },

  async connectAccount(provider, email) {
    const res = await fetch(`${API_BASE}/accounts/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, email })
    });
    return res.json();
  },

  // Reset Demo
  async resetDemo() {
    const res = await fetch(`${API_BASE}/reset-demo`, {
      method: 'POST'
    });
    return res.json();
  }
};
