import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { BsFilePdfFill, BsListTask } from "react-icons/bs";
import { CiFilter } from "react-icons/ci";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import useUserPermission from "../hooks/usePermission";

const AllExpenseList = () => {
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
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const { permissions } = useUserPermission();

  const fetchExpenseAmountHistory = async () => {
    try {
      const response = await fetch(`${url}/expense/list/`, {
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

  useEffect(() => {
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

  const handleEditExpenseCategory = (id) => {
    navigate(`/edit-expense-list/${id}`);
  };

  const handleAddExpense = () => {
    navigate("/add-expense");
  };

  const handleDetailView = (id) => {
    navigate(`/expense-detail/${id}`);
  };

  const handleDeleteSubAdmin = async () => {
    if (!selectedUserId) return;

    try {
      const response = await fetch(`${url}/expense/list/?expense_id=${selectedUserId}`, {
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

  // Extract unique currencies and years
  const currencies = [...new Set(expenses.map((expense) => expense.currency_title))];
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

  return (
    <div className="bg-white mt-16 p-4 sm:p-6 md:p-8 max-w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-black rounded-t-lg text-white px-4 sm:px-6 py-3 sm:py-4">
        <h1 className="text-lg sm:text-xl mb-2 sm:mb-0">Expense History</h1>
        <div className="flex gap-4 text-lg sm:text-xl">
          <CiFilter
            className="cursor-pointer"
            onClick={() => setShowFilter(!showFilter)}
          />
          <BsFilePdfFill className="text-red-500 cursor-pointer" />
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
        <div className="mt-4 p-4 bg-gray-100 rounded-md flex flex-col sm:flex-row gap-4 sm:gap-6 flex-wrap">
          <div className="">
            <label className="block text-sm font-medium text-gray-700 mr-2">Yearly Filter:</label>
            <select
              className="mt-1 block w-32 border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedMonth(""); // Reset month when year changes
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
                // Reset year and month when a specific date is selected
                if (e.target.value) {
                  setSelectedYear("");
                  setSelectedMonth("");
                }
              }}
            />
          </div>
          <div className=" min-w-[150px]">
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
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">Expense For</th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">Date</th>
              <th className="border-b border-gray usadas-300 p-2 sm:p-3 text-left text-xs sm:text-sm">Method</th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">Reference</th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">Category</th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">Quantity</th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">Unit Cost</th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">Sub Total</th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">Additional Cost</th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">Total</th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">Actions</th>
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
                  <td className="border-b border-gray-300 p-2 sm:p-3">
                    <input
                      type="checkbox"
                      checked={selectedExpenseId.includes(expense.id)}
                      onChange={() => toggleUserSelection(expense.id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">{expense.expense_for || "—"}</td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                    {new Date(expense.expense_date).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">{expense.payment_method || "—"}</td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">{expense.reference || "—"}</td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">{expense.expense_category_name || "—"}</td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">{parseFloat(expense.qty || 0).toFixed(2)}</td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                    {expense.currency_sign} {parseFloat(expense.unit_cost || 0).toFixed(2)}
                  </td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                    {expense.currency_sign} {parseFloat(expense.sub_total || 0).toFixed(2)}
                  </td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                    {expense.currency_sign} {parseFloat(expense.additional_cost || 0).toFixed(2)}
                  </td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                    {expense.currency_sign} {parseFloat(expense.total || 0).toFixed(2)}
                  </td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                    <div className="flex gap-2">
                      <button
                        className="text-purple-500 hover:text-purple-700"
                        onClick={() => handleEditExpenseCategory(expense.id)}
                      >
                        <FiEdit className="w-4 sm:w-5 h-4 sm:h-5" />
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

export default AllExpenseList;