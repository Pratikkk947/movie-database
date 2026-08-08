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
      poster: "https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_UF894,1000_QL80_.jpg" 
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
      poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg" 
    },
    { 
      title: "Avatar", 
      genre: "Sci-Fi/Adventure", 
      year: 2009, 
      rating: 7.9, 
      director: "James Cameron",
      synopsis: "A marine on an alien planet becomes torn between following orders and protecting the world he has learned to call home.",
      poster: "https://m.media-amazon.com/images/S/pv-target-images/ae4816cade1a5b7f29787d0b89610132c72c7747041481c6619b9cc3302c0101.jpg" 
    }
];

await mongoose.connect(process.env.MONGODB_URL)

await movie.deleteMany({})
await movie.insertMany(SAMPLE_MOVIES)

console.log(`Seeded ${SAMPLE_MOVIES.length} movies successfully`);

await mongoose.disconnect();

export default SAMPLE_MOVIES;