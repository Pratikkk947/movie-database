import { Film, Heart, PlusCircle } from "lucide-react";

function Navbar({ currentPage, setCurrentPage }) {
  const navItems = [
    {
      id: "browse",
      label: "Browse",
      icon: <Film size={18} />,
    },
    {
      id: "watchlist",
      label: "Watchlist",
      icon: <Heart size={18} />,
    },
    {
      id: "add",
      label: "Add Movie",
      icon: <PlusCircle size={18} />,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">

        {/* Logo */}

        <div className="flex items-center gap-3">

          <div className="bg-indigo-600 text-white p-3 rounded-xl shadow-lg">
            <Film size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              MovieDB
            </h1>

            <p className="text-sm text-slate-500">
              Movie Collection
            </p>
          </div>

        </div>

        {/* Navigation */}

        <ul className="flex items-center gap-4">

          {navItems.map((item) => (

            <li
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full cursor-pointer transition-all duration-300 font-medium

              ${
                currentPage === item.id
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
              }`}
            >
              {item.icon}

              {item.label}

            </li>

          ))}

        </ul>

      </div>
    </nav>
  );
}

export default Navbar;