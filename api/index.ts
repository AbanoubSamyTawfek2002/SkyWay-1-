import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// 🛑 استيراد المسارات في البداية (Top-level imports)
import authRoutes from "../server/auth.js";
import apiRoutes from "../server/api.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. إعدادات الـ CORS
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

// 2. الاتصال بـ MongoDB (Logic الخاص بالـ Serverless)
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

// 3. Middleware للتأكد من الاتصال بكل طلب
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// تفعيل المسارات
app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);

// ✅ TEST ROUTE
app.get("/api/test", (req, res) => {
  res.json({ message: "SkyWay API is live on Vercel! 🚀✅" });
});

// 4. Seeding Logic (للتجربة عند الحاجة)
app.get("/api/seed", async (req, res) => {
  try {
    const { Flight, Hotel, Blog } = await import("../server/models.js");
    const { FLIGHTS, HOTELS, BLOGS } = await import("../server/seeds.js");

    // ملاحظة: لو عايز تنفذ الـ InsertMany فعلياً ضيف السطور دي:
    // await Flight.insertMany(FLIGHTS);

    res.json({ message: "Seeding request received and processed" });
  } catch (err: any) {
    // ضفنا :any عشان TypeScript ميزعلش
    res.status(500).json({ error: err.message });
  }
});

// 5. التشغيل المحلي (Development Only)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// 🛑 التصدير لـ Vercel
export default app;
