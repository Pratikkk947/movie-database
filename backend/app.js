import express from "express";
import movies from "./data/movie.js";

const app = express();

app.use(express.json());

const PORT = 3001;

// GET all movies
app.get("/movie", (req, res) => {
    return res.json(movies);
});

// POST new movie
app.post("/movie", (req, res) => {
    const mov = req.body;

    movies.push(mov);

    return res.status(201).json({
        message: "Movie added successfully",
        movie: mov
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});