import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
    },
    releaseYear: {
      type: Number,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [0, "Rating cannot be less than 0"],
      max: [10, "Rating cannot be more than 10"],
      default: 5.0,
    },
    director: {
      type: String,
      trim: true,
      default: "Unknown Director",
    },
    synopsis: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    poster: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Movie creator is required"],
    },
    // User reviews for this movie
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: [true, "Rating is required"],
          min: [1, "Rating must be at least 1"],
          max: [5, "Rating cannot be more than 5"],
        },
        comment: {
          type: String,
          required: [true, "Comment is required"],
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Average of all user review ratings (1-5 scale), recalculated on review add
    avgRating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Map equivalent fields before saving to ensure both standard/UI and database-specific keys are populated
movieSchema.pre('save', function () {
  if (this.year && !this.releaseYear) {
    this.releaseYear = this.year;
  } else if (this.releaseYear && !this.year) {
    this.year = this.releaseYear;
  }

  if (this.synopsis && !this.description) {
    this.description = this.synopsis;
  } else if (this.description && !this.synopsis) {
    this.synopsis = this.description;
  }

  if (this.poster && !this.image) {
    this.image = this.poster;
  } else if (this.image && !this.poster) {
    this.poster = this.image;
  }
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
