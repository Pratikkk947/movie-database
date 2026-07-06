import { Calendar, Heart, Star, Tag } from "lucide-react";

function MovieCard({
  movie,
  onSelectMovie,
  watchlist,
  toggleWatchlist,
}) {
  const getBadgeColor = () => {
    if (movie.rating >= 8)
      return "bg-green-500";

    if (movie.rating >= 5)
      return "bg-amber-500";

    return "bg-red-500";
  };

  const isInWatchlist = watchlist.some(
    (item) => item.id === movie.id
  );

  return (
    <div
      onClick={() => onSelectMovie(movie)}
      className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      {/* Poster */}

      <div className="relative overflow-hidden">

        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-80 object-cover group-hover:scale-105 transition duration-500"
        />

        {/* Rating */}

        <div
          className={`absolute top-4 right-4 ${getBadgeColor()} text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg`}
        >
          <Star size={14} fill="white" />
          {movie.rating}
        </div>

      </div>

      {/* Content */}

      <div className="p-5">

        <h2 className="text-xl font-bold text-slate-900 line-clamp-1">
          {movie.title}
        </h2>

        <div className="flex items-center gap-2 mt-3 text-slate-500 text-sm">
          <Tag size={16} />

          <span>{movie.genre}</span>
        </div>

        <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
          <Calendar size={16} />

          <span>{movie.year}</span>
        </div>

        {/* Button */}

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWatchlist(movie);
          }}
          className={`mt-6 w-full flex items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all duration-300

          ${
            isInWatchlist
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          <Heart
            size={18}
            fill={isInWatchlist ? "white" : "none"}
          />

          {isInWatchlist
            ? "Remove from Watchlist"
            : "Add to Watchlist"}
        </button>

      </div>
    </div>
  );
}

export default MovieCard;