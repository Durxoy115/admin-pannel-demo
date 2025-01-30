import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Hearder/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/LoginPage";
import ForgotPassword from "./components/ForgotPasswordPage/ForgotPasswordPage";
import OTPPage from "./components/OTPPage/OTPPage";
import AddNewClient from "./components/AddNewClient/AddNewClient";
import ClientProfile from "./components/ClientProfile/ClientProfile";
import UserProfile from "./components/UserProfile/UserProfile";
import ActivityLog from "./components/ActivityLog/ActivityLog";
import Message from "./components/Message/Message";
import PaymentHistory from "./components/PaymentHistory/PaymentHistory";
import OrderList from "./components/OrderList/OrderList";
import ChangePassword from "./components/ChangePassword/ChangePassword";
// import Test from "./components/test";

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
                <Route path="client-profile/:Id" element={<ClientProfile></ClientProfile>} />
                <Route path="profile/" element={<UserProfile></UserProfile>} />
                <Route path="activity-log" element={<ActivityLog></ActivityLog>} />
                <Route path="message" element={<Message></Message>} />
                <Route path="payment-history" element={<PaymentHistory></PaymentHistory>} />
                <Route path="orderlist" element={<OrderList></OrderList>} />
                <Route path="change-password" element={<ChangePassword></ChangePassword>} />
                {/* <Route path="test" element={<Test></Test>} /> */}
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
