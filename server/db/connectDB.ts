import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("🔍 connectDB() starting...");
    console.log("MONGO_URL =", process.env.MONGO_URL);

    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL not found in .env file");
    }

    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    if (error instanceof Error) {
      console.error("❌ Error details:", error.message);
      if ('code' in error) console.error("❌ Error code:", (error as any).code);
      if ('codeName' in error) console.error("❌ Error codeName:", (error as any).codeName);
    }
    throw error; 
  }
};

export default connectDB;
