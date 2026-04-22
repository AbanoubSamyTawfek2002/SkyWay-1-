```ts
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 5000;

  // MongoDB Connection
  const MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb+srv://pepoabanob7_db_user:uQGUg6ZRmIbrejd4@cluster0.q6ypfrw.mongodb.net/?appName=Cluster0";

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }

  app.use(cors());
  app.use(express.json());

  // ✅ API ROUTES (لازم قبل vite)
  const authRoutes = (await import("./server/auth.js")).default;
  const apiRoutes = (await import("./server/api.js")).default;

  app.use("/api/auth", authRoutes);
  app.use("/api", apiRoutes);

  // ✅ TEST ROUTE (عشان تتأكد)
  app.get("/api/test", (req, res) => {
    res.json({ message: "API is working ✅" });
  });

  // Seed Data
  if (mongoose.connection.readyState === 1) {
    try {
      const { Flight, Hotel, Blog } = await import("./server/models.js");
      const { FLIGHTS, HOTELS, BLOGS } = await import("./server/seeds.js");

      if ((await Flight.countDocuments()) < 100) {
        await Flight.deleteMany({});
        await Flight.insertMany(FLIGHTS);
        console.log("Flights re-seeded");
      }

      if ((await Hotel.countDocuments()) < 150) {
        await Hotel.deleteMany({});
        await Hotel.insertMany(HOTELS);
        console.log("Hotels re-seeded");
      }

      if ((await Blog.countDocuments()) < 3) {
        await Blog.deleteMany({});
        await Blog.insertMany(BLOGS);
        console.log("Blogs seeded");
      }
    } catch (err) {
      console.warn("Seeding failed:", err);
    }
  }

  // ✅ VITE (بعد الـ API)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(vite.middlewares);

  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
```
