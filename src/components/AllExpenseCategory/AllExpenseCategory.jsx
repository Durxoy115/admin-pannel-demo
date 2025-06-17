import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { IoMdAddCircleOutline, IoIosListBox } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import useUserPermission from "../hooks/usePermission";

const AllExpenseCategory = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedExpenseId, setSelectedExpenseId] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currencyData, setCurrencyData] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState("BDT");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const { permissions } = useUserPermission();

  const fetchExpenseCategory = async () => {
    try {
      const response = await fetch(`${url}/expense/category/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setExpenses(data.data || []);
      } else {
        setError("Error fetching expense categories: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      setError("Error fetching expense categories: " + error.message);
    }
  };

  const fetchTotalCredits = async () => {
    try {
      const response = await fetch(`${url}/expense/all-credit-expense-summary/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.json();
      if (data.success && data.data) {
        setCurrencyData(data.data);
        // Prioritize BDT as the default currency if it exists, otherwise use the first currency or empty string
        const availableCurrencies = Object.keys(data.data);
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
    fetchExpenseCategory();
    fetchTotalCredits();
  }, [url, token]);

  const handleEditExpenseCategory = (id) => navigate(`/edit-expense-category/${id}`);
  const handleAddAmount = () => navigate("/add-amount");
  const handleAllCreditAmountList = () => navigate("/all-credit-list");
  const handleAddExpenseCategory = () => navigate("/add-expense-category");
  const handleYearlyExpense = () => navigate("/yearly-expense-amount");

  const handleDeleteSubAdmin = async () => {
    if (!selectedUserId) return;
    try {
      const response = await fetch(
        `${url}/expense/category/?expense_category_id=${selectedUserId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (response.ok) {
        setExpenses(expenses.filter((user) => user.id !== selectedUserId));
        setIsModalOpen(false);
      } else {
        setError("Failed to delete expense category");
      }
    } catch (error) {
      setError("Error deleting expense category: " + error.message);
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

  const toggleUserSelection = (userId) => {
    setSelectedExpenseId((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // Get selected currency data
  const selectedCurrencyData = currencyData[selectedCurrency] || {};
  // Fallback to currency code if currency_sign is not provided
  const currencySign = selectedCurrencyData.currency_sign || selectedCurrency || "৳";

  return (
    <div className="bg-white mt-16 p-1 sm:p-6 md:p-8 w-full mx-auto">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md text-sm sm:text-base">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-0">
          
        </h2>
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
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
    { label: "Total Amount", key: "current_credit", action: [handleAddAmount, handleAllCreditAmountList] },
    { label: "Total Expense This Month", key: "this_month_expense" },
    { label: "Total Expense This Year", key: "this_year_expense", action: [null, handleYearlyExpense] },
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


      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-black rounded-t-lg text-white px-4 sm:px-6 py-2 sm:py-2 mt-6">
        <h1 className="text-base sm:text-xl mb-2 sm:mb-0">Expense Category List</h1>
        <IoMdAddCircleOutline
          className="text-lg sm:text-xl cursor-pointer"
          onClick={handleAddExpenseCategory}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm" colSpan={4}>
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-4">
                    <span className="w-4 h-4"></span>
                    <span className="text-xs sm:text-sm">SL</span>
                    <span className="text-xs sm:text-sm ml-12">Name</span>
                  </div>
                  <span className="text-xs sm:text-sm">Actions</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center p-4 text-gray-500 text-xs sm:text-sm"
                >
                  No expense categories found
                </td>
              </tr>
            ) : (
              expenses.map((expense, index) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="border-b border-gray-300 p-2 sm:p-3" colSpan={4}>
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedExpenseId.includes(expense?.id)}
                          onChange={() => toggleUserSelection(expense?.id)}
                          className="w-4 h-4"
                        />
                        <span className="text-xs sm:text-sm">{index + 1}</span>
                        <span className="text-xs sm:text-sm ml-12">{expense?.name}</span>
                      </div>
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
            <p className="text-gray-700 text-sm sm:text-base">
              Are you sure you want to delete this expense category?
            </p>
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

export default AllExpenseCategory;