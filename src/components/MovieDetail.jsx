function MovieDetail({ movie }) {
    if (!movie) return null;
  
    return (
      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <h2 className="text-3xl font-bold">{movie.title}</h2>
  
        <div className="mt-3 space-y-2">
          <p>
            <strong>Genre:</strong> {movie.genre}
          </p>
  
          <p>
            <strong>Year:</strong> {movie.year}
          </p>
  
          <p>
            <strong>Director:</strong> {movie.director}
          </p>
  
          <p>
            <strong>Rating:</strong> ⭐ {movie.rating}
          </p>
  
          <p>
            <strong>Synopsis:</strong>
          </p>
  
          <p className="text-gray-700">{movie.synopsis}</p>
  
          <div className="mt-4">
            <strong>Cast:</strong>
  
            <ul className="list-disc ml-6 mt-2">
              {movie.cast.map((actor, index) => (
                <li key={index}>{actor}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
  
  export default MovieDetail;