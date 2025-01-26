import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Hearder/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/LoginPage";
import ForgotPassword from "./components/ForgotPasswordPage/ForgotPasswordPage";
import OTPPage from "./components/OTPPage/OTPPage";
import AddNewClient from "./components/AddNewClient/AddNewClient";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Routes without Header */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp" element={<OTPPage />} />

        {/* Routes with Header */}
        <Route
          path="/*"
          element={
            <WithHeader>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="addnewclient" element={<AddNewClient />} />
              </Routes>
            </WithHeader>
          }
        />
      </Routes>
    </Router>
  );
};

// Layout with Header
const WithHeader = ({ children }) => {
  return (
    <>
      <Header />
      <main className="p-4">{children}</main>
    </>
  );
};

export default App;
