import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { BsFilePdfFill,BsListTask } from "react-icons/bs";
import { CiFilter } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import useUserPermission from "../hooks/usePermission";

const AllCreditAmountHistory = () => {
  const [creditAmounts, setCreditAmounts] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]); // For filtered data
  const [selectedExpenseId, setSelectedExpenseId] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedYear, setSelectedYear] = useState(""); // Track selected year
  const [selectedCurrency, setSelectedCurrency] = useState("BDT"); // Default to BDT
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  const { permissions } = useUserPermission();

  const fetchExpenseAmountHistory = async () => {
    try {
      const response = await fetch(`${url}/expense/credit-summary/?credit_id=yearly`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        const flattenedExpenses = Object.values(data.data).flat();
        setCreditAmounts(flattenedExpenses);
        // Default to BDT data only
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
    fetchExpenseAmountHistory();
  }, [url, token]);

  // Filter expenses based on selected year and currency
  useEffect(() => {
    let filtered = [...creditAmounts];
    if (selectedCurrency) {
      filtered = filtered.filter((expense) => expense.currency__currency === selectedCurrency);
    }
    if (selectedYear) {
      filtered = filtered.filter((expense) => expense.year === selectedYear);
    }
    setFilteredExpenses(filtered);
  }, [selectedYear, selectedCurrency, creditAmounts]);

 

  const handleMonthlyCredit = (year) => {
    navigate(`/monthly-credit-list/${year}`);
  };

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
        setCreditAmounts(creditAmounts.filter((expense) => expense.id !== selectedUserId));
        setFilteredExpenses(filteredExpenses.filter((expense) => expense.id !== selectedUserId));
        setIsModalOpen(false);
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
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
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Extract unique currencies and years from expenses
  const currencies = [...new Set(creditAmounts.map((expense) => expense.currency__currency))];
  const years = [...new Set(creditAmounts.map((expense) => expense.year))].sort().reverse();

  return (
    <div className="bg-white mt-16 md:mt-20 px-1 md:px-8 ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-black rounded-t-lg text-white pl-8 sm:pl-4 pr-3 sm:pr-4 py-2 sm:py-2">
        <h1 className="text-lg sm:text-lg mb-2 sm:mb-0">Yearly Add Amount History</h1>
        <div className="flex gap-4">
          <CiFilter
            className="text-lg sm:text-xl cursor-pointer"
            onClick={() => setShowFilter(!showFilter)}
          />
          <BsFilePdfFill className="text-red-500" />
        </div>
      </div>

      {/* Yearly and Currency Filter Dropdowns */}
      {showFilter && (
        <div className="p-4 bg-gray-100 flex flex-col sm:flex-row gap-4">
          <div>
            <label className="mr-2">Yearly Filter: </label>
            <select
              className="p-2 border rounded"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
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
                Year
              </th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">
                Start Date
              </th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">
                End Date
              </th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm">
                Total Add Amount
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
            {filteredExpenses.map((credit, index) => (
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
                  {credit.year}
                </td>
                <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                  {credit.start_date}
                </td>
                <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                  {credit.end_date}
                </td>
                <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                  {credit.currency__sign} {credit.total_amount.toFixed(2)}
                </td>
                <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                  {credit.currency__sign} {credit.total_expense.toFixed(2)}
                </td>
                <td className=" border-gray-300 p-2 sm:p-3 flex gap-2">
                 <BsListTask className="bg-green-300 text-xl p-1 rounded-md"
                 onClick={() => handleMonthlyCredit(credit?.year)}
                 />
                 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center w-full max-w-sm">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-700 text-sm sm:text-base">
              Are you sure you want to delete this member?
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

export default AllCreditAmountHistory;