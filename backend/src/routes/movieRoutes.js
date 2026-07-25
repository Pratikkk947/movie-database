import express from "express";
import {
    getMovies,
    getMovieById,
    createMovie,
    updateMovie,
} from "../controllers/movieController.js";

import { movieRules, validate } from "../validators/movieValidator.js";
import authenticate from "../utils/middleware/auth.js"; // <-- Add this

const router = express.Router();

router.get("/", getMovies);
router.get("/:id", getMovieById);

router.post("/", authenticate, movieRules, validate, createMovie);

router.put("/:id", authenticate, movieRules, validate, updateMovie);

export default router;