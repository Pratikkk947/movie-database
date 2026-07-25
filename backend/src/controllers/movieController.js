import * as movieModel from "../models/movieModel.js";

// Handle GET /movies
export async function getMovies(req, res) {
    const movies = await movieModel.getAll();
    return res.json(movies);
}

// Handle GET /movies/:id
export async function getMovieById(req, res) {
    const movie = await movieModel.getById(req.params.id);

    if (!movie) {
        return res.status(404).json({
            error: "Movie not found for given id",
        });
    }

    return res.status(200).json(movie);
}


// Handle POST /movies
export async function createMovie(req, res) {
    const newMovie = req.body;

    const movie = await movieModel.addMovie(newMovie);

    return res.status(201).json({
        message: "Movie added successfully",
        movie,
    });
}

// Handle PUT /movies/:id
export async function updateMovie(req, res) {
    const id = req.params.id;
    const newMovie = req.body;

    const updated = await movieModel.updateMovie(id, newMovie);

    if (!updated) {
        return res.status(404).json({
            error: "Movie not found for the given id",
        });
    }

    return res.status(200).json({
        message: "Movie updated successfully",
        movie: updated,
    });
}