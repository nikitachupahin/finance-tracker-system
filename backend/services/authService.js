import { pool } from "../libs/database.js";
import { comparePassword, createJWT, hashPassword } from "../libs/index.js";
import { v4 as uuidv4 } from "uuid";

export const registerUser = async (name, email, password) => {
  const userExist = await pool.query({
    text: "SELECT EXISTS (SELECT * FROM users WHERE email = $1)",
    values: [email],
  });

  if (userExist.rows[0].exists) {
    throw new Error("Email is already registered. Please log in.");
  }

  const hashedPassword = await hashPassword(password);

  const user = await pool.query({
    text: `INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email`,
    values: [uuidv4(), name, email, hashedPassword],
  });

  return user.rows[0];
};

export const authenticateUser = async (email, password) => {
  const result = await pool.query({
    text: `SELECT * FROM users WHERE email = $1`,
    values: [email],
  });

  const user = result.rows[0];

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password.");
  }

  const token = createJWT(String(user.id));

  return { user: { id: user.id, name: user.name, email: user.email }, token };
};
