import fetch from "node-fetch";
import { WireMockContainer } from "@wiremock/wiremock-testcontainers-node";
import {
  getUserById,
  updateUserInfo,
  changeUserPassword,
} from "../../services/mockUserService.js";

let container;
let baseUrl;
const testUserId = "u123";

beforeAll(async () => {
  container = await new WireMockContainer().withExposedPorts(8080).start();

  const host = container.getHost();
  const port = container.getMappedPort(8080);
  baseUrl = `http://${host}:${port}`;

  // GET /users/:id
  await fetch(`${baseUrl}/__admin/mappings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      request: {
        method: "GET",
        url: `/users/${testUserId}`,
      },
      response: {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: testUserId,
          name: "Test",
          email: "test_user@example.com",
        }),
      },
    }),
  });

  // PATCH /users/:id
  await fetch(`${baseUrl}/__admin/mappings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      request: {
        method: "PATCH",
        url: `/users/${testUserId}`,
      },
      response: {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: testUserId,
          name: "New Name",
          email: "new_email@example.com",
        }),
      },
    }),
  });

  // POST /users/:id/password — success
  await fetch(`${baseUrl}/__admin/mappings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      request: {
        method: "POST",
        url: `/users/${testUserId}/password`,
        bodyPatterns: [
          {
            matchesJsonPath: "$[?(@.currentPassword == 'OldPassword123!')]",
          },
        ],
      },
      response: {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Password changed successfully" }),
      },
    }),
  });
  await fetch(`${baseUrl}/__admin/mappings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      request: {
        method: "GET",
        url: `/users/unknown-id`,
      },
      response: {
        status: 404,
        body: "Not found",
      },
    }),
  });
  await fetch(`${baseUrl}/__admin/mappings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      request: {
        method: "PATCH",
        url: `/users/fail-id`,
      },
      response: {
        status: 500,
        body: "Something went wrong",
      },
    }),
  });

  // POST /users/:id/password — fail
  await fetch(`${baseUrl}/__admin/mappings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      request: {
        method: "POST",
        url: `/users/${testUserId}/password`,
        bodyPatterns: [
          {
            matchesJsonPath: "$[?(@.currentPassword == 'wrongOld')]",
          },
        ],
      },
      response: {
        status: 403,
        body: "Invalid current password",
      },
    }),
  });
});

afterAll(async () => {
  if (container) {
    await container.stop();
  }
});

test("updateUserInfo throws if update fails", async () => {
  await expect(
    updateUserInfo("fail-id", "Name", "fail@example.com", baseUrl)
  ).rejects.toThrow("Update failed");
});

test("getUserById throws if userId is invalid", async () => {
  await expect(getUserById(null, baseUrl)).rejects.toThrow("Invalid user ID");
  await expect(getUserById(123, baseUrl)).rejects.toThrow("Invalid user ID");
});

test("changeUserPassword throws if new passwords do not match", async () => {
  await expect(
    changeUserPassword(
      testUserId,
      "OldPassword123!",
      "NewPassword123",
      "DifferentPassword123",
      baseUrl
    )
  ).rejects.toThrow("New Passwords do not match");
});
test("getUserById throws if user not found", async () => {
  await expect(getUserById("unknown-id", baseUrl)).rejects.toThrow(
    "User not found"
  );
});

test("getUserById returns correct user", async () => {
  const user = await getUserById(testUserId, baseUrl);
  expect(user.name).toBe("Test");
  expect(user.email).toBe("test_user@example.com");
});

test("updateUserInfo updates name and email", async () => {
  const updated = await updateUserInfo(
    testUserId,
    "New Name",
    "new_email@example.com",
    baseUrl
  );
  expect(updated.name).toBe("New Name");
  expect(updated.email).toBe("new_email@example.com");
  expect(updated.password).toBeUndefined();
});

test("changeUserPassword works with correct password", async () => {
  const result = await changeUserPassword(
    testUserId,
    "OldPassword123!",
    "NewPassword456!",
    "NewPassword456!",
    baseUrl
  );
  expect(result.message).toBe("Password changed successfully");
});

test("changeUserPassword throws if old password wrong", async () => {
  await expect(
    changeUserPassword(testUserId, "wrongOld", "123456", "123456", baseUrl)
  ).rejects.toThrow("Invalid current password");
});
