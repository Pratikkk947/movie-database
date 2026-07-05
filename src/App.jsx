import { useState } from "react";
import Navbar from "./components/Navbar";
import MovieGrid from "./components/MovieGrid";
import MovieDetail from "./components/MovieDetail";
import AddMovieForm from "./components/AddMovieForm";
import moviesData from "./data/movies";

function App() {
  const [movies, setMovies] = useState(moviesData);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const addMovie = (movie) => {
    setMovies((prevMovies) => [...prevMovies, movie]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-8">
        <AddMovieForm onAddMovie={addMovie} />

        <h2 className="text-3xl font-bold mb-6">
          Browse Movies
        </h2>

        <MovieGrid
          movies={movies}
          onSelectMovie={setSelectedMovie}
        />

        <MovieDetail movie={selectedMovie} />
      </div>
    </div>
  );
}

export default App;