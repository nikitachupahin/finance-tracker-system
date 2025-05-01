import { comparePassword } from "../../libs/index.js";

describe("Unit: comparePassword()", () => {
  test("returns false if user password is missing", async () => {
    const result = await comparePassword(undefined, "test123");
    expect(result).toBe(false);
  });

  test("returns false if input password is missing", async () => {
    const result = await comparePassword("$2b$10$randomHashedPassword", null);
    expect(result).toBe(false);
  });

  test("returns false for incorrect password", async () => {
    const fakeHashed =
      "$2b$10$w1DvPjLWBWlWJcyS0AVFdeUZVuyPQ2Y2BWxEpV1NKZfAzVrHgUP1a";
    const result = await comparePassword("wrongpass", fakeHashed);
    expect(result).toBe(false);
  });

  test("returns true for matching password", async () => {
    const bcrypt = await import("bcrypt");
    const hashed = await bcrypt.default.hash("mypassword", 10);
    const result = await comparePassword("mypassword", hashed);
    expect(result).toBe(true);
  });
});
