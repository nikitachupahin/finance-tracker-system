import express from "express";
import authMiddleware from "../middleware/authMiddleWare.js";
import * as transactionController from "../controllers/transactionController.js";
import { validateTransaction } from "../libs/validation.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateTransaction,
  transactionController.createTransaction
);
router.get("/", authMiddleware, transactionController.getUserTransactions);
router.get("/summary", authMiddleware, transactionController.getUserSummary);

export default router;
