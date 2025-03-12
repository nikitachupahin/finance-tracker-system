import { pool } from "../libs/database.js";
import { v4 as uuidv4 } from "uuid";

export const createTransaction = async (userId, amount, type, category, description) => {
  const transaction = await pool.query({
    text: `INSERT INTO transactions (id, user_id, amount, type, category, description, transaction_date) 
           VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
    values: [uuidv4(), userId, amount, type, category, description],
  });
  return transaction.rows[0];
};

export const getUserTransactions = async (userId, filterType, category) => {
  let query = `SELECT * FROM transactions WHERE user_id = $1`;
  let values = [userId];

  if (filterType) {
    query += ` AND type = $2`;
    values.push(filterType);
  }

  if (category) {
    query += ` AND category = $${values.length + 1}`;
    values.push(category);
  }

  const transactions = await pool.query({ text: query, values });
  return transactions.rows;
};

export const getUserSummary = async (userId) => {
  const summary = await pool.query({
    text: `SELECT 
             SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
             SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
           FROM transactions WHERE user_id = $1`,
    values: [userId],
  });
  return summary.rows[0];
};

export const deleteTransaction = async (userId, transactionId) => {
  const result = await pool.query({
    text: `DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *`,
    values: [transactionId, userId],
  });

  return result.rowCount > 0;
};
