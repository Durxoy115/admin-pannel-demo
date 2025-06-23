import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { BsFilePdfFill, BsListTask } from "react-icons/bs";
import { CiFilter } from "react-icons/ci";
import { IoMdAddCircleOutline, IoIosListBox } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import useUserPermission from "../hooks/usePermission";
import myPDFDocument from "../myPDFDocument";
import { pdf } from "@react-pdf/renderer";
import EmployeePaySlip from "../employeePaySlip";

const EmployeeSalaryList = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedExpenseId, setSelectedExpenseId] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("BDT");
  const [currencyData, setCurrencyData] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const { permissions } = useUserPermission();

  const fetchExpenseAmountHistory = async () => {
    try {
      const response = await fetch(`${url}/expense/employee-salary/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.json();
      if (data.success && data.data) {
        const allExpenses = Object.values(data.data).flat();
        setExpenses(allExpenses);
        setFilteredExpenses(allExpenses.filter((expense) => expense.currency_title === "BDT"));
      } else {
        setError("Error fetching expense summary: " + (data.message || "No data returned"));
      }
    } catch (error) {
      setError("Error fetching expense summary: " + error.message);
    }
  };

  const fetchTotalCreditsSalary = async () => {
    try {
      const response = await fetch(`${url}/expense/all-salary-expense-summary/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.json();
      if (data.success && data.data) {
        // Transform the API response to match the expected structure
        const transformedData = Object.keys(data.data).reduce((acc, currency) => {
          const currencyData = data.data[currency];
          acc[currency] = {
            currency_sign: currency === "BDT" ? "৳" : currency === "Euro" ? "€" : "$",
            currency_title: currency,
            current_credit: currencyData.current_credit || 0,
            this_month_expense: currencyData.this_month_expense || 0,
            this_year_expense: currencyData.this_year_expense || 0,
          };
          return acc;
        }, {});
        setCurrencyData(transformedData);
        // Prioritize BDT as the default currency if it exists, otherwise use the first currency or empty string
        const availableCurrencies = Object.keys(transformedData);
        const defaultCurrency = availableCurrencies.includes("BDT") ? "BDT" : availableCurrencies[0] || "";
        setSelectedCurrency(defaultCurrency);
      } else {
        setError("Error fetching credit summary: " + (data.message || "No data returned"));
      }
    } catch (error) {
      setError("Error fetching credit summary: " + error.message);
    }
  };

  useEffect(() => {
    fetchTotalCreditsSalary();
    fetchExpenseAmountHistory();
  }, [url, token]);

  // Filter expenses based on year, month, date, and currency
  useEffect(() => {
    let filtered = [...expenses];
    if (selectedCurrency) {
      filtered = filtered.filter((expense) => expense.currency_title === selectedCurrency);
    }
    if (selectedYear) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.expense_date);
        return expenseDate.getFullYear().toString() === selectedYear;
      });
    }
    if (selectedMonth) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.expense_date);
        return (expenseDate.getMonth() + 1).toString().padStart(2, "0") === selectedMonth;
      });
    }
    if (selectedDate) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.expense_date).toISOString().split("T")[0];
        return expenseDate === selectedDate;
      });
    }
    setFilteredExpenses(filtered);
  }, [selectedYear, selectedMonth, selectedDate, selectedCurrency, expenses]);

  const handleEditSalary = (id) => {
    navigate(`/edit-salary-list/${id}`);
  };

  const handleAddExpense = () => {
    navigate("/add-employee-salary");
  };

  const handleDetailView = (id) => {
    navigate(`/expense-detail/${id}`);
  };
  const handleAddAmount = () => navigate("/add-total-salary-amount");
  const handleAllSalaryCreditAmountList = () => navigate("/total-salary-credit-amount-sumary");
  const handleYearlyExpense = () => navigate("/yearly-expense-amount");

  const handleDeleteSubAdmin = async () => {
    if (!selectedUserId) return;

    try {
      const response = await fetch(`${url}/expense/employee-salary/?employee_salary_id=${selectedUserId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        setExpenses(expenses.filter((expense) => expense.id !== selectedUserId));
        setFilteredExpenses(filteredExpenses.filter((expense) => expense.id !== selectedUserId));
        setIsModalOpen(false);
        setSelectedUserId(null);
      } else {
        setError("Failed to delete expense");
      }
    } catch (error) {
      setError("Error deleting expense: " + error.message);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  const toggleUserSelection = (id) => {
    setSelectedExpenseId((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const handlePDFPreview = async () => {
    try {
      const title = "Employee Salary List";
      const heading = [
        "ID",
        "Employee Name",
        "Basic 50%",
        "H.Rent 30%",
        "Medical 10%",
        "Other 10%",
        "Gross Salary",
        "Deduct",
        "Providient Fund",
        "Total Paid",
      ];
      const value = [
        "employees_id",
        "employee_name",
        "basic",
        "h_rent",
        "medical_allowance",
        "others",
        "gross_salary",
        "deduct",
        "provident_fund",
        "total_payable",
      ];
      const useCurrency = [
        "h_rent",
        "medical_allowance",
        "others",
        "gross_salary",
        "deduct",
        "provident_fund",
        "total_payable",
      ];
      console.log("filteredExpenses", filteredExpenses);
      const pdfData =
        selectedExpenseId.length > 0
          ? filteredExpenses.filter((expense) =>
              selectedExpenseId.includes(expense.id)
            )
          : filteredExpenses;
      const pdfDoc = pdf(
        myPDFDocument({ data: pdfData, heading, value, title, useCurrency })
      );

      const blob = await pdfDoc.toBlob();
      const url = URL.createObjectURL(blob);

      // Open the PDF in a new tab
      window.open(url, "_blank");

      // Optionally revoke after a few seconds to free memory
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handlePDFPreviewOfEmployeePaySlip = async (id) =>{
    try {
      const response = await fetch(
        `${url}/expense/employee-pay-slip/?employee_id=${id}`, // Replace 6 with the actual employee_id
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data && data.success && data.data) {
        const pdfDoc = pdf(<EmployeePaySlip data={data.data} />);
        const blob = await pdfDoc.toBlob();
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      } else {
        setError("Error fetching pay slip data: No data returned");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Error generating PDF: " + error.message);
    }
  };

  // Extract unique currencies from currencyData
  const currencies = Object.keys(currencyData);
  const years = [...new Set(expenses.map((expense) => new Date(expense.expense_date).getFullYear().toString()))]
    .sort()
    .reverse();

  // Month options (1-12, padded with leading zeros)
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  // Get selected currency data
  const selectedCurrencyData = currencyData[selectedCurrency] || {};
  // Fallback to currency code if currency_sign is not provided
  const currencySign = selectedCurrencyData.currency_sign || selectedCurrency || "৳";
  return (
    <div className="bg-white mt-16 p-4 sm:p-6 md:p-8 max-w-full mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-0"></h2>
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {Object.keys(currencyData).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Credit Amount", key: "current_credit", action: [handleAddAmount, handleAllSalaryCreditAmountList] },
          { label: "Current Expense", key: "this_month_expense" },
          { label: "Total Expense This Year", key: "this_year_expense", action: [null,  handleAllSalaryCreditAmountList] },
        ].map(({ label, key, action }, index) => (
          <div key={index} className="bg-white rounded-lg shadow border">
            <div className="bg-black text-white rounded-t-lg px-4 py-2 flex justify-between items-center">
              <h2 className="text-sm sm:text-base font-medium">{label}</h2>
              {action && (
                <div className="flex gap-3 text-lg">
                  {action[0] && <IoMdAddCircleOutline className="cursor-pointer" onClick={action[0]} />}
                  {action[1] && <IoIosListBox className="cursor-pointer" onClick={action[1]} />}
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-xs sm:text-sm text-gray-500 mb-2">
                Date: {new Date().toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="text-lg sm:text-xl font-semibold">
                {currencySign} {(parseFloat(selectedCurrencyData[key]) || 0).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-black rounded-t-lg text-white px-4 sm:px-6 py-2 sm:py-2 mt-4">
        <h1 className="text-lg sm:text-xl mb-2 sm:mb-0">Employee Salary List</h1>
        <div className="flex gap-4 text-lg sm:text-xl">
          <CiFilter
            className="cursor-pointer"
            onClick={() => setShowFilter(!showFilter)}
          />
          <BsFilePdfFill className="text-red-500 cursor-pointer" 
            onClick={handlePDFPreview}
          />
          <IoMdAddCircleOutline
            className="cursor-pointer"
            onClick={handleAddExpense}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Filter Dropdowns */}
      {showFilter && (
        <div className="p-4 bg-gray-100 rounded-md flex flex-col sm:flex-row gap-4 sm:gap-6 flex-wrap">
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mr-2">Monthly Filter:</label>
            <select
              className="mt-1 block w-32 border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">All Months</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mr-2">Date Filter:</label>
            <input
              type="date"
              className="mt-1 block w-32 border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                if (e.target.value) {
                  setSelectedYear("");
                  setSelectedMonth("");
                }
              }}
            />
          </div>
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mr-2">Currency Filter:</label>
            <select
              className="mt-1 block w-32 border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
            >
              <option value="">All Currencies</option>
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">
                <input
                  type="checkbox"
                  className="mr-2"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedExpenseId(filteredExpenses.map((expense) => expense.id));
                    } else {
                      setSelectedExpenseId([]);
                    }
                  }}
                  checked={selectedExpenseId.length === filteredExpenses.length && filteredExpenses.length > 0}
                />
              </th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left text-xs sm:text-sm">Date</th>
              <th className="border-b border-gray-300 p-2 sm:p-1 text-left text-xs sm:text-sm">ID</th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left text-xs sm:text-sm">Employee Name</th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left text-xs sm:text-sm">Basic 50%</th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left text-xs sm:text-sm">H.Rent 30%</th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left text-xs sm:text-sm">Medical 10%</th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left text-xs sm:text-sm">Other 10%</th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left text-xs sm:text-sm">Gross Salary</th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left text-xs sm:text-sm">Deduct</th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left text-xs sm:text-sm">Providient Fund</th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left text-xs sm:text-sm">Total Paid</th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left text-xs sm:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan="12" className="text-center p-4 text-gray-500">
                  No expenses found
                </td>
              </tr>
            ) : (
              filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="border-b border-gray-300 p-1 sm:p-1">
                    <input
                      type="checkbox"
                      checked={selectedExpenseId.includes(expense.id)}
                      onChange={() => toggleUserSelection(expense.id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="border-b border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">
                    {new Date(expense.date).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="border-b border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">{expense.employee_name || "—"}</td>
                  <td className="border-b border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">{expense.employees_id || "—"}</td>
                  <td className="border-b border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">{expense.currency_sign} {expense.basic || "—"}</td>
                  <td className="border-b border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">{expense.currency_sign} {expense.h_rent || "—"}</td>
                  <td className="border-b border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">{expense.currency_sign} {expense.medical_allowance || "—"}</td>
                  <td className="border-b border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">{expense.currency_sign} {expense.others || "—"}</td>
                  <td className="border-b border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">{expense.currency_sign} {expense.gross_salary || "—"}</td>
                  <td className="border-b border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">{expense.currency_sign} {expense.deduct || "—"}</td>
                  <td className="border-b border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">{expense.currency_sign} {expense.provident_fund || "—"}</td>
                  <td className="border-b border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">{expense.currency_sign} {expense.total_payable || "—"}</td>
                  <td className="border-b border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">
                    <div className="flex gap-2">
                      <button
                        className="text-purple-500 hover:text-purple-700"
                        onClick={() => handleEditSalary(expense.id)}
                      >
                        <FiEdit className="w-4 sm:w-5 h-4 sm:h-5" />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                      
                      >
                        <BsFilePdfFill className="w-4 sm:w-5 h-4 sm:h-5" 
                        onClick={() => handlePDFPreviewOfEmployeePaySlip(expense.id)}
                        />
                      </button>
                      
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => openDeleteModal(expense.id)}
                      >
                        <FiTrash2 className="w-4 sm:w-5 h-4 sm:h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center w-full max-w-sm">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Confirm Delete</h2>
            <p className="text-gray-700 text-sm sm:text-base">Are you sure you want to delete this expense?</p>
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                className="bg-red-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-red-700 text-sm sm:text-base"
                onClick={handleDeleteSubAdmin}
              >
                Delete
              </button>
              <button
                className="bg-green-300 px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-green-400 text-sm sm:text-base"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSalaryList;