import express from "express";
import authMiddleWare from "../middleware/authMiddleWare.js";

import {
  changePassword,
  getUser,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", authMiddleWare, getUser);
router.put("/change-password", authMiddleWare, changePassword);
router.put("/", authMiddleWare, updateUser);

export default router;
