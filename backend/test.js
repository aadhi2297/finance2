import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

async function testDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
  process.exit();
}

testDB();
