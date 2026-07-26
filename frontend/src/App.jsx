import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import MovieGrid from "./components/MovieGrid";
import AddMovieForm from "./components/AddMovieForm";
import MovieDetail from "./components/MovieDetail";
import { getMovies, createMovie } from "./api/movieAPI";

const SAMPLE_MOVIES = [
  {
    id: 1,
    title: "Interstellar",
    genre: "Sci-Fi/Drama",
    year: 2014,
    rating: 8.7,
    director: "Christopher Nolan",
    synopsis: "A team of explorers travels through a wormhole near Saturn in search of a new home for humanity.",
    poster: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg"
  },
  {
    id: 2,
    title: "Inception",
    genre: "Sci-Fi/Thriller",
    year: 2010,
    rating: 8.8,
    director: "Christopher Nolan",
    synopsis: "A skilled thief who steals secrets through dream-sharing technology is given a chance to erase his past by performing an impossible task.",
    poster: "https://upload.wikimedia.org/wikipedia/en/7/7f/Inception_ver3.jpg"
  },
  {
    id: 3,
    title: "Dangal",
    genre: "Biography/Drama",
    year: 2016,
    rating: 8.3,
    director: "Nitesh Tiwari",
    synopsis: "A former wrestler trains his daughters to become world-class wrestlers despite social challenges.",
    poster: "https://upload.wikimedia.org/wikipedia/en/9/99/Dangal_Poster.jpg"
  },
  {
    id: 4,
    title: "The Dark Knight",
    genre: "Action/Crime",
    year: 2008,
    rating: 9.0,
    director: "Christopher Nolan",
    synopsis: "Batman faces a criminal mastermind who creates chaos and pushes Gotham City into fear and destruction.",
    poster: "https://upload.wikimedia.org/wikipedia/en/8/8a/Dark_Knight.jpg"
  },
  {
    id: 5,
    title: "Avatar",
    genre: "Sci-Fi/Adventure",
    year: 2009,
    rating: 7.9,
    director: "James Cameron",
    synopsis: "A marine on an alien planet becomes torn between following orders and protecting the world he has learned to call home.",
    poster: "https://upload.wikimedia.org/wikipedia/en/b/b0/Avatar-Teaser-Poster.jpg"
  }
];
function App() {
  const [movies, setMovies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Separate state array for Watchlist
  const [watchlistIds, setWatchlistIds] = useState([]);
  const [isWatchlistView, setIsWatchlistView] = useState(false);

  // Dashboard stats
  const [stats, setStats] = useState({ total: 0, averageRating: 0 });

  // Fetch movies from database
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await getMovies();
        const formattedMovies = response.data.map(movie => ({
          ...movie,
          id: movie._id
        }));
        setMovies(formattedMovies);
      } catch (error) {
        console.error("Error fetching movies from DB:", error);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    const total = movies.length; //use effect k garne vanera yeta lekhne(internal state vanda bahek external ko lagi we use useeffect)
    const avg = total > 0
      ? (movies.reduce((acc, m) => acc + m.rating, 0) / total).toFixed(1)
      : 0;

    setStats({ total, averageRating: avg });
  }, [movies]);

  const handleAddMovie = async (newMovie) => {
    try {
      const moviePayload = {
        ...newMovie,
        year: Number(newMovie.year),
        rating: Number(newMovie.rating || 5.0)
      };
      const response = await createMovie(moviePayload);
      const createdMovie = {
        ...response.data.movie,
        id: response.data.movie._id
      };
      setMovies(prev => [createdMovie, ...prev]);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding movie:", error);
      const serverError = error.response?.data?.error || error.response?.data?.message || "Failed to save movie. Please check your inputs.";
      alert(`Could not save movie: ${serverError}`);
    }
  };

  const toggleWatchlist = (movie) => {
    setWatchlistIds(prev =>
      prev.includes(movie.id)
        ? prev.filter(id => id !== movie.id)
        : [...prev, movie.id]
    );
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If in watchlist view, further filter to only pinned movies
  const displayMovies = isWatchlistView
    ? filteredMovies.filter(m => watchlistIds.includes(m.id))
    : filteredMovies;

  return (
    <div className="min-h-screen bg-[#F8FAFC] bg-[radial-gradient(at_0%_0%,_rgba(238,242,255,1)_0%,_transparent_50%),_radial-gradient(at_100%_0%,_rgba(245,243,255,1)_0%,_transparent_50%),_radial-gradient(at_100%_100%,_rgba(239,246,255,1)_0%,_transparent_50%),_radial-gradient(at_0%_100%,_rgba(253,242,248,1)_0%,_transparent_50%)] text-gray-900 font-sans">
      <Navbar
        onAddClick={() => {
          setShowForm(!showForm);
          setSelectedMovie(null);
          setIsWatchlistView(false);
        }}
        showForm={showForm}
        onBrowse={() => {
          setIsWatchlistView(false);
          setSelectedMovie(null);
          setShowForm(false);
        }}
        onWatchlist={() => {
          setIsWatchlistView(true);
          setSelectedMovie(null);
          setShowForm(false);
        }}
        isWatchlistView={isWatchlistView}
      />

      <main className="container mx-auto py-10 px-4">
        {!selectedMovie && !showForm && (
          <>
            <header className="mb-8 text-center relative px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-blue-800 to-purple-600">
                    Discover. Watch. Enjoy.
                  </span>
                </h2>
                <p className="text-gray-500 text-sm md:text-base font-medium mb-6 max-w-xl mx-auto">
                  Explore your personal collection of amazing movies.
                </p>

                <div className="flex flex-wrap gap-4 justify-center mb-8">
                  <div className="bg-white px-5 py-3 rounded-2xl shadow-xl shadow-blue-500/5 border border-blue-50 flex items-center gap-3 transition-all hover:shadow-2xl hover:-translate-y-0.5">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Total Movies</p>
                      <p className="text-xl font-black text-gray-900 leading-none">{stats.total}</p>
                    </div>
                  </div>

                  <div className="bg-white px-5 py-3 rounded-2xl shadow-xl shadow-purple-500/5 border border-purple-50 flex items-center gap-3 transition-all hover:shadow-2xl hover:-translate-y-0.5">
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Avg Rating</p>
                      <p className="text-xl font-black text-gray-900 leading-none flex items-center gap-1.5">
                        {stats.averageRating} <span className="text-yellow-400 text-sm">★</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="max-w-md mx-auto relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search movies..."
                  className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-12 py-4 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all font-medium text-gray-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm ? (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full p-1 transition-all"
                    title="Clear search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ) : (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-50 text-blue-500 rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-wider hidden sm:block">
                    Search
                  </div>
                )}
              </div>
            </header>

            {displayMovies.length > 0 ? (
              <MovieGrid
                movies={displayMovies}
                onMovieClick={(movie) => setSelectedMovie(movie)}
                onToggleWatchlist={toggleWatchlist}
                watchlistIds={watchlistIds}
              />
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-lg mx-auto">
                <p className="text-gray-400 text-xl font-medium">
                  {isWatchlistView ? "Your watch later list is currently empty." : "No movies found matching your search."}
                </p>
                <button
                  onClick={() => isWatchlistView ? setIsWatchlistView(false) : setSearchTerm("")}
                  className="mt-4 text-blue-600 font-bold hover:underline"
                >
                  {isWatchlistView ? "Browse All Movies" : "Clear Search"}
                </button>
              </div>
            )}
          </>
        )}

        {showForm && (
          <div className="max-w-2xl mx-auto mb-16">
            <AddMovieForm onAddMovie={handleAddMovie} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {selectedMovie && !showForm && (
          <MovieDetail movie={selectedMovie} onBack={() => setSelectedMovie(null)} />
        )}
      </main>
    </div>
  );
}

export default App;