import { Calendar, Film, Star, User } from "lucide-react";

function MovieDetail({ movie }) {
  if (!movie) return null;

  return (
    <div className="mt-12 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">

      <div className="grid lg:grid-cols-3">

        {/* Poster */}

        <div className="bg-slate-100 flex items-center justify-center p-8">

          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full max-w-xs rounded-2xl shadow-2xl object-cover"
          />

        </div>

        {/* Details */}

        <div className="lg:col-span-2 p-10">

          {/* Title */}

          <div className="flex justify-between items-start">

            <div>

              <h2 className="text-4xl font-bold text-slate-900">
                {movie.title}
              </h2>

              <p className="text-slate-500 mt-2">
                {movie.genre}
              </p>

            </div>

            <div className="bg-amber-400 text-white px-5 py-2 rounded-full flex items-center gap-2 shadow-md">
              <Star size={18} fill="white" />
              <span className="font-semibold">
                {movie.rating}
              </span>
            </div>

          </div>

          {/* Movie Info */}

          <div className="grid md:grid-cols-2 gap-6 mt-8">

            <div className="flex items-center gap-3">
              <Calendar className="text-indigo-600" />
              <div>
                <p className="text-sm text-slate-500">
                  Release Year
                </p>
                <p className="font-semibold">
                  {movie.year}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Film className="text-indigo-600" />
              <div>
                <p className="text-sm text-slate-500">
                  Director
                </p>
                <p className="font-semibold">
                  {movie.director}
                </p>
              </div>
            </div>

          </div>

          {/* Synopsis */}

          <div className="mt-10">

            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Synopsis
            </h3>

            <p className="text-slate-600 leading-8">
              {movie.synopsis}
            </p>

          </div>

          {/* Cast */}

          <div className="mt-10">

            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Cast
            </h3>

            <div className="flex flex-wrap gap-3">

              {movie.cast.map((actor, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full border border-indigo-100"
                >
                  <User size={16} />
                  {actor}
                </div>
              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default MovieDetail;