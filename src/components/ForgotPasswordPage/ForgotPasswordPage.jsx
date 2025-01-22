import React, { useState } from "react";

const ForgotPasswordPage = ({ navigate }) => {
  const [email, setEmail] = useState("");

  const handleSendOTP = (e) => {
    e.preventDefault();
    alert("OTP sent to your email!");
    navigate("otp");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 overflow-hidden">
      <form className="bg-white shadow-md pl-80 pr-80 rounded-md pt-20" onSubmit={handleSendOTP}>
        <h2 className="text-2xl font-bold mb-4 text-center pt-16">Forgot Password</h2>
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
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Send OTP
        </button>
        <p
          className="text-blue-500 text-sm mt-4 text-right cursor-pointer"
          onClick={() => navigate("login")}
        >
          Back to Login
        </p>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
