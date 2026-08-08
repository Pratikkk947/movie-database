import React from "react";

const MovieCard = ({ movie, onClick, onToggleWatchlist, isWatchlisted }) => {
  const getRatingColor = (rating) => {
    if (rating >= 8) return "bg-gradient-to-br from-gold-400 to-gold-600 text-cinema-950";
    if (rating >= 5) return "bg-slate-700 text-gold-300";
    return "bg-red-500/90 text-white";
  };

  return (
    <div
      onClick={() => onClick(movie)}
      className="bg-gradient-to-b from-cinema-800 to-cinema-900 rounded-2xl shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-black/60 hover:-translate-y-2 border border-white/[0.06] overflow-hidden transition-all duration-300 h-full cursor-pointer group"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-cinema-700">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded shadow-md text-xs font-bold ${getRatingColor(movie.rating)}`}>
            {movie.rating} ★
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold truncate pr-2 text-white">{movie.title}</h3>
        </div>
        <p className="text-slate-400 text-sm mb-5">{movie.genre} | {movie.year}</p>

        {/* Watchlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent opening detail view when clicking button
            onToggleWatchlist(movie);
          }}
          className={`w-full py-2.5 rounded-xl font-bold transition-all duration-200 ${
            isWatchlisted
              ? "bg-gold-500/10 text-gold-300 border border-gold-500/25 hover:bg-gold-500/20"
              : "bg-gradient-to-r from-gold-400 to-gold-600 text-cinema-950 hover:from-gold-300 hover:to-gold-500 shadow-lg shadow-gold-500/15 hover:shadow-gold-500/25"
          }`}
        >
          {isWatchlisted ? "Remove from Watch Later" : "Add to Watch Later"}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
