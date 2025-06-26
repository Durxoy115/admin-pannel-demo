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
    employee_name: "",
    payment_date: "",
    payment_method: "",
    account_number: "",
    reference: "",
    amount: "",
    salary_month: "",
    salary_year: "",
    currency: "",
    salary_for: "",
    total_payable: 0,
    festival: 0,
    others: 0
  });
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Create Amount object
  const Amount = {
    Monthly: formData.total_payable || 0,
    Festival: formData.festival || 0,
    Others: formData.others || 0
  };

  // Fetch all employees for dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${url}/expense/employee-salary/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const result = await response.json();
        if (result.success) {
          setEmployees(result.data || []);
          if (id && result.data.find((emp) => emp.employee === parseInt(id))) {
            const selectedEmployee = result.data.find((emp) => emp.employee === parseInt(id));
            console.log("selectedEmployee", selectedEmployee);
            setSelectedEmployeeId(id);
            setFormData((prev) => ({
              ...prev,
              employee: id,
              employee_name: selectedEmployee.employee_name || "",
              total_payable: selectedEmployee.total_payable || 0,
              festival: selectedEmployee.festival || 0,
              others: selectedEmployee.others || 0,
              amount: selectedEmployee.total_payable || 0
            }));
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
        setError("Error fetching currencies: " + error.message);
      }
    };
    fetchCurrency();
  }, [url, token]);

  // Set default payment date to today (June 26, 2025, 06:04 PM +06)
  useEffect(() => {
    const today = new Date("2025-06-26T18:04:00+06:00")
      .toISOString()
      .split("T")[0];
    setFormData((prev) => ({ ...prev, payment_date: today }));
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "salary_for") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        amount: value === "Monthly" ? (formData.total_payable || 0).toString() : Amount[value] !== undefined ? Amount[value].toString() : ""
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle employee selection
  const handleEmployeeChange = (e) => {
    const employeeId = e.target.value;
    const selectedEmployee = employees.find((emp) => emp.employee === parseInt(employeeId));
    console.log("selectedEmployee", selectedEmployee);
    setSelectedEmployeeId(employeeId);
    setFormData((prev) => ({
      ...prev,
      employee: employeeId,
      total_payable: selectedEmployee ? selectedEmployee.total_payable || 0 : 0,
      festival: selectedEmployee ? selectedEmployee.festival || 0 : 0,
      others: selectedEmployee ? selectedEmployee.others || 0 : 0,
      amount: selectedEmployee && prev.salary_for === "Monthly" ? (selectedEmployee.total_payable || 0).toString() : prev.amount
    }));
  };
  // Submit salary data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${url}/expense/monthly-salary/?monthly_salary_id=${id}`,
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
            salary_for: formData.salary_for || "Monthly",
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

  const handleEmployee = () => {
    navigate(`/employee-list`);
  };

  return (
    <div className="bg-white mt-16 p-6 lg:p-8 max-w-7xl mx-auto rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Monthly Salary Add</h1>

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Employee
            </label>
            <input
              type="text"
              name="employee_name"
              value={formData.employee_name}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
              required
            />
            {/* <select
              name="employee_name"
              value={selectedEmployeeId}
              onChange={handleEmployeeChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
              required
            >
              <option value="">
                Select an Employee <span className="text-red-600">*</span>
              </option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee?.employee}>
                  {employee.employee_name}
                </option>
              ))}
            </select> */}

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
              readOnly
            />
          </div>
          <div>
            <label
              htmlFor="currency"
              className="block text-gray-700 font-medium text-sm sm:text-base"
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
          <div className="">
            <label
              htmlFor="salary_for"
              className="block text-gray-700 font-medium text-sm sm:text-base"
            >
              Salary For <span className="text-red-500"></span>
            </label>
            <select
              id="salary_for"
              name="salary_for"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
              value={formData.salary_for}
            >
              <option value="" disabled>
                Select Option
              </option>
              <option value="Monthly">Monthly</option>
              <option value="Festival">Festival Bonus</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>

        <div className="text-left">
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-md"
            onClick={handleEmployee}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMonthlySingleEmployeeSalary;