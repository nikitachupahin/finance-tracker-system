import * as transactionService from "../services/transactionService.js";
import validateTransaction from "../schemas/transactionSchema.js";
import express from "express";

const router = express.Router();

export const createTransaction = async (req, res) => {
  try {
    const userId = req.body.user?.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const { amount, type, category, description } = req.body;
    const transaction = await transactionService.createTransaction(
      userId,
      amount,
      type,
      category,
      description
    );
    res.status(201).json({ message: "Transaction created", transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserTransactions = async (req, res) => {
  try {
    const userId = req.body.user?.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const { type, category } = req.query;
    const transactions = await transactionService.getUserTransactions(
      userId,
      type,
      category
    );
    res.status(200).json({ transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserSummary = async (req, res) => {
  try {
    const userId = req.body.user?.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const summary = await transactionService.getUserSummary(userId);
    res.status(200).json({ summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

router.post("/transactions", validateTransaction, createTransaction);
router.get("/transactions", getUserTransactions);
router.get("/transactions/summary", getUserSummary);

export default router;
