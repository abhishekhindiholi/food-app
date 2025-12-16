console.log("Starting index.ts");
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route";
import restaurantRoute from "./routes/restaurant.route";
import menuRoute from "./routes/menu.route";
import orderRoute from "./routes/order.route";
import path from "path";

dotenv.config();
console.log("After dotenv.config(), MONGO_URL:", process.env.MONGO_URL);
console.log("MONGO_URL from env:", process.env.MONGO_URL);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const BASE_DIR = path.join(__dirname, "..");

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://192.168.26.1:5173", "http://192.168.26.1:5174", "http://192.168.26.1:5175"],
    credentials: true,
  })
);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/restaurant", restaurantRoute);
app.use("/api/v1/menu", menuRoute);
app.use("/api/v1/order", orderRoute);


app.get("/", (_req, res) => {
  console.log("Root endpoint hit – server is up and running");
  res.status(200).send("🚀 Server is up and running");
});


const clientDist = path.join(BASE_DIR, "client", "dist");
app.use(express.static(clientDist));

console.log("SERVER FILE LOADED - starting application...");

async function startServer() {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB(); 
    console.log("MongoDB Connected Successfully.");

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Closing server...");
      server.close(() => process.exit(0));
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

startServer();
