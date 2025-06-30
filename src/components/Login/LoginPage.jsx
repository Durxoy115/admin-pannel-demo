import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import useToken from "../hooks/useToken";
import localStorageWrapper from "../../localStorage";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${url}/auth/user/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorageWrapper.setItem("office_token", data.data.token, 3600 * 1000 );
        setMessage("Login successful!");
        setIsSuccess(true);

        setTimeout(() => {
          navigate("/dashboard");
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        className="bg-white shadow-md rounded-md p-6 sm:p-10 md:p-16 w-full login_form"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>
        </div>
        {message && (
          <p
            className={`text-center mt-4 ${
              isSuccess ? "text-green-500" : "text-red-500"
            }`}
          >
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