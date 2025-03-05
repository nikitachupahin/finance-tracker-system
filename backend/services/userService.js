import { pool } from "../libs/database.js";
import { comparePassword, hashPassword } from "../libs/index.js";

export const getUserById = async (userId) => {
  if (!userId || typeof userId !== "string") {
    throw new Error("Invalid user ID");
  }

  const userExist = await pool.query({
    text: "SELECT * FROM users WHERE id = $1",
    values: [userId],
  });

  return userExist.rows[0] || null;
};

export const changeUserPassword = async (userId, currentPassword, newPassword, confirmPassword) => {
  if (newPassword !== confirmPassword) {
    throw new Error("New Passwords do not match");
  }

  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await comparePassword(currentPassword, user.password);
  if (!isMatch) {
    throw new Error("Invalid current password");
  }

  const hashedPassword = await hashPassword(newPassword);

  await pool.query({
    text: "UPDATE users SET password = $1 WHERE id = $2",
    values: [hashedPassword, userId],
  });

  return { message: "Password changed successfully" };
};

export const updateUserInfo = async (userId, name, email) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await pool.query({
    text: "UPDATE users SET name = $1, email = $2, createdat = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
    values: [name, email, userId],
  });

  updatedUser.rows[0].password = undefined;

  return updatedUser.rows[0];
};
