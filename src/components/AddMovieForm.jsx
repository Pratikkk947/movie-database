import { useState } from "react";

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
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow mb-8"
    >
      <h2 className="text-2xl font-bold mb-4">
        Add Movie
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Movie Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Director"
          value={director}
          onChange={(e) => setDirector(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="url"
          placeholder="Poster URL"
          value={poster}
          onChange={(e) => setPoster(e.target.value)}
          className="border p-2 rounded md:col-span-2"
          required
        />
      </div>

      <textarea
        placeholder="Synopsis"
        value={synopsis}
        onChange={(e) => setSynopsis(e.target.value)}
        className="border p-2 rounded w-full mt-4"
        rows="4"
        required
      />

      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
      >
        Add Movie
      </button>
    </form>
  );
}

export default AddMovieForm;