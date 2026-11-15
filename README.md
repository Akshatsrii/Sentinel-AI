<div align="center">

### Autonomous Email Intelligence for Personal Assistants & Leaders

**AI Full-Stack Engineer Intern Assignment Submission**

*An autonomous executive email orchestration platform built to eliminate the delegation bottleneck between Personal Assistants and their clients.*

<br/>

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://proxxy-cyan.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://proxxy-3ooz.onrender.com)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#-technology-stack)
[![Node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#-technology-stack)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](#-technology-stack)
[![Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white)](#-technology-stack)

<br/>

[**Live App**](https://proxxy-cyan.vercel.app/) · [**Full-Stack Mirror**](https://proxxy-3ooz.onrender.com) · [**API Health**](https://proxxy-3ooz.onrender.com/api/health) · [**Emails API**](https://proxxy-3ooz.onrender.com/api/emails)

</div>

---

## 📑 Table of Contents

- [Live Deployed Links](#-live-deployed-links)
- [The Problem](#-executive-overview--the-problem)
- [System Architecture](#-system-architecture)
- [Core AI Implementations](#-core-ai-implementations)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start-guide)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Demo Walkthrough](#-suggested-demo-video-walkthrough-script)
- [Author](#-author)

---

## 🌐 Live Deployed Links

| Service | Link |
|---|---|
| **Primary Web App (Vercel)** | https://proxxy-cyan.vercel.app/ |
| **Full-Stack Mirror (Render)** | https://proxxy-3ooz.onrender.com |
| **API Diagnostics & Health** | https://proxxy-3ooz.onrender.com/api/health |
| **MongoDB Atlas Stream** | https://proxxy-3ooz.onrender.com/api/emails |

---

## 🎯 Executive Overview & The Problem

Personal assistants (PAs) manage hundreds of emails on behalf of high-profile clients (Founders, CEOs, Partners). One fundamental question always persists:

> **"Who is responsible for replying to this email?"**

- A client reads an email on their phone without indicating whether they will handle it personally or expect their assistant to draft a reply.
- Assistants are forced to manually review every thread, chase clients for clarification, or let urgent approvals slip through the cracks.

**Sentinel AI solves this bottleneck with a Dual-Persona AI Architecture:**

| Persona | Experience |
|---|---|
| 🧑‍💼 **Assistant Command Center** | A 3-column power workspace (Front / Superhuman caliber) with real-time analytics, automated classification, AI thread summaries, action-item extraction and smart reply drafting. |
| 👔 **Executive Briefing Desk** | A zero-distraction terminal for the client showing only emails that need personal decisions (Series B Term Sheets, DocuSign signatures, candidate equity grants) with one-click **Mark Resolved**, **Delegate to Sarah** (with simulated Voice Dictation) or **Approve Draft**. |

### The Before / After

```mermaid
flowchart LR
    subgraph BEFORE["❌ Without Sentinel AI"]
        direction TB
        A1["📥 Email arrives"] --> A2["Client reads on phone"]
        A2 --> A3{"Who replies?<br/>Nobody knows"}
        A3 --> A4["PA chases client"]
        A4 --> A5["⏳ Urgent approvals slip"]
    end

    subgraph AFTER["✅ With Sentinel AI"]
        direction TB
        B1["📥 Email arrives"] --> B2["🤖 AI classifies owner<br/>+ confidence + rationale"]
        B2 --> B3{"Routed instantly"}
        B3 -->|Assistant| B4["PA gets AI draft"]
        B3 -->|Client| B5["Executive Desk<br/>1-click decision"]
    end

    BEFORE ~~~ AFTER
```

---

## 🏗️ System Architecture

### High-Level Architecture

```mermaid
flowchart TB
    subgraph CLIENT["🖥️ Frontend · Vercel"]
        direction LR
        UI1["Assistant Command Center<br/>3-column workspace"]
        UI2["Executive Briefing Desk<br/>minimal decision view"]
        UI3["Sentinel Copilot<br/>RAG chat drawer"]
        UI4["Agent Drawer<br/>reasoning traces"]
    end

    subgraph SERVER["⚙️ Backend · Render · Node.js + Express 5"]
        direction TB
        API["REST API<br/>/api/emails · /api/health"]
        ENGINE["🧠 AI Engine"]
        AGENT["🛡️ Sentinel Agent<br/>tool orchestrator"]
        API --> ENGINE
        API --> AGENT
    end

    subgraph AI["✨ Intelligence Layer"]
        direction TB
        GEM["Google Gemini API"]
        HEUR["Hybrid Heuristic Fallback<br/>100% demo reliability"]
    end

    subgraph DATA["🗄️ Data Layer"]
        direction TB
        MONGO[("MongoDB Atlas<br/>MONGO_URI")]
        MEM[("In-memory store<br/>seeded executive threads")]
    end

    CLIENT <-->|HTTPS / JSON| API
    ENGINE --> GEM
    ENGINE -.->|"if key missing or API fails"| HEUR
    API <--> MONGO
    API <-.->|fallback| MEM
```

### Email Intelligence Flow (Reply Responsibility)

```mermaid
flowchart TD
    START(["📩 New Email Arrives"]) --> ANALYZE["🤖 AI Analysis<br/>sender · subject · thread context · intent"]
    ANALYZE --> DECIDE{"Classify<br/>reply owner"}

    DECIDE -->|"Routine scheduling,<br/>logistics, vendor follow-ups"| ASSIST["🔵 Assistant to Reply"]
    DECIDE -->|"Term sheets, equity grants,<br/>press, legal signatures"| CLIENT["🟣 Client to Reply"]
    DECIDE -->|"Receipts, newsletters,<br/>flight confirmations"| NONE["⚪ No Reply Needed"]
    DECIDE -->|"Ambiguous cold outreach"| REVIEW["🟡 Needs Review / Flagged"]

    ASSIST --> CONF
    CLIENT --> CONF
    NONE --> CONF
    REVIEW --> CONF

    CONF["📊 Confidence Score 60%–99%<br/>+ Detailed Rationale"] --> OVR{"Manual<br/>override?"}
    OVR -->|"Yes · custom note"| FINAL
    OVR -->|No| FINAL["✅ Final Routing"]

    FINAL --> PA["🧑‍💼 Assistant Queue"]
    FINAL --> EX["👔 Executive Desk"]
    FINAL --> ARCH["🗃️ Archived"]
    FINAL --> FLAG["🚩 Review Bucket"]
```

### Human-in-the-Loop Reply Workflow

```mermaid
sequenceDiagram
    autonumber
    actor PA as 🧑‍💼 Assistant
    participant UI as Reply Studio
    participant AI as 🤖 AI Engine
    actor EX as 👔 Executive

    PA->>UI: Click "AI Draft"
    PA->>UI: Pick tone + optional custom prompt
    UI->>AI: Full thread history + tone + prompt
    AI-->>UI: Contextual draft reply
    UI-->>PA: Show draft for review
    alt Needs changes
        PA->>UI: Edit or regenerate
        UI->>AI: Updated instructions
        AI-->>UI: Revised draft
    end
    PA->>UI: Approve & Send
    Note over PA,UI: AI never auto-sends.<br/>Human approval is mandatory.
    UI-->>EX: Dispatched on approval
```

### Delegation Flow (Executive Desk)

```mermaid
flowchart LR
    E(["👔 Alex Vance<br/>Executive Desk"]) --> Q{"Decision needed"}
    Q -->|"Approve AI draft"| D1["✅ Draft approved & sent"]
    Q -->|"Mark Resolved"| D2["📁 Thread closed"]
    Q -->|"Delegate to Sarah"| D3["🎤 Optional voice dictation"]
    D3 --> D4["📨 Instantly in Sarah's queue"]
```

### Autonomous Sentinel Agent Pipeline

```mermaid
flowchart TD
    T(["🛡️ Sentinel Agent triggered"]) --> P["Plan: choose sub-agent tools"]

    P --> A1["📑 TermSheetClauseAuditor<br/>valuation · liquidation prefs ·<br/>cliff resets · signatures"]
    P --> A2["📅 ExecutiveCalendarInspector<br/>availability + holds"]
    P --> A3["🕸️ StakeholderRelationshipMapper<br/>investor & candidate pedigree"]
    P --> A4["⏱️ ExecutiveResponseSLATracker<br/>4-hour urgent approvals"]

    A1 --> M["🔗 Merge findings"]
    A2 --> M
    A3 --> M
    A4 --> M

    M --> TR["📜 Reasoning Traces<br/>live in Agent Drawer"]
    M --> ACT["⚡ Proposed 1-click actions"]

    ACT --> X1["Hold 15-min call on Alex's calendar"]
    ACT --> X2["Dispatch term sheet draft to Gunderson Dettmer"]
    X1 --> OK{"User approves?"}
    X2 --> OK
    OK -->|Yes| RUN["▶️ Execute"]
    OK -->|No| SKIP["Dismiss"]
```

### Real-Time Simulation Flow

```mermaid
flowchart LR
    S(["🖱️ Click Simulate Mail"]) --> N["New email injected"]
    N --> C["🤖 Instant AI classification"]
    C --> R["Routed to correct queue"]
    R --> TOAST["🔔 Executive toast notification"]
    R --> METRICS["📈 All metrics update live"]
```

---

## 🤖 Core AI Implementations

### 1. AI Email Intelligence Engine (Automatic Reply Responsibility)

Every incoming conversation is analyzed across multiple dimensions:

| Tag | Meaning | Typical Examples |
|---|---|---|
| 🔵 **Assistant to Reply** | Routine work the PA can own | Scheduling, rescheduling, logistics, vendor follow-ups, admin |
| 🟣 **Client to Reply** | High-stakes personal decisions | Investor term sheets, equity grants, press interviews, legal signatures |
| ⚪ **No Reply Needed** | Nothing to send | AWS / Stripe receipts, newsletters, flight confirmations, resolved items |
| 🟡 **Needs Review / Flagged** | AI is unsure | Ambiguous cold outreach where the client may or may not know the sender |

- **AI Confidence Score (60% – 99%)** with a **detailed rationale** explaining why the responsibility was assigned.
- **Manual Override:** the Assistant or the Client can override any AI classification with custom notes.

### 2. Autonomous Agent Sentinel & Telemetry

| Sub-Agent Tool | Responsibility |
|---|---|
| `TermSheetClauseAuditor` | Audits valuation, liquidation preferences, cliff resets and legal signatures |
| `ExecutiveCalendarInspector` | Checks Alex Vance's availability and creates holds |
| `StakeholderRelationshipMapper` | Cross-references investor and candidate pedigree |
| `ExecutiveResponseSLATracker` | Enforces a 4-hour response on urgent approvals |

- **Reasoning Traces:** real-time, step-by-step tool execution telemetry visible in the Agent Drawer.
- **Executable Actions Pipeline:** proposes 1-click actions such as *"Hold 15-min call on Alex's calendar"* or *"Dispatch term sheet draft to Gunderson Dettmer"*.

### 3. AI Conversation Summarizer

Produces a structured 4-part executive digest:

| # | Section | Description |
|---|---|---|
| 1 | **Core Discussion** | 1–2 sentence synthesis of the thread |
| 2 | **Key Updates** | Bulleted list of critical new developments |
| 3 | **Pending Action** | Clear statement of what is blocked or waiting |
| 4 | **Recommended Next Step** | Proactive guidance for the assistant or client |

### 4. Context-Aware AI Reply Studio

Drafts contextual replies from the full conversation history.

- **Executive Tones:** Professional · Friendly · Short & Direct · Polite Decline
- **Custom Prompt Injection:** e.g. *"Offer Friday 10:30 AM instead"*
- **Mandatory Approval Workflow:** AI drafts are **never sent automatically**. Review and approval is required before dispatch.

### 5. Interactive Sentinel Copilot (RAG Chatbot)

A dedicated natural-language assistant that queries live email records:

```text
> Which emails need client attention?
> Summarize today's emails.
> What responses are pending from the assistant?
> Show urgent and high priority emails.
> What upcoming meetings require scheduling?
```

```mermaid
flowchart LR
    Q["💬 Natural language question"] --> RET["🔍 Retrieve relevant<br/>live email records"]
    RET --> CTX["🧩 Build context"]
    CTX --> LLM["🧠 Gemini / heuristic engine"]
    LLM --> ANS["✅ Grounded answer in Copilot drawer"]
```

### 6. Real-Time Incoming Email Simulation

A built-in simulator lets you test live AI classification on the fly. When triggered, a new email enters the inbox, is classified immediately, shows an executive toast notification and updates every metric in real time.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** *(Vercel)* | React 19 · Vite · Tailwind CSS v4 · Lucide Icons · Inter & JetBrains Mono |
| **Backend** *(Render)* | Node.js · Express 5 · CORS · Dotenv |
| **AI Engine** | Google Gemini API (`@google/generative-ai`) with a hybrid heuristic fallback engine for 100% demo reliability |
| **Database / State** | MongoDB Atlas ready (`MONGO_URI`) + in-memory store seeded with realistic executive email threads |

---

## 🚀 Quick Start Guide

### 1. Clone & Install

```bash
git clone https://github.com/Akshatsrii/Proxxy.git
cd Proxxy

# Install root, backend and frontend packages
npm run install:all
```

### 2. Configure Environment Variables *(Optional)*

Create `backend/.env`:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here   # Optional: enables live Gemini LLM calls
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/proxxy?retryWrites=true&w=majority
```

> 💡 Without `GEMINI_API_KEY` or `MONGO_URI`, the app still works end-to-end using the heuristic engine and the in-memory store.

### 3. Build & Run

```bash
# Build frontend
npm run build

# Start the unified full-stack server
npm start
```

Open **http://localhost:5000** 🎉

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `J` or `↓` | Select next email thread |
| `K` or `↑` | Select previous email thread |
| `Esc` | Dismiss open drawers / modal windows |

---

## 🎬 Suggested Demo Video Walkthrough Script

```mermaid
timeline
    title Demo Walkthrough (~4:30)
    0:00 - 0:30 : Introduction : Sentinel AI for PAs and executives
    0:30 - 1:15 : Assistant Workspace : 3-column layout, tabs, search, priority chips
    1:15 - 2:00 : AI Intelligence Engine : Apex Ventures Term Sheet, Client Decision tag, 4-part summary
    2:00 - 2:30 : AI Reply Studio : AI Draft, Professional tone, Approve & Send
    2:30 - 3:00 : Real-Time Simulation : Simulate Mail, live classification
    3:00 - 3:45 : Executive Briefing Mode : Alex Vance desk, Mic dictation, Delegate to Sarah
    3:45 - 4:15 : Agent Telemetry : Sub-agent tools and reasoning logs
    4:15 - 4:30 : Sentinel Copilot : "Which emails need client attention?"
```

| Time | Segment | What to Show |
|---|---|---|
| **0:00 – 0:30** | Introduction | Sentinel AI as the autonomous email intelligence platform for personal assistants and high-profile executives |
| **0:30 – 1:15** | Assistant Workspace | 3-column layout (Front / Superhuman style), segmentation tabs, search bar, priority chips |
| **1:15 – 2:00** | AI Intelligence Engine | Open the **Apex Ventures Term Sheet ($14M lead)**. Show the Client Decision tag, the Executive AI Briefing box and the 4-part summary |
| **2:00 – 2:30** | AI Reply Studio | Click **AI Draft**, select **Professional** tone, click **Approve & Send** to demonstrate human-in-the-loop review |
| **2:30 – 3:00** | Real-Time Simulation | Click **Simulate Mail** in the sidebar to see an incoming email classified and routed live |
| **3:00 – 3:45** | Executive Briefing Mode | Switch to **Executive**. Show Alex Vance's minimalist desk, the **Mic** button (Voice Dictation) and **Delegate to Sarah** transferring instantly to Sarah's queue |
| **3:45 – 4:15** | Agent Telemetry | Open **Sentinel Agent** to show the sub-agent tools (TermSheetClauseAuditor, CalendarInspector) and live reasoning logs |
| **4:15 – 4:30** | Sentinel Copilot | Open the Copilot drawer and ask *"Which emails need client attention?"* |

---

## 👨‍💻 Author

**Akshat Srivastava**
GitHub: [@Akshatsrii](https://github.com/Akshatsrii)

<div align="center">

<br/>

**Built with ❤️ to give every assistant their time back.**

⭐ Star this repo if you found it useful!

</div>
