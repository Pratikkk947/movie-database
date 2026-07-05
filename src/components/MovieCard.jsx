function MovieCard({ movie, onSelectMovie }) {
    const getBadgeColor = () => {
      if (movie.rating >= 8) return "bg-green-500";
      if (movie.rating >= 5) return "bg-yellow-500";
      return "bg-red-500";
    };
  
    return (
      <div
        onClick={() => onSelectMovie(movie)}
        className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition"
      >
        <div className="bg-gray-300 h-56 rounded flex items-center justify-center">
          Poster
        </div>
  
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
      </div>
    );
  }
  
  export default MovieCard;