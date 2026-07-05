import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import MovieGrid from "./components/MovieGrid";
import MovieDetail from "./components/MovieDetail";
import AddMovieForm from "./components/AddMovieForm";
import SearchBar from "./components/SearchBar";
import Dashboard from "./components/Dashboard";
import moviesData from "./data/movies";

function App() {
  const [movies, setMovies] = useState(moviesData);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [search, setSearch] = useState("");

  const [totalMovies, setTotalMovies] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  const addMovie = (movie) => {
    setMovies((prevMovies) => [...prevMovies, movie]);
  };

  const toggleWatchlist = (movie) => {
    const exists = watchlist.some((item) => item.id === movie.id);

    if (exists) {
      setWatchlist(watchlist.filter((item) => item.id !== movie.id));
    } else {
      setWatchlist([...watchlist, movie]);
    }
  };

  useEffect(() => {
    const total = movies.length;

    const average =
      movies.reduce((sum, movie) => sum + movie.rating, 0) / total;

    setTotalMovies(total);
    setAverageRating(average);
  }, [movies]);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-8">
        <Dashboard
          totalMovies={totalMovies}
          averageRating={averageRating}
        />

        <AddMovieForm onAddMovie={addMovie} />

        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        <h2 className="text-3xl font-bold mb-6">
          Browse Movies
        </h2>

        <MovieGrid
          movies={filteredMovies}
          onSelectMovie={setSelectedMovie}
          watchlist={watchlist}
          toggleWatchlist={toggleWatchlist}
        />

        <MovieDetail movie={selectedMovie} />
      </div>
    </div>
  );
}

export default App;