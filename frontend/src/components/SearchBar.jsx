function SearchBar({ search, setSearch }) {
    return (
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search movies by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  }
  
  export default SearchBar;