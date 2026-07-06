import { useState } from "react";
import { Film } from "lucide-react";

function AddMovieForm({ onAddMovie }) {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [director, setDirector] = useState("");
  const [poster, setPoster] = useState("");
  const [synopsis, setSynopsis] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMovie = {
      id: Date.now(),
      title,
      genre,
      year: Number(year),
      director,
      poster,
      synopsis,
      rating: 7.0,
      cast: ["Unknown"],
    };

    onAddMovie(newMovie);

    setTitle("");
    setGenre("");
    setYear("");
    setDirector("");
    setPoster("");
    setSynopsis("");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}

        <div className="bg-gray-900 text-white p-6">
          <div className="flex items-center gap-3">
            <Film size={30} />

            <div>
              <h2 className="text-2xl font-bold">
                Add New Movie
              </h2>

              <p className="text-gray-300 text-sm">
                Fill in the movie information below.
              </p>
            </div>
          </div>
        </div>

        {/* Body */}

        <div className="p-8 space-y-6">

          <div className="grid md:grid-cols-2 gap-6">

            <input
              type="text"
              placeholder="Movie Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />

            <input
              type="text"
              placeholder="Genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />

            <input
              type="number"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />

            <input
              type="text"
              placeholder="Director"
              value={director}
              onChange={(e) => setDirector(e.target.value)}
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />

          </div>

          <input
            type="url"
            placeholder="Poster URL"
            value={poster}
            onChange={(e) => setPoster(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />

          <textarea
            placeholder="Movie Synopsis"
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            rows="5"
            className="w-full border rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              + Add Movie
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}

export default AddMovieForm;