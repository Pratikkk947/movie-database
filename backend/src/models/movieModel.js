import movie from "../../data/movie.js";
import { ObjectId } from "mongodb";

export async function getAll() {
    return movie.find();
}

export async function getById(id) {
    const updatedId = new ObjectId(id);
    const foundMovie = await movie.findById(updatedId);
    return foundMovie;
}

export async function addMovie(newMovie) {
    return movie.create(newMovie);
}

export async function updateMovie(id, newMovie) {
    const updatedId = new ObjectId(id);
    const updatedMovie = await movie.findByIdAndUpdate(updatedId, newMovie, {
        new: true,
        runValidators: true,
    });
    return updatedMovie;
}