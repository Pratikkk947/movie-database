import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import movies from "./data/movie.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

/* ==========================================
   Test Route
========================================== */

app.get("/", (req, res) => {
  res.send("Movie API is running 🚀");
});

/* ==========================================
   Requirement 2
   GET /api/movies
========================================== */

app.get("/api/movies", (req, res) => {
  return res.status(200).json({
    success: true,
    count: movies.length,
    data: movies,
  });
});

/* ==========================================
   Requirement 3
   POST /api/movies
========================================== */

app.post("/api/movies", (req, res) => {
  const { title, genre, year, director, synopsis } = req.body;

  // Validation
  if (!title || !genre || !year || !director || !synopsis) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields.",
    });
  }

  const newMovie = {
    id: movies.length + 1,
    title,
    genre,
    year,
    director,
    synopsis,
    rating: 0,
    cast: [],
    poster: "",
  };

  movies.push(newMovie);

  return res.status(201).json({
    success: true,
    message: "Movie added successfully.",
    data: newMovie,
  });
});

/* ==========================================
   Requirement 4
   GET /api/movies/:id
========================================== */

app.get("/api/movies/:id", (req, res) => {
  const id = Number(req.params.id);

  const movie = movies.find((movie) => movie.id === id);

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: "Movie not found.",
    });
  }

  return res.status(200).json({
    success: true,
    data: movie,
  });
});

/* ==========================================
   Start Server
========================================== */

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});