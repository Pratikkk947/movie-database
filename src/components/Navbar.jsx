function Navbar() {
    return (
      <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between">
        <h1 className="text-2xl font-bold">MovieDB</h1>
  
        <ul className="flex gap-8">
          <li className="cursor-pointer hover:text-blue-400">Browse</li>
          <li className="cursor-pointer hover:text-blue-400">Watchlist</li>
          <li className="cursor-pointer hover:text-blue-400">Add Movie</li>
        </ul>
      </nav>
    );
  }
  
  export default Navbar;