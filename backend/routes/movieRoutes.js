import express from "express";
import {
    getMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
    addReview,
} from "../controllers/movieController.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

router.get("/", getMovies);
router.get("/:id", getMovieById);

router.post("/", authenticate, createMovie);
router.put("/:id", authenticate, updateMovie);
router.delete("/:id", authenticate, deleteMovie);
router.post("/:id/reviews", authenticate, addReview);

export default router;
