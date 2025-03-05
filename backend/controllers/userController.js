import { getUserById, changeUserPassword, updateUserInfo } from "../services/userService.js";

export const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.body.user.userId);

    if (!user) {
      return res.status(404).json({ status: "failed", message: "User not found." });
    }

    user.password = undefined;
    res.status(200).json({ status: "success", user });

  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const result = await changeUserPassword(userId, currentPassword, newPassword, confirmPassword);
    res.status(200).json({ status: "success", message: result.message });

  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "failed", message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { name, email } = req.body;

    const updatedUser = await updateUserInfo(userId, name, email);
    res.status(200).json({
      status: "success",
      message: "User information updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "failed", message: error.message });
  }
};
