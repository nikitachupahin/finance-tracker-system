// tests/contract/goal.contract.test.js

import { createGoal, updateGoal } from "../../services/goalService.js";
import { registerUser } from "../../services/authService.js";
import { pool } from "../../libs/database.js";

describe("Contract: Update Goal", () => {
  let goalId, userId;

  beforeAll(async () => {
    const user = await registerUser(
      "GoalContractTest",
      "goal.contract@test.com",
      "StrongPass789!"
    );
    userId = user.id;

    const goal = await createGoal(
      userId,
      "Vacation Fund",
      3000,
      800,
      "2025-10-15"
    );
    goalId = goal.id;
  });

  afterAll(async () => {
    await pool.query("DELETE FROM goals WHERE user_id = $1", [userId]);
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    await pool.end();
  });

  test("updated goal matches contract", async () => {
    const updated = await updateGoal(goalId, userId, {
      goal_name: "Vacation to Bali",
      current_amount: 1200,
      deadline: "2025-12-31",
      status: "in_progress",
    });

    expect(updated).toMatchObject({
      id: goalId,
      user_id: userId,
      goal_name: "Vacation to Bali",
      current_amount: "1200.00",
      target_amount: "3000.00",
      status: "in_progress",
    });
  });
});
