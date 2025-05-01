import {
  getUserById,
  changeUserPassword,
  updateUserInfo,
} from "../../services/userService.js";
import { registerUser } from "../../services/authService.js";
import { pool } from "../../libs/database.js";

describe("Integration: userService", () => {
  let testUserId;
  const email = "test_user@example.com";
  const password = "OldPassword123!";

  beforeAll(async () => {
    const user = await registerUser("Test", email, password);
    testUserId = user.id;
  });

  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE id = $1", [testUserId]);
    await pool.end();
  });

  test("getUserById returns correct user", async () => {
    const user = await getUserById(testUserId);
    expect(user.email).toBe(email);
  });

  test("updateUserInfo updates name and email", async () => {
    const updated = await updateUserInfo(
      testUserId,
      "New Name",
      "new_email@example.com"
    );
    expect(updated.name).toBe("New Name");
    expect(updated.email).toBe("new_email@example.com");
  });

  test("changeUserPassword works with correct password", async () => {
    const result = await changeUserPassword(
      testUserId,
      password,
      "NewPassword456!",
      "NewPassword456!"
    );
    expect(result.message).toBe("Password changed successfully");
  });

  test("changeUserPassword throws if old password wrong", async () => {
    await expect(
      changeUserPassword(testUserId, "wrongOld", "123456", "123456")
    ).rejects.toThrow("Invalid current password");
  });
});
