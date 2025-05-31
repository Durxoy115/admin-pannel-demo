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
  const [selectedCurrency, setSelectedCurrency] = useState("BDT"); // Default to BDT
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const { permissions } = useUserPermission();

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
      if (data && data.data && data.data.BDT) {
        // Use data.data.BDT directly since it's already an array
        setExpenses(data.data.BDT);
        setFilteredExpenses(
          data.data.BDT.filter((expense) => expense.currency_title === "BDT")
        );
      } else {
        console.error("Error fetching daily summary: No data returned");
      }
    } catch (error) {
      console.error("Error fetching daily summary:", error);
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
    <div className="bg-white mt-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-black rounded-t-lg text-white pl-8 sm:pl-4 pr-3 sm:pr-4 py-2 sm:py-3">
        <h1 className="text-lg sm:text-lg mb-2 sm:mb-0">Daily Expense History - {month} {year}</h1>
        <div className="flex gap-4">
          <CiFilter
            className="text-lg sm:text-xl cursor-pointer"
            onClick={() => setShowFilter(!showFilter)}
          />
          <BsFilePdfFill className="text-red-500" />
        </div>
      </div>

      {/* Currency Filter Dropdown */}
      {showFilter && (
        <div className="p-4 bg-gray-100 flex flex-col sm:flex-row gap-4">
          <div>
            <label className="mr-2">Currency Filter: </label>
            <select
              className="p-2 border rounded"
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
                <input type="checkbox" className="mr-2" />
              </th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">
                Date
              </th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">
                Category
              </th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">
                Total
              </th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">
                Payment Method
              </th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">
                Description
              </th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
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
                  {new Date(expense.expense_date).toLocaleDateString()}
                </td>
                <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                  {expense.expense_category_name}
                </td>
                <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                  {expense.currency_sign} {expense.total}
                </td>
                <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                  {expense.payment_method}
                </td>
                <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                  {expense.description}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyExpenseHistory;