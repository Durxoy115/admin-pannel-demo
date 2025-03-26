import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Hearder/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/LoginPage";
import ForgotPassword from "./components/ForgotPasswordPage/ForgotPasswordPage";
import OTPPage from "./components/OTPPage/OTPPage";
import AddNewClient from "./components/AddNewClient/AddNewClient";
// import ClientProfile from "./components/ClientProfile/ClientProfile";
import UserProfile from "./components/UserProfile/UserProfile";
import ActivityLog from "./components/ActivityLog/ActivityLog";
import Message from "./components/Message/Message";
import PaymentHistory from "./components/PaymentHistory/PaymentHistory";
// import OrderList from "./components/OrderList/OrderList";
import ChangePassword from "./components/ChangePassword/ChangePassword";
import EditUserProfile from "./components/EditUserProfile/EditUserProfile";
import EditSubAdmin from "./components/EditSubAdmin/EditSubAdmin";
import AddUser from "./components/AddUser/AddUser";
import AddProductCard from "./components/AddProductCard/AddProductCard";
import AddAddress from "./components/AddAddress/AddAddress";
import EditService from "./EditService/EditService";
import EditCompanyAddress from "./components/EditCompanyAddress/EditCompanyAddress";
import ListOrder from "./components/ListOrder/ListOrder";
import OrderAdd from "./components/OrderAdd/OrderAdd";
import OrderDetails from "./components/OrderDetails/OrderDetails";
import InvoiceList from "./components/InvoiceList/InvoiceList";
import InvoiceEdit from "./components/InvoiceEdit/InvoiceEdit";
import CreateInvoice from "./components/CreateInvoice/CreateInvoice";
import CombineComponent from "./components/CombineComponent/CombineComponent";
import PaymentAdd from "./components/PaymentAdd/PaymentAdd";
import Footer from "./components/Footer/Footer";
import AddContact from "./components/AddContact/AddContact";
import CreateInvoiceFromDashboard from "./components/CreateInvoiceFromDashboard/CreateInvoiceFromDashboard";


// import Test from "./components/Test";

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
                <Route path="client-info/:id" element={<CombineComponent></CombineComponent>} />
                <Route path="profile/" element={<UserProfile></UserProfile>} />
                <Route path="activity-log" element={<ActivityLog></ActivityLog>} />
                <Route path="message" element={<Message></Message>} />
                <Route path="payment-history" element={<PaymentHistory></PaymentHistory>} />
                {/* <Route path="orderlist" element={<OrderList></OrderList>} /> */}
                <Route path="change-password" element={<ChangePassword></ChangePassword>} />
                <Route path="edit-user-profile/:id" element={<EditUserProfile></EditUserProfile>} />
                <Route path="edit-user/:id" element={<EditSubAdmin></EditSubAdmin>} />
                <Route path="add-user" element={<AddUser></AddUser>} />
                <Route path="add-product" element={<AddProductCard></AddProductCard>} />
                <Route path="add-address" element={<AddAddress></AddAddress>} />
                <Route path="edit-service/:id" element={<EditService></EditService>} />
                <Route path="edit-address/:id" element={<EditCompanyAddress></EditCompanyAddress>} />
                <Route path="order-list" element={<ListOrder></ListOrder>} />
                <Route path="add-order" element={<OrderAdd></OrderAdd>} />
                <Route path="order-details/:orderId" element={<OrderDetails></OrderDetails>} />
                <Route path="invoice-list" element={<InvoiceList></InvoiceList>} />
                <Route path="edit-invoice/:id" element={<InvoiceEdit></InvoiceEdit>} />
                <Route path="create-invoice" element={<CreateInvoice></CreateInvoice>} />
                <Route path="add-payment" element={<PaymentAdd></PaymentAdd>} />
                <Route path="add-support-contact" element={<AddContact></AddContact>} />
                <Route path="client-invoice-create/:clientId" element={<CreateInvoiceFromDashboard></CreateInvoiceFromDashboard>} />
                
                

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
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content (flex-grow ensures it expands) */}
      <main className="flex-grow">{children}</main>

      {/* Footer (Sticks to Bottom) */}
      <Footer />
    </div>
  );
};


export default App;
