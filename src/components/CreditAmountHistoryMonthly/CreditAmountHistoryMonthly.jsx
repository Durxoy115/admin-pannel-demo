import React, { useEffect, useState } from "react";
import { BsFilePdfFill, BsListTask } from "react-icons/bs";
import { CiFilter } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";
import useToken from "../hooks/useToken";
import useUserPermission from "../hooks/usePermission";
import myPDFDocument from "../myPDFDocument";
import { pdf } from "@react-pdf/renderer";

const CreditAmountHistoryMonthly = () => {
  const { year } = useParams();
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
      setSelectedYear(year);
    }
  }, [url, token, year]);

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

  // ✅ Toggle checkbox by index
  const toggleUserSelection = (index) => {
    setSelectedExpenseId((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handlePDFPreview = async () => {
    try {
   
  
      const title = `Monthly Debits and Credits History - ${year}`;
      const heading = ["Month", "Start Date", "End Date", "Receive Amount", "Total Expense"];
      const value = ["month", "start_date", "end_date", "total_amount", "total_expense"];
      const useCurrency = ["total_amount", "total_expense"];

      const pdfData = selectedExpenseId.length > 0
      ? filteredExpenses.filter((expense, index) => selectedExpenseId.includes(index))
      : filteredExpenses;
      console.log("pdfData", pdfData);
      const showTotalAmount = pdfData.reduce(
            (totals, expense) => ({
              Total_Receive: totals.Total_Receive + (parseFloat(expense.total_amount) || 0),
              Total_Expense: totals.Total_Expense + (parseFloat(expense.total_expense) || 0),
            }),
            { Total_Receive: 0, Total_Expense: 0 }
          );
      showTotalAmount["currency_sign"] = pdfData[0]?.currency_sign || "";
      console.log("pdfCal", showTotalAmount);
      const pdfDoc = pdf(
        myPDFDocument({ data: pdfData, heading, value, title, useCurrency, showTotalAmount})
      );
      const blob = await pdfDoc.toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };
  
 
  const currencies = [...new Set(expenses.map((e) => e.currency__currency))];
  const years = [...new Set(expenses.map((e) => new Date(e.start_date).getFullYear().toString()))]
    .sort()
    .reverse();

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
    <div className="bg-white mt-16 p-2 sm:p-6 w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-black rounded-t-lg text-white px-4 py-2">
        <h1 className="text-sm sm:text-xl">Monthly Credit History - {year}</h1>
        <div className="flex gap-4 text-lg sm:text-xl">
          <CiFilter onClick={() => setShowFilter(!showFilter)} className="cursor-pointer" />
          <BsFilePdfFill onClick={handlePDFPreview} className="text-red-500 cursor-pointer" />
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>
      )}

      {showFilter && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md flex flex-wrap gap-4">
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700">Year Filter:</label>
            <select
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedMonth("");
                setSelectedDate("");
              }}
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700">Month Filter:</label>
            <select
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setSelectedDate("");
              }}
            >
              <option value="">All Months</option>
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700">Date Filter:</label>
            <input
              type="date"
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                if (e.target.value) {
                  setSelectedYear("");
                  setSelectedMonth("");
                }
              }}
            />
          </div>
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700">Currency Filter:</label>
            <select
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
            >
              <option value="">All Currencies</option>
              {currencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border-b p-2 text-left text-sm">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedExpenseId(filteredExpenses.map((_, i) => i));
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
              <th className="border-b p-2 text-left text-sm">Month</th>
              <th className="border-b p-2 text-left text-sm">Start Date</th>
              <th className="border-b p-2 text-left text-sm">End Date</th>
              <th className="border-b p-2 text-left text-sm">Receive Amount</th>
              <th className="border-b p-2 text-left text-sm">Total Expense</th>
              <th className="border-b p-2 text-left text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500 text-sm">
                  No expenses found
                </td>
              </tr>
            ) : (
              filteredExpenses.map((expense, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border-b p-2">
                    <input
                      type="checkbox"
                      checked={selectedExpenseId.includes(index)}
                      onChange={() => toggleUserSelection(index)}
                    />
                  </td>
                  <td className="border-b p-2 text-sm">
                    {expense.month || new Date(expense.start_date).toLocaleString("default", { month: "long" })}
                  </td>
                  <td className="border-b p-2 text-sm">
                    {new Date(expense.start_date).toLocaleDateString("en-US")}
                  </td>
                  <td className="border-b p-2 text-sm">
                    {new Date(expense.end_date).toLocaleDateString("en-US")}
                  </td>
                  <td className="border-b p-2 text-sm">
                    {expense.currency_sign} {(parseFloat(expense.total_amount) || 0).toFixed(2)}
                  </td>
                  <td className="border-b p-2 text-sm">
                    {expense.currency_sign} {(parseFloat(expense.total_expense) || 0).toFixed(2)}
                  </td>
                  <td className="border-b p-2 text-sm">
                    <BsListTask
                      className="bg-green-300 text-xl p-1 rounded-md cursor-pointer"
                      onClick={() =>
                        handleDailyExpense(expense.month || new Date(expense.start_date).getMonth() + 1, year)
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
                <td colSpan="4" className="p-2 text-right font-semibold text-sm">Total:</td>
                <td className="p-2 text-sm">
                  {filteredExpenses[0]?.currency_sign || ""} {totalReceive.toFixed(2)}
                </td>
                <td className="p-2 text-sm">
                  {filteredExpenses[0]?.currency_sign || ""} {totalExpense.toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default CreditAmountHistoryMonthly;
