import React, { useState } from "react";

// Vite forwards /api requests to the backend during local development.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const AuthForm = ({ onAuthSuccess, onCancel, initialMode = "login" }) => {
  const [isRegister, setIsRegister] = useState(initialMode === "register");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on typing
  };

  const validateForm = () => {
    if (isRegister && formData.username.trim().length < 3) {
      setError("Username must be at least 3 characters long");
      return false;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      if (isRegister) {
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            username: formData.username.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || result.message);
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data));
        onAuthSuccess(result.data);
      } else {
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || result.message);
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data));
        onAuthSuccess(result.data);
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError(
        err.message === "Failed to fetch"
          ? "Cannot reach the backend. Run \"npm start\" inside the Backend folder, then try again."
          : err.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-8 max-w-md mx-auto my-8 transition-all hover:shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black mb-2 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold-200 via-gold-400 to-gold-600">
            {isRegister ? "Join Us Today" : "Welcome Back"}
          </span>
        </h2>
        <p className="text-slate-400 text-sm font-medium">
          {isRegister
            ? "Create an account to build your movie collection"
            : "Sign in to manage and view your movies"}
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-2xl text-sm font-semibold mb-6 flex items-center gap-2 animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 shrink-0 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {isRegister && (
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <input
                type="text"
                name="username"
                required
                className="w-full bg-cinema-850/70 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-gold-500/20 focus:border-gold-500/50 focus:bg-cinema-850 transition-all font-medium text-white placeholder-slate-500"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleInputChange}
                minLength={3}
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </span>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-cinema-850/70 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-gold-500/20 focus:border-gold-500/50 focus:bg-cinema-850 transition-all font-medium text-white placeholder-slate-500"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Password
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </span>
            <input
              type="password"
              name="password"
              required
              className="w-full bg-cinema-850/70 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-gold-500/20 focus:border-gold-500/50 focus:bg-cinema-850 transition-all font-medium text-white placeholder-slate-500"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              minLength={6}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-gold-400 to-gold-600 text-cinema-950 rounded-2xl py-4 font-bold shadow-lg shadow-gold-500/25 hover:shadow-xl hover:shadow-gold-500/35 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-base flex justify-center items-center"
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-cinema-950"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : isRegister ? (
            "Create Account"
          ) : (
            "Login"
          )}
        </button>

        <div className="flex flex-col gap-3 pt-2 text-center text-sm font-semibold">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-gold-400 hover:text-gold-300 hover:underline"
          >
            {isRegister
              ? "Already have an account? Sign In"
              : "Don't have an account? Register Now"}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-300 hover:underline"
          >
            Go Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
