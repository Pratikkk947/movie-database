import Movie from '../models/Movie.js';
import mongoose from 'mongoose';

// GET all movies
// Supports optional MongoDB-level filtering:
//   ?genre=Action   -> movies whose genre matches "Action"
//   ?search=matrix  -> movies whose title contains "matrix" (case-insensitive)
//   ?genre=Action&search=batman -> combined filter
export const getMovies = async (req, res) => {
    try {
        const { genre, search } = req.query;
        const filter = {};

        if (genre) {
            filter.genre = { $regex: genre, $options: "i" };
        }

        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }

        const movies = await Movie.find(filter).populate('createdBy', 'username email');
        return res.status(200).json(movies);
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching movies",
            error: error.message
        });
    }
};

// GET movie by ID
export const getMovieById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid movie ID format" });
        }

        const movie = await Movie.findById(id).populate('createdBy', 'username email').populate('reviews.user', 'username email');
        if (!movie) {
            return res.status(404).json({ message: "Movie not found for given id" });
        }

        return res.status(200).json(movie);
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching the movie",
            error: error.message
        });
    }
};

// POST add new movie
export const createMovie = async (req, res) => {
    try {
        const { title, genre, year, releaseYear, rating, director, synopsis, description, poster, image } = req.body;

        if (!title || !genre) {
            return res.status(400).json({ message: "Title and genre are required" });
        }

        const movieData = {
            title,
            genre,
            year: year || releaseYear,
            releaseYear: releaseYear || year,
            rating: rating !== undefined ? rating : 5.0,
            director,
            synopsis: synopsis || description,
            description: description || synopsis,
            poster: poster || image,
            image: image || poster,
            createdBy: req.user._id
        };

        const newMovie = await Movie.create(movieData);

        return res.status(201).json({
            message: "Movie added successfully",
            movie: newMovie
        });
    } catch (error) {
        return res.status(400).json({
            message: "Failed to add movie",
            error: error.message
        });
    }
};

// PUT update movie
export const updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid movie ID format" });
        }

        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found for the given id" });
        }

        // Authorization check: User must be the creator of the movie or an admin
        const isCreator = movie.createdBy && movie.createdBy.toString() === req.user._id.toString();
        const isAdmin = req.user.isAdmin;

        if (!isCreator && !isAdmin) {
            return res.status(403).json({ message: "Unauthorized: You can only update movies you created." });
        }

        // Handle field mappings in case of update
        if (updateData.year && !updateData.releaseYear) updateData.releaseYear = updateData.year;
        if (updateData.releaseYear && !updateData.year) updateData.year = updateData.releaseYear;
        if (updateData.synopsis && !updateData.description) updateData.description = updateData.synopsis;
        if (updateData.description && !updateData.synopsis) updateData.synopsis = updateData.description;
        if (updateData.poster && !updateData.image) updateData.image = updateData.poster;
        if (updateData.image && !updateData.poster) updateData.poster = updateData.image;

        const updatedMovie = await Movie.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        return res.status(200).json({
            message: "Movie updated successfully",
            movie: updatedMovie
        });
    } catch (error) {
        return res.status(400).json({
            message: "Failed to update movie",
            error: error.message
        });
    }
};

// POST add review to a movie (protected route)
export const addReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid movie ID format" });
        }

        // Validate rating (must be a number between 1 and 5)
        const ratingNum = Number(rating);
        if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            return res.status(400).json({ message: "Rating must be a whole number between 1 and 5" });
        }

        // Validate comment
        if (!comment || !String(comment).trim()) {
            return res.status(400).json({ message: "Comment is required" });
        }

        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        // Attach the logged-in user's ID to the review
        const review = {
            user: req.user._id,
            rating: ratingNum,
            comment: String(comment).trim(),
        };

        // Recalculate average rating from all reviews (e.g. 5, 4, 3 -> 4)
        const allRatings = [...movie.reviews.map((r) => r.rating), ratingNum];
        const total = allRatings.reduce((sum, r) => sum + r, 0);
        const avgRating = +(total / allRatings.length).toFixed(1);

        // Use findByIdAndUpdate so only the review subdocument validators run,
        // avoiding full-document validation on legacy movies missing createdBy.
        const updatedMovie = await Movie.findByIdAndUpdate(
            id,
            { $push: { reviews: review }, $set: { avgRating } },
            { new: true, runValidators: true }
        );

        await updatedMovie.populate('createdBy', 'username email');
        await updatedMovie.populate('reviews.user', 'username email');

        return res.status(201).json({
            message: "Review added successfully",
            movie: updatedMovie,
            avgRating
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to add review",
            error: error.message
        });
    }
};

// DELETE movie
export const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid movie ID format" });
        }

        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        // Authorization check: User must be the creator of the movie or an admin
        const isCreator = movie.createdBy && movie.createdBy.toString() === req.user._id.toString();
        const isAdmin = req.user.isAdmin;

        if (!isCreator && !isAdmin) {
            return res.status(403).json({ message: "Unauthorized: You can only delete movies you created." });
        }

        await Movie.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Movie deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while deleting the movie",
            error: error.message
        });
    }
};
