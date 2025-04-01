import { registerUser, authenticateUser } from "../services/authService.js";
import { signupSchema, signinSchema } from "../schemas/userSchema.js";
import { validateSchema } from "../libs/validation.js";

export const signupUser = async (req, res) => {
  try {
    validateSchema(signupSchema, req.body);

    const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);

    res.status(200).json({
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
    validateSchema(signinSchema, req.body);
    const { email, password } = req.body;

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
