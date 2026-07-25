import express from "express";
import cors from "cors";
import SAMPLE_MOVIES from "./data/movies.js";
import dotenv from "dotenv";
import movieRouter from "./src/routes/movieRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import dbConnection from './src/config/db.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Mount the movie router under /movies

app.use("/movies", movieRouter);
app.use("/auth", authRoutes);

await dbConnection()

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});