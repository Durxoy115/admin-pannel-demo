import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { BsFilePdfFill, BsListTask } from "react-icons/bs";
import { CiFilter } from "react-icons/ci";
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import useToken from "../hooks/useToken";
import useUserPermission from "../hooks/usePermission";
import myPDFDocument from "../myPDFDocument";
import { pdf } from "@react-pdf/renderer";

const YearlySingleEmployeeSalary = () => {
  const { id } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedExpenseId, setSelectedExpenseId] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [error, setError] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(""); // Default to empty for all currencies
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const { permissions } = useUserPermission();

  const fetchSalaryHistory = async () => {
    try {
      const response = await fetch(
        `${url}/expense/salary-summary/?summary_for=yearly&employee_id=${id}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setExpenses(data.data); // No need to flatten, data.data is already an array
        setFilteredExpenses(data.data); // Initialize with all expenses
      } else {
        console.error("Error fetching salary summary:", data.message);
      }
    } catch (error) {
      console.error("Error fetching salary summary:", error);
    }
  };

  useEffect(() => {
    fetchSalaryHistory();
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

  // const handleMonthlyExpense = (year) => {
  //   navigate(`/monthly-salary-amount/${year}`);
  // };

  const toggleUserSelection = (index) => {
    setSelectedExpenseId((prev) =>
      prev.includes(index)
        ? prev.filter((id) => id !== index)
        : [...prev, index]
    );
  };
  // const handleAddYearlySalary = (id) => {
  //   navigate(`/add-monthly-salary/${id}`);
  // };

  const currencies = [
    ...new Set(expenses.map((expense) => expense.currency__currency)),
  ];
  const years = [...new Set(expenses.map((expense) => expense.year))]
    .sort()
    .reverse();
    const handlePDFPreview = async (year) => {
      try {
        const title = `Yearly Single Employee Salary History - ${year}`;
        const heading = ["Year", "Start Date", "End Date", "Total Amount"];
        const value = [ "year", "start_date", "end_date", "total_salary"];
        const useCurrency = ["total_salary"];
  
        const pdfData = selectedExpenseId.length > 0
          ? filteredExpenses.filter((_, index) => selectedExpenseId.includes(index))
          : filteredExpenses;
  
        if (pdfData.length === 0) {
          setError("No data selected for PDF generation.");
          return;
        }
  
        const showTotalAmount = pdfData.reduce(
          (totals, expense) => ({
            Total_Receive: totals.Total_Receive + (parseFloat(expense.total_salary) || 0), // Use total_salary
            Total_Expense: 0, // No total_expense
          }),
          { Total_Receive: 0, Total_Expense: 0 }
        );
        showTotalAmount["currency_sign"] = pdfData[0]?.currency_sign || "";
  
        const pdfDoc = pdf(
          myPDFDocument({ data: pdfData, heading, value, title, useCurrency, })
        );
        const blob = await pdfDoc.toBlob();
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      } catch (error) {
        console.error("Error generating PDF:", error);
        setError("Error generating PDF: " + error.message);
      }
    };

    const handleMonthlySalaryList= (year) => {
      navigate(`/monthly-salary-list/${year}/${id}`);
    };

  return (
    <div className="bg-white mt-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-black rounded-t-lg text-white pl-8 sm:pl-4 pr-3 sm:pr-4 py-1 sm:py-2">
        <h1 className="text-lg sm:text-lg mb-2 sm:mb-0">
          Yearly Salary List
        </h1>
        <div className="flex gap-4">
          <CiFilter
            className="text-lg sm:text-xl cursor-pointer"
            onClick={() => setShowFilter(!showFilter)}
          />
          <BsFilePdfFill className="text-red-500" 
          onClick={() => handlePDFPreview(selectedYear)}
          />
          {/* <FiPlusCircle 
            onClick={() => handleAddYearlySalary(id)}
          /> */}
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
                <input type="checkbox" />
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
                Total Amount
              </th>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-end text-xs sm:text-sm">
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
                  {expense.currency__sign} {expense.total_salary.toFixed(2)}
                </td>
                <td className="border-b border-gray-300 p-2 sm:p-3 text-xs sm:text-sm text-right">
                  <BsListTask
                    className="bg-green-300 text-xl p-1 rounded-md inline-block"
                    onClick={() => handleMonthlySalaryList(expense?.year)}
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

export default YearlySingleEmployeeSalary;