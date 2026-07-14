import movies from "../../data/movies.js";

/**
 * ===========================================
 * GET /api/movies
 * Get all movies
 * ===========================================
 */
export const getAllMovies = (req, res) => {
  return res.status(200).json({
    success: true,
    count: movies.length,
    data: movies,
  });
};

/**
 * ===========================================
 * GET /api/movies/:id
 * Get single movie by ID
 * ===========================================
 */
export const getMovieById = (req, res) => {
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
};

/**
 * ===========================================
 * POST /api/movies
 * Add a new movie
 * ===========================================
 */
export const addMovie = (req, res) => {
  const { title, genre, year, director, synopsis } = req.body;

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
};

/**
 * ===========================================
 * DELETE /api/movies/:id
 * Delete movie by ID
 * ===========================================
 */
export const deleteMovie = (req, res) => {
  const id = Number(req.params.id);

  const index = movies.findIndex((movie) => movie.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Movie not found.",
    });
  }

  const deletedMovie = movies.splice(index, 1);

  return res.status(200).json({
    success: true,
    message: "Movie deleted successfully.",
    data: deletedMovie[0],
  });
};