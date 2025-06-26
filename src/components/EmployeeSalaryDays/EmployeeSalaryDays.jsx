import React, { useEffect, useState } from "react";
import { BsFilePdfFill } from "react-icons/bs";
import { CiFilter } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";
import useToken from "../hooks/useToken";
import { FaRegTrashAlt } from "react-icons/fa";
import useUserPermission from "../hooks/usePermission";
import myPDFDocument from "../myPDFDocument";
import { pdf } from "@react-pdf/renderer";

const EmployeeSalaryDays = () => {
  const { year, month, id } = useParams(); // Extract year, month, and employeeId from URL
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("BDT"); // Default to BDT
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const { permissions } = useUserPermission();

  // Calculate total amount
  const calculateTotalAmount = (expenses) => {
    return expenses.reduce(
      (total, expense) => total + (parseFloat(expense.amount) || 0),
      0
    );
  };

  const totalAmount = calculateTotalAmount(filteredExpenses);

  const fetchExpenseAmountHistory = async (month, year, id) => {
    try {
      const response = await fetch(
        `${url}/expense/salary-summary/?summary_for=daily-${month}-${year}&employee_id=${id}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success && data.data) {
        // Handle both array and single object responses
        const expenseData = Array.isArray(data.data) ? data.data : [data.data];
        setExpenses(expenseData);
        setFilteredExpenses(
          expenseData.filter((expense) => expense.currency_title === "BDT")
        );
      } else {
        setExpenses([]);
        setFilteredExpenses([]);
        setError(
          data.message || "No expense data available for the selected period."
        );
      }
    } catch (error) {
      setExpenses([]);
      setFilteredExpenses([]);
      setError("Error fetching daily summary: " + error.message);
    }
  };

  useEffect(() => {
    if (month && year && id) {
      fetchExpenseAmountHistory(month, year, id);
    } else {
      setError("Year, month, or employee ID is missing from the URL.");
    }
  }, [url, token, year, month, id]);

  // Filter expenses based on selected currency
  useEffect(() => {
    const filtered = selectedCurrency
      ? expenses.filter(
          (expense) => expense.currency_title === selectedCurrency
        )
      : expenses;
    setFilteredExpenses(filtered);
  }, [selectedCurrency, expenses]);

  const handlePDFPreview = async () => {
    try {
      const title = `Daily Debits History - ${year}-${month}`;
      const heading = ["Date", "Amount"];
      const value = ["payment_date", "amount"];
      const useCurrency = ["amount"];

      const pdfData = filteredExpenses; // Use all filteredExpenses directly

      if (pdfData.length === 0) {
        setError("No data available for PDF generation.");
        return;
      }

      const showTotalAmount = pdfData.reduce(
        (totals, expense) => ({
          Total: totals.Total + (parseFloat(expense.amount) || 0),
        }),
        { Total: 0 }
      );
      showTotalAmount["currency_sign"] = pdfData[0]?.currency_sign || "";

      const pdfDoc = pdf(
        myPDFDocument({
          data: pdfData,
          heading,
          value,
          title,
          useCurrency,
          showTotalAmount,
        })
      );
      const blob = await pdfDoc.toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Error generating PDF: " + error.message);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      const response = await fetch(
        `${url}/expense/monthly-salary/?monthly_salary_id=${expenseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        setExpenses(expenses.filter((expense) => expense.id !== expenseId));
        setFilteredExpenses(
          filteredExpenses.filter((expense) => expense.id !== expenseId)
        );
        setSuccessMessage("Expense deleted successfully!");
        setShowDeleteModal(false);
        setExpenseToDelete(null);
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(data.message || "Failed to delete expense");
        setShowDeleteModal(false);
      }
    } catch (error) {
      setError("Error deleting expense: " + error.message);
      setShowDeleteModal(false);
    }
  };

  const openDeleteModal = (expenseId) => {
    setExpenseToDelete(expenseId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setExpenseToDelete(null);
  };

  const currencies = [
    ...new Set(expenses.map((expense) => expense.currency_title)),
  ];

  return (
    <div className="bg-white mt-16 p-4 sm:p-6 md:p-8 w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-black rounded-t-lg text-white px-4 sm:px-6 py-2 sm:py-2">
        <h1 className="text-lg sm:text-xl mb-2 sm:mb-0">
          Daily Salary Expense History - {month} {year}
        </h1>
        <div className="flex gap-4 text-lg sm:text-xl">
          <CiFilter
            className="cursor-pointer"
            onClick={() => setShowFilter(!showFilter)}
          />
          <BsFilePdfFill
            className="text-red-500 cursor-pointer"
            onClick={handlePDFPreview}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md text-sm sm:text-base">
          {successMessage}
        </div>
      )}

      {/* Currency Filter Dropdown */}
      {showFilter && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md flex flex-col sm:flex-row gap-4 sm:gap-6 flex-wrap">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700">
              Currency Filter:
            </label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
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
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">
                Date
              </th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-right text-xs sm:text-sm">
                Amount
              </th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-right text-xs sm:text-sm">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="text-center p-4 text-gray-500 text-xs sm:text-sm"
                >
                  No expenses found
                </td>
              </tr>
            ) : (
              filteredExpenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                    {new Date(expense.payment_date).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-right text-xs sm:text-sm">
                    {expense.currency_sign}{" "}
                    {(parseFloat(expense.amount) || 0).toFixed(2)}
                  </td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-end text-xs sm:text-sm">
                    <div className="flex justify-end">
                      <FaRegTrashAlt
                        className="bg-red-300 text-xl text-red-600 p-1 rounded-md cursor-pointer"
                        onClick={() => openDeleteModal(expense.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {filteredExpenses.length > 0 && (
            <tfoot className="bg-gray-50">
              <tr>
                <td className="border-t border-gray-300 p-2 sm:p-3 text-right text-xs sm:text-sm font-semibold"></td>
                <td className="border-t border-gray-300 p-2 sm:p-3 text-right text-xs sm:text-sm font-semibold">
                  Total: {filteredExpenses[0]?.currency_sign || "৳"}{" "}
                  {totalAmount.toFixed(2)}
                </td>
                <td className="border-t border-gray-300 p-2 sm:p-3"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this expense?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                onClick={() => handleDeleteExpense(expenseToDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSalaryDays;