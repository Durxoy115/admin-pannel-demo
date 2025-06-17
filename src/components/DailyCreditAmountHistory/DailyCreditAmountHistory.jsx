import React, { useEffect, useState } from "react";
import { BsFilePdfFill } from "react-icons/bs";
import { CiFilter } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";
import useToken from "../hooks/useToken";
import useUserPermission from "../hooks/usePermission";
import myPDFDocument from "../myPDFDocument";
import { pdf } from "@react-pdf/renderer";

const DailyCreditAmountHistory = () => {
  const { year, month } = useParams(); // Extract year and month from URL
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("BDT"); // Default to BDT
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const { permissions } = useUserPermission();

  // Calculate total amount
  const calculateTotalAmount = (expenses) => {
    return expenses.reduce((total, expense) => total + (parseFloat(expense.amount) || 0), 0);
  };

  const totalAmount = calculateTotalAmount(filteredExpenses);

  const fetchExpenseAmountHistory = async (month, year) => {
    try {
      const response = await fetch(
        `${url}/expense/credit-summary/?credit_id=daily-${month}-${year}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data && data.data && data.data.BDT) {
        setExpenses(data.data.BDT);
        setFilteredExpenses(
          data.data.BDT.filter((expense) => expense.currency_title === "BDT")
        );
      } else {
        setError("Error fetching daily summary: No data returned");
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
  const handlePDFPreview = async () => {
    try {
      const title = `Daily Debits and Credits History - ${year}-${month}`;
      const heading = ["Date", "Amount"];
      const value = ["date", "amount"];
      const useCurrency = ["amount"];
  
      const pdfData = filteredExpenses; // Use all filteredExpenses directly
  
      const showTotalAmount = pdfData.reduce(
        (totals, expense) => ({
          Total: totals.Total + (parseFloat(expense.amount) || 0),
        }),
        { Total: 0 }
      );
      showTotalAmount["currency_sign"] = pdfData[0]?.currency_sign || "";
      console.log("pdfCal", showTotalAmount);
  
      const pdfDoc = pdf(
        myPDFDocument({ data: pdfData, heading, value, title, useCurrency, showTotalAmount })
      );
      const blob = await pdfDoc.toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const currencies = [...new Set(expenses.map((expense) => expense.currency_title))];

  return (
    <div className="bg-white mt-16 p-4 sm:p-6 md:p-8 w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-black rounded-t-lg text-white px-4 sm:px-6 py-2 sm:py-2">
        <h1 className="text-lg sm:text-xl mb-2 sm:mb-0">
          Daily Credit History - {month} {year}
        </h1>
        <div className="flex gap-4 text-lg sm:text-xl">
          <CiFilter
            className="cursor-pointer"
            onClick={() => setShowFilter(!showFilter)}
          />
          <BsFilePdfFill className="text-red-500 cursor-pointer"
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

      {/* Currency Filter Dropdown */}
      {showFilter && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md flex flex-col sm:flex-row gap-4 sm:gap-6 flex-wrap">
          <div className="flex-1 min-w-[150px]">
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
                Date
              </th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-right text-xs sm:text-sm">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td
                  colSpan="2"
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
                  onClick={() => handleDetailView(expense.id)}
                >
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                    {new Date(expense.date).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="border-b border-gray-300 p-2 sm:p-3 text-right text-xs sm:text-sm">
                    {expense.currency_sign} {(parseFloat(expense.amount) || 0).toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {filteredExpenses.length > 0 && (
            <tfoot className="bg-gray-50">
              <tr>
                <td className="border-t border-gray-300 p-2 sm:p-3 text-right text-xs sm:text-sm font-semibold">
                  
                </td>
                <td className="border-t border-gray-300 p-2 sm:p-3 text-right text-xs sm:text-sm font-semibold">
                  Total: {filteredExpenses[0]?.currency_sign || "৳"} {totalAmount.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default DailyCreditAmountHistory;