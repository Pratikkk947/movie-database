import { Film, Star } from "lucide-react";

function Dashboard({ totalMovies, averageRating }) {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-10">

      {/* Total Movies */}

      <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-7 hover:shadow-2xl transition-all duration-300">

        <div className="flex justify-between items-center">

          <div>

            <p className="text-slate-500 text-sm uppercase tracking-wide">
              Total Movies
            </p>

            <h2 className="text-5xl font-bold mt-3 text-slate-900">
              {totalMovies}
            </h2>

          </div>

          <div className="bg-indigo-100 p-5 rounded-2xl">
            <Film className="text-indigo-600" size={34} />
          </div>

        </div>

      </div>

      {/* Average Rating */}

      <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-7 hover:shadow-2xl transition-all duration-300">

        <div className="flex justify-between items-center">

          <div>

            <p className="text-slate-500 text-sm uppercase tracking-wide">
              Average Rating
            </p>

            <h2 className="text-5xl font-bold mt-3 text-slate-900">
              ⭐ {averageRating.toFixed(1)}
            </h2>

          </div>

          <div className="bg-amber-100 p-5 rounded-2xl">
            <Star className="text-amber-500" size={34} />
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;