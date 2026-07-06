function MovieCard({
    movie,
    onSelectMovie,
    watchlist,
    toggleWatchlist,
  }) {
    const getBadgeColor = () => {
      if (movie.rating >= 8) return "bg-green-500";
      if (movie.rating >= 5) return "bg-yellow-500";
      return "bg-red-500";
    };
  
    const isInWatchlist = watchlist.some(
      (item) => item.id === movie.id
    );
  
    return (
      <div
        onClick={() => onSelectMovie(movie)}
        className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition"
      >
       <img
  src={movie.poster}
  alt={movie.title}
  className="h-72 w-full object-cover rounded-lg"
/>
  
        <h2 className="text-xl font-bold mt-4">
          {movie.title}
        </h2>
  
        <p className="text-gray-600">
          {movie.genre}
        </p>
  
        <div className="flex justify-between items-center mt-3">
          <span>{movie.year}</span>
  
          <span
            className={`${getBadgeColor()} text-white px-3 py-1 rounded-full`}
          >
            ⭐ {movie.rating}
          </span>
        </div>
  
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWatchlist(movie);
          }}
          className={`mt-4 w-full py-2 rounded text-white ${
            isInWatchlist
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isInWatchlist
            ? "Remove from Watchlist"
            : "Add to Watchlist"}
        </button>
      </div>
    );
  }
  
  export default MovieCard;