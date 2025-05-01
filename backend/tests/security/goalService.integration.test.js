import {
  createGoal,
  getUserGoals,
  updateGoal,
} from "../../services/goalService.js";
import { pool } from "../../libs/database.js";

describe("Integration: Goal Service", () => {
  const testUserId = "482788ec-d438-4b67-8feb-3ddc1be64adb";
  let createdGoal;

  afterAll(async () => {
    await pool.query("DELETE FROM goals WHERE user_id = $1", [testUserId]);
    await pool.end();
  });

  test("createGoal() creates a goal and returns all fields correctly", async () => {
    createdGoal = await createGoal(
      testUserId,
      "Plan conference trip",
      4500,
      1000,
      "2026-05-10"
    );

    expect(Number(createdGoal.current_amount)).toBe(1000);
    expect(Number(createdGoal.target_amount)).toBe(4500);
    const date = new Date(createdGoal.deadline);
    expect(date.getUTCFullYear()).toBe(2026);
    expect(date.getUTCMonth()).toBe(4);

    expect(createdGoal).toHaveProperty("id");
    expect(createdGoal).toHaveProperty("status");
  });

  test("getUserGoals() should return an array including the new goal", async () => {
    const goals = await getUserGoals(testUserId);

    expect(Array.isArray(goals)).toBe(true);
    expect(goals.length).toBeGreaterThan(0);

    const matchedGoal = goals.find((g) => g.id === createdGoal.id);
    expect(matchedGoal).toBeDefined();
    expect(matchedGoal.goal_name).toContain("conference");
  });

  test("updateGoal() should update name, amount and status", async () => {
    const updated = await updateGoal(createdGoal.id, testUserId, {
      goal_name: "Conference Budget",
      current_amount: 2500,
      target_amount: 4500,
      deadline: "2026-06-01",
      status: "completed",
    });

    expect(updated.goal_name).toBe("Conference Budget");
    expect(Number(updated.current_amount)).toBe(2500);
    expect(Number(updated.target_amount)).toBe(4500);

    const formatted = new Date(updated.deadline).toLocaleDateString("en-CA");
    expect(formatted).toBe("2026-06-01");
  });
});
