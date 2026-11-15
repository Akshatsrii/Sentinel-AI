const initialEmails = require("../data/initialEmails");
const geminiService = require("../services/geminiService");

// In-memory working database initialized with rich executive threads
let emails = JSON.parse(JSON.stringify(initialEmails));

let accounts = [
  {
    id: "acc-1",
    email: "alex.vance@vancecapital.io",
    name: "Alex Vance (Work)",
    provider: "google",
    icon: "google",
    status: "connected",
    lastSynced: "Just now",
    totalEmails: 1842,
    unreadCount: 4
  },
  {
    id: "acc-2",
    email: "alex.vance@outlook.com",
    name: "Alex Vance (Executive / Personal)",
    provider: "microsoft",
    icon: "microsoft",
    status: "connected",
    lastSynced: "2 mins ago",
    totalEmails: 924,
    unreadCount: 2
  }
];

// GET /api/emails
exports.getEmails = (req, res) => {
  const { segment, search, priority, account } = req.query;
  let filtered = [...emails];

  // Account filter
  if (account && account !== "all") {
    filtered = filtered.filter((e) => e.account === account);
  }

  // Segment filter
  if (segment) {
    switch (segment) {
      case "assistant":
        filtered = filtered.filter(
          (e) => e.ai?.responsibility === "Assistant to Reply" && !e.isArchived
        );
        break;
      case "client":
        filtered = filtered.filter(
          (e) => e.ai?.responsibility === "Client to Reply" && !e.isArchived
        );
        break;
      case "no_reply":
        filtered = filtered.filter(
          (e) => e.ai?.responsibility === "No Reply Needed" && !e.isArchived
        );
        break;
      case "needs_review":
        filtered = filtered.filter(
          (e) => e.ai?.responsibility === "Needs Review" && !e.isArchived
        );
        break;
      case "action_required":
        filtered = filtered.filter(
          (e) =>
            (e.ai?.responsibility === "Assistant to Reply" ||
              e.ai?.responsibility === "Client to Reply") &&
            e.status !== "handled" &&
            !e.isArchived
        );
        break;
      case "waiting":
        filtered = filtered.filter(
          (e) => e.status === "waiting_for_response" && !e.isArchived
        );
        break;
      case "meetings":
        filtered = filtered.filter(
          (e) =>
            (e.subject.toLowerCase().includes("meeting") ||
              e.subject.toLowerCase().includes("reschedule") ||
              e.subject.toLowerCase().includes("reservation") ||
              e.subject.toLowerCase().includes("dinner") ||
              e.subject.toLowerCase().includes("interview")) &&
            !e.isArchived
        );
        break;
      case "important":
        filtered = filtered.filter((e) => e.isImportant && !e.isArchived);
        break;
      case "archived":
        filtered = filtered.filter((e) => e.isArchived);
        break;
      case "all":
      default:
        filtered = filtered.filter((e) => !e.isArchived);
        break;
    }
  }

  // Search filter
  if (search && search.trim()) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.subject.toLowerCase().includes(term) ||
        e.sender.name.toLowerCase().includes(term) ||
        e.sender.email.toLowerCase().includes(term) ||
        (e.ai?.reason && e.ai.reason.toLowerCase().includes(term))
    );
  }

  // Priority filter
  if (priority && priority !== "all") {
    filtered = filtered.filter((e) => e.ai?.priority === priority);
  }

  // Sort: most recent first
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Compute metrics for quick stats bar
  const stats = {
    total: emails.filter((e) => !e.isArchived).length,
    unread: emails.filter((e) => e.isUnread && !e.isArchived).length,
    assistantToReply: emails.filter(
      (e) => e.ai?.responsibility === "Assistant to Reply" && e.status !== "handled" && !e.isArchived
    ).length,
    clientToReply: emails.filter(
      (e) => e.ai?.responsibility === "Client to Reply" && e.status !== "handled" && !e.isArchived
    ).length,
    noReplyNeeded: emails.filter(
      (e) => e.ai?.responsibility === "No Reply Needed" && !e.isArchived
    ).length,
    needsReview: emails.filter(
      (e) => e.ai?.responsibility === "Needs Review" && !e.isArchived
    ).length,
    actionRequired: emails.filter(
      (e) =>
        (e.ai?.responsibility === "Assistant to Reply" || e.ai?.responsibility === "Client to Reply") &&
        e.status !== "handled" &&
        !e.isArchived
    ).length,
    upcomingMeetings: emails.filter(
      (e) =>
        (e.subject.toLowerCase().includes("meeting") ||
          e.subject.toLowerCase().includes("reschedule") ||
          e.subject.toLowerCase().includes("reservation")) &&
        !e.isArchived
    ).length
  };

  res.json({ emails: filtered, stats });
};

