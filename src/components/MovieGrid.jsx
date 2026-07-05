import MovieCard from "./MovieCard";
import movies from "../data/movies";

function MovieGrid() {
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
        />
      ))}
    </div>
  );
}

export default MovieGrid;