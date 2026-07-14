import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./src/config/db.js";
import movieRoutes from "./src/routes/movieRoutes.js";

dotenv.config();

const app = express();

// Database (Week 4 placeholder)
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("🎬 Movie Database API is running...");
});

// Movie Routes
app.use("/api/movies", movieRoutes);

// Server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});