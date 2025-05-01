// services/userService.js
import fetch from "node-fetch";

export async function getUserById(userId, baseUrl) {
  if (!userId || typeof userId !== "string") {
    throw new Error("Invalid user ID");
  }

  const res = await fetch(`${baseUrl}/users/${userId}`);
  if (!res.ok) throw new Error("User not found");
  return res.json();
}

export async function changeUserPassword(
  userId,
  currentPassword,
  newPassword,
  confirmPassword,
  baseUrl
) {
  if (newPassword !== confirmPassword) {
    throw new Error("New Passwords do not match");
  }

  const res = await fetch(`${baseUrl}/users/${userId}/password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!res.ok) throw new Error("Invalid current password");
  return res.json();
}

export async function updateUserInfo(userId, name, email, baseUrl) {
  const res = await fetch(`${baseUrl}/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });

  if (!res.ok) throw new Error("Update failed");
  const user = await res.json();
  user.password = undefined;
  return user;
}
