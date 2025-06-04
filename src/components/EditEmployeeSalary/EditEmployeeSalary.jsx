import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import useToken from "../hooks/useToken";

const EditEmployeeSalary = () => {
  const [formData, setFormData] = useState({
    employee: "",
    currency: "",
    date: new Date().toISOString().split("T")[0], // ISO format: YYYY-MM-DD
    gross_salary: "",
    provident_per: "",
    provident_fund: "",
    deduct: "",
    deduct_for: "",
    basic_per: "",
    basic: "",
    h_rent_per: "",
    h_rent: "",
    mobile_allowance_per: "",
    mobile_allowance: "",
    medical_allowance_per: "",
    medical_allowance: "",
    transport_per: "",
    transport: "",
    others_per: "",
    others: "",
    total_payable: "",
  });
  const [employees, setEmployees] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [globalError, setGlobalError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
 const { id } = useParams(); // Get employee salary ID from URL

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${url}/employee/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setEmployees(data.data || []);
      } else {
        setGlobalError("Error fetching employees: " + (data?.data?.message || "Unknown error"));
      }
    } catch (error) {
      setGlobalError("Error fetching employees: " + error.message);
    }
  };

  // Fetch currencies
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
        setCurrencies(data.data || []);
      } else {
        setGlobalError("Error fetching currencies: " + (data?.data?.message || "Unknown error"));
      }
    } catch (error) {
      setGlobalError("Error fetching currencies: " + error.message);
    }
  };

  // Fetch active salary configuration
  const fetchSalaryConfig = async () => {
    try {
      const response = await axios.get(`${url}/company/salary-config/?salary_config_id=active`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (response.data.success) {
        const data = response.data.data;
        setFormData((prevData) => ({
          ...prevData,
          basic_per: data.basic || prevData.basic_per,
          h_rent_per: data.house_rent || prevData.h_rent_per,
          medical_allowance_per: data.medical_allow || prevData.medical_allowance_per,
          mobile_allowance_per: data.mobile_allow || prevData.mobile_allowance_per,
          transport_per: data.transport_allow || prevData.transport_per,
          others_per: data.others || prevData.others_per,
        }));
      } else {
        setGlobalError("Error fetching salary configuration: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      setGlobalError("Error fetching salary configuration: " + (error.response?.data?.message || error.message));
    }
  };

  // Fetch employee salary data
  const fetchEmployeeSalary = async () => {
    try {
      const response = await fetch(`${url}/expense/employee-salary/?employee_salary_id=${id}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        const salaryData = data.data;
        // Format date to YYYY-MM-DD
        let formattedDate = new Date().toISOString().split("T")[0]; // Fallback: 2025-06-04
        if (salaryData.date) {
          try {
            // Attempt to parse the date
            let dateObj;
            // Handle common date formats
            if (salaryData.date.match(/^\d{2}-\d{2}-\d{4}$/)) {
              // DD-MM-YYYY (e.g., "04-06-2025")
              const [day, month, year] = salaryData.date.split("-");
              dateObj = new Date(`${year}-${month}-${day}`);
            } else {
              // Try parsing directly (e.g., "2025-06-04" or other formats)
              dateObj = new Date(salaryData.date);
            }
            if (!isNaN(dateObj)) {
              formattedDate = dateObj.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
            } else {
              console.warn("Invalid date format from API:", salaryData.date);
            }
          } catch (e) {
            console.warn("Error parsing date from API:", salaryData.date, e);
          }
        }
  
        setFormData({
          employee: salaryData.employee || "",
          currency: salaryData.currency || "",
          date: formattedDate,
          gross_salary: salaryData.gross_salary || "",
          provident_per: salaryData.provident_per || "",
          provident_fund: salaryData.provident_fund || "",
          deduct: salaryData.deduct || "",
          deduct_for: salaryData.deduct_for || "",
          basic_per: salaryData.basic_per || "",
          basic: salaryData.basic || "",
          h_rent_per: salaryData.h_rent_per || "",
          h_rent: salaryData.h_rent || "",
          mobile_allowance_per: salaryData.mobile_allowance_per || "",
          mobile_allowance: salaryData.mobile_allowance || "",
          medical_allowance_per: salaryData.medical_allowance_per || "",
          medical_allowance: salaryData.medical_allowance || "",
          transport_per: salaryData.transport_per || "",
          transport: salaryData.transport || "",
          others_per: salaryData.others_per || "",
          others: salaryData.others || "",
          total_payable: salaryData.total_payable || "",
        });
      } else {
        setGlobalError("Error fetching salary data: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      setGlobalError("Error fetching salary data: " + error.message);
    }
  };

  useEffect(() => {
    fetchEmployeeSalary();
    fetchEmployees();
    fetchCurrency();
    fetchSalaryConfig();
  }, [url, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear field-specific error when user starts typing
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    // Calculate allowance amounts, provident fund, and total_payable dynamically
    if (
      name === "gross_salary" ||
      name === "provident_per" ||
      name === "deduct" ||
      name === "basic_per" ||
      name === "h_rent_per" ||
      name === "mobile_allowance_per" ||
      name === "medical_allowance_per" ||
      name === "transport_per" ||
      name === "others_per"
    ) {
      const grossSalary = name === "gross_salary" ? value : formData.gross_salary;
      const providentFundPer = name === "provident_per" ? value : formData.provident_per;
      const deduct = name === "deduct" ? value : formData.deduct;
      const basicPer = name === "basic_per" ? value : formData.basic_per;
      const hRentPer = name === "h_rent_per" ? value : formData.h_rent_per;
      const mobileAllowancePer = name === "mobile_allowance_per" ? value : formData.mobile_allowance_per;
      const medicalAllowancePer = name === "medical_allowance_per" ? value : formData.medical_allowance_per;
      const transportPer = name === "transport_per" ? value : formData.transport_per;
      const othersPer = name === "others_per" ? value : formData.others_per;

      const providentFund = grossSalary && providentFundPer ? ((parseFloat(grossSalary) * parseFloat(providentFundPer)) / 100).toFixed(2) : "";
      const basic = grossSalary && basicPer ? ((parseFloat(grossSalary) * parseFloat(basicPer)) / 100).toFixed(2) : "";
      const hRent = grossSalary && hRentPer ? ((parseFloat(grossSalary) * parseFloat(hRentPer)) / 100).toFixed(2) : "";
      const mobileAllowance = grossSalary && mobileAllowancePer ? ((parseFloat(grossSalary) * parseFloat(mobileAllowancePer)) / 100).toFixed(2) : "";
      const medicalAllowance = grossSalary && medicalAllowancePer ? ((parseFloat(grossSalary) * parseFloat(medicalAllowancePer)) / 100).toFixed(2) : "";
      const transport = grossSalary && transportPer ? ((parseFloat(grossSalary) * parseFloat(transportPer)) / 100).toFixed(2) : "";
      const others = grossSalary && othersPer ? ((parseFloat(grossSalary) * parseFloat(othersPer)) / 100).toFixed(2) : "";
      const totalPayable = grossSalary ? (parseFloat(grossSalary) - (parseFloat(providentFund || 0) + parseFloat(deduct || 0))).toFixed(2) : "";

      setFormData((prevData) => ({
        ...prevData,
        provident_fund: providentFund,
        basic,
        h_rent: hRent,
        mobile_allowance: mobileAllowance,
        medical_allowance: medicalAllowance,
        transport,
        others,
        total_payable: totalPayable,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.employee) errors.employee = "Employee is required";
    if (!formData.currency) errors.currency = "Currency is required";
    if (!formData.date) errors.date = "Date is required";
    if (!formData.gross_salary) errors.gross_salary = "Gross salary is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      employee: parseInt(formData.employee) || 0,
      currency: parseInt(formData.currency) || 0,
      date: formData.date,
      gross_salary: parseFloat(formData.gross_salary).toFixed(2) || "0.00",
      provident_per: parseFloat(formData.provident_per).toFixed(2) || "0.00",
      provident_fund: parseFloat(formData.provident_fund).toFixed(2) || "0.00",
      deduct: parseFloat(formData.deduct).toFixed(2) || "0.00",
      deduct_for: formData.deduct_for || "",
      basic_per: parseFloat(formData.basic_per).toFixed(2) || "0.00",
      basic: parseFloat(formData.basic).toFixed(2) || "0.00",
      h_rent_per: parseFloat(formData.h_rent_per).toFixed(2) || "0.00",
      h_rent: parseFloat(formData.h_rent).toFixed(2) || "0.00",
      mobile_allowance_per: parseFloat(formData.mobile_allowance_per).toFixed(2) || "0.00",
      mobile_allowance: parseFloat(formData.mobile_allowance).toFixed(2) || "0.00",
      medical_allowance_per: parseFloat(formData.medical_allowance_per).toFixed(2) || "0.00",
      medical_allowance: parseFloat(formData.medical_allowance).toFixed(2) || "0.00",
      transport_per: parseFloat(formData.transport_per).toFixed(2) || "0.00",
      transport: parseFloat(formData.transport).toFixed(2) || "0.00",
      others_per: parseFloat(formData.others_per).toFixed(2) || "0.00",
      others: parseFloat(formData.others).toFixed(2) || "0.00",
      total_payable: parseFloat(formData.total_payable).toFixed(2) || "0.00",
    };

    try {
      const response = await fetch(`${url}/expense/employee-salary/?employee_salary_id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Salary updated successfully!");
        navigate("/employee-salary-list");
      } else {
        const errorData = await response.json();
        setGlobalError("Error updating salary: " + (errorData.message || "Unknown error"));
      }
    } catch (error) {
      setGlobalError("Error updating salary: " + error.message);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md mt-16 max-w-full">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">Edit Employee Salary</h2>

      {/* Global Error Message */}
      {globalError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md text-sm sm:text-base">
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Employee */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Employee<span className="text-red-500">*</span>
          </label>
          <select
            name="employee"
            value={formData.employee}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.full_name}
              </option>
            ))}
          </select>
          {formErrors.employee && (
            <p className="mt-1 text-xs text-red-500">{formErrors.employee}</p>
          )}
        </div>

        {/* Currency */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Currency<span className="text-red-500">*</span>
          </label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          >
            <option value="">Select Currency</option>
            {currencies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.currency}
              </option>
            ))}
          </select>
          {formErrors.currency && (
            <p className="mt-1 text-xs text-red-500">{formErrors.currency}</p>
          )}
        </div>

        {/* Date */}
      {/* Date */}
