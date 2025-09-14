import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const db = process.env.MONGO_URI;

    const { connection } = await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Success log with host + db name
    console.log(
      `✅ MongoDB Connected Successfully: ${connection.host}/${connection.name}`
    );

    // Extra check: Ping the database
    await mongoose.connection.db.admin().ping();
    console.log("✅ Pinged MongoDB: Connection is alive!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};
