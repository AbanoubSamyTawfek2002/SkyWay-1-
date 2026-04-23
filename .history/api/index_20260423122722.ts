import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. إعدادات الـ CORS للسماح لـ GitHub Pages بالوصول للسيرفر
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

// 2. الاتصال بـ MongoDB (بشكل يضمن عدم تكرار الاتصال في Vercel)
const MONGODB_URI = process.env.MONGODB_URI;

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
};

// 3. المسارات (Routes)
// ملاحظة: يفضل استخدام Static Imports لو أمكن، لكن سأبقيها كما هي مع التأكد من المسارات
app.use(async (req, res, next) => {
  await connectDB(); // تأكد من الاتصال قبل معالجة أي طلب
  next();
});

// استيراد المسارات
import authRoutes from "../server/auth.js";
import apiRoutes from "../server/api.js";

app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);

// ✅ TEST ROUTE
app.get("/api/test", (req, res) => {
  res.json({ message: "SkyWay API is live on Vercel! ✅" });
});

// 4. Seeding Logic (يفضل تشغيلها يدوياً مرة واحدة، لكن سأتركها لك)
app.get("/api/seed", async (req, res) => {
  try {
    const { Flight, Hotel, Blog } = await import("../server/models.js");
    const { FLIGHTS, HOTELS, BLOGS } = await import("../server/seeds.js");
    // ضع هنا منطق الـ InsertMany الخاص بك
    res.json({ message: "Seeding request received" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. تعديل Listen: في Vercel لا نحتاج app.listen، لكن سنتركه للتشغيل المحلي
if (process.env.NODE_ENV !== "production") {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// 🛑 أهم سطر لـ Vercel
export default app;
