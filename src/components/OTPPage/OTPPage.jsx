import React, { useState } from "react";
import axios from "axios";
import useToken from "../hooks/useToken";
import { useNavigate } from "react-router-dom";

const OTPPage = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [url] = useToken();

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!url) {
      setError("API URL is not available.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${url}/auth/user/set-password/`, {
        otp: otp.trim(),
        email: email.trim(),
        password,
      });

      if (response.data.success) {
        alert("Password reset successful!");
        navigate("/login");
      } else {
        setError("Invalid OTP or email. Please try again.");
      }
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Failed to reset password. Please try again.";
      setError(errorMsg);
      console.error("Error resetting password:", err);
    } finally {
      setLoading(false);
    }
  };

  console.log(otp, email, password);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        className="bg-white shadow-md rounded-md p-6 sm:p-10 md:p-16 w-full max-w-lg"
        onSubmit={handleVerifyOTP}
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
          Verify OTP and Reset Password
        </h2>

        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Enter Your Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-gray-200"
            required
          />
        </div>

        {/* OTP Field */}
        <div className="mb-4">
          <label htmlFor="otp" className="block text-sm font-medium mb-1">
            Enter OTP
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-gray-200"
            required
          />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Enter New Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-gray-200"
            required
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? "Resetting Password..." : "Reset Password"}
        </button>

        {/* Back to Forgot Password Link */}
        <p
          className="text-blue-500 text-sm mt-4 text-right cursor-pointer"
          onClick={() => navigate("/forgot-password")} // Fixed the path to "/forgot-password"
        >
          Back to Forgot Password
        </p>
      </form>
    </div>
  );
};

export default OTPPage;