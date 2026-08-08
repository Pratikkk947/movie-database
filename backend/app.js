import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import dbConnection from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

// Express Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration supporting credentials from the frontend.
// Allow any http://localhost:* dev origin plus the configured FRONTEND_URL.
app.use(cors({
    origin: (origin, callback) => {
        const allowed = process.env.FRONTEND_URL;
        if (
            !origin ||
            (allowed && allowed.split(",").includes(origin)) ||
            /^http:\/\/localhost:\d+$/.test(origin)
        ) {
            return callback(null, true);
        }
        return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));

// Connect to MongoDB
await dbConnection();

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/ai", aiRoutes);

// Fallback Route
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

export default app;