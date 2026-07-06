function Navbar({ currentPage, setCurrentPage }) {
  return (
    <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">MovieDB</h1>

      <ul className="flex gap-8">
        <li
          onClick={() => setCurrentPage("browse")}
          className={`cursor-pointer transition ${
            currentPage === "browse"
              ? "text-blue-400 font-semibold"
              : "hover:text-blue-400"
          }`}
        >
          Browse
        </li>

        <li
          onClick={() => setCurrentPage("watchlist")}
          className={`cursor-pointer transition ${
            currentPage === "watchlist"
              ? "text-blue-400 font-semibold"
              : "hover:text-blue-400"
          }`}
        >
          Watchlist
        </li>

        <li
          onClick={() => setCurrentPage("add")}
          className={`cursor-pointer transition ${
            currentPage === "add"
              ? "text-blue-400 font-semibold"
              : "hover:text-blue-400"
          }`}
        >





          Add Movie
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;