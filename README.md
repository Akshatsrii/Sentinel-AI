# AuraPA – AI-Powered Email Management Dashboard for Personal Assistants & Clients

> **AI Full-Stack Engineer Intern Assignment**  
> An intelligent, mobile-responsive executive web platform built to solve the email bottleneck between Personal Assistants and their busy clients.

---

## 🎯 Executive Overview & Product Vision

Personal assistants (PAs) manage high volumes of emails on behalf of high-profile clients (Founders, CEOs, Partners). One fundamental challenge has always persisted: **"Who is responsible for replying to this email?"**

- Often, a client reads an email on their phone without indicating whether they plan to handle it personally or expect their assistant to draft a response.
- Assistants are forced to manually review every single thread, chase clients for clarification, or let urgent approvals slip through the cracks.

**AuraPA** solves this bottleneck with a **Dual-Persona AI Architecture**:
1. **Assistant Command Center:** A unified power dashboard with real-time analytics, automated classification, AI thread summaries, action item extraction, and smart reply drafting.
2. **Minimalist Client Portal:** A zero-distraction executive interface showing **only** emails requiring the client's personal attention, with one-click **"Handled"**, **"Delegate to Assistant"**, or **"Approve Draft"** actions.

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

### 2. AI Conversation Summarizer
Produces structured 4-part executive digests:
- **Core Discussion:** 1–2 sentence synthesis of the thread.
- **Key Updates:** Bulleted list of critical new developments.
- **Pending Action:** Clear statement of what is blocked or waiting.
- **Recommended Next Step:** Proactive guidance for assistant or client.

### 3. Context-Aware AI Reply Generator
Drafts contextual replies based on the full conversation history:
- **Multiple Executive Tones:** *Professional, Friendly, Short & Direct, Polite Decline*.
- **Custom Prompt Injection:** e.g., *"Offer Friday 10:30 AM instead"*.
- **Mandatory Approval Workflow:** AI drafts are never sent automatically; user review and approval is required before dispatch.

### 4. Interactive AI Email Copilot (RAG Chatbot)
A dedicated natural language assistant that queries the live email database:
- *"Which emails need client attention?"*
- *"Summarize today's emails."*
- *"What responses are pending from the assistant?"*
- *"Show urgent and high priority emails."*
- *"What upcoming meetings require scheduling?"*

### 5. AI Action Item & Calendar Extraction
Automatically parses threads for tasks, deadlines, and appointment slots with assignee badges (`client` vs `assistant`).

### 6. Real-Time Incoming Email Simulation
A built-in simulator allows testing live AI classification on the fly during demonstrations. When triggered, a new email enters the inbox, undergoes immediate AI classification, displays an executive toast notification, and updates all metrics in real time.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide React Icons
- **Backend:** Node.js, Express 5, CORS, Dotenv
- **AI Engine:** Google Gemini API (`@google/generative-ai`) with hybrid heuristic fallback engine for 100% demo reliability
- **Database / State:** MongoDB Atlas ready (`MONGO_URI`) + in-memory store initialized with realistic executive email threads

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <your-repo-link>
cd mkc

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables (Optional)

In `backend/.env`:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here # Optional: enables live Gemini LLM API calls
MONGO_URI=your_mongodb_atlas_connection_string # Optional
```
> *Note: Even without an API key, AuraPA runs in Enhanced Hybrid AI Mode with live heuristic intelligence so the app is always functional.*

### 3. Build & Run the Application

```bash
# Build frontend
cd frontend
npm run build

# Start the unified full-stack server
cd ../backend
node server.js
```

Open your browser and navigate to: **`http://localhost:5000`**

---

## 🎬 Suggested Demo Video Walkthrough Script

When recording the submission video:
1. **Introduction (0:00 - 0:30):** Introduce AuraPA as an AI-powered email management dashboard solving the communication gap between Personal Assistants and clients.
2. **Assistant Dashboard (0:30 - 1:15):** Walk through the metrics bar, segmentation tabs (*Assistant to Reply, Client to Reply, No Reply Needed*), and search/priority filters.
3. **AI Intelligence Engine (1:15 - 2:00):** Open a thread (e.g. Apex Ventures Term Sheet or Board Meeting Reschedule). Show the AI Responsibility Badge, Confidence Score, Classification Rationale, and Structured 4-Part Summary.
4. **AI Reply Drafting (2:00 - 2:30):** Select a tone (*Professional* or *Friendly*), add a custom prompt, generate an AI draft, and show the user approval step.
5. **Real-time Email Simulation (2:30 - 3:00):** Click **"Simulate Email"** in the navbar to show a live incoming email classified and routed by AI in real time.
6. **Minimalist Client Portal (3:00 - 3:45):** Switch to **Client Portal** using the top navbar. Explain how the executive (Alex Vance) sees only items requiring personal decisions. Demonstrate **"Handled"** and **"Delegate to Sarah"** with a quick note, showing real-time synchronization back to the Assistant view.
7. **AI Copilot (3:45 - 4:15):** Open the **AI Copilot** drawer and ask *"Which emails need client attention?"* or *"Summarize today's emails"*. Show the structured response synthesized from database records.
8. **Connected Inboxes (4:15 - 4:30):** Show the Inboxes modal with Google Workspace and Microsoft 365 sync status.

---

## 📱 Mobile-Responsive Design
The interface is responsive across desktop, tablet, and mobile devices, with adaptive drawers, slide-overs, and touch-friendly controls.
