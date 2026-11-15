// Hyper-realistic Executive Email Threads for Personal Assistant & Client Platform

const initialEmails = [
  {
    id: "thread-000",
    account: "alex.vance@vancecapital.io",
    accountProvider: "google",
    subject: "Final Project Budget Approval (Q4 Allocation)",
    sender: {
      name: "Jonathan Miller",
      email: "jmiller@vancecapital.io",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      company: "Vance Tech Finance"
    },
    recipients: ["alex.vance@vancecapital.io"],
    cc: ["sarah.jenkins@vancecapital.io"],
    date: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    isUnread: true,
    isImportant: true,
    isArchived: false,
    status: "pending_client",
    
    // AI Intelligence metadata matching evaluator test
    ai: {
      responsibility: "Client to Reply",
      confidence: 98,
      reason: "Personal approval required. Executive decision needed on final project budget allocation.",
      priority: "High",
      sentiment: "Neutral",
      suggestedAction: "Alex must personally review the budget line items and authorize release before tomorrow's deadline.",
      actionRequired: true,
      summary: {
        discussion: "CFO Jonathan Miller requested final project budget review and formal executive sign-off by tomorrow.",
        keyUpdates: [
          "Consolidated engineering hiring and cloud infrastructure reserve",
          "Total budget capped at $1.25M for Q4 allocation",
          "Vendor purchase orders and contractor contracts waiting on Alex's direct approval"
        ],
        pendingAction: "Personal approval required on budget by tomorrow",
        nextStep: "Alex Vance to approve the allocation or request line-item adjustments"
      },
      actionItems: [
        {
          id: "act-0-1",
          task: "Review and approve final project budget",
          deadline: "Tomorrow, 5:00 PM EST",
          type: "approval",
          assignee: "client",
          isCompleted: false
        }
      ]
    },
    messages: [
      {
        id: "msg-000-1",
        sender: "Jonathan Miller <jmiller@vancecapital.io>",
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        body: "Please review and approve the final project budget by tomorrow.\n\nWe have finalized the department breakdown including the cloud infrastructure expansion and Q4 contractor extensions. Total allocation comes to $1,250,000.\n\nOnce you give the green light, we will issue the vendor POs.\n\nBest,\nJonathan"
      }
    ]
  },
  {
    id: "thread-001",
    account: "alex.vance@vancecapital.io",
    accountProvider: "google",
    subject: "Series B Term Sheet & Valuation Discussion ($14M Lead)",
    sender: {
      name: "Marcus Sterling",
      email: "m.sterling@apexventures.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      company: "Apex Ventures"
    },
    recipients: ["alex.vance@vancecapital.io"],
    cc: ["sarah.jenkins@vancecapital.io"], // PA
    date: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    isUnread: true,
    isImportant: true,
    isArchived: false,
    status: "pending_client", // pending_client, pending_assistant, handled, no_action
    
    // AI Intelligence metadata
    ai: {
      responsibility: "Client to Reply",
      confidence: 96,
      reason: "High-stakes investor negotiation requiring Founder/CEO approval on $14M pre-money valuation and Board seat composition.",
      priority: "Urgent",
      sentiment: "Positive",
      suggestedAction: "Client should review Clause 3 (liquidation preference) and give green light or counter-offer.",
      summary: {
        discussion: "Marcus from Apex Ventures submitted the updated Series B Term Sheet offering $14M lead investment at a $65M pre-money valuation.",
        keyUpdates: [
          "Apex committed to taking 60% of the $14M round",
          "Requested 1 voting board seat and pro-rata rights for Series C",
          "Term sheet expiry set for Friday 5:00 PM EST"
        ],
        pendingAction: "Client's formal decision and signature or counter-proposal on board composition.",
        nextStep: "Alex (Client) to review terms or schedule a 15-min call with Marcus."
      },
      actionItems: [
        {
          id: "act-1",
          task: "Review Clause 3.2 regarding voting threshold",
          deadline: "This Friday, 5:00 PM EST",
          type: "approval",
          assignee: "client",
          isCompleted: false
        },
        {
          id: "act-2",
          task: "Confirm legal counsel (Wilson Sonsini) has copy",
          deadline: "Tomorrow morning",
          type: "task",
          assignee: "assistant",
          isCompleted: true
        }
      ]
    },

    messages: [
      {
        id: "msg-101",
        sender: "Marcus Sterling <m.sterling@apexventures.com>",
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        body: `Hi Alex,\n\nGreat connecting over dinner on Tuesday. Our investment committee convened yesterday afternoon, and we are unanimous in our excitement for what you and the Vance Capital team are building.\n\nAttached is our official Series B Term Sheet. We are ready to lead with $8.5M of the $14M round at a $65M pre-money valuation. We are requesting one Preferred Director seat and standard pro-rata participation.\n\nPlease review Clause 3 and 7 with your counsel. This offer remains valid until this Friday at 5:00 PM EST.\n\nBest regards,\nMarcus Sterling\nPartner, Apex Ventures`
      },
      {
        id: "msg-102",
        sender: "Alex Vance <alex.vance@vancecapital.io>",
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        body: `Hi Marcus,\n\nAppreciate the swift follow-up and the vote of confidence from Apex. Overall the terms align with our expectations. I'm looping in my executive assistant Sarah Jenkins and our legal team to do a line-by-line review. I'll get back to you with our notes before Friday.\n\nBest,\nAlex`
      },
      {
        id: "msg-103",
        sender: "Marcus Sterling <m.sterling@apexventures.com>",
        timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        body: `Sounds great Alex. One quick addendum: our LP committee requested clarification on whether you intend to maintain the 2-year founder vesting cliff reset or keep the original schedule. If you can confirm that single point today, we can expedite the final closing documents for early next week.\n\nLooking forward to your call.\nMarcus`
      }
    ]
  },

  {
    id: "thread-002",
    account: "alex.vance@vancecapital.io",
    accountProvider: "google",
    subject: "Reschedule Q3 Board of Directors Meeting to Friday morning?",
    sender: {
      name: "Evelyn Reed",
      email: "ereed@sequoiacap.com",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
      company: "Sequoia Capital"
    },
    recipients: ["alex.vance@vancecapital.io"],
    cc: ["sarah.jenkins@vancecapital.io"],
    date: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    isUnread: true,
    isImportant: true,
    isArchived: false,
    status: "pending_assistant",
    
    ai: {
      responsibility: "Assistant to Reply",
      confidence: 94,
      reason: "Meeting rescheduling and calendar coordination. Assistant can check Alex's availability and propose open slots without bothering the client.",
      priority: "High",
      sentiment: "Neutral",
      suggestedAction: "Assistant should check Alex's Friday morning calendar, propose 10:30 AM EST, and send updated Google Calendar invite.",
      summary: {
        discussion: "Board member Evelyn Reed has a flight conflict on Thursday 2:00 PM and requested moving the Q3 Board Meeting to Friday morning.",
        keyUpdates: [
          "Thursday afternoon slot cancelled due to Evelyn's travel",
          "Requested Friday 9:30 AM or 10:30 AM EST slot",
          "Need confirmation to sync other 3 board members"
        ],
        pendingAction: "Assistant to verify calendar availability and confirm revised time.",
        nextStep: "Sarah (PA) sends reply with available slot and calendar update."
      },
      actionItems: [
        {
          id: "act-201",
          task: "Check Friday 10:30 AM availability in Alex's calendar",
          deadline: "Today by 2:00 PM",
          type: "meeting",
          assignee: "assistant",
          isCompleted: false
        },
        {
          id: "act-202",
          task: "Send revised calendar invites to Evelyn and Board members",
          deadline: "Today by 4:00 PM",
          type: "followup",
          assignee: "assistant",
          isCompleted: false
        }
      ]
    },

    messages: [
      {
        id: "msg-201",
        sender: "Evelyn Reed <ereed@sequoiacap.com>",
        timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
        body: `Dear Alex (and Sarah),\n\nApologies for the last-minute curveball, but my flight from Zurich was delayed and I won't make our scheduled Q3 Board Meeting this Thursday at 2:00 PM EST.\n\nCould we please reschedule to Friday morning? I am wide open between 9:30 AM and 12:00 PM EST. Sarah, could you please check Alex's schedule and circulate an updated invite to the rest of the board if this works?\n\nThank you for understanding,\nEvelyn Reed`
      }
    ]
  },

  {
    id: "thread-003",
    account: "alex.vance@vancecapital.io",
    accountProvider: "google",
    subject: "Urgent: Final IP Assignment & Executive Employment Agreement Signature",
    sender: {
      name: "David Chen, Esq.",
      email: "dchen@gunder.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      company: "Gunderson Dettmer LLP"
    },
    recipients: ["alex.vance@vancecapital.io"],
    cc: ["sarah.jenkins@vancecapital.io"],
    date: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    isUnread: false,
    isImportant: true,
    isArchived: false,
    status: "pending_client",

    ai: {
      responsibility: "Client to Reply",
      confidence: 98,
      reason: "Legal document requiring personal signature and consent from Alex Vance. Legal liability prevents assistant from signing on client's behalf.",
      priority: "Urgent",
      sentiment: "Neutral",
      suggestedAction: "Client must review the DocuSign envelope and execute signature before 5 PM closing.",
      summary: {
        discussion: "Legal counsel David Chen forwarded the clean IP Assignment and revised employment agreement for DocuSign execution prior to audit submission.",
        keyUpdates: [
          "All redlines from yesterday's call incorporated into Exhibit B",
          "DocuSign link sent to Alex's primary email",
          "Deadline is today before 5:00 PM EST"
        ],
        pendingAction: "Client's electronic signature via DocuSign link.",
        nextStep: "Alex opens DocuSign link and signs the document."
      },
      actionItems: [
        {
          id: "act-301",
          task: "Sign DocuSign agreement for IP Assignment",
          deadline: "Today by 5:00 PM EST",
          type: "approval",
          assignee: "client",
          isCompleted: false
        }
      ]
    },

    messages: [
      {
        id: "msg-301",
        sender: "David Chen, Esq. <dchen@gunder.com>",
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        body: `Alex,\n\nWe have finalized the clean IP Assignment agreement incorporating all changes requested during yesterday's review. The DocuSign envelope has been dispatched to your email.\n\nBecause this directly affects the closing representations for the upcoming round, we need your personal execution today by 5:00 PM EST.\n\nPlease confirm once signed so we can attach it to the closing binder.\n\nBest,\nDavid Chen\nPartner, Gunderson Dettmer`
      }
    ]
  },

  {
    id: "thread-004",
    account: "alex.vance@outlook.com",
    accountProvider: "microsoft",
    subject: "Private Dining Reservation at Nobu Downtown (Dietary & Wine Selection)",
    sender: {
      name: "Chef Nobu Concierge",
      email: "reservations@noburestaurants.com",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
      company: "Nobu Hospitality"
    },
    recipients: ["alex.vance@outlook.com"],
    cc: ["sarah.jenkins@vancecapital.io"],
    date: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    isUnread: true,
    isImportant: false,
    isArchived: false,
    status: "pending_assistant",

    ai: {
      responsibility: "Assistant to Reply",
      confidence: 95,
      reason: "Routine concierge hospitality follow-up. Assistant knows client preferences, dietary restrictions, and corporate card details.",
      priority: "Medium",
      sentiment: "Positive",
      suggestedAction: "Assistant should confirm guest count (6 people), note seafood allergy for Guest 3, and authorize credit card on file.",
      summary: {
        discussion: "Nobu Downtown concierge reaching out to confirm dinner table details for next Tuesday's VIP investor dinner.",
        keyUpdates: [
          "Private dining room reserved for 6 guests at 7:30 PM",
          "Chef requested dietary restrictions 48 hrs in advance",
          "Corkage policy and wine pairing options provided"
        ],
        pendingAction: "Assistant to confirm dietary restrictions and wine pairing selection.",
        nextStep: "Sarah confirms guest details and corporate card guarantee."
      },
      actionItems: [
        {
          id: "act-401",
          task: "Confirm 6 guest dietary preferences and notify Nobu concierge",
          deadline: "Tomorrow by 12:00 PM",
          type: "task",
          assignee: "assistant",
          isCompleted: false
        }
      ]
    },

    messages: [
      {
        id: "msg-401",
        sender: "Chef Nobu Concierge <reservations@noburestaurants.com>",
        timestamp: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
        body: `Dear Mr. Vance,\n\nWe look forward to welcoming you and your guests to Nobu Downtown on Tuesday, November 24th at 7:30 PM in our Private Dining Salon.\n\nCould your office kindly share any guest dietary restrictions or allergies by tomorrow, as Chef prepares the Omakase menu 48 hours in advance? Also, please let us know if you would like our head sommelier to curate a reserve sake pairing.\n\nWarm regards,\nElena Rostova | VIP Concierge Manager`
      }
    ]
  },

  {
    id: "thread-005",
    account: "alex.vance@vancecapital.io",
    accountProvider: "google",
    subject: "Forbes 40 Under 40: Exclusive Cover Profile & Interview Request",
    sender: {
      name: "Chloe Martin",
      email: "cmartin@forbes.com",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
      company: "Forbes Magazine"
    },
    recipients: ["alex.vance@vancecapital.io"],
    date: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    isUnread: false,
    isImportant: true,
    isArchived: false,
    status: "pending_client",

    ai: {
      responsibility: "Client to Reply",
      confidence: 91,
      reason: "High-visibility personal press opportunity. Only the client can decide whether to accept the cover profile, photo shoot dates, and PR narrative.",
      priority: "High",
      sentiment: "Positive",
      suggestedAction: "Client should decide if they wish to participate; if yes, assistant can coordinate photography logistics.",
      summary: {
        discussion: "Forbes Senior Editor Chloe Martin inviting Alex Vance for an in-depth cover interview for the upcoming 'Innovators in AI & Finance' issue.",
        keyUpdates: [
          "Profile entails 45-minute 1-on-1 interview and studio photoshoot in NYC",
          "Editorial embargo until publication in January",
          "Response requested by Friday"
        ],
        pendingAction: "Client to give go/no-go on doing the press interview.",
        nextStep: "Alex decides whether to proceed or decline gracefully."
      },
      actionItems: [
        {
          id: "act-501",
          task: "Decide on Forbes cover profile participation",
          deadline: "Thursday 5:00 PM",
          type: "approval",
          assignee: "client",
          isCompleted: false
        }
      ]
    },

    messages: [
      {
        id: "msg-501",
        sender: "Chloe Martin <cmartin@forbes.com>",
        timestamp: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
        body: `Dear Alex,\n\nI hope this finds you well. I'm a Senior Tech & Venture Editor at Forbes. We have been tracking Vance Capital's remarkable momentum and the emergence of your AI infrastructure portfolio.\n\nWe are planning a feature cover story for our January 2027 issue titled 'The Next Architects of Intelligent Capital', and our editorial board has selected you as our primary profile.\n\nThe feature would include a 45-minute virtual or in-person discussion with me and a 1-hour photoshoot in our Manhattan studio between Dec 2nd - 6th.\n\nCould you please let me know if you would be open to this profile?\n\nWarmly,\nChloe Martin\nSenior Editor, Forbes`
      }
    ]
  },

  {
    id: "thread-006",
    account: "alex.vance@vancecapital.io",
    accountProvider: "google",
    subject: "Amazon Web Services Billing Notification: Invoice #INV-2026-9812",
    sender: {
      name: "AWS Billing Support",
      email: "no-reply-billing@amazon.com",
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
      company: "Amazon Web Services"
    },
    recipients: ["alex.vance@vancecapital.io"],
    date: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    isUnread: false,
    isImportant: false,
    isArchived: false,
    status: "no_action",

    ai: {
      responsibility: "No Reply Needed",
      confidence: 99,
      reason: "Automated billing notification and receipt. Credit card was charged automatically; no response or action is required.",
      priority: "Low",
      sentiment: "Neutral",
      suggestedAction: "Archived/Logged automatically. Accounting system already synced via invoice webhook.",
      summary: {
        discussion: "Monthly AWS cloud infrastructure statement for October charges totalling $4,382.40 paid via corporate Amex.",
        keyUpdates: [
          "Payment processed successfully",
          "PDF tax invoice attached",
          "Zero outstanding balance"
        ],
        pendingAction: "None. Informational receipt.",
        nextStep: "No reply required."
      },
      actionItems: []
    },

    messages: [
      {
        id: "msg-601",
        sender: "AWS Billing Support <no-reply-billing@amazon.com>",
        timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        body: `Greetings from Amazon Web Services.\n\nYour invoice for the billing period October 1 - October 31, 2026 is now available. Your credit card ending in 4108 has been charged for $4,382.40 USD.\n\nYou can review your detailed breakdown in the AWS Billing and Cost Management console.\n\nThank you for choosing Amazon Web Services.`
      }
    ]
  },

  {
    id: "thread-007",
    account: "alex.vance@vancecapital.io",
    accountProvider: "google",
    subject: "Stratechery by Ben Thompson: AI Agents & The Unbundling of Email",
    sender: {
      name: "Ben Thompson",
      email: "daily@stratechery.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
      company: "Stratechery"
    },
    recipients: ["alex.vance@vancecapital.io"],
    date: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    isUnread: false,
    isImportant: false,
    isArchived: false,
    status: "no_action",

    ai: {
      responsibility: "No Reply Needed",
      confidence: 99,
      reason: "Newsletter subscription delivery. Broadcast publication sent to thousands of subscribers.",
      priority: "Low",
      sentiment: "Neutral",
      suggestedAction: "No action needed. Can be read during leisure or archived.",
      summary: {
        discussion: "Weekly analysis of enterprise AI agents, multi-agent communication protocols, and productivity interfaces.",
        keyUpdates: [
          "Analysis of how LLM assistants filter information overload",
          "Comparison of traditional email vs. agentic workflows"
        ],
        pendingAction: "None.",
        nextStep: "No reply required."
      },
      actionItems: []
    },

    messages: [
      {
        id: "msg-701",
        sender: "Ben Thompson <daily@stratechery.com>",
        timestamp: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
        body: `Hello and welcome to today's Stratechery Update.\n\nToday we dive into the evolution of executive communication and why autonomous AI personal assistants represent a fundamental shift in user experience...\n\nClick here to read the full analysis on the website.`
      }
    ]
  },

  {
    id: "thread-008",
    account: "alex.vance@vancecapital.io",
    accountProvider: "google",
    subject: "Offer Letter Negotiation: Elena Rostova (Head of AI Engineering)",
    sender: {
      name: "Elena Rostova",
      email: "elena.rostova@stanford.alum.edu",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
      company: "Candidate (Ex-DeepMind)"
    },
    recipients: ["alex.vance@vancecapital.io"],
    date: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    isUnread: true,
    isImportant: true,
    isArchived: false,
    status: "pending_client",

    ai: {
      responsibility: "Client to Reply",
      confidence: 94,
      reason: "Executive hire counter-offer with equity & signing bonus request. Only Founder/CEO can authorize equity pool allocation.",
      priority: "Urgent",
      sentiment: "Neutral",
      suggestedAction: "Client should review counter-offer (0.4% extra equity + $25k sign-on) and approve or counter before competitor deadline.",
      summary: {
        discussion: "Elena Rostova, principal AI engineer candidate, received a competing offer from Anthropic and requested a 0.4% equity grant increase and $25k sign-on bonus to sign immediately.",
        keyUpdates: [
          "Candidate enthusiastic about mission",
          "Holds competing offer expiring Wednesday evening",
          "Willing to sign immediately if equity is bumped from 1.1% to 1.5%"
        ],
        pendingAction: "Founder decision on equity adjustment.",
        nextStep: "Alex decides whether to match equity or offer hybrid incentive."
      },
      actionItems: [
        {
          id: "act-801",
          task: "Authorize 0.4% equity increase for Head of AI hire",
          deadline: "Wednesday 6:00 PM",
          type: "approval",
          assignee: "client",
          isCompleted: false
        }
      ]
    },

    messages: [
      {
        id: "msg-801",
        sender: "Elena Rostova <elena.rostova@stanford.alum.edu>",
        timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
        body: `Dear Alex,\n\nThank you so much for the offer to join Vance Capital as Head of AI Engineering. I was truly inspired by our conversation last Thursday.\n\nI have received a competing written offer from Anthropic that includes higher equity participation. Vance Capital is my clear #1 choice culturally and strategically. If we can adjust the equity grant to 1.5% (from 1.1%) and include a $25k signing bonus to offset unvested shares, I am prepared to sign the offer letter tonight and decline all other opportunities.\n\nCould you let me know if this is feasible?\n\nWarmly,\nElena`
      }
    ]
  },

  {
    id: "thread-009",
    account: "alex.vance@outlook.com",
    accountProvider: "microsoft",
    subject: "Strategic Partnership Pitch: Cross-Border Liquidity Rails",
    sender: {
      name: "Arthur Pendelton",
      email: "apendelton@nexusglobalfx.co.uk",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      company: "Nexus Global FX"
    },
    recipients: ["alex.vance@outlook.com"],
    date: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    isUnread: false,
    isImportant: false,
    isArchived: false,
    status: "needs_review",

    ai: {
      responsibility: "Needs Review",
      confidence: 62,
      reason: "Ambiguous cold outreach claiming prior mutual acquaintance. Unclear if client knows Arthur or if this is unsolicited sales outreach.",
      priority: "Medium",
      sentiment: "Neutral",
      suggestedAction: "Assistant should verify if Alex knows Arthur from the London FinTech conference before scheduling a meeting.",
      summary: {
        discussion: "Arthur from Nexus Global FX pitches an enterprise liquidity protocol, claiming they met briefly at a FinTech dinner in May.",
        keyUpdates: [
          "Wants 20-minute intro call next week",
          "Claims connection via mutual investor Sir Nigel Green"
        ],
        pendingAction: "Assistant to check CRM/contacts to confirm if client knows sender.",
        nextStep: "Sarah reviews sender history and flags to Alex or politely declines."
      },
      actionItems: [
        {
          id: "act-901",
          task: "Check CRM for Arthur Pendelton or Sir Nigel Green connection",
          deadline: "Tomorrow",
          type: "followup",
          assignee: "assistant",
          isCompleted: false
        }
      ]
    },

    messages: [
      {
        id: "msg-901",
        sender: "Arthur Pendelton <apendelton@nexusglobalfx.co.uk>",
        timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
        body: `Dear Alex,\n\nTrust this finds you well. Nigel Green mentioned we should connect regarding cross-border liquidity rails following your panel in London earlier this year.\n\nWe have built an institutional clearing network currently handling $400M daily. We'd love to explore synergies with Vance Capital's portfolio companies.\n\nDo you or your assistant have 20 minutes open next Tuesday or Wednesday?\n\nBest regards,\nArthur Pendelton\nManaging Director, Nexus Global`
      }
    ]
  },

  {
    id: "thread-010",
    account: "alex.vance@vancecapital.io",
    accountProvider: "google",
    subject: "British Airways Booking Confirmation & E-Ticket: NYC (JFK) -> London (LHR)",
    sender: {
      name: "British Airways Club World",
      email: "eticket@britishairways.com",
      avatar: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=100&auto=format&fit=crop&q=80",
      company: "British Airways"
    },
    recipients: ["alex.vance@vancecapital.io"],
    date: new Date(Date.now() - 1000 * 60 * 800).toISOString(),
    isUnread: false,
    isImportant: false,
    isArchived: false,
    status: "no_action",

    ai: {
      responsibility: "No Reply Needed",
      confidence: 99,
      reason: "Automated airline itinerary confirmation. Flight tickets and seat selection (Seat 3A) already confirmed.",
      priority: "Low",
      sentiment: "Positive",
      suggestedAction: "Assistant already synced flight calendar events with terminal transfer times.",
      summary: {
        discussion: "Flight confirmation for Alex Vance flying Club World Business Class from JFK to LHR on Dec 1st.",
        keyUpdates: [
          "Booking reference: #7X4K9L",
          "Departs JFK 8:15 PM, arrives LHR 8:30 AM (+1 day)",
          "Baggage & lounge access confirmed"
        ],
        pendingAction: "None. Itinerary confirmed.",
        nextStep: "No reply required."
      },
      actionItems: []
    },

    messages: [
      {
        id: "msg-1001",
        sender: "British Airways <eticket@britishairways.com>",
        timestamp: new Date(Date.now() - 1000 * 60 * 800).toISOString(),
        body: `Dear Mr. Vance,\n\nThank you for booking with British Airways. Your e-ticket receipt is confirmed.\n\nFlight: BA 0178 (Club World)\nDeparture: New York JFK (Terminal 7) - Monday, 1 Dec 2026, 20:15\nArrival: London Heathrow (Terminal 5) - Tuesday, 2 Dec 2026, 08:30\nSeat: 3A (Window - Club Suite)\nBooking Ref: 7X4K9L\n\nHave a pleasant flight.`
      }
    ]
  }
];

export default initialEmails;
