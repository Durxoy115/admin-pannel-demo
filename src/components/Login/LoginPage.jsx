import React, { useState } from "react";
import './LoginPage.css';

const LoginPage = ({ navigate }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        if (password.length >= 6 && password.length <= 16) {
            alert("Login successful!");
        } else {
            alert("Password must be between 6 and 16 characters.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 overflow-hidden">
            <form
                className="bg-white shadow-md pl-60 pr-56 rounded-md pt-20"
                onSubmit={handleLogin}
            >
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
