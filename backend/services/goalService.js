import { pool } from "../libs/database.js";
import { v4 as uuidv4 } from "uuid";

export const createGoal = async (userId, goalName, targetAmount, currentAmount, deadline) => {
  const result = await pool.query({
    text: `INSERT INTO goals (id, user_id, goal_name, target_amount, current_amount, deadline) 
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    values: [uuidv4(), userId, goalName, targetAmount, currentAmount, deadline],
  });
  return result.rows[0];
};

export const getUserGoals = async (userId) => {
  const result = await pool.query({
    text: `SELECT * FROM goals WHERE user_id = $1`,
    values: [userId],
  });
  return result.rows;
};

export const updateGoal = async (goalId, userId, updates) => {
  const { goal_name, target_amount, current_amount, deadline, status } = updates;

  const result = await pool.query({
    text: `UPDATE goals SET 
              goal_name = COALESCE($1, goal_name),
              target_amount = COALESCE($2, target_amount),
              current_amount = COALESCE($3, current_amount),
              deadline = COALESCE($4, deadline),
              status = COALESCE($5, status)
           WHERE id = $6 AND user_id = $7 RETURNING *`,
    values: [goal_name, target_amount, current_amount, deadline, status, goalId, userId],
  });

  return result.rows[0];
};
