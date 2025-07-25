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
import AddCurrency from "./components/AddCurrency/AddCurrency";
import EditCurrency from "./components/EditCurrency/EditCurrency";
import InvoiceListToPayment from "./components/InvoiceListToPayment/InvoiceListToPayment";
import EditPaymentHistory from "./components/EditPaymentHistory/EditPaymentHistory";
import AllExpenseCategory from "./components/AllExpenseCategory/AllExpenseCategory";
import AddAmount from "./components/AddAmount/AddAmount";
import AddExpenseCategory from "./components/AddExpenseCategory/AddExpenseCategory";
import EditExpenseCategory from "./components/EditExenseCategory/EditExenseCategory";
import AllExpensesList from "./components/AllExpensesList/AllExpensesList";
import AllCreditAmountHistory from "./components/AllCreditAmountHistory/AllCreditAmountHistory";
import AddExpense from "./components/AddExpense/AddExpense";
import ExpenseAmountyearly from "./components/ExpenseAmountYearly/ExpenseAmountYearly";
import EditExpenseFromAllList from "./components/EditExpenseFromAllList/EditExpenseFromAllList";
import ExpenseSummaryMonthly from "./components/ExpenseSummaryMonthly/ExpenseSummaryMonthly";
import DailyExpenseHistory from "./components/DailyExpenseHistory/DailyExpenseHistory";
import CreditAmountHistoryMonthly from "./components/CreditAmountHistoryMonthly/CreditAmountHistoryMonthly";
import DailyCreditAmountHistory from "./components/DailyCreditAmountHistory/DailyCreditAmountHistory";
import EmployeeList from "./components/EmployeeList/EmployeeList";
import AddEmployee from "./components/AddEmployee/AddEmployee";
import EditEmployee from "./components/EditEmployee/EditEmployee";
import EmployeeDetails from "./components/EmployeeDetails/EmployeeDetails";
import EmployeeSalaryList from "./components/EmployeeSlaryList/EmployeeSlaryList";
import AddEmployeeSalary from "./components/AddEmployeeSalary/AddEmployeeSalary";
import AddSalaryConfig from "./components/AddSalaryConfig/AddSalaryConfig";
import EditSalaryConfig from "./components/EditSalaryConfig/EditSalaryConfig";
import EditEmployeeSalary from "./components/EditEmployeeSalary/EditEmployeeSalary";
import AddMonthlySingleEmployeeSalary from "./components/AddMonthlySingleEmployeeSalary/AddMonthlySingleEmployeeSalary";
import EmployeeSalaryMonthly from "./components/EmployeeSalaryMonthly/EmployeeSalaryMonthly";
import AddTotalSalaryAmount from "./components/AddTotalSalaryAmount/AddTotalSalaryAmount";
import SalaryCreditSummary from "./components/SalaryCreditSummary/SalaryCreditSummary";
import SalarySummaryMonthly from "./components/SalarySummaryMonthly/SalarySummaryMonthly";
import DailySalaryCreditAmount from "./components/DailySalaryCreditAmount/DailySalaryCreditAmount";
import DailySalaryExpenseAmount from "./components/DailySalaryExpenseHistory/DailySalaryExpenseHistory";
import AddTaxConfig from "./components/AddTaxConfig/AddTaxConfig";
import EditTaxConfig from "./components/EditTaxConfig/EditTaxConfig";
import EmployeeSalaryDays from "./components/EmployeeSalaryDays/EmployeeSalaryDays";
// import AddYearlySingleEmployeeSalary from "./components/AddYearlySingleEmployeeSalary/AddYearlySingleEmployeeSalary";


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
          <Route path="invoice-to-payment/:invoice_id" element={<InvoiceListToPayment/>} />
          <Route path="edit-payment-history/:id" element={<EditPaymentHistory/>} />
          <Route path="company-address" element={<CompanyAddress></CompanyAddress>} />
          <Route path="add-company-address" element={<AddCompanyAddress></AddCompanyAddress>} />
          <Route path="edit-company-address/:id" element={<EditCompany></EditCompany>} />
          <Route path="edit-support-contact/:id" element={<EditSupportContact></EditSupportContact>} />
          <Route path="add-signature" element={<AddSignature></AddSignature>} />
          <Route path="edit-signature/:id" element={<EditSignature></EditSignature>} />
          <Route path="add-user-role" element={<AddUserRole></AddUserRole>} />
          <Route path="edit-user-role/:id" element={<EditUserRole></EditUserRole>} />
          <Route path="edit-currency/:id" element={<EditCurrency></EditCurrency>} />
          <Route path="add-currency" element={<AddCurrency></AddCurrency>} />
          <Route path="expense-category-list" element={<AllExpenseCategory/>} />
          <Route path= "add-amount" element={<AddAmount></AddAmount>} />
          <Route path= "add-expense-category" element={<AddExpenseCategory></AddExpenseCategory>} />
          <Route path= "edit-expense-category/:id" element={<EditExpenseCategory></EditExpenseCategory>} />
          <Route path= "all-expense-list" element={<AllExpensesList/>} />
          <Route path= "edit-expense-list/:expense_id" element={<EditExpenseFromAllList/>} />
          <Route path= "all-credit-list" element={<AllCreditAmountHistory/>} />
          <Route path= "monthly-credit-list/:year" element={<CreditAmountHistoryMonthly/>} />
          <Route path= "daily-credit-list/:month/:year" element={<DailyCreditAmountHistory/>} />
          <Route path= "add-expense" element={<AddExpense/>} />
          <Route path= "yearly-expense-amount" element={<ExpenseAmountyearly/>} />
          <Route path= "monthly-expense-amount/:year" element={<ExpenseSummaryMonthly/>} />
          <Route path="/daily-expense/:month/:year" element={<DailyExpenseHistory />} />
          <Route path="/employee-list" element={<EmployeeList/>} />
          <Route path="/add-employee" element={<AddEmployee/>} />
          <Route path="/edit-employee/:id" element={<EditEmployee/>} />
          <Route path="employee-details/:id" element={<EmployeeDetails/>} />
          <Route path="employee-salary-list" element={<EmployeeSalaryList/>} />
          <Route path="add-employee-salary" element={<AddEmployeeSalary/>} />
          <Route path="edit-salary-list/:id" element={<EditEmployeeSalary/>} />
          <Route path="add-salary-config" element={<AddSalaryConfig/>} />
          <Route path="edit-salary-config/:id" element={<EditSalaryConfig/>} />
          <Route path="add-monthly-salary/:id" element={<AddMonthlySingleEmployeeSalary/>} />
          <Route path= "monthly-salary-list/:year/:id" element={<EmployeeSalaryMonthly/>} />
          <Route path= "add-total-salary-amount" element={<AddTotalSalaryAmount/>} />
          <Route path= "total-salary-credit-amount-sumary" element={<SalaryCreditSummary/>} />
          <Route path= "monthly-salary-credit-expense-amount/:year" element={<SalarySummaryMonthly/>} />
          <Route path= "daily-salary-credit-list/:month/:year" element={<DailySalaryCreditAmount/>} />
          <Route path= "daily-salary-expense-list/:month/:year" element={<DailySalaryExpenseAmount/>} />
          <Route path= "add-tax-config" element={<AddTaxConfig/>} />
          <Route path="edit-tax-config/:id" element={<EditTaxConfig/>} />
          <Route path= "daily-salary-list/:month/:year/:id" element={<EmployeeSalaryDays/>} />
          
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
