import React, { useState } from "react";
import LoginPage from "./components/Login/LoginPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage/ForgotPasswordPage";
import OTPPage from "./components/OTPPage/OTPPage";
import ResetPasswordPage from "./components/ResetPasswordPage/ResetPasswordPage";
import Header from "./components/Hearder/Header";

const App = () => {
  const [currentPage, setCurrentPage] = useState("login");

  const navigate = (page) => setCurrentPage(page);

  return (
    <>
    <Header></Header>
      {currentPage === "login" && <LoginPage navigate={navigate} />}
      {currentPage === "forgotPassword" && <ForgotPasswordPage navigate={navigate} />}
      {currentPage === "otp" && <OTPPage navigate={navigate} />}
      {currentPage === "resetPassword" && <ResetPasswordPage navigate={navigate} />}
    </>
  );
};

export default App;
