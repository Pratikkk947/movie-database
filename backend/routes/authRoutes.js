import { Router } from "express";
import { registerUser, loginUser, logoutUser, toggleWatchlist } from "../controllers/authController.js";
import authenticate from "../middleware/auth.js";

const router = Router();

router.post("/register", registerUser);             
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/watchlist/toggle", authenticate, toggleWatchlist);

export default router;
