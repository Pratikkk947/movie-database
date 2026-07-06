function Dashboard({ totalMovies, averageRating }) {
    return (
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-600">
            Total Movies
          </h3>
  
          <p className="text-3xl font-bold mt-2">
            {totalMovies}
          </p>
        </div>
  
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-600">
            Average Rating
          </h3>
  
          <p className="text-3xl font-bold mt-2">
            {averageRating.toFixed(1)}
          </p>
        </div>
      </div>
    );
  }
  
  export default Dashboard;