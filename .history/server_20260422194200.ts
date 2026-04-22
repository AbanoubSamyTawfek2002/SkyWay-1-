import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // MongoDB Connection
  const MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb+srv://pepoabanob7_db_user:uQGUg6ZRmIbrejd4@cluster0.q6ypfrw.mongodb.net/?appName=Cluster0";

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Fail fast if IP is not whitelisted
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(
      "CRITICAL: MongoDB connection failed. Please ensure your IP is whitelisted in MongoDB Atlas (Allow 0.0.0.0/0 for testing).",
      err,
    );
  }

  app.use(cors());
  app.use(express.json());

  // Import routes
  const authRoutes = (await import("./server/auth.js")).default;
  const apiRoutes = (await import("./server/api.js")).default;

  app.use("/api/auth", authRoutes);
  app.use("/api", apiRoutes);

  // Seed Data if empty and connected
  if (mongoose.connection.readyState === 1) {
    try {
      const { Flight, Hotel, Blog } = await import("./server/models.js");
      const { FLIGHTS, HOTELS, BLOGS } = await import("./server/seeds.js");

      const flightCount = await Flight.countDocuments();
      if (flightCount < 100) {
        await Flight.deleteMany({});
        await Flight.insertMany(FLIGHTS);
        console.log("Flights re-seeded");
      }

      const hotelCount = await Hotel.countDocuments();
      if (hotelCount < 150) {
        await Hotel.deleteMany({});
        await Hotel.insertMany(HOTELS);
        console.log("Hotels re-seeded");
      }

      const blogCount = await Blog.countDocuments();
      if (blogCount < 3) {
        await Blog.deleteMany({});
        await Blog.insertMany(BLOGS);
        console.log("Blogs seeded");
      }

      const { Review, User } = await import("./server/models.js");
      const reviewCount = await Review.countDocuments();
      if (reviewCount === 0) {
        console.log("Seeding reviews...");
        let systemUser = await User.findOne({ email: "system@skyway.com" });
        if (!systemUser) {
          systemUser = await User.create({
            name: "SkyWay Reviews System",
            email: "system@skyway.com",
            role: "admin",
            isVerified: true,
          });
        }

        const hotels = await Hotel.find().limit(5);
        const flights = await Flight.find().limit(5);

        const demoReviews = [
          "Absolutely loved the service! Highly recommend.",
          "Good experience overall, could be improved in some areas.",
          "Value for money was excellent.",
          "Staff were very helpful and friendly.",
          "One of the best experiences I have had recently.",
          "Top-notch quality and attention to detail.",
          "Exceeded my expectations in every way.",
          "A solid choice for anyone looking for reliability.",
        ];

        for (const hotel of hotels) {
          const reviewsToInsert = [];
          for (let i = 0; i < 5; i++) {
            reviewsToInsert.push({
              userId: systemUser._id,
              targetType: "hotel",
              targetId: hotel._id,
              rating: Math.floor(Math.random() * 2) + 4, // 4 or 5
              comment:
                demoReviews[Math.floor(Math.random() * demoReviews.length)],
              createdAt: new Date(
                Date.now() - Math.floor(Math.random() * 1000000000),
              ),
            });
          }
          await Review.insertMany(reviewsToInsert);

          // Update average
          const avgRating =
            reviewsToInsert.reduce((acc, curr) => acc + curr.rating, 0) /
            reviewsToInsert.length;
          await Hotel.findByIdAndUpdate(hotel._id, {
            rating: avgRating,
            reviewCount: reviewsToInsert.length,
          });
        }

        for (const flight of flights) {
          const reviewsToInsert = [];
          for (let i = 0; i < 5; i++) {
            reviewsToInsert.push({
              userId: systemUser._id,
              targetType: "flight",
              targetId: flight._id,
              rating: Math.floor(Math.random() * 2) + 4, // 4 or 5
              comment:
                demoReviews[Math.floor(Math.random() * demoReviews.length)],
              createdAt: new Date(
                Date.now() - Math.floor(Math.random() * 1000000000),
              ),
            });
          }
          await Review.insertMany(reviewsToInsert);

          // Update average
          const avgRating =
            reviewsToInsert.reduce((acc, curr) => acc + curr.rating, 0) /
            reviewsToInsert.length;
          await Flight.findByIdAndUpdate(flight._id, {
            rating: avgRating,
            reviewCount: reviewsToInsert.length,
          });
        }
        console.log("Reviews seeded");
      }
    } catch (seedErr) {
      console.warn("Seeding failed or timed out:", seedErr);
    }
  } else {
    console.warn("Skipping seeding because MongoDB is not connected.");
  }

  // Vite middleware for development
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

  app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
  });
  ``;
}

startServer();
