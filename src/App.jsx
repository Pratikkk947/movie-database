import Navbar from "./components/Navbar";
import MovieGrid from "./components/MovieGrid";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-7xl mx-auto p-8">

        <h2 className="text-3xl font-bold mb-6">
          Browse Movies
        </h2>

        <MovieGrid />

      </div>

    </div>
  );
}

export default App;