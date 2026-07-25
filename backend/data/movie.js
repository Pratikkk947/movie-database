import mongoose from "mongoose";


const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  genre: {
    type: String,
    required: true,
    enum: [
      "Sci-Fi/Drama",
      "Sci-Fi/Thriller",
      "Biography/Drama",
      "Action/Crime",
      "Sci-Fi/Adventure",
    ],
  },

  year: {
    type: Number,
    required: true,
  },

  rating: {
    type: Number,
    required: true,
  },

  director: {
    type: String,
    required: true,
    trim: true,
  },

  synopsis: {
    type: String,
    required: true,
  },

  poster: {
    type: String,
    required: true,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;