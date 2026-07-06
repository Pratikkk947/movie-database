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
  const [currentPage, setCurrentPage] = useState("browse");

  const [totalMovies, setTotalMovies] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  const addMovie = (movie) => {
    setMovies((prev) => [...prev, movie]);
  };

  const toggleWatchlist = (movie) => {
    const exists = watchlist.some((item) => item.id === movie.id);

    if (exists) {
      setWatchlist((prev) =>
        prev.filter((item) => item.id !== movie.id)
      );
    } else {
      setWatchlist((prev) => [...prev, movie]);
    }
  };

  useEffect(() => {
    setTotalMovies(movies.length);

    const avg =
      movies.reduce((sum, movie) => sum + movie.rating, 0) /
      movies.length;

    setAverageRating(avg);
  }, [movies]);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <div className="max-w-7xl mx-auto p-8">

        {/* ===========================
            Browse
        ============================ */}

        {currentPage === "browse" && (
          <>
            <Dashboard
              totalMovies={totalMovies}
              averageRating={averageRating}
            />

            <SearchBar
              search={search}
              setSearch={setSearch}
            />

            <h2 className="text-3xl font-bold mb-8">
              Browse Movies
            </h2>

            <MovieGrid
              movies={filteredMovies}
              watchlist={watchlist}
              toggleWatchlist={toggleWatchlist}
              onSelectMovie={(movie) => {
                setSelectedMovie(movie);
                setCurrentPage("movie");
              }}
            />
          </>
        )}

        {/* ===========================
            Watchlist
        ============================ */}

        {currentPage === "watchlist" && (
          <>
            <h2 className="text-3xl font-bold mb-8">
              My Watchlist
            </h2>

            {watchlist.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
                <h3 className="text-2xl font-semibold text-slate-700">
                  Your watchlist is empty.
                </h3>

                <p className="text-slate-500 mt-3">
                  Browse movies and add some favourites.
                </p>
              </div>
            ) : (
              <MovieGrid
                movies={watchlist}
                watchlist={watchlist}
                toggleWatchlist={toggleWatchlist}
                onSelectMovie={(movie) => {
                  setSelectedMovie(movie);
                  setCurrentPage("movie");
                }}
              />
            )}
          </>
        )}

        {/* ===========================
            Add Movie
        ============================ */}

        {currentPage === "add" && (
          <AddMovieForm onAddMovie={addMovie} />
        )}

        {/* ===========================
            Movie Detail Page
        ============================ */}

        {currentPage === "movie" && selectedMovie && (
          <>
            <button
              onClick={() => setCurrentPage("browse")}
              className="mb-8 flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              ← Back to Browse
            </button>

            <MovieDetail movie={selectedMovie} />
          </>
        )}

      </div>
    </div>
  );
}

export default App;