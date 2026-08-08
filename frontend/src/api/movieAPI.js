import axios from 'axios'

// Backend base URL from environment (VITE_API_URL), with a localhost fallback for development.
// Example dev:  VITE_API_URL=http://localhost:3001
// Example prod: VITE_API_URL=https://YOUR-RENDER-BACKEND-URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
})

// Request interceptor to automatically inject the JWT token if stored in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export function getMovies() {
  return api.get('/movies')
}

export function getMovieById(movieId) {
  return api.get(`/movies/${movieId}`)
}

export function createMovie(movie) {
  return api.post('/movies', movie)
}

export function updateMovie(movieId, movie) {
  return api.put(`/movies/${movieId}`, movie)
}

export function deleteMovie(movieId) {
  return api.delete(`/movies/${movieId}`)
}

export function toggleWatchlistAPI(movieId) {
  return api.post('/auth/watchlist/toggle', { movieId })
}

export function getAIRecommendations(userInput) {
  return api.post('/ai/recommend', { userInput })
}

export function addReview(movieId, review) {
  return api.post(`/movies/${movieId}/reviews`, review)
}

export function logoutAPI() {
  return api.post('/auth/logout')
}

export default api;