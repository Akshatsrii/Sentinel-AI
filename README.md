# Proxxy — AI-Powered Email Management Platform for Personal Assistants & Clients

> **AI Full-Stack Engineer Intern Assignment**  
> An autonomous executive email orchestration platform built to eliminate the delegation bottleneck between Personal Assistants and their clients.

[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Express%20%7C%20Gemini%20AI-blue)](#technology-stack)
[![UI Caliber](https://img.shields.io/badge/UI-Superhuman%20%2F%20Linear%20Caliber-emerald)](#uiux-architecture)
[![Status](https://img.shields.io/badge/Status-Functional%20Prototype%20Ready-green)](#quick-start-guide)

---

## 🎯 Executive Overview & The Problem

Personal assistants (PAs) manage hundreds of emails on behalf of high-profile clients (Founders, CEOs, Partners). One fundamental challenge has always persisted: **"Who is responsible for replying to this email?"**

- Often, a client reads an email on their phone without indicating whether they plan to handle it personally or expect their assistant to draft a response.
- Assistants are forced to manually review every single thread, chase clients for clarification, or let urgent approvals slip through the cracks.

**Proxxy** solves this bottleneck with a **Dual-Persona AI Architecture**:
1. **Assistant Command Center:** A 3-column power workspace (Front/Superhuman caliber) with real-time analytics, automated classification, AI thread summaries, action item extraction, and smart reply drafting.
2. **Minimalist Executive Briefing Desk:** A zero-distraction terminal for the client showing **only** emails requiring personal decisions (Series B Term Sheets, DocuSign signatures, candidate equity grants), with one-click **"Mark Resolved"**, **"Delegate to Sarah"** (with simulated Voice Dictation), or **"Approve Draft"**.

---

## 🤖 Core AI Implementations & Architecture

### 1. AI Email Intelligence Engine (Automatic Reply Responsibility)
Every incoming conversation is analyzed by AI across multiple dimensions:
- 🔵 **Assistant to Reply:** Routine scheduling, rescheduling, logistics, vendor follow-ups, and admin communication.
- 🟣 **Client to Reply:** High-stakes decisions, investor term sheets, equity grants, press interviews, and legal signature approvals.
- ⚪ **No Reply Needed:** Transactional receipts (AWS, Stripe), newsletters, flight confirmations, and resolved items.
- 🟡 **Needs Review / Flagged:** Ambiguous cold outreach where AI is uncertain whether the client knows the sender.
- **AI Confidence Score (60% - 99%) & Detailed Rationale:** Explains *why* the responsibility was assigned.
- **Manual Override:** Assistant or Client can easily override AI classifications with custom notes.

### 2. Autonomous Agent Sentinel & Telemetry
- **Active Sub-Agent Tools:**
  - `TermSheetClauseAuditor`: Audits valuation, liquidation preferences, cliff resets, and legal signatures.
  - `ExecutiveCalendarInspector`: Checks Alex Vance availability and creates holds.
  - `StakeholderRelationshipMapper`: Cross-references investor and candidate pedigree.
  - `ExecutiveResponseSLATracker`: Enforces 4-hour response on urgent approvals.
- **Reasoning Traces:** Real-time step-by-step tool execution telemetry visible in the Agent Drawer.
- **Executable Actions Pipeline:** Proposes 1-click executable actions (*"Hold 15-min call on Alex's calendar"*, *"Dispatch term sheet draft to Gunderson Dettmer"*).

### 3. AI Conversation Summarizer
Produces structured 4-part executive digests:
- **Core Discussion:** 1–2 sentence synthesis of the thread.
- **Key Updates:** Bulleted list of critical new developments.
- **Pending Action:** Clear statement of what is blocked or waiting.
- **Recommended Next Step:** Proactive guidance for assistant or client.

### 4. Context-Aware AI Reply Studio
Drafts contextual replies based on the full conversation history:
- **Multiple Executive Tones:** *Professional, Friendly, Short & Direct, Polite Decline*.
- **Custom Prompt Injection:** e.g., *"Offer Friday 10:30 AM instead"*.
- **Mandatory Approval Workflow:** AI drafts are never sent automatically; user review and approval is required before dispatch.

### 5. Interactive Proxxy Copilot (RAG Chatbot)
A dedicated natural language assistant querying live email records:
- *"Which emails need client attention?"*
- *"Summarize today's emails."*
- *"What responses are pending from the assistant?"*
- *"Show urgent and high priority emails."*
- *"What upcoming meetings require scheduling?"*

### 6. Real-Time Incoming Email Simulation
A built-in simulator allows testing live AI classification on the fly. When triggered, a new email enters the inbox, undergoes immediate AI classification, displays an executive toast notification, and updates all metrics in real time.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide Icons, Inter & JetBrains Mono typography
- **Backend:** Node.js, Express 5, CORS, Dotenv
- **AI Engine:** Google Gemini API (`@google/generative-ai`) with hybrid heuristic fallback engine for 100% demo reliability
- **Database / State:** MongoDB Atlas ready (`MONGO_URI`) + in-memory store initialized with realistic executive email threads

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Akshatsrii/Proxxy.git
cd Proxxy

# Install root, backend, and frontend packages
npm run install:all
```

### 2. Configure Environment Variables (Optional)

In `backend/.env`:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here # Optional: enables live Gemini LLM API calls
MONGO_URI=your_mongodb_atlas_connection_string # Optional
```
> *Note: Even without an API key, Proxxy runs in Enhanced Hybrid AI Mode with live heuristic intelligence so the app is always functional.*

### 3. Build & Run the Application

```bash
# Build frontend
npm run build

# Start the unified full-stack server
npm start
```

Open your browser and navigate to: **`http://localhost:5000`**

---

## ⌨️ Keyboard Shortcuts
- **`J` or `↓`:** Select next email thread
- **`K` or `↑`:** Select previous email thread
- **`Escape`:** Dismiss open drawers / modal windows

---

## 🎬 Suggested Demo Video Walkthrough Script

1. **Introduction (0:00 - 0:30):** Introduce **Proxxy** as the autonomous email proxy for personal assistants and high-profile executives.
2. **Assistant Workspace (0:30 - 1:15):** Walk through the 3-column layout (Front/Superhuman style), segmentation tabs, search bar, and priority chips.
3. **AI Intelligence Engine (1:15 - 2:00):** Open the **Apex Ventures Term Sheet** ($14M lead). Show the **Client Decision** tag, the **Executive AI Briefing box**, and the **4-part summary**.
4. **AI Reply Studio (2:00 - 2:30):** Click **AI Draft**, select **Professional** tone, and click **Approve & Send** to demonstrate human-in-the-loop review.
5. **Real-Time Simulation (2:30 - 3:00):** Click **Simulate Mail** in the sidebar to show an incoming email being classified and routed live by the Autonomous Sentinel.
6. **Executive Briefing Mode (3:00 - 3:45):** Switch to **Executive** in the sidebar. Show Alex Vance's minimalist desk. Demonstrate the **Mic button** (Voice Dictation) and click **Delegate to Sarah**, showing it transfer instantly to Sarah's queue.
7. **Agent Telemetry (3:45 - 4:15):** Open **Agent Sentinel** in the sidebar to show the active sub-agent tools (`TermSheetClauseAuditor`, `CalendarInspector`) and live reasoning logs.
8. **Proxxy Copilot (4:15 - 4:30):** Open the Copilot drawer and ask *"Which emails need client attention?"*.
