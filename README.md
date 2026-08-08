# Movie Database

A full-stack movie collection app with user accounts, watchlists, and AI-powered recommendations.

## Features

- **User authentication** — register / login / logout with JWT stored in an HTTP-only cookie
- **Movie library** — browse, search, add, edit, and delete movies (only admins or the movie's creator can edit/delete)
- **Server-side filtering** — filter movies by genre and search titles directly in MongoDB (`GET /api/movies?genre=Action&search=batman`)
- **Watch Later list** — add/remove movies from your personal watchlist
- **Reviews** — logged-in users can rate (1–5) and review movies; the average rating is recalculated from all reviews
- **AI recommendations** — the "Recommend Me Something" button on the Watch Later page asks Groq to pick 3 movies you'd enjoy, based on your watchlist and favourite genres, with reasons
- **Dark cinema UI** — premium near-black theme with gold accents

## Tech Stack

| Layer     | Tech                                     |
| --------- | ---------------------------------------- |
| Frontend  | React 19, Vite, Tailwind CSS v4, Axios   |
| Backend   | Node.js, Express 5, Mongoose             |
| Database  | MongoDB Atlas                            |
| Auth      | bcrypt + JSON Web Tokens (HTTP-only cookies) |
| AI        | Groq (Llama) API                         |

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster
- A Groq API key from [Groq Console](https://console.groq.com/keys)

### Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in your values
npm run dev
```

`backend/.env`:

```
PORT=3001
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/MovieDatabase?appName=MovieDatabase
JWT_SECRET=<long random string>
GROQ_API_KEY=<your Groq API key>
GROQ_MODEL=llama-3.3-70b-versatile
FRONTEND_URL=http://localhost:5173
NODE_ENV=dev
```

> **Note:** `backend/.env` is git-ignored. Never commit real credentials.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. `frontend/.env` can override the backend URL:

```
VITE_API_URL=http://localhost:3001
```

## API Endpoints

| Method | Endpoint              | Auth | Description                                      |
| ------ | --------------------- | ---- | ------------------------------------------------ |
| POST   | `/api/auth/register`  | –    | Create an account                                |
| POST   | `/api/auth/login`     | –    | Log in (sets cookie, returns user + token)       |
| POST   | `/api/auth/logout`    | –    | Log out (clears cookie)                          |
| POST   | `/api/auth/watchlist/toggle` | ✅ | Add/remove a movie from the watchlist     |
| GET    | `/api/movies`         | –    | List all movies                                  |
| GET    | `/api/movies?genre=Action` | – | List movies filtered by genre (MongoDB)    |
| GET    | `/api/movies?search=matrix` | – | Search movies by title (MongoDB, case-insensitive) |
| GET    | `/api/movies/:id`     | –    | Get a single movie (includes populated reviews)  |
| POST   | `/api/movies`         | ✅   | Create a movie                                   |
| PUT    | `/api/movies/:id`     | ✅   | Update a movie (creator or admin)                |
| DELETE | `/api/movies/:id`     | ✅   | Delete a movie (creator or admin)                |
| POST   | `/api/movies/:id/reviews` | ✅ | Submit a review `{ "rating": 5, "comment": "..." }` (rating 1–5) |
| POST   | `/api/ai/recommend`   | ✅   | Groq-based movie recommendations from watchlist   |

### Seeding sample movies

```bash
cd backend
node data/movies.js
```

> This **wipes** the existing `Movie` collection and inserts the sample list. Run with care.

## Deployment (Render + Netlify)

### Backend → Render

- Build command: `npm install`
- Start command: `node server.js`
- Environment variables (set in Render dashboard, never in code):

```
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=<long random string>
GROQ_API_KEY=<your Groq API key>
FRONTEND_URL=<your Netlify URL>
NODE_ENV=production
```

### Frontend → Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL=https://<your-render-backend-url>`

The `frontend/public/_redirects` file (`/* /index.html 200`) enables SPA routing on Netlify.

## CI (GitHub Actions)

The `.github/workflows/ci.yml` workflow runs on every push/PR to `main`. It builds the frontend, installs backend dependencies, and verifies the backend starts and serves against a CI MongoDB service container. No production secrets are required or stored in the workflow.

## Live URL

_Add your deployed URL here when you deploy._

## Screenshots

_Add screenshots to a `screenshots/` folder and reference them here, e.g.:_

![Home](screenshots/home.png)
![Recommendations](screenshots/recommendations.png)
