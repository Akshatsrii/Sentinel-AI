const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const emailRoutes = require("./routes/emailRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas (with graceful fallback)
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Proxxy — Executive AI Email & Decision Platform",
    aiEngine: process.env.GEMINI_API_KEY ? "Gemini Live API" : "Enhanced Hybrid AI Heuristics",
    database: process.env.MONGO_URI && !process.env.MONGO_URI.includes("<db_username>") ? "MongoDB Atlas (Connected)" : "In-Memory Executive Store",
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
  console.log(`🚀 Proxxy Server running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📬 Emails API: http://localhost:${PORT}/api/emails`);
  console.log(`===================================================`);
});
