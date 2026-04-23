import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// استيراد المسارات من الفولدر الأصلي (زودنا نقطتين عشان نخرج من فولدر api)
import authRoutes from "../server/auth.js";
import apiRoutes from "../server/api.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "https://abanoubsamytawfek2002.github.io",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);

app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    if (!MONGODB_URI) throw new Error("MONGODB_URI is missing!");
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);

// سطر التجربة
app.get("/api/test", (req, res) => {
  res.json({ message: "SkyWay API is live on Vercel! 🚀" });
});

// للتأكد من تشغيل السيرفر في البيئة المحلية
if (process.env.NODE_ENV !== "production") {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
