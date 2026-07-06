import MovieCard from "./MovieCard";

function MovieGrid({
  movies,
  onSelectMovie,
  watchlist,
  toggleWatchlist,
}) {
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onSelectMovie={onSelectMovie}
          watchlist={watchlist}
          toggleWatchlist={toggleWatchlist}
        />
      ))}
    </div>
  );
}

export default MovieGrid;