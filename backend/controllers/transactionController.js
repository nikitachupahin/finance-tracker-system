import * as transactionService from "../services/transactionService.js";

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

export const deleteTransaction = async (req, res) => {
  try {
    const userId = req.body.user?.userId;
    const { transactionId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!transactionId) {
      return res.status(400).json({ message: "Transaction ID is required" });
    }

    const deletedTransaction = await transactionService.deleteTransaction(userId, transactionId);

    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found or not authorized to delete" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
