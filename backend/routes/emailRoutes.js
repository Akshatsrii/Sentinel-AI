const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");

// Inbox & Email Management
router.get("/emails", emailController.getEmails);
router.get("/emails/:id", emailController.getEmailById);
router.post("/emails/:id/classify", emailController.classifyEmail);
router.post("/emails/:id/summarize", emailController.summarizeEmail);
router.post("/emails/:id/generate-reply", emailController.generateReply);
router.post("/emails/:id/send-reply", emailController.sendReply);
router.patch("/emails/:id/override", emailController.overrideClassification);
router.patch("/emails/:id/delegate", emailController.delegateToAssistant);
router.patch("/emails/:id/status", emailController.updateStatus);

// Autonomous AI Agent Pipeline
router.get("/agent/status", emailController.getAgentStatus);
router.get("/agent/logs", emailController.getAgentLogs);
router.post("/agent/execute-action", emailController.executeAgentAction);
router.post("/agent/run-autonomous-triage", emailController.runAutonomousTriage);

// AI Copilot & Simulation
router.post("/emails/compose", emailController.composeEmail);
router.post("/emails/ai-draft-new", emailController.aiDraftNew);
router.post("/emails/simulate-incoming", emailController.simulateIncomingEmail);
router.post("/emails/ai-chat", emailController.aiChat);

// Accounts & Onboarding
router.get("/accounts", emailController.getAccounts);
router.post("/accounts/connect", emailController.connectAccount);

// Demo Reset
router.post("/reset-demo", emailController.resetDemo);

module.exports = router;
