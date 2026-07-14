import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import movies from "./data/movie.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Test Route
app.get("/", (req, res) => {
  res.send("Movie API is running 🚀");
});

// Get All Movies
app.get("/api/movies", (req, res) => {
  return res.json(movies);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});