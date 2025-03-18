import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import * as goalController from "../controllers/goalController.js";

const router = express.Router();

router.post("/", authMiddleware, goalController.createGoal);
router.get("/:userId", authMiddleware, goalController.getUserGoals);
router.put("/:id", authMiddleware, goalController.updateGoal);

export default router;
