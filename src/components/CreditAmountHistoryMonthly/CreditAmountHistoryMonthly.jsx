import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { BsFilePdfFill, BsListTask } from "react-icons/bs";
import { CiFilter } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";
import useToken from "../hooks/useToken";
import useUserPermission from "../hooks/usePermission";

const CreditAmountHistoryMonthly = () => {
  const { year } = useParams(); // Extract year from URL
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedExpenseId, setSelectedExpenseId] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("BDT");
  const [selectedYear, setSelectedYear] = useState(year || "");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const { permissions } = useUserPermission();

  // Calculate totals
  const calculateTotals = (expenses) => {
    return expenses.reduce(
      (totals, expense) => ({
        totalReceive: totals.totalReceive + (parseFloat(expense.total_amount) || 0),
        totalExpense: totals.totalExpense + (parseFloat(expense.total_expense) || 0),
      }),
      { totalReceive: 0, totalExpense: 0 }
    );
  };

  const { totalReceive, totalExpense } = calculateTotals(filteredExpenses);

  const fetchExpenseAmountHistory = async (year) => {
    try {
      const response = await fetch(`${url}/expense/credit-summary/?credit_id=monthly-${year}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.json();
      if (data.success && data.data) {
        const flattenedExpenses = Object.values(data.data).flat();
        setExpenses(flattenedExpenses);
        setFilteredExpenses(
          flattenedExpenses.filter((expense) => expense.currency__currency === "BDT")
        );
      } else {
        setError("Error fetching credit summary: " + (data.message || "No data returned"));
      }
    } catch (error) {
      setError("Error fetching credit summary: " + error.message);
    }
  };

  useEffect(() => {
    if (year) {
      fetchExpenseAmountHistory(year);
      setSelectedYear(year); // Set default year from URL
    }
  }, [url, token, year]);

  // Filter expenses based on currency, year, month, and date
  useEffect(() => {
    let filtered = [...expenses];
    if (selectedCurrency) {
      filtered = filtered.filter((expense) => expense.currency__currency === selectedCurrency);
    }
    if (selectedYear) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.start_date);
        return expenseDate.getFullYear().toString() === selectedYear;
      });
    }
    if (selectedMonth) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.start_date);
        return (expenseDate.getMonth() + 1).toString().padStart(2, "0") === selectedMonth;
      });
    }
    if (selectedDate) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.start_date).toISOString().split("T")[0];
        return expenseDate === selectedDate;
      });
    }
    setFilteredExpenses(filtered);
  }, [selectedCurrency, selectedYear, selectedMonth, selectedDate, expenses]);

  const handleDailyExpense = (month, year) => {
    navigate(`/daily-credit-list/${month}/${year}`);
  };

  const toggleUserSelection = (id) => {
    setSelectedExpenseId((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  // Extract unique currencies and years
  const currencies = [...new Set(expenses.map((expense) => expense.currency__currency))];
  const years = [
    ...new Set(expenses.map((expense) => new Date(expense.start_date).getFullYear().toString())),
  ]
    .sort()
    .reverse();

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
    <div className="bg-white mt-16 p-2 sm:p-6 md:p-6 w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-black rounded-t-lg text-white px-4 sm:px-6 py-2 sm:py-2">
        <h1 className="text-sm sm:text-xl  sm:mb-0">Monthly Credit History - {year}</h1>
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

      {/* Filter Section */}
      {showFilter && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md flex flex-col sm:flex-row gap-4 sm:gap-6 flex-wrap">
          <div className=" min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700">Year Filter:</label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedMonth(""); // Reset month when year changes
                setSelectedDate(""); // Reset date when year changes
              }}
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className=" min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700">Month Filter:</label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setSelectedDate(""); // Reset date when month changes
              }}
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
            <label className="block text-sm font-medium text-gray-700">Date Filter:</label>
            <input
              type="date"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                if (e.target.value) {
                  setSelectedYear(""); // Reset year when date is selected
                  setSelectedMonth(""); // Reset month when date is selected
                }
              }}
            />
          </div>
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

      <div className="overflow-x-auto ">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100 sticky top-0 z-10">
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
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">Month</th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">Start Date</th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">End Date</th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">Receive Amount</th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">Total Expense</th>
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
                    {expense.month || new Date(expense.start_date).toLocaleString("default", { month: "long" })}
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
                    {expense.currency_sign} {(parseFloat(expense.total_amount) || 0).toFixed(2)}
                  </td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                    {expense.currency_sign} {(parseFloat(expense.total_expense) || 0).toFixed(2)}
                  </td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                    <BsListTask
                      className="bg-green-300 text-xl p-1 rounded-md cursor-pointer"
                      onClick={() => handleDailyExpense(expense.month || new Date(expense.start_date).getMonth() + 1, year)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {filteredExpenses.length > 0 && (
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan="4" className="border-t border-gray-300 p-2 sm:p-3 text-right text-xs sm:text-sm font-semibold">
                  
                </td>
                <td className="border-t border-gray-300 p-2 sm:p-3 text-xs sm:text-sm ">
                 Total Receive: {filteredExpenses[0]?.currency_sign || "৳"} {totalReceive.toFixed(2)}
                </td>
                <td className="border-t border-gray-300 p-2 sm:p-3 text-xs sm:text-sm ">
                 Total Expense: {filteredExpenses[0]?.currency_sign || "৳"} {totalExpense.toFixed(2)}
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

export default CreditAmountHistoryMonthly;