import React, { useState } from "react";
import axios from "axios";
import useToken from "../hooks/useToken";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [url] = useToken();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!url) {
      setError("API URL is not available.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${url}/auth/user/forgot-password/`, {
        email,
      });

      if (response.data.success) {
        alert("OTP sent to your email!");
        navigate("/otp");
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Failed to send OTP. Please try again.";
      setError(errorMsg);
      console.error("Error sending OTP:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        className="bg-white shadow-md rounded-md p-6 sm:p-10 md:p-16 w-full max-w-lg"
        onSubmit={handleSendOTP}
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
          Forgot Password
        </h2>
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
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
        <p
          className="text-blue-500 text-sm mt-4 text-right cursor-pointer"
          onClick={() => navigate("/login")} // Fixed the path to "/login"
        >
          Back to Login
        </p>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;