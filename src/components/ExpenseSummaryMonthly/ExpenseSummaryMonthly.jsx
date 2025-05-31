import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { BsFilePdfFill, BsListTask } from "react-icons/bs";
import { CiFilter } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";
import useToken from "../hooks/useToken";
import useUserPermission from "../hooks/usePermission";

const ExpenseSummaryMonthly = () => {
  const { year } = useParams(); // Extract year from URL
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedExpenseId, setSelectedExpenseId] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("BDT"); // Default to BDT
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  const { permissions } = useUserPermission();

  const fetchExpenseAmountHistory = async (year) => {
    try {
      const response = await fetch(`${url}/expense/summary/?expense_id=monthly-${year}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        const flattenedExpenses = Object.values(data.data).flat();
        setExpenses(flattenedExpenses);
        const bdtExpenses = flattenedExpenses.filter(
          (expense) => expense.currency__currency === "BDT"
        );
        setFilteredExpenses(bdtExpenses);
      } else {
        console.error("Error fetching credit summary:", data.message);
      }
    } catch (error) {
      console.error("Error fetching credit summary:", error);
    }
  };

  useEffect(() => {
    if (year) {
      fetchExpenseAmountHistory(year);
    }
  }, [url, token, year]);

  // Filter expenses based on selected currency
  useEffect(() => {
    let filtered = [...expenses];
    if (selectedCurrency) {
      filtered = filtered.filter((expense) => expense.currency__currency === selectedCurrency);
    }
    setFilteredExpenses(filtered);
  }, [selectedCurrency, expenses]);

  const handleDailyExpense = (month, year) => {
    navigate(`/daily-expense/${month}/${year}`);
  };

  const toggleUserSelection = (index) => {
    setSelectedExpenseId((prev) =>
      prev.includes(index)
        ? prev.filter((id) => id !== index)
        : [...prev, index]
    );
  };

  const currencies = [...new Set(expenses.map((expense) => expense.currency__currency))];

  return (
    <div className="bg-white mt-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-black rounded-t-lg text-white pl-8 sm:pl-4 pr-3 sm:pr-4 py-2 sm:py-3">
        <h1 className="text-lg sm:text-lg mb-2 sm:mb-0">Monthly Expense History - {year}</h1>
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
                Month
              </th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">
                Start Date
              </th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">
                End Date
              </th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">
                Receive Amount
              </th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">
                Total Expense
              </th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border-b border-gray-300 p-2 sm:p-3">
                  <input
                    type="checkbox"
                    checked={selectedExpenseId.includes(index)}
                    onChange={() => toggleUserSelection(index)}
                    className="w-4 h-4"
                  />
                </td>
                <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                  {expense.month} {/* Assuming API provides a month field */}
                </td>
                <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                  {expense.start_date}
                </td>
                <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                  {expense.end_date}
                </td>
                <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                  {expense.currency_sign} {expense.total_amount.toFixed(2)}
                </td>
                <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                  {expense.currency_sign} {expense.total_expense.toFixed(2)}
                </td>
                <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                  <BsListTask
                    className="bg-green-300 text-xl p-1 rounded-md"
                    onClick={() => handleDailyExpense(expense.month, year)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseSummaryMonthly;