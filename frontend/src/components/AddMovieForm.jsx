import { useState } from "react";
import {
  Film,
  Calendar,
  User,
  Image,
  FileText,
  Tag,
} from "lucide-react";

function AddMovieForm({ onAddMovie }) {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [director, setDirector] = useState("");
  const [poster, setPoster] = useState("");
  const [synopsis, setSynopsis] = useState("");

  const clearForm = () => {
    setTitle("");
    setGenre("");
    setYear("");
    setDirector("");
    setPoster("");
    setSynopsis("");
  };

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

    clearForm();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
      >
        {/* Header */}

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6">

          <div className="flex items-center gap-4">

            <Film size={38} />

            <div>

              <h2 className="text-3xl font-bold">
                Add New Movie
              </h2>

              <p className="text-indigo-100">
                Fill in the movie details below.
              </p>

            </div>

          </div>

        </div>

        {/* Body */}

        <div className="grid lg:grid-cols-3 gap-10 p-8">

          {/* Form */}

          <div className="lg:col-span-2 space-y-6">

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="font-semibold mb-2 flex items-center gap-2">
                  <Film size={16} />
                  Movie Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Inception"
                  className="w-full border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold mb-2 flex items-center gap-2">
                  <Tag size={16} />
                  Genre
                </label>

                <input
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  placeholder="Sci-Fi"
                  className="w-full border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Year
                </label>

                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2025"
                  className="w-full border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold mb-2 flex items-center gap-2">
                  <User size={16} />
                  Director
                </label>

                <input
                  type="text"
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                  placeholder="Christopher Nolan"
                  className="w-full border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

            </div>

            <div>

              <label className="font-semibold mb-2 flex items-center gap-2">
                <Image size={16} />
                Poster URL
              </label>

              <input
                type="url"
                value={poster}
                onChange={(e) => setPoster(e.target.value)}
                placeholder="https://..."
                className="w-full border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500"
                required
              />

            </div>

            <div>

              <label className="font-semibold mb-2 flex items-center gap-2">
                <FileText size={16} />
                Synopsis
              </label>

              <textarea
                rows="6"
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-4 resize-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Write a short movie description..."
                required
              />

            </div>

            <div className="flex justify-end gap-4">

              <button
                type="button"
                onClick={clearForm}
                className="px-7 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition"
              >
                + Add Movie
              </button>

            </div>

          </div>

          {/* Poster Preview */}

          <div>

            <h3 className="font-bold text-xl mb-4">
              Poster Preview
            </h3>

            <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">

              {poster ? (
                <img
                  src={poster}
                  alt="Poster Preview"
                  className="w-full h-[520px] object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="h-[520px] flex items-center justify-center text-slate-400">
                  No Poster Selected
                </div>
              )}

            </div>

          </div>

        </div>

      </form>
    </div>
  );
}

export default AddMovieForm;