// GET /api/emails/:id
exports.getEmailById = (req, res) => {
  const email = emails.find((e) => e.id === req.params.id);
  if (!email) {
    return res.status(404).json({ error: "Email thread not found" });
  }

  // Mark as read automatically when opened
  email.isUnread = false;

  res.json({ email });
};

// POST /api/emails/:id/classify (Trigger Live AI Re-classification)
exports.classifyEmail = async (req, res) => {
  const email = emails.find((e) => e.id === req.params.id);
  if (!email) {
    return res.status(404).json({ error: "Email thread not found" });
  }

  try {
    const aiResult = await geminiService.classifyEmail(email);
    email.ai = {
      ...email.ai,
      ...aiResult
    };

    if (aiResult.responsibility === "Client to Reply") {
      email.status = "pending_client";
    } else if (aiResult.responsibility === "Assistant to Reply") {
      email.status = "pending_assistant";
    } else if (aiResult.responsibility === "Needs Review") {
      email.status = "needs_review";
    } else {
      email.status = "no_action";
    }

    res.json({ success: true, email, aiResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/emails/:id/summarize
exports.summarizeEmail = async (req, res) => {
  const email = emails.find((e) => e.id === req.params.id);
  if (!email) {
    return res.status(404).json({ error: "Email thread not found" });
  }

  try {
    const summary = await geminiService.summarizeThread(email);
    email.ai.summary = summary;
    res.json({ success: true, summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/emails/:id/generate-reply
exports.generateReply = async (req, res) => {
  const { tone = "Professional", customInstructions = "" } = req.body;
  const email = emails.find((e) => e.id === req.params.id);
  if (!email) {
    return res.status(404).json({ error: "Email thread not found" });
  }

  try {
    const replyData = await geminiService.generateReply(email, tone, customInstructions);
    res.json({ success: true, replyData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/emails/:id/send-reply
exports.sendReply = (req, res) => {
  const { replyText, senderRole = "assistant" } = req.body;
  const email = emails.find((e) => e.id === req.params.id);
  if (!email) {
    return res.status(404).json({ error: "Email thread not found" });
  }

  const senderLabel =
    senderRole === "client"
      ? "Alex Vance <alex.vance@vancecapital.io>"
      : "Sarah Jenkins (PA on behalf of Alex Vance) <sarah.jenkins@vancecapital.io>";

  const newMessage = {
    id: "msg-" + Date.now(),
    sender: senderLabel,
    timestamp: new Date().toISOString(),
    body: replyText
  };

  email.messages.push(newMessage);
  email.status = "handled";
  email.isUnread = false;

  res.json({ success: true, message: "Reply dispatched successfully", email });
};

// PATCH /api/emails/:id/override (Manual Re-classification Override)
exports.overrideClassification = (req, res) => {
  const { responsibility, reason, overrideBy = "assistant" } = req.body;
  const email = emails.find((e) => e.id === req.params.id);
  if (!email) {
    return res.status(404).json({ error: "Email thread not found" });
  }

  email.ai.responsibility = responsibility;
  email.ai.isManualOverride = true;
  email.ai.overrideBy = overrideBy;
  if (reason) {
    email.ai.reason = reason;
  }

  if (responsibility === "Client to Reply") {
    email.status = "pending_client";
  } else if (responsibility === "Assistant to Reply") {
    email.status = "pending_assistant";
  } else if (responsibility === "Needs Review") {
    email.status = "needs_review";
  } else {
    email.status = "no_action";
  }

  res.json({ success: true, email });
};

// PATCH /api/emails/:id/delegate (Client delegates to Assistant with instruction)
exports.delegateToAssistant = (req, res) => {
  const { note = "Please handle this on my behalf." } = req.body;
  const email = emails.find((e) => e.id === req.params.id);
  if (!email) {
    return res.status(404).json({ error: "Email thread not found" });
  }

  email.ai.responsibility = "Assistant to Reply";
  email.ai.reason = `Delegated by Alex (Client): "${note}"`;
  email.ai.isDelegated = true;
  email.ai.delegatedNote = note;
  email.status = "pending_assistant";

  res.json({
    success: true,
    message: "Email successfully delegated to Personal Assistant",
    email
  });
};

// PATCH /api/emails/:id/status (Mark handled, important, unread, archive)
exports.updateStatus = (req, res) => {
  const { status, isImportant, isUnread, isArchived } = req.body;
  const email = emails.find((e) => e.id === req.params.id);
  if (!email) {
    return res.status(404).json({ error: "Email thread not found" });
  }

  if (status !== undefined) email.status = status;
  if (isImportant !== undefined) email.isImportant = isImportant;
  if (isUnread !== undefined) email.isUnread = isUnread;
  if (isArchived !== undefined) email.isArchived = isArchived;

  res.json({ success: true, email });
};

// POST /api/emails/simulate-incoming (Simulate realistic incoming email with live AI analysis)
exports.simulateIncomingEmail = async (req, res) => {
  const templates = [
    {
      subject: "Series B Term Sheet Revisions & Escrow Holdback",
      sender: {
        name: "Marcus Sterling",
        email: "m.sterling@apexventures.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        company: "Apex Ventures"
      },
      body: "Hi Alex,\n\nWe updated Section 4 to reflect the 10% escrow holdback we discussed. Please review and provide sign-off by 4:00 PM today so we can finalize the wire instructions.\n\nBest,\nMarcus"
    },
    {
      subject: "Next Week's All-Hands Catering & Audio Equipment Setup",
      sender: {
        name: "Chef Nobu Concierge",
        email: "catering@hudsonyards.com",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
        company: "Hudson Yards Events"
      },
      body: "Hello Sarah,\n\nFollowing up to confirm the delivery window for Monday morning at 8:30 AM. Could you confirm the loading dock freight elevator pass for our staff?\n\nRegards,\nDispatch Team"
    },
    {
      subject: "Stripe Monthly Payout Statement: $148,250.00 Transferred",
      sender: {
        name: "Stripe Billing",
        email: "notifications@stripe.com",
        avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
        company: "Stripe Inc."
      },
      body: "Your daily payout of $148,250.00 USD has been initiated to Silicon Valley Bank (ending in 8821). Expected delivery: 1-2 business days. No action is required."
    }
  ];

  // Pick random template or use custom provided in body
  const selected = req.body.subject ? req.body : templates[Math.floor(Math.random() * templates.length)];

  const newThread = {
    id: "thread-" + Date.now(),
    account: "alex.vance@vancecapital.io",
    accountProvider: "google",
    subject: selected.subject,
    sender: selected.sender,
    recipients: ["alex.vance@vancecapital.io"],
    cc: ["sarah.jenkins@vancecapital.io"],
    date: new Date().toISOString(),
    isUnread: true,
    isImportant: true,
    isArchived: false,
    status: "pending_assistant",
    messages: [
      {
        id: "msg-" + Date.now(),
        sender: `${selected.sender.name} <${selected.sender.email}>`,
        timestamp: new Date().toISOString(),
        body: selected.body
      }
    ]
  };

  // Run live AI classification & summary
  const aiResult = await geminiService.classifyEmail(newThread);
  const summary = await geminiService.summarizeThread(newThread);
  const actionItems = await geminiService.extractActionItems(newThread);

  newThread.ai = {
    ...aiResult,
    summary,
    actionItems
  };

  if (aiResult.responsibility === "Client to Reply") {
    newThread.status = "pending_client";
  } else if (aiResult.responsibility === "Assistant to Reply") {
    newThread.status = "pending_assistant";
  } else if (aiResult.responsibility === "Needs Review") {
    newThread.status = "needs_review";
  } else {
    newThread.status = "no_action";
  }

  // Prepend to top of inbox
  emails.unshift(newThread);

  res.json({
    success: true,
    message: "New email simulated and classified by AI in real-time!",
    email: newThread
  });
};

// POST /api/emails/ai-chat (Copilot interaction over MongoDB/Email records)
exports.aiChat = async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const result = await geminiService.chatWithEmails(query, emails);
    res.json({ success: true, answer: result.answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/accounts
exports.getAccounts = (req, res) => {
  res.json({ accounts });
};

// POST /api/accounts/connect (Simulate OAuth connection)
exports.connectAccount = (req, res) => {
  const { provider, email } = req.body;
  const newAccount = {
    id: "acc-" + Date.now(),
    email: email || (provider === "google" ? "alex.vance@gmail.com" : "alex.vance@corporate365.com"),
    name: provider === "google" ? "Alex Vance (Gmail)" : "Alex Vance (Enterprise 365)",
    provider: provider || "google",
    icon: provider || "google",
    status: "connected",
    lastSynced: "Just now",
    totalEmails: 420,
    unreadCount: 3
  };

  accounts.push(newAccount);
  res.json({ success: true, message: "Account connected successfully", account: newAccount, accounts });
};

// POST /api/reset-demo
exports.resetDemo = (req, res) => {
  emails = JSON.parse(JSON.stringify(initialEmails));
  res.json({ success: true, message: "Demo inbox reset to fresh state", totalEmails: emails.length });
};
