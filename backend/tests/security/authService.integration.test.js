import { registerUser, authenticateUser } from "../../services/authService.js";
import { pool } from "../../libs/database.js";

describe("Integration: Auth Service", () => {
  const testUser = {
    name: "Alice Test",
    email: "alice@example.com",
    password: "SuperSecret123",
  };

  let createdUserId;

  beforeAll(async () => {
    await pool.query("DELETE FROM users WHERE email = $1", [testUser.email]);
  });

  afterAll(async () => {
    if (createdUserId) {
      await pool.query("DELETE FROM users WHERE id = $1", [createdUserId]);
    }
    await pool.end();
  });

  test("registerUser: creates a new user in database", async () => {
    const newUser = await registerUser(
      testUser.name,
      testUser.email,
      testUser.password
    );
    createdUserId = newUser.id;

    expect(typeof newUser.id).toBe("string");
    expect(newUser.email).toBe(testUser.email);
  });

  test("registerUser: throws error for duplicate email", async () => {
    await expect(
      registerUser("Alice Duplicate", testUser.email, testUser.password)
    ).rejects.toThrow(/already registered/i);
  });

  test("authenticateUser: returns token and user for correct credentials", async () => {
    const result = await authenticateUser(testUser.email, testUser.password);
    expect(result).toHaveProperty("token");
    expect(result.user.email).toBe(testUser.email);
    expect(result.user).toHaveProperty("id");
  });

  test("authenticateUser: throws for wrong password", async () => {
    await expect(
      authenticateUser(testUser.email, "wrongPassword!")
    ).rejects.toThrow(/invalid email or password/i);
  });

  test("authenticateUser: throws for non-existent user", async () => {
    await expect(
      authenticateUser("notfound@example.com", "any")
    ).rejects.toThrow(/invalid email or password/i);
  });
});
