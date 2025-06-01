import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { BsFilePdfFill, BsListTask } from "react-icons/bs";
import { CiFilter } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";
import useToken from "../hooks/useToken";
import useUserPermission from "../hooks/usePermission";

const DailyExpenseHistory = () => {
  const { year, month } = useParams(); // Extract year and month from URL
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedExpenseId, setSelectedExpenseId] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(""); // No default currency
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const { permissions } = useUserPermission();

  // Calculate total amount
  const calculateTotalAmount = (expenses) => {
    return expenses.reduce((total, expense) => total + (parseFloat(expense.total) || 0), 0);
  };

  const totalAmount = calculateTotalAmount(filteredExpenses);

  const fetchExpenseAmountHistory = async (month, year) => {
    try {
      const response = await fetch(
        `${url}/expense/summary/?expense_id=daily-${month}-${year}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success && data.data) {
        // Flatten all currency data
        const flattenedExpenses = Object.values(data.data).flat();
        setExpenses(flattenedExpenses);
        setFilteredExpenses(flattenedExpenses);
        // Set default currency to the first available
        const firstCurrency = [...new Set(flattenedExpenses.map((exp) => exp.currency_title))][0] || "";
        setSelectedCurrency(firstCurrency);
      } else {
        setError("Error fetching daily summary: " + (data.message || "No data returned"));
      }
    } catch (error) {
      setError("Error fetching daily summary: " + error.message);
    }
  };

  useEffect(() => {
    if (month && year) {
      fetchExpenseAmountHistory(month, year);
    }
  }, [url, token, year, month]);

  // Filter expenses based on selected currency
  useEffect(() => {
    const filtered = selectedCurrency
      ? expenses.filter((expense) => expense.currency_title === selectedCurrency)
      : expenses;
    setFilteredExpenses(filtered);
  }, [selectedCurrency, expenses]);

  const handleDetailView = (expenseId) => {
    navigate(`/expense-detail/${year}/${month}/${expenseId}`);
  };

  const toggleUserSelection = (id) => {
    setSelectedExpenseId((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const currencies = [...new Set(expenses.map((expense) => expense.currency_title))];

  return (
    <div className="bg-white mt-16 p-4 sm:p-6 md:p-8 w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-black rounded-t-lg text-white px-4 sm:px-6 py-2 sm:py-2">
        <h1 className="text-base sm:text-xl mb-2 sm:mb-0">
          Daily Expense History - {month} {year}
        </h1>
        <div className="flex gap-4 text-lg sm:text-xl">
          <CiFilter
            className="cursor-pointer"
            onClick={() => setShowFilter(!showFilter)}
          />
          <BsFilePdfFill className="text-red-500 cursor-pointer" />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Currency Filter Dropdown */}
      {showFilter && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md flex flex-col sm:flex-row gap-4 sm:gap-6 flex-wrap">
          <div className=" min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700">Currency Filter:</label>
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
                <input
                  type="checkbox"
                  className="w-4 h-4"
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
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">Date</th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">Category</th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">Expense For</th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">Payment Method</th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">Total</th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500 text-xs sm:text-sm">
                  No expenses found
                </td>
              </tr>
            ) : (
              filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="border-b border-gray-300 p-2 sm:p-3">
                    <input
                      type="checkbox"
                      checked={selectedExpenseId.includes(expense.id)}
                      onChange={() => toggleUserSelection(expense.id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                    {new Date(expense.expense_date).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                    {expense.expense_category_name || "N/A"}
                  </td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                    {expense.expense_for || "N/A"}
                  </td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                    {expense.payment_method || "N/A"}
                  </td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                    {expense.currency_sign} {(parseFloat(expense.total) || 0).toFixed(2)}
                  </td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                    <div className="flex gap-2">
                      <BsListTask
                        className="bg-green-300 text-xl p-1 rounded-md cursor-pointer"
                        onClick={() => handleDetailView(expense.id)}
                      />
                      {permissions.includes("edit_expense") && (
                        <FiEdit className="text-blue-500 text-xl cursor-pointer" />
                      )}
                      {permissions.includes("delete_expense") && (
                        <FiTrash2 className="text-red-500 text-xl cursor-pointer" />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {filteredExpenses.length > 0 && (
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan="5" className="border-t border-gray-300 p-2 sm:p-3 text-right text-xs sm:text-sm font-semibold">
                  Total:
                </td>
                <td className="border-t border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                  {filteredExpenses[0]?.currency_sign || "৳"} {totalAmount.toFixed(2)}
                </td>
                <td className="border-t border-gray-300 p-2 sm:p-3"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default DailyExpenseHistory;