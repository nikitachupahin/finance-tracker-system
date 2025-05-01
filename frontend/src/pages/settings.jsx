import React, { useEffect, useState } from "react";
import api from "../libs/apiCall";
import { toast } from "react-toastify";

const Settings = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "warning"

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/user");
        setUser(res.data.user);
        setNewName(res.data.user.name);
        setNewEmail(res.data.user.email);
      } catch (err) {
        toast.error("Failed to load user info");
      }
    };
    fetchUser();
  }, []);

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (newName === user.name && newEmail === user.email) {
      setMessage("No changes detected in name or email.");
      setMessageType("warning");
      return;
    }

    try {
      const res = await api.put("/user", { name: newName, email: newEmail });
      toast.success("Profile updated successfully.");
      setUser(res.data.user);
      setMessage("Profile updated successfully.");
      setMessageType("success");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("Please fill in all password fields.");
      setMessageType("warning");
      return;
    }

    if (newPassword === currentPassword) {
      setMessage("New password is the same as current password.");
      setMessageType("warning");
      return;
    }

    try {
      const res = await api.put("/user/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      toast.success(res.data.message || "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Password changed successfully.");
      setMessageType("success");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    }
  };

  return (
    <div className="p-6 space-y-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* 🟢 Уведомление */}
      {message && (
        <div
          className={`p-4 rounded-md text-sm ${
            messageType === "success"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {message}
        </div>
      )}

      {/* 🔧 Профиль */}
      <form onSubmit={handleUpdateUser} className="space-y-4">
        <h2 className="text-xl font-semibold">Update Profile</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full px-4 py-2 border rounded-md dark:bg-slate-800"
        />
        <input
          type="email"
          placeholder="Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md dark:bg-slate-800"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
        >
          Save Changes
        </button>
      </form>

      {/* 🔒 Пароль */}
      <form onSubmit={handleChangePassword} className="space-y-4">
        <h2 className="text-xl font-semibold">Change Password</h2>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md dark:bg-slate-800"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md dark:bg-slate-800"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md dark:bg-slate-800"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default Settings;
