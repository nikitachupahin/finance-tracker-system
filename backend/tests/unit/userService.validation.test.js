import { getUserById } from "../../services/userService.js";

describe("Unit: userService validation only", () => {
  test("getUserById throws if userId is not string or falsy", async () => {
    await expect(getUserById(null)).rejects.toThrow("Invalid user ID");
    await expect(getUserById(undefined)).rejects.toThrow("Invalid user ID");
    await expect(getUserById(123)).rejects.toThrow("Invalid user ID");
    await expect(getUserById({})).rejects.toThrow("Invalid user ID");
  });
});
