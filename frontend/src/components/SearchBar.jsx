import { Search } from "lucide-react";

function SearchBar({ search, setSearch }) {
  return (
    <div className="mb-8">
      <div className="relative max-w-2xl mx-auto">

        <Search
          size={22}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search movies by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-14 pr-6 py-4 rounded-full border border-slate-200 bg-white shadow-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-300"
        />

      </div>
    </div>
  );
}

export default SearchBar;