<div className="col-span-1">
  <label className="block text-sm font-medium text-gray-700">
    Date<span className="text-red-500">*</span>
  </label>
  <input
    type="date"
    name="date"
    value={formData.date} // Expects YYYY-MM-DD format
    onChange={handleChange}
    className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
  />
  {formErrors.date && (
    <p className="mt-1 text-xs text-red-500">{formErrors.date}</p>
  )}
</div>

        {/* Gross Salary */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Gross Salary<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="gross_salary"
            value={formData.gross_salary}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-0 sm:p-1 sm:p-2 focus:outline-none focus:ring-2 focus:ring-purple Raven-500 text-sm sm:text-base"
            min="0"
            step="0.01"
          />
          {formErrors.gross_salary && (
            <p className="mt-1 text-xs text-red-500">{formErrors.gross_salary}</p>
          )}
        </div>

        {/* Provident Fund Percentage */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Provident Fund (%)</label>
          <input
            type="number"
            name="provident_per"
            value={formData.provident_per}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            min="0"
            step="0.01"
          />
        </div>

        {/* Provident Fund */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Provident Fund</label>
          <input
            type="text"
            name="provident_fund"
            value={formData.provident_fund}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 bg-gray-100 text-sm sm:text-base"
          />
        </div>

        {/* Deduct */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Deduct</label>
          <input
            type="number"
            name="deduct"
            value={formData.deduct}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:p-2 sm:text-base"
            min="0"
            step="0.01"
          />
        </div>

        {/* Deduct For */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Deduct For</label>
          <input
            type="text"
            name="deduct_for"
            value={formData.deduct_for}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          />
        </div>

        {/* Basic Percentage */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Basic (%)</label>
          <input
            type="number"
            name="basic_per"
            value={formData.basic_per}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            min="0"
            step="0.01"
          />
        </div>

        {/* Basic */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Basic</label>
          <input
            type="text"
            name="basic"
            value={formData.basic}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 bg-gray-100 text-sm sm:text-base"
          />
        </div>

        {/* House Rent Percentage */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">House Rent (%)</label>
          <input
            type="number"
            name="h_rent_per"
            value={formData.h_rent_per}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            min="0"
            step="0.01"
          />
        </div>

        {/* House Rent */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">House Rent</label>
          <input
            type="text"
            name="h_rent"
            value={formData.h_rent}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 bg-gray-100 text-sm sm:text-base"
          />
        </div>

        {/* Mobile Allowance Percentage */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Mobile Allowance (%)</label>
          <input
            type="number"
            name="mobile_allowance_per"
            value={formData.mobile_allowance_per}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            min="0"
            step="0.01"
          />
        </div>

        {/* Mobile Allowance */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Mobile Allowance</label>
          <input
            type="text"
            name="mobile_allowance"
            value={formData.mobile_allowance}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 bg-gray-100 text-sm sm:text-base"
          />
        </div>

        {/* Medical Allowance Percentage */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Medical Allowance (%)</label>
          <input
            type="number"
            name="medical_allowance_per"
            value={formData.medical_allowance_per}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            min="0"
            step="0.01"
          />
        </div>

        {/* Medical Allowance */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Medical Allowance</label>
          <input
            type="text"
            name="medical_allowance"
            value={formData.medical_allowance}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 bg-gray-100 text-sm sm:text-base"
          />
        </div>

        {/* Transport Percentage */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Transport (%)</label>
          <input
            type="number"
            name="transport_per"
            value={formData.transport_per}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            min="0"
            step="0.01"
          />
        </div>

        {/* Transport */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Transport</label>
          <input
            type="text"
            name="transport"
            value={formData.transport}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 bg-gray-100 text-sm sm:text-base"
          />
        </div>

        {/* Others Percentage */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Others (%)</label>
          <input
            type="number"
            name="others_per"
            value={formData.others_per}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            min="0"
            step="0.01"
          />
        </div>

        {/* Others */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Others</label>
          <input
            type="text"
            name="others"
            value={formData.others}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 bg-gray-100 text-sm sm:text-base"
          />
        </div>

        {/* Total Payable */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Total Payable</label>
          <input
            type="text"
            name="total_payable"
            value={formData.total_payable}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 bg-gray-100 text-sm sm:text-base"
          />
        </div>

        {/* Submit Button */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-start">
          <button
            type="submit"
            className="mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEmployeeSalary;