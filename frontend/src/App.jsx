import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import MovieGrid from "./components/MovieGrid";
import AddMovieForm from "./components/AddMovieForm";
import MovieDetail from "./components/MovieDetail";
import AuthForm from "./components/AuthForm";
import { 
  getMovies, 
  getMovieById,
  createMovie, 
  updateMovie, 
  deleteMovie, 
  toggleWatchlistAPI, 
  logoutAPI,
  getAIRecommendations 
} from "./api/movieAPI";

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  const [showAuth, setShowAuth] = useState(false);
  const [movies, setMovies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieToEdit, setMovieToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Separate state array for Watchlist
  const [watchlistIds, setWatchlistIds] = useState([]);
  const [isWatchlistView, setIsWatchlistView] = useState(false);

  // AI recommendations
  const [recommendations, setRecommendations] = useState([]);
  const [recommending, setRecommending] = useState(false);
  const [recommendPrompt, setRecommendPrompt] = useState("");

  // Dashboard stats
  const [stats, setStats] = useState({ total: 0, averageRating: 0 });

  // Fetch movies from API
  const fetchMovies = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getMovies();
      // Normalize _id to id so all child components can use movie.id or movie._id interchangeably
      const normalized = (response.data || []).map(m => ({
        ...m,
        id: m._id || m.id,
        poster: m.poster || m.image,
        year: m.year || m.releaseYear,
        synopsis: m.synopsis || m.description
      }));
      setMovies(normalized);
    } catch (err) {
      console.error("Failed to load movies:", err);
      setError("Failed to fetch movies from the server.");
    } finally {
      setLoading(false);
    }
  };

  // Sync watchlist and fetch movies when user session changes
  useEffect(() => {
    if (user) {
      setWatchlistIds(user.watchlist || []);
      fetchMovies();
    } else {
      setMovies([]);
      setWatchlistIds([]);
    }
  }, [user]);

  // Recalculate stats based on movies list
  useEffect(() => {
    const total = movies.length;
    const avg = total > 0
      ? (movies.reduce((acc, m) => acc + (Number(m.rating) || 0), 0) / total).toFixed(1)
      : 0;

    setStats({ total, averageRating: avg });
  }, [movies]);

  // Create movie
  const handleAddMovie = async (newMovie) => {
    try {
      await createMovie(newMovie);
      await fetchMovies();
      setShowForm(false);
    } catch (err) {
      console.error("Error creating movie:", err);
      alert(err.response?.data?.message || err.message || "Failed to create movie");
    }
  };

  // Update movie
  const handleUpdateMovie = async (movieId, updatedData) => {
    try {
      await updateMovie(movieId, updatedData);
      await fetchMovies();
      
      // Update selected movie details view if it was open
      if (selectedMovie && (selectedMovie._id === movieId || selectedMovie.id === movieId)) {
        const found = movies.find(m => m.id === movieId || m._id === movieId);
        if (found) {
          setSelectedMovie({ ...found, ...updatedData });
        } else {
          setSelectedMovie(null);
        }
      }
      
      setShowForm(false);
      setMovieToEdit(null);
      setSelectedMovie(null);
    } catch (err) {
      console.error("Error updating movie:", err);
      alert(err.response?.data?.message || err.message || "Failed to update movie");
    }
  };

  // Delete movie
  const handleDeleteMovie = async (movieId) => {
    try {
      await deleteMovie(movieId);
      await fetchMovies();
      setSelectedMovie(null);
    } catch (err) {
      console.error("Error deleting movie:", err);
      alert(err.response?.data?.message || err.message || "Failed to delete movie");
    }
  };

  // Toggle Watchlist persistence in database
  const toggleWatchlist = async (movie) => {
    const movieId = movie._id || movie.id;
    try {
      const response = await toggleWatchlistAPI(movieId);
      const updatedWatchlist = response.data.watchlist || [];
      setWatchlistIds(updatedWatchlist);
      
      if (user) {
        const updatedUser = { ...user, watchlist: updatedWatchlist };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (err) {
      console.error("Error updating watchlist:", err);
      alert(err.response?.data?.message || err.response?.data?.error || "Failed to update watchlist");
    }
  };

  // Log out user session
  const handleLogout = async () => {
    try {
      await logoutAPI();
    } catch (err) {
      console.error("Error during server logout request:", err);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setWatchlistIds([]);
    setIsWatchlistView(false);
    setSelectedMovie(null);
    setShowForm(false);
    setMovieToEdit(null);
    setRecommendations([]);
  };

  // Ask Groq to recommend movies based on the watchlist
  const handleRecommend = async () => {
    setRecommending(true);
    try {
      const response = await getAIRecommendations(recommendPrompt);
      setRecommendations(response.data.recommendations || []);
    } catch (err) {
      console.error("Error getting AI recommendations:", err);
      alert(err.response?.data?.message || "Failed to generate recommendations. Try again.");
    } finally {
      setRecommending(false);
    }
  };

  // Setup form states when add or edit is clicked
  const handleAddClick = () => {
    setMovieToEdit(null);
    setShowForm(!showForm);
    setSelectedMovie(null);
    setIsWatchlistView(false);
  };

  // Open a movie's detail view, fetching fresh data so reviews are available
  const handleMovieClick = async (movie) => {
    try {
      const response = await getMovieById(movie._id || movie.id);
      const detail = response.data;
      setSelectedMovie({
        ...detail,
        id: detail._id || detail.id,
        poster: detail.poster || detail.image,
        year: detail.year || detail.releaseYear,
        synopsis: detail.synopsis || detail.description,
      });
    } catch (err) {
      console.error("Failed to load movie details:", err);
      setSelectedMovie(movie);
    }
  };

  // Update the selected movie after a review is submitted
  const handleReviewUpdated = (updatedMovie) => {
    setSelectedMovie((prev) => ({
      ...prev,
      ...updatedMovie,
      reviews: updatedMovie.reviews || prev.reviews || [],
      avgRating: updatedMovie.avgRating,
    }));
  };

  const handleEditClick = (movie) => {
    setMovieToEdit(movie);
    setShowForm(true);
    setSelectedMovie(null);
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayMovies = isWatchlistView
    ? filteredMovies.filter(m => watchlistIds.includes(m._id || m.id))
    : filteredMovies;

  return (
    <div className="min-h-screen bg-cinema-950 text-slate-100 font-sans">
      <Navbar
        onAddClick={handleAddClick}
        showForm={showForm}
        onBrowse={() => {
          setIsWatchlistView(false);
          setSelectedMovie(null);
          setShowForm(false);
          setMovieToEdit(null);
          setRecommendations([]);
        }}
        onWatchlist={() => {
          setIsWatchlistView(true);
          setSelectedMovie(null);
          setShowForm(false);
          setMovieToEdit(null);
          setRecommendations([]);
        }}
        isWatchlistView={isWatchlistView}
        user={user}
        onLogin={() => setShowAuth(true)}
        onLogout={handleLogout}
      />

      {showAuth && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full">
            <AuthForm
              onAuthSuccess={(authenticatedUser) => {
                setUser(authenticatedUser);
                setWatchlistIds(authenticatedUser.watchlist || []);
                setShowAuth(false);
              }}
              onCancel={() => setShowAuth(false)}
            />
          </div>
        </div>
      )}

      <main className="container mx-auto py-10 px-4">
        {!user ? (
          <section className="card mx-auto mt-12 max-w-2xl px-8 py-16 text-center">
            <p className="text-sm font-black tracking-[0.3em] text-gold-400">MOVIE APP</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">Your movie dashboard</h2>
            <p className="mx-auto mt-4 max-w-lg text-slate-400">Log in to browse movies, manage your Watch Later list, and add movies to your collection.</p>
            <button onClick={() => setShowAuth(true)} className="mt-8 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3 font-bold text-cinema-950 shadow-lg shadow-gold-500/25 transition hover:from-gold-300 hover:to-gold-500">
              Log in to continue
            </button>
          </section>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl text-center font-semibold">
                {error}
                <button onClick={fetchMovies} className="ml-4 text-gold-400 underline">Retry</button>
              </div>
            )}

            {loading && movies.length === 0 ? (
              <div className="text-center py-20">
                <svg className="animate-spin h-10 w-10 text-gold-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-slate-400 font-medium">Loading collection...</p>
              </div>
            ) : (
              <>
                {!selectedMovie && !showForm && (
                  <>
                    <header className="mb-8 text-center relative px-4">
                      <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold-200 via-gold-400 to-gold-600">
                            Your cinema. Your story.
                          </span>
                        </h2>
                        <p className="text-slate-400 text-sm md:text-base font-medium mb-6 max-w-xl mx-auto">
                          Explore your personal collection of amazing movies.
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center mb-8">
                          <div className="bg-cinema-850/80 backdrop-blur px-5 py-3 rounded-2xl shadow-xl shadow-black/30 border border-white/[0.06] flex items-center gap-3 transition-all hover:shadow-2xl hover:-translate-y-0.5">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-cinema-950 shadow-lg shadow-gold-500/25">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                              </svg>
                            </div>
                            <div className="text-left">
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-1">Total Movies</p>
                              <p className="text-xl font-black text-white leading-none">{stats.total}</p>
                            </div>
                          </div>

                          <div className="bg-cinema-850/80 backdrop-blur px-5 py-3 rounded-2xl shadow-xl shadow-black/30 border border-white/[0.06] flex items-center gap-3 transition-all hover:shadow-2xl hover:-translate-y-0.5">
                            <div className="w-10 h-10 rounded-full bg-slate-700/80 flex items-center justify-center text-gold-400 shadow-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            </div>
                            <div className="text-left">
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-1">Avg Rating</p>
                              <p className="text-xl font-black text-white leading-none flex items-center gap-1.5">
                                {stats.averageRating} <span className="text-gold-400 text-sm">★</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="max-w-md mx-auto relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-gold-400 transition-colors pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          placeholder="Search movies..."
                          className="w-full bg-cinema-850/90 border border-white/10 rounded-2xl pl-12 pr-12 py-4 shadow-sm focus:outline-none focus:ring-4 focus:ring-gold-500/20 focus:border-gold-500/60 transition-all font-medium text-white placeholder-slate-500"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm ? (
                          <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-slate-400 rounded-full p-1 transition-all"
                            title="Clear search"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        ) : (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-gold-500/10 text-gold-400 rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-wider hidden sm:block">
                            Search
                          </div>
                        )}
                      </div>
                    </header>

                    {isWatchlistView && (
                      <div className="mb-10">
                        <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
                          <input
                            type="text"
                            value={recommendPrompt}
                            onChange={(e) => setRecommendPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleRecommend()}
                            placeholder="Tell the AI what you're in the mood for (optional)..."
                            className="flex-1 rounded-2xl bg-cinema-850/80 border border-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30"
                          />
                          <button
                            onClick={handleRecommend}
                            disabled={recommending}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3 font-bold text-cinema-950 shadow-lg shadow-gold-500/20 transition hover:from-gold-300 hover:to-gold-500 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {recommending ? (
                              <svg className="animate-spin h-5 w-5 text-cinema-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <span aria-hidden>✨</span>
                            )}
                            {recommending ? "Thinking..." : "Recommend Me Something"}
                          </button>
                        </div>
                      </div>
                    )}

                    {displayMovies.length > 0 ? (
                      <MovieGrid
                        movies={displayMovies}
                        onMovieClick={handleMovieClick}
                        onToggleWatchlist={toggleWatchlist}
                        watchlistIds={watchlistIds}
                      />
                    ) : (
                      <div className="card text-center py-20 max-w-lg mx-auto">
                        <p className="text-slate-400 text-xl font-medium">
                          {isWatchlistView ? "Your watch later list is currently empty." : "No movies found matching your search."}
                        </p>
                        <button
                          onClick={() => isWatchlistView ? setIsWatchlistView(false) : setSearchTerm("")}
                          className="mt-4 text-gold-400 font-bold hover:underline"
                        >
                          {isWatchlistView ? "Browse All Movies" : "Clear Search"}
                        </button>
                      </div>
                    )}

                    {recommendations.length > 0 && (
                      <div className="card p-6 md:p-8 mb-10">
                        <h3 className="text-2xl font-black text-white mb-1">Your AI Picks</h3>
                        <p className="text-slate-400 text-sm mb-6">Recommended from your watch later list</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          {recommendations.map((rec, i) => (
                            <div key={i} className="rounded-2xl bg-cinema-850/80 border border-white/[0.06] overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl">
                              <div className="aspect-[2/3] bg-cinema-700">
                                <img
                                  src={rec.movie.poster}
                                  alt={rec.movie.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop";
                                  }}
                                />
                              </div>
                              <div className="p-4">
                                <h4 className="font-bold text-white">{rec.movie.title}</h4>
                                <p className="text-slate-500 text-xs mb-2">{rec.movie.genre} | {rec.movie.year}</p>
                                <p className="text-slate-400 text-sm leading-relaxed">{rec.reason}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {showForm && (
                  <div className="max-w-2xl mx-auto mb-16">
                    <AddMovieForm 
                      onAddMovie={handleAddMovie} 
                      onCancel={() => {
                        setShowForm(false);
                        setMovieToEdit(null);
                      }} 
                      movieToEdit={movieToEdit}
                      onUpdateMovie={handleUpdateMovie}
                    />
                  </div>
                )}

                {selectedMovie && !showForm && (
                  <MovieDetail 
                    movie={selectedMovie} 
                    onBack={() => setSelectedMovie(null)} 
                    user={user}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteMovie}
                    onLogin={() => setShowAuth(true)}
                    onReviewUpdated={handleReviewUpdated}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;