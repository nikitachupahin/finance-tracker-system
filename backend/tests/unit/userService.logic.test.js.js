import { jest } from "@jest/globals";

let userService;
let queryMock, compareMock, hashMock;

beforeAll(async () => {
  queryMock = jest.fn();
  compareMock = jest.fn();
  hashMock = jest.fn();

  jest.unstable_mockModule("../../libs/database.js", () => ({
    pool: { query: queryMock },
  }));

  jest.unstable_mockModule("../../libs/index.js", () => ({
    comparePassword: compareMock,
    hashPassword: hashMock,
  }));

  userService = await import("../../services/userService.js");
});

beforeEach(() => {
  queryMock.mockReset();
  compareMock.mockReset();
  hashMock.mockReset();
});

describe("Unit: userService logic with mocks", () => {
  test("getUserById returns user", async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: "u1", name: "Test" }] });
    const user = await userService.getUserById("u1");
    expect(user.name).toBe("Test");
  });

  test("getUserById returns null if user not found", async () => {
    queryMock.mockResolvedValueOnce({ rows: [] });

    const result = await userService.getUserById("some-id");
    expect(result).toBeNull();
  });

  test("getUserById returns user object", async () => {
    queryMock.mockResolvedValueOnce({
      rows: [{ id: "some-id", name: "Alice" }],
    });

    const result = await userService.getUserById("some-id");
    expect(result).toEqual({ id: "some-id", name: "Alice" });
  });

  test("changeUserPassword throws if passwords do not match", async () => {
    queryMock.mockResolvedValueOnce({
      rows: [{ id: "u1", password: "hashedPass" }],
    });

    await expect(
      userService.changeUserPassword("u1", "old", "new1", "new2")
    ).rejects.toThrow("New Passwords do not match");
  });

  test("changeUserPassword updates password", async () => {
    queryMock.mockResolvedValueOnce({
      rows: [{ id: "u1", password: "hashedOld" }],
    });
    compareMock.mockResolvedValueOnce(true);
    hashMock.mockResolvedValueOnce("hashedNew");
    queryMock.mockResolvedValueOnce({}); // update

    const result = await userService.changeUserPassword(
      "u1",
      "old",
      "new",
      "new"
    );
    expect(result.message).toBe("Password changed successfully");
  });

  test("updateUserInfo returns user without password", async () => {
    queryMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: "u1",
            name: "Old",
            email: "old@example.com",
            password: "secret",
          },
        ],
      }) // getUserById
      .mockResolvedValueOnce({
        rows: [
          {
            id: "u1",
            name: "Updated",
            email: "new@example.com",
            password: "secret",
          },
        ],
      }); // update

    const result = await userService.updateUserInfo(
      "u1",
      "Updated",
      "new@example.com"
    );

    expect(result.name).toBe("Updated");
    expect(result.email).toBe("new@example.com");
    expect(result.password).toBeUndefined();
  });
});
