import React, { useState } from "react";

const OTPPage = ({ navigate }) => {
  const [otp, setOtp] = useState("");

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otp === "123456") {
      alert("OTP Verified!");
      navigate("resetPassword");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 overflow-hidden">
      <form className="bg-white shadow-md pl-80 pr-80 rounded-md pt-20" onSubmit={handleVerifyOTP}>
        <h2 className="text-2xl font-bold mb-4 text-center">Verify OTP</h2>
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
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default OTPPage;