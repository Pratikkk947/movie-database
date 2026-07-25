import mongoose from 'mongoose'
import movie from './movie.js'
import dotenv from 'dotenv'

dotenv.config({
    path:'./.env',
})

const SAMPLE_MOVIES = [
    { 
      title: "Interstellar", 
      genre: "Sci-Fi/Drama", 
      year: 2014, 
      rating: 8.7, 
      director: "Christopher Nolan",
      synopsis: "A team of explorers travels through a wormhole near Saturn in search of a new home for humanity.",
      poster: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg" 
    },
    { 
      title: "Inception", 
      genre: "Sci-Fi/Thriller", 
      year: 2010, 
      rating: 8.8, 
      director: "Christopher Nolan",
      synopsis: "A skilled thief who steals secrets through dream-sharing technology is given a chance to erase his past by performing an impossible task.",
      poster: "https://upload.wikimedia.org/wikipedia/en/7/7f/Inception_ver3.jpg" 
    },
    { 
      title: "Dangal", 
      genre: "Biography/Drama", 
      year: 2016, 
      rating: 8.3, 
      director: "Nitesh Tiwari",
      synopsis: "A former wrestler trains his daughters to become world-class wrestlers despite social challenges.",
      poster: "https://upload.wikimedia.org/wikipedia/en/9/99/Dangal_Poster.jpg" 
    },
    { 
      title: "The Dark Knight", 
      genre: "Action/Crime", 
      year: 2008, 
      rating: 9.0, 
      director: "Christopher Nolan",
      synopsis: "Batman faces a criminal mastermind who creates chaos and pushes Gotham City into fear and destruction.",
      poster: "https://upload.wikimedia.org/wikipedia/en/8/8a/Dark_Knight.jpg" 
    },
    { 
      title: "Avatar", 
      genre: "Sci-Fi/Adventure", 
      year: 2009, 
      rating: 7.9, 
      director: "James Cameron",
      synopsis: "A marine on an alien planet becomes torn between following orders and protecting the world he has learned to call home.",
      poster: "https://upload.wikimedia.org/wikipedia/en/b/b0/Avatar-Teaser-Poster.jpg" 
    }
];

const connection = mongoose.connect(process.env.MONGODB_URL)

await movie.deleteMany({})
await movie.insertMany(SAMPLE_MOVIES)

export default SAMPLE_MOVIES;