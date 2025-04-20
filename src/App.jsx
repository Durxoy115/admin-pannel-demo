import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
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
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import CompanyAddress from "./components/CompanyAddress/CompanyAddress";
import AddCompanyAddress from "./components/AddCompanyAddress/AddCompanyAddress";
import EditCompany from "./components/EditCompany/EditCompany";
import EditSupportContact from "./components/EditSupportContact/EditSupportContact";
import AddSignature from "./components/AddSignature/AddSignature";
import EditSignature from "./components/EditSignature/EditSignature";
import AddUserRole from "./components/AddUserRole/AddUserRole";
import EditUserRole from "./components/EditUserRole/EditUserRole";


// import Test from "./components/Test";

const App = () => {
  return (
    <Router>
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/otp" element={<OTPPage />} />
  
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/"
          element={
            <WithHeader>
              <Outlet />
            </WithHeader>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="addnewclient" element={<AddNewClient />} />
          <Route path="client-info/:id" element={<CombineComponent />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="activity-log" element={<ActivityLog />} />
          <Route path="message" element={<Message />} />
          <Route path="payment-history" element={<PaymentHistory />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="edit-user-profile/:id" element={<EditUserProfile />} />
          <Route path="edit-user/:id" element={<EditSubAdmin />} />
          <Route path="add-user" element={<AddUser />} />
          <Route path="add-product" element={<AddProductCard />} />
          <Route path="add-address" element={<AddAddress />} />
          <Route path="edit-service/:id" element={<EditService />} />
          <Route path="edit-address/:id" element={<EditCompanyAddress />} />
          <Route path="order-list" element={<ListOrder />} />
          <Route path="add-order" element={<OrderAdd />} />
          <Route path="order-details/:orderId" element={<OrderDetails />} />
          <Route path="invoice-list" element={<InvoiceList />} />
          <Route path="edit-invoice/:id" element={<InvoiceEdit />} />
          <Route path="create-invoice" element={<CreateInvoice />} />
          <Route path="add-payment" element={<PaymentAdd />} />
          <Route path="add-support-contact" element={<AddContact />} />
          <Route path="client-invoice-create/:clientId" element={<CreateInvoiceFromDashboard />} />
          <Route path="company-address" element={<CompanyAddress></CompanyAddress>} />
          <Route path="add-company-address" element={<AddCompanyAddress></AddCompanyAddress>} />
          <Route path="edit-company-address/:id" element={<EditCompany></EditCompany>} />
          <Route path="edit-support-contact/:id" element={<EditSupportContact></EditSupportContact>} />
          <Route path="add-signature" element={<AddSignature></AddSignature>} />
          <Route path="edit-signature/:id" element={<EditSignature></EditSignature>} />
          <Route path="add-user-role" element={<AddUserRole></AddUserRole>} />
          <Route path="edit-user-role/:id" element={<EditUserRole></EditUserRole>} />
        </Route>
      </Route>
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
