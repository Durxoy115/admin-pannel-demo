import React, { useEffect, useState } from "react";
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
  const [selectedMonth, setSelectedMonth] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const { permissions } = useUserPermission();

  // Calculate total expense
  const calculateTotalExpense = (expenses) => {
    return expenses.reduce(
      (total, expense) => total + (parseFloat(expense.total_expense) || 0),
      0
    );
  };

  const totalExpense = calculateTotalExpense(filteredExpenses);

  const fetchExpenseAmountHistory = async (year) => {
    try {
      const response = await fetch(
        `${url}/expense/summary/?expense_id=monthly-${year}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success && data.data) {
        const flattenedExpenses = Object.values(data.data).flat();
        setExpenses(flattenedExpenses);
        setFilteredExpenses(
          flattenedExpenses.filter(
            (expense) => expense.currency__currency === "BDT"
          )
        );
      } else {
        setError(
          "Error fetching expense summary: " +
            (data.message || "No data returned")
        );
      }
    } catch (error) {
      setError("Error fetching expense summary: " + error.message);
    }
  };

  useEffect(() => {
    if (year) {
      fetchExpenseAmountHistory(year);
    }
  }, [url, token, year]);

  // Filter expenses based on selected currency and month
  useEffect(() => {
    let filtered = [...expenses];
    if (selectedCurrency) {
      filtered = filtered.filter(
        (expense) => expense.currency__currency === selectedCurrency
      );
    }
    if (selectedMonth) {
      filtered = filtered.filter((expense) => {
        const expenseMonth =
          expense.month ||
          (new Date(expense.start_date).getMonth() + 1)
            .toString()
            .padStart(2, "0");
        return expenseMonth === selectedMonth;
      });
    }
    setFilteredExpenses(filtered);
  }, [selectedCurrency, selectedMonth, expenses]);

  const handleDailyExpense = (month, year) => {
    // Ensure month is padded with leading zero
    const paddedMonth = month.toString().padStart(2, "0");
    navigate(`/daily-expense/${paddedMonth}/${year}`);
  };

  const toggleUserSelection = (id) => {
    setSelectedExpenseId((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const currencies = [
    ...new Set(expenses.map((expense) => expense.currency__currency)),
  ];

  // Month options
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

  return (
    <div className="bg-white mt-16 p-4 sm:p-6 md:p-8 w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-black rounded-t-lg text-white px-4 sm:px-6 py-2 sm:py-2">
        <h1 className="text-base sm:text-lg mb-1 sm:mb-0">
          Monthly Expense History - {year}
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

      {/* Filters */}
      {showFilter && (
        <div className="mt-2 p-2 rounded-md flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap">
          <div className="min-w-[150px]">
            <label className="block text-xs font-medium text-gray-700">
              Currency Filter:
            </label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
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
          <div className="min-w-[150px]">
            <label className="block text-xs font-medium text-gray-700">
              Month Filter:
            </label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
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
        </div>
      )}

      <div className="overflow-x-auto ">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedExpenseId(
                        filteredExpenses.map((expense) => expense.id)
                      );
                    } else {
                      setSelectedExpenseId([]);
                    }
                  }}
                  checked={
                    selectedExpenseId.length === filteredExpenses.length &&
                    filteredExpenses.length > 0
                  }
                />
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
            {filteredExpenses.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center p-4 text-gray-500 text-xs sm:text-sm"
                >
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
                    {expense.month ||
                      new Date(expense.start_date).toLocaleString("default", {
                        month: "long",
                      })}
                  </td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                    {new Date(expense.start_date).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                    {new Date(expense.end_date).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                    {expense.currency_sign}{" "}
                    {(parseFloat(expense.total_amount) || 0).toFixed(2)}
                  </td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                    {expense.currency_sign}{" "}
                    {(parseFloat(expense.total_expense) || 0).toFixed(2)}
                  </td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                    <BsListTask
                      className="bg-green-300 text-xl p-1 rounded-md cursor-pointer"
                      onClick={() =>
                        handleDailyExpense(
                          expense.month ||
                            (
                              new Date(expense.start_date).getMonth() + 1
                            ).toString(),
                          year
                        )
                      }
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {filteredExpenses.length > 0 && (
            <tfoot className="bg-gray-50">
              <tr>
                <td
                  colSpan="5"
                  className="border-t border-gray-300 p-2 sm:p-3 text-right text-xs sm:text-sm font-semibold"
                >
                  Total:
                </td>
                <td className="border-t border-gray-300 p-2 sm:p-3 text-xs sm:text-sm font-semibold">
                  {filteredExpenses[0]?.currency_sign || "৳"}{" "}
                  {totalExpense.toFixed(2)}
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

export default ExpenseSummaryMonthly;
