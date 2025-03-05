import { pool } from "../libs/database.js";
import { comparePassword, createJWT, hashPassword } from "../libs/index.js";
import { v4 as uuidv4 } from "uuid";

export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ status: "error", message: "All fields are required." });
    }

    const userExist = await pool.query({
      text: "SELECT EXISTS (SELECT * FROM users WHERE email = $1)",
      values: [email],
    });

    if (userExist.rows[0].userExist) {
      return res.status(409).json({
        status: "error",
        message: "Email is already registered. Please log in.",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await pool.query({
      text: `INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING *`,
      values: [uuidv4(), name, email, hashedPassword],
    });

    user.rows[0].password = undefined;

    res.status(201).json({
      status: "success",
      message: "User registered successfully.",
      user: user.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "error", message: "Email and password are required." });
    }

    const result = await pool.query({
      text: `SELECT * FROM users WHERE email = $1`,
      values: [email],
    });

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Invalid email or password.",
      });
    }

    const isMatch = await comparePassword(password, user?.password);

    if (!isMatch) {
      return res.status(404).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    const token = createJWT(String(user.id));

    user.password = undefined;

    res.status(200).json({
      status: "success",
      message: "Login successful.",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};