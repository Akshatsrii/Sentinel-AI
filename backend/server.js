require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const emailRoutes = require("./routes/emailRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Personal Assistant AI Email Platform",
    aiEngine: process.env.GEMINI_API_KEY ? "Gemini Live API" : "Enhanced Hybrid AI Heuristics",
    timestamp: new Date().toISOString()
  });
});

// Mount API Routes
app.use("/api", emailRoutes);

// Serve Frontend in Production or when dist exists
const frontendDist = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendDist));

// Fallback for SPA routing in Express 5
app.use((req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"), (err) => {
    if (err) {
      res.status(200).send("API is active. Build frontend with 'npm run build' inside frontend directory.");
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 PA Email AI Platform running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📬 Emails API: http://localhost:${PORT}/api/emails`);
  console.log(`===================================================`);
});
