import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// تفعيل قراءة ملف الـ .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  // 1. 🛑 تعديل المنفذ: Render يحدد البورت تلقائياً عبر متغير البيئة PORT
  const PORT = process.env.PORT || 5000;

  // 2. 🛑 الاتصال بقاعدة البيانات عبر متغير بيئي (للأمان)
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error(
      "❌ Error: MONGODB_URI is not defined in Environment Variables.",
    );
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }

  // 3. 🛑 حل مشكلة الـ CORS: السماح لرابط جيت هاب بكلم السيرفر
  app.use(
    cors({
      origin: [
        "https://abanoubsamytawfek2002.github.io",
        "http://localhost:5173",
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );

  app.use(express.json());

  // ✅ استيراد المسارات (Routes)
  const authRoutes = (await import("./server/auth.js")).default;
  const apiRoutes = (await import("./server/api.js")).default;

  app.use("/api/auth", authRoutes);
  app.use("/api", apiRoutes);

  // ✅ اختبار عمل السيرفر
  app.get("/api/test", (req, res) => {
    res.json({
      status: "success",
      message: "SkyWay API is running perfectly! 🚀",
    });
  });

  // --- 💡 منطق Seed Data الخاص بك ---
  if (mongoose.connection.readyState === 1) {
    try {
      const { Flight, Hotel, Blog } = await import("./server/models.js");
      const { FLIGHTS, HOTELS, BLOGS } = await import("./server/seeds.js");

      if ((await Flight.countDocuments()) < 50) {
        await Flight.deleteMany({});
        await Flight.insertMany(FLIGHTS);
        console.log("✈️ Flights seeded");
      }

      if ((await Hotel.countDocuments()) < 50) {
        await Hotel.deleteMany({});
        await Hotel.insertMany(HOTELS);
        console.log("🏨 Hotels seeded");
      }
    } catch (err) {
      console.warn("⚠️ Seeding failed:", err);
    }
  }

  // 4. 🛑 التعامل مع بيئة الإنتاج (Production)
  if (process.env.NODE_ENV === "production") {
    // في Render، السيرفر يعمل كـ API فقط لأن الفرونت على جيت هاب
    console.log("🚀 Running in Production Mode (API Server)");
  } else {
    // تشغيل Vite Middleware فقط في البيئة المحلية للتطوير
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("🛠️ Vite Development Middleware Loaded");
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server is listening on port ${PORT}`);
  });
}

startServer();
