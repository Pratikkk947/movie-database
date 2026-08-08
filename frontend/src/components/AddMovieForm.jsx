import React, { useState, useEffect } from "react";

const InputWrapper = ({ icon, children, label }) => (
  <div className="space-y-1.5 flex-1">
    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
      <span>{icon}</span> {label}
    </label>
    <div className="relative group">
      {children}
    </div>
  </div>
);

const AddMovieForm = ({ onAddMovie, onCancel, movieToEdit, onUpdateMovie }) => {
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    year: "",
    director: "",
    synopsis: "",
    poster: ""
  });

  // Pre-populate if editing
  useEffect(() => {
    if (movieToEdit) {
      setFormData({
        title: movieToEdit.title || "",
        genre: movieToEdit.genre || "",
        year: movieToEdit.year || movieToEdit.releaseYear || "",
        director: movieToEdit.director || "",
        synopsis: movieToEdit.synopsis || movieToEdit.description || "",
        poster: movieToEdit.poster || movieToEdit.image || ""
      });
    }
  }, [movieToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // basic validation
    if (!formData.title || !formData.genre) {
      return alert("Please fill at least Title and Genre");
    }
    
    const payload = {
      ...formData,
      year: Number(formData.year) || new Date().getFullYear(),
      poster: formData.poster || "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop"
    };

    if (movieToEdit) {
      onUpdateMovie(movieToEdit._id || movieToEdit.id, payload);
    } else {
      onAddMovie({ 
        ...payload, 
        rating: 5.0, // Default rating for new movies
      });
    }
  };

  return (
    <div className="card p-8 max-w-2xl mx-auto my-4 transition-all duration-300">
      <header className="mb-8 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
          <span className="text-3xl">{movieToEdit ? "✏️" : "🎬"}</span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            {movieToEdit ? "Edit Movie" : "Add New Movie"}
          </h2>
        </div>
        <p className="text-slate-400 font-medium ml-0 sm:ml-12">
          {movieToEdit ? "Update details for this movie." : "Fill in the details below to add a new movie."}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          {/* Movie Title */}
          <InputWrapper icon="🎬" label="Movie Title">
            <input 
              type="text" 
              placeholder="e.g. Inception" 
              required
              className="w-full bg-cinema-850/70 border border-white/10 rounded-xl px-4 py-3 focus:bg-cinema-850 focus:outline-none focus:ring-4 focus:ring-gold-500/20 focus:border-gold-500/50 transition-all font-medium text-white placeholder-slate-500"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </InputWrapper>

          {/* Genre */}
          <InputWrapper icon="🏷" label="Genre">
            <select 
              required
              className="w-full bg-cinema-850/70 border border-white/10 rounded-xl px-4 py-3 focus:bg-cinema-850 focus:outline-none focus:ring-4 focus:ring-gold-500/20 focus:border-gold-500/50 transition-all font-medium text-white [&>option]:bg-cinema-800"
              value={formData.genre}
              onChange={(e) => setFormData({...formData, genre: e.target.value})}
            >
              <option value="" className="bg-cinema-800">Select a Genre</option>
              <option value="Sci-Fi/Drama">Sci-Fi/Drama</option>
              <option value="Sci-Fi/Thriller">Sci-Fi/Thriller</option>
              <option value="Biography/Drama">Biography/Drama</option>
              <option value="Action/Crime">Action/Crime</option>
              <option value="Sci-Fi/Adventure">Sci-Fi/Adventure</option>
              <option value="Romance/Action">Romance/Action</option>
              <option value="Romance/Drama">Romance/Drama</option>
              <option value="Action/Drama">Action/Drama</option>
              <option value="Comedy/Drama">Comedy/Drama</option>
              <option value="Action/Thriller">Action/Thriller</option>
            </select>
          </InputWrapper>

          {/* Year and Director Row */}
          <div className="flex flex-col sm:flex-row gap-6">
            <InputWrapper icon="📅" label="Release Year">
              <input 
                type="number" 
                placeholder="2024" 
                className="w-full bg-cinema-850/70 border border-white/10 rounded-xl px-4 py-3 focus:bg-cinema-850 focus:outline-none focus:ring-4 focus:ring-gold-500/20 focus:border-gold-500/50 transition-all font-medium text-white placeholder-slate-500"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
              />
            </InputWrapper>
            <InputWrapper icon="👤" label="Director">
              <input 
                type="text" 
                placeholder="Christopher Nolan" 
                className="w-full bg-cinema-850/70 border border-white/10 rounded-xl px-4 py-3 focus:bg-cinema-850 focus:outline-none focus:ring-4 focus:ring-gold-500/20 focus:border-gold-500/50 transition-all font-medium text-white placeholder-slate-500"
                value={formData.director}
                onChange={(e) => setFormData({...formData, director: e.target.value})}
              />
            </InputWrapper>
          </div>

          {/* Poster URL */}
          <InputWrapper icon="🔗" label="Poster Image URL">
            <input 
              type="text" 
              placeholder="https://example.com/poster.jpg" 
              className="w-full bg-cinema-850/70 border border-white/10 rounded-xl px-4 py-3 focus:bg-cinema-850 focus:outline-none focus:ring-4 focus:ring-gold-500/20 focus:border-gold-500/50 transition-all font-medium text-white placeholder-slate-500"
              value={formData.poster}
              onChange={(e) => setFormData({...formData, poster: e.target.value})}
            />
          </InputWrapper>

          {/* Synopsis */}
          <InputWrapper icon="📝" label="Synopsis / Description">
            <textarea 
              placeholder="A brief description of the movie..." 
              className="w-full bg-cinema-850/70 border border-white/10 rounded-xl px-4 py-3 h-32 focus:bg-cinema-850 focus:outline-none focus:ring-4 focus:ring-gold-500/20 focus:border-gold-500/50 transition-all font-medium text-white placeholder-slate-500 resize-none"
              value={formData.synopsis}
              onChange={(e) => setFormData({...formData, synopsis: e.target.value})}
            />
          </InputWrapper>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button 
            type="submit" 
            className="flex-1 bg-gradient-to-r from-gold-400 to-gold-600 text-cinema-950 py-4 rounded-xl font-bold hover:from-gold-300 hover:to-gold-500 hover:shadow-lg hover:shadow-gold-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
          >
            <span>💾</span> {movieToEdit ? "Update Movie" : "Save Movie"}
          </button>
          <button 
            type="button" 
            onClick={onCancel} 
            className="flex-1 bg-white/[0.06] text-slate-300 py-4 rounded-xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMovieForm;
