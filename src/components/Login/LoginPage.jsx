import React, { useState } from "react";
import "./LoginPage.css";
import localStorage from "../../../src/localStorage";

const LoginPage = ({ navigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://192.168.0.131:8000/users/customer-login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Save user data in localStorage
        localStorage.setItem("user", data); // Replace with custom util
        setIsSuccess(true);
        setMessage("Login successful!");
        setTimeout(() => {
          // console.log("Dashboard")
          navigate("dashboard"); 
        }, 1000);
      } else {
        setIsSuccess(false);
        setMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setIsSuccess(false);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 overflow-hidden">
      <form className="bg-white shadow-md pl-60 pr-56 rounded-md pt-20" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-4 text-center pt-16">Login</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
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
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
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
          <p
            className="text-blue-500 text-sm mt-4 text-right cursor-pointer"
            onClick={() => navigate("forgotPassword")}
          >
            Forgot Password?
          </p>
        </div>
        {message && (
          <p className={`text-center mt-4 ${isSuccess ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;