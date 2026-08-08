import { Router } from "express";
import { getRecommendations } from "../controllers/aiController.js";
import authenticate from "../middleware/auth.js";

const router = Router();

router.post("/recommend", authenticate, getRecommendations);

export default router;
