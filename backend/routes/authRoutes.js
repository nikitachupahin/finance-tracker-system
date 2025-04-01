import express from "express";
import { signinUser, signupUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/sign-up", signupUser);
router.post("/login", signinUser);

export default router;