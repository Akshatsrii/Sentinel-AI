const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  id: String,
  sender: String,
  timestamp: String,
  body: String
});

const actionItemSchema = new mongoose.Schema({
  id: String,
  task: String,
  deadline: String,
  type: { type: String },
  assignee: { type: String, enum: ["client", "assistant"] },
  isCompleted: { type: Boolean, default: false }
});

const emailSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    account: { type: String, required: true },
    accountProvider: { type: String, default: "google" },
    subject: { type: String, required: true },
    sender: {
      name: String,
      email: String,
      avatar: String,
      company: String
    },
    recipients: [String],
    cc: [String],
    date: { type: String, required: true },
    isUnread: { type: Boolean, default: true },
    isImportant: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending_client", "pending_assistant", "handled", "no_action", "needs_review"],
      default: "pending_assistant"
    },
    ai: {
      responsibility: {
        type: String,
        enum: ["Assistant to Reply", "Client to Reply", "No Reply Needed", "Needs Review"]
      },
      confidence: Number,
      reason: String,
      priority: { type: String, enum: ["Urgent", "High", "Medium", "Low"] },
      sentiment: String,
      suggestedAction: String,
      isManualOverride: { type: Boolean, default: false },
      overrideBy: String,
      isDelegated: { type: Boolean, default: false },
      delegatedNote: String,
      summary: {
        discussion: String,
        keyUpdates: [String],
        pendingAction: String,
        nextStep: String
      },
      actionItems: [actionItemSchema]
    },
    messages: [messageSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Email", emailSchema);
