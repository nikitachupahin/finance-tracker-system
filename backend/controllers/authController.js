import { registerUser, authenticateUser } from "../services/authService.js";

export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ status: "error", message: "All fields are required." });
    }

    const user = await registerUser(name, email, password);

    res.status(201).json({
      status: "success",
      message: "User registered successfully.",
      user,
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
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

    const { user, token } = await authenticateUser(email, password);

    res.status(200).json({
      status: "success",
      message: "Login successful.",
      user,
      token,
    });
  } catch (error) {
    res.status(401).json({ status: "error", message: error.message });
  }
};
