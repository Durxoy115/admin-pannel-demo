import React, { useState } from "react";

const ResetPasswordPage = ({ navigate }) => {
  const [password, setPassword] = useState("");

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (password.length >= 6 && password.length <= 16) {
      alert("Password reset successful!");
      navigate("login");
    } else {
      alert("Password must be between 6 and 16 characters.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 overflow-hidden">
      <form
        className="bg-white shadow-md pl-80 pr-80 rounded-md pt-20"
        onSubmit={handleResetPassword}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-gray-200"
            minLength="6"
            maxLength="16"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Set Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
