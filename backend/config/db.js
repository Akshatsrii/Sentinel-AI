const mongoose = require("mongoose");
const Email = require("../models/Email");
const initialEmails = require("../data/initialEmails");

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri || uri.includes("<db_username>")) {
    console.log("ℹ️ MongoDB Atlas: No valid URI provided. Running in high-performance in-memory store.");
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(" Connected to MongoDB Atlas successfully");

    // Auto-seed initial emails if database is empty
    const count = await Email.countDocuments();
    if (count === 0) {
      await Email.insertMany(initialEmails);
      console.log(` Seeded ${initialEmails.length} executive email threads into MongoDB Atlas.`);
    } else {
      console.log(` MongoDB Atlas active with ${count} existing email threads.`);
    }
    return true;
  } catch (err) {
    console.warn("⚠️ MongoDB Atlas connection notice:", err.message);
    console.log("ℹ️ Gracefully fell back to built-in in-memory store. App continues running 100% functional.");
    return false;
  }
}

module.exports = connectDB;
