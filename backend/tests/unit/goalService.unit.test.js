import { jest } from "@jest/globals";

describe("Unit: goalService", () => {
  let goalService;
  let queryMock;

  beforeAll(async () => {
    queryMock = jest.fn();

    jest.unstable_mockModule("../../libs/database.js", () => ({
      pool: { query: queryMock },
    }));

    jest.unstable_mockModule("uuid", () => ({
      v4: () => "test-uuid-1234",
    }));

    goalService = await import("../../services/goalService.js");
  });

  beforeEach(() => {
    queryMock.mockReset();
  });

  test("createGoal() sends correct INSERT query", async () => {
    const expected = {
      id: "test-uuid-1234",
      user_id: "u1",
      goal_name: "Unit Test Goal",
      target_amount: 1000,
      current_amount: 100,
      deadline: "2025-11-11",
    };
    queryMock.mockResolvedValueOnce({ rows: [expected] });

    const result = await goalService.createGoal(
      "u1",
      "Unit Test Goal",
      1000,
      100,
      "2025-11-11"
    );

    expect(queryMock).toHaveBeenCalledTimes(1);
    expect(queryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringMatching(/INSERT INTO goals/i),
        values: expect.arrayContaining([
          "u1",
          "Unit Test Goal",
          1000,
          100,
          "2025-11-11",
        ]),
      })
    );
    expect(result).toEqual(expected);
  });

  test("getUserGoals() returns result from query", async () => {
    const mockData = [{ goal_name: "Mock goal", user_id: "u1" }];
    queryMock.mockResolvedValueOnce({ rows: mockData });

    const result = await goalService.getUserGoals("u1");
    expect(queryMock).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  test("updateGoal() builds correct UPDATE query", async () => {
    const returned = { id: "g1", goal_name: "Updated Name" };
    queryMock.mockResolvedValueOnce({ rows: [returned] });

    const result = await goalService.updateGoal("g1", "u1", {
      goal_name: "Updated Name",
      current_amount: 200,
      deadline: null,
      target_amount: null,
      status: "done",
    });

    expect(queryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringMatching(/UPDATE goals/i),
        values: ["Updated Name", null, 200, null, "done", "g1", "u1"],
      })
    );
    expect(result.goal_name).toBe("Updated Name");
  });
});
