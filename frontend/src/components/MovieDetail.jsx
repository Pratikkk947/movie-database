import React, { useState } from "react";
import { addReview } from "../api/movieAPI";

const MovieDetail = ({ movie, onBack, user, onEdit, onDelete, onLogin, onReviewUpdated }) => {
  // Check authorization: User must be an admin, or the creator of the movie (represented by ID or populated object)
  const isAuthorized = user && (
    user.isAdmin ||
    (movie.createdBy && (movie.createdBy === user._id || movie.createdBy._id === user._id))
  );

  // Review form state
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const reviews = movie.reviews || [];
  const avgRating = movie.avgRating || 0;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");

    // Validate rating (1-5) and non-empty comment on the client too
    const ratingNum = Number(rating);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5 || !Number.isInteger(ratingNum)) {
      setReviewError("Please choose a rating between 1 and 5.");
      return;
    }
    if (!comment.trim()) {
      setReviewError("Please write a comment.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await addReview(movie._id || movie.id, {
        rating: ratingNum,
        comment: comment.trim(),
      });
      // Refresh movie details and clear the form on success
      onReviewUpdated(response.data.movie);
      setRating("");
      setComment("");
      setReviewSuccess("Your review was added successfully!");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Failed to submit review. Try again.";
      if (err.response?.status === 401) {
        setReviewError("Please log in to submit a review.");
      } else {
        setReviewError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "";

  return (
    <div className="card overflow-hidden max-w-4xl mx-auto my-10 animate-fade-in translate-y-0 transition-all">
      <div className="md:flex">
        {/* Poster Section */}
        <div className="md:w-1/3">
          <img
            src={movie.poster || movie.image}
            alt={movie.title}
            className="w-full h-full object-cover min-h-[400px]"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop";
            }}
          />
        </div>

        {/* Content Section */}
        <div className="md:w-2/3 p-8 flex flex-col">
          <button
            onClick={onBack}
            className="text-gold-400 font-bold mb-6 flex items-center hover:underline group self-start"
          >
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
            Back to Collection
          </button>

          <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">
            {movie.title}
          </h2>

          <div className="flex gap-4 items-center mb-8 flex-wrap">
            <span className="bg-gold-500/10 text-gold-300 px-4 py-1 rounded-full text-sm font-bold border border-gold-500/25">
              {movie.year || movie.releaseYear}
            </span>
            <span className="bg-white/[0.06] text-slate-300 px-4 py-1 rounded-full text-sm font-bold border border-white/10">
              {movie.genre}
            </span>
            <span className="text-gold-400 font-black text-2xl">
              ★ {movie.rating}
            </span>
          </div>

          <div className="space-y-6 flex-1">
            <div>
               <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Director</h3>
               <p className="text-xl font-bold text-slate-200">{movie.director || "Unknown Director"}</p>
            </div>

            <div>
               <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Synopsis</h3>
               <p className="text-slate-400 leading-relaxed text-lg">
                  {movie.synopsis || movie.description || "No detailed synopsis available for this title yet."}
               </p>
            </div>

            <div>
               <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Created By</h3>
               <p className="text-slate-400 font-medium">
                  {movie.createdBy && typeof movie.createdBy === 'object' ? movie.createdBy.username : "System"}
               </p>
            </div>
          </div>

          {/* Authorization Check Actions */}
          {isAuthorized && (
            <div className="flex gap-4 mt-8 pt-6 border-t border-white/[0.06]">
              <button
                onClick={() => onEdit(movie)}
                className="bg-gold-500/15 hover:bg-gold-500/25 text-gold-300 border border-gold-500/25 font-bold px-6 py-3 rounded-xl shadow-md transition-all active:scale-[0.98] text-sm flex items-center gap-2"
              >
                <span>✏️</span> Edit Movie
              </button>
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${movie.title}"?`)) {
                    onDelete(movie._id || movie.id);
                  }
                }}
                className="bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/25 font-bold px-6 py-3 rounded-xl shadow-md transition-all active:scale-[0.98] text-sm flex items-center gap-2"
              >
                <span>🗑️</span> Delete Movie
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="p-8 pt-0">
        <div className="border-t border-white/[0.06] pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h3 className="text-2xl font-black text-white tracking-tight">Reviews</h3>
            {reviews.length > 0 && (
              <span className="text-slate-400 text-sm font-medium">
                Community Rating:{" "}
                <span className="text-gold-400 font-black text-lg">★ {avgRating.toFixed(1)}</span>
                <span className="text-slate-500"> ({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
              </span>
            )}
          </div>

          {/* Review Form / Login prompt */}
          {user ? (
            <form onSubmit={handleReviewSubmit} className="card p-5 mb-8 space-y-4">
              <div className="flex flex-wrap items-end gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Your Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="bg-cinema-850/70 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-gold-500/20 focus:border-gold-500/50 transition-all font-medium text-white [&>option]:bg-cinema-800"
                  >
                    <option value="" className="bg-cinema-800">Select rating</option>
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n} className="bg-cinema-800">{n} ★</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Your Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you think of this movie?"
                  className="w-full bg-cinema-850/70 border border-white/10 rounded-xl px-4 py-3 h-24 focus:outline-none focus:ring-4 focus:ring-gold-500/20 focus:border-gold-500/50 transition-all font-medium text-white placeholder-slate-500 resize-none"
                />
              </div>

              {reviewError && (
                <p className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-2 rounded-xl text-sm font-semibold">
                  {reviewError}
                </p>
              )}
              {reviewSuccess && (
                <p className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-xl text-sm font-semibold">
                  {reviewSuccess}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-gold-400 to-gold-600 text-cinema-950 px-6 py-3 rounded-xl font-bold shadow-lg shadow-gold-500/20 hover:from-gold-300 hover:to-gold-500 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          ) : (
            <div className="card p-5 mb-8 text-center">
              <p className="text-slate-400 font-medium mb-3">Log in to submit a review for this movie.</p>
              <button
                onClick={onLogin}
                className="bg-gradient-to-r from-gold-400 to-gold-600 text-cinema-950 px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-gold-500/20 hover:from-gold-300 hover:to-gold-500 transition-all"
              >
                Log in to Review
              </button>
            </div>
          )}

          {/* Existing Reviews */}
          {reviews.length > 0 ? (
            <ul className="space-y-4">
              {reviews.map((review, i) => (
                <li key={i} className="bg-cinema-850/80 border border-white/[0.06] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-cinema-950 font-black flex items-center justify-center text-sm shadow-md">
                        {((review.user && review.user.username) || "U").charAt(0).toUpperCase()}
                      </span>
                      <span className="font-bold text-white">
                        {review.user && review.user.username ? review.user.username : "User"}
                      </span>
                    </div>
                    <span className="text-gold-400 font-black">★ {review.rating}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{review.comment}</p>
                  {review.createdAt && (
                    <p className="text-slate-500 text-xs mt-2">{formatDate(review.createdAt)}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-sm text-center py-4">No reviews yet. Be the first to review this movie!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
