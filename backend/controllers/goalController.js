import * as goalService from "../services/goalService.js";

export const createGoal = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const { goal_name, target_amount, current_amount = 0, deadline } = req.body;

    if (!goal_name || !target_amount || !deadline) {
      return res.status(400).json({ message: "All fields except current_amount are required" });
    }

    const goal = await goalService.createGoal(userId, goal_name, target_amount, current_amount, deadline);
    res.status(201).json({ message: "Goal created", goal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserGoals = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const goals = await goalService.getUserGoals(userId);
    res.status(200).json({ goals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const goalId = req.params.id;
    const updates = req.body;

    const updatedGoal = await goalService.updateGoal(goalId, userId, updates);

    if (!updatedGoal) return res.status(404).json({ message: "Goal not found" });

    res.status(200).json({ message: "Goal updated", updatedGoal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
