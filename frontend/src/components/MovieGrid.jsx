import React from "react";
import MovieCard from "./MovieCard";

const MovieGrid = ({ movies, onMovieClick, onToggleWatchlist, watchlistIds }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 p-4">
      {movies.map((movie) => (
        <MovieCard 
          key={movie.id} 
          movie={movie} 
          onClick={onMovieClick}
          onToggleWatchlist={onToggleWatchlist}
          isWatchlisted={watchlistIds.includes(movie.id)}
        />
      ))}
    </div>
  );
};

export default MovieGrid;