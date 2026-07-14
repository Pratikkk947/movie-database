import express from "express";

import {
  getAllMovies,
  getMovieById,
  addMovie,
  deleteMovie,
} from "../controllers/movieController.js";

import validateMovie from "../validators/movievalidator.js";

const router = express.Router();

/*
=========================================
GET ALL MOVIES
POST NEW MOVIE
=========================================
*/

router
  .route("/")
  .get(getAllMovies)
  .post(validateMovie, addMovie);

/*
=========================================
GET MOVIE BY ID
DELETE MOVIE
=========================================
*/

router
  .route("/:id")
  .get(getMovieById)
  .delete(deleteMovie);

export default router;