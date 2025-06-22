import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";

const AddMonthlySingleEmployeeSalary = () => {
  const { id } = useParams();
  const [employees, setEmployees] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(id || "");
  const [formData, setFormData] = useState({
    employee: "",
    payment_date: "",
    payment_method: "",
    account_number: "",
    reference: "",
    amount: "",
    salary_month: "",
    salary_year: "",
    currency: "", // Hardcoded for now; adjust if API provides options
  });
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Fetch all employees for dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${url}/employee/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const result = await response.json();
        if (result.success) {
          setEmployees(result.data || []);
          if (id && result.data.find((emp) => emp.id === parseInt(id))) {
            setSelectedEmployeeId(id);
            setFormData((prev) => ({ ...prev, employee: id }));
          }
        } else {
          setError(result.message || "Failed to fetch employees");
        }
      } catch (err) {
        setError("An error occurred while fetching employees: " + err.message);
      }
    };
    fetchEmployees();
  }, [url, token, id]);
  // Fetch currencies
  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const response = await fetch(`${url}/config/currency/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setCurrency(data?.data);
        }
      } catch (error) {
        setGlobalError("Error fetching currencies: " + error.message);
      }
    };
    fetchCurrency();
  }, [url, token]);

  // Set default payment date to today (June 22, 2025, 11:33 AM +06)
  useEffect(() => {
    const today = new Date("2025-06-22T11:33:00+06:00")
      .toISOString()
      .split("T")[0];
    setFormData((prev) => ({ ...prev, payment_date: today }));
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle employee selection
  const handleEmployeeChange = (e) => {
    const employeeId = e.target.value;
    setSelectedEmployeeId(employeeId);
    setFormData((prev) => ({ ...prev, employee: employeeId }));
  };

  // Submit salary data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${url}/expense/monthly-salary/?monthly_salary_id=`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employee: parseInt(formData.employee),
            payment_date: formData.payment_date,
            payment_method: formData.payment_method,
            account_number: formData.account_number,
            reference: formData.reference,
            amount: parseFloat(formData.amount).toFixed(2) || 0,
            salary_month: formData.salary_month,
            salary_year: formData.salary_year,
            currency: formData.currency,
          }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setSuccessMessage("Salary submitted successfully!");
        setError("");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(result.message || "Failed to submit salary");
      }
    } catch (err) {
      setError("An error occurred while submitting salary: " + err.message);
    }
  };

  return (
    <div className="bg-white mt-16 p-6 lg:p-8 max-w-7xl mx-auto rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Salary List Add</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Employee Dropdown */}

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Employee
            </label>
            <select
              name="employee"
              value={selectedEmployeeId}
              onChange={handleEmployeeChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
              required
            >
              <option value="">
                Select an Employee <span className="text-red-600">*</span>
              </option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.full_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Date <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              name="payment_date"
              value={formData.payment_date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <input
              type="text"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Number <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="account_number"
              value={formData.account_number}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reference
            </label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary Month
            </label>
            <select
              name="salary_month"
              value={formData.salary_month}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
            >
              <option value="">Select Month</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary Year
            </label>
            <input
              type="text"
              name="salary_year"
              value={formData.salary_year}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="currency"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Currency <span className="text-red-500">*</span>
            </label>
            <select
              id="currency"
              name="currency"
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
              value={formData.currency}
            >
              <option value="" disabled>
                Select Currency
              </option>
              {currency.map((c) => (
                <option key={c.id} value={parseInt(c.id)}>
                  {c.currency}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-left">
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMonthlySingleEmployeeSalary;
