import React from "react";

const Navbar = ({ onAddClick, showForm, onBrowse, onWatchlist, isWatchlistView, user, onLogin, onLogout }) => {
  return (
    <nav className="bg-cinema-900/80 backdrop-blur-xl border-b border-white/[0.06] p-4 flex justify-between items-center sticky top-0 z-50">
      <h1
        onClick={onBrowse}
        className="text-xl font-display font-extrabold tracking-tight cursor-pointer text-gradient-gold"
      >
        MOVIE APP
      </h1>

      <div className="flex items-center gap-6">
        {user && <div className="hidden md:flex space-x-6 font-medium">
          <button
            onClick={onBrowse}
            className={`transition-colors ${!isWatchlistView && !showForm ? "text-gold-400 font-bold" : "text-slate-400 hover:text-slate-200"}`}
          >
            Browse
          </button>
          <button
            onClick={onWatchlist}
            className={`transition-colors ${isWatchlistView ? "text-gold-400 font-bold" : "text-slate-400 hover:text-slate-200"}`}
          >
            Watch Later
          </button>
        </div>}

        {user && (
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-cinema-950 font-black flex items-center justify-center text-sm shadow-md">
              {(user.username?.[0] || "U").toUpperCase()}
            </span>
            <span className="text-sm font-bold text-slate-200">{user.username}</span>
          </div>
        )}

        {user && <button
          onClick={onAddClick}
          className={`${showForm ? "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25" : "bg-gradient-to-r from-gold-400 to-gold-600 text-cinema-950 hover:from-gold-300 hover:to-gold-500"
            } px-4 py-1.5 rounded-lg font-bold transition-all shadow-sm text-sm`}
        >
          {showForm ? "Close Form" : "+ Add Movie"}
        </button>}
        {user ? (
          <button
            onClick={onLogout}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Log out
          </button>
        ) : (
          <button
            onClick={onLogin}
            className="rounded-lg bg-gradient-to-r from-gold-400 to-gold-600 px-4 py-1.5 text-xs font-bold text-cinema-950 transition hover:from-gold-300 hover:to-gold-500 shadow-lg shadow-gold-500/20"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
