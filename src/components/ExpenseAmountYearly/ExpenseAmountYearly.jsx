import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { BsFilePdfFill, BsListTask } from "react-icons/bs";
import { CiFilter } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import useUserPermission from "../hooks/usePermission";
import { pdf } from "@react-pdf/renderer";
import myPDFDocument from "../myPDFDocument";

const ExpenseAmountyearly = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedExpenseId, setSelectedExpenseId] = useState([]);

  const [showFilter, setShowFilter] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("BDT");
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  const { permissions } = useUserPermission();

  const fetchExpenseAmountHistory = async () => {
    try {
      const response = await fetch(`${url}/expense/summary/?expense_id=yearly`, {
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
    fetchExpenseAmountHistory();
  }, [url, token]);

  useEffect(() => {
    let filtered = [...expenses];
    if (selectedCurrency) {
      filtered = filtered.filter((expense) => expense.currency__currency === selectedCurrency);
    }
    if (selectedYear) {
      filtered = filtered.filter((expense) => expense.year === selectedYear);
    }
    setFilteredExpenses(filtered);
  }, [selectedYear, selectedCurrency, expenses]);

  const handleMonthlyExpense = (year) => {
    navigate(`/monthly-expense-amount/${year}`);
  };

  const toggleUserSelection = (index) => {
    setSelectedExpenseId((prev) =>
      prev.includes(index)
        ? prev.filter((id) => id !== index)
        : [...prev, index]
    );
  };

   // Generate and preview PDF
   const handlePDFPreview = async () => {
    try {

      const title = "Yearly Money Receive and Expense History"
      const heading = ["Year", "Start Date", "End Date", "Receive Amount", "Total Expense"];
      const value = ["year", "start_date", "end_date", "total_amount", "total_expense"];
      const useCurrency = ["total_amount", "total_expense"];
      const pdfData = selectedExpenseId.length > 0
      ? filteredExpenses.filter((expense, index) => selectedExpenseId.includes(index))
      : filteredExpenses;
      const pdfDoc = pdf(myPDFDocument({ data: pdfData, heading, value, title,useCurrency }));
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
  

  // Close modal and clean up URL
  

  const currencies = [...new Set(expenses.map((expense) => expense.currency__currency))];
  const years = [...new Set(expenses.map((expense) => expense.year))].sort().reverse();

  return (
    <div className="bg-white mt-20 p-1 md:p-8 ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-black rounded-t-lg text-white pl-8 sm:pl-4 pr-3 sm:pr-4 py-2 sm:py-3">
        <h1 className="text-lg sm:text-lg mb-2 sm:mb-0">Yearly Expense History</h1>
        <div className="flex gap-4">
          <CiFilter
            className="text-lg sm:text-xl cursor-pointer"
            onClick={() => setShowFilter(!showFilter)}
          />
          <BsFilePdfFill className="text-red-500" 
           onClick={handlePDFPreview}/>
        </div>
      </div>

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
                  {expense.year}
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
                    onClick={() => handleMonthlyExpense(expense?.year)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
            {/* PDF Preview Modal */}
         
    </div>
  );
};

export default ExpenseAmountyearly;