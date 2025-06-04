import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";

const AddExpense = () => {
  const [formData, setFormData] = useState({
    expense_category: "",
    expense_date: new Date().toISOString().split("T")[0], // ISO format: YYYY-MM-DD
    qty: 1,
    unit_cost:0.00,
    payment_method: "",
    reference: "",
    additional_cost:0.00,
    sub_total: 0.00,
    total: 0.00,
    expense_for: "",
    description: "",
    currency: "",
  });
  const [categories, setCategories] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [globalError, setGlobalError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  // Fetch expense categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${url}/expense/category/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCategories(data.data || []);
      } else {
        setGlobalError("Error fetching categories: " + (data?.data?.message || "Unknown error"));
      }
    } catch (error) {
      setGlobalError("Error fetching categories: " + error.message);
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

  useEffect(() => {
    fetchCategories();
    fetchCurrency();
  }, [url, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear field-specific error when user starts typing
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    // Calculate sub_total and total dynamically
    if (name === "qty" || name === "unit_cost" || name === "additional_cost") {
      const quantity = name === "qty" ? value : formData.qty;
      const unitCost = name === "unit_cost" ? value : formData.unit_cost;
      const additionalCost = name === "additional_cost" ? value : formData.additional_cost;

      const subTotal = quantity && unitCost ? (parseFloat(quantity) * parseFloat(unitCost)).toFixed(2) : "";
      const total = subTotal && additionalCost ? (parseFloat(subTotal) + parseFloat(additionalCost || 0)).toFixed(2) : subTotal;

      setFormData((prevData) => ({
        ...prevData,
        sub_total: subTotal,
        total: total || "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.expense_category) errors.expense_category = "Expense category is required";
    if (!formData.expense_date) errors.expense_date = "Expense date is required";
    if (!formData.qty) errors.qty = "Quantity is required";
    if (!formData.unit_cost) errors.unit_cost = "Unit cost is required";
    if (!formData.currency) errors.currency = "Currency is required";
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
      expense_category: parseInt(formData.expense_category) || 0,
      qty: parseFloat(formData.qty) || 0,
      unit_cost: parseFloat(formData.unit_cost).toFixed(2) || 0,
      additional_cost: parseFloat(formData.additional_cost).toFixed(2) || 0,
      sub_total: parseFloat(formData.sub_total) || 0,
      total: parseFloat(formData.total) || 0,
      expense_date: formData.expense_date,
      payment_method: formData.payment_method,
      reference: formData.reference,
      expense_for: formData.expense_for,
      description: formData.description,
      currency: parseInt(formData.currency) || 0,
    };

    try {
      const response = await fetch(`${url}/expense/list/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Expense added successfully!");
        navigate("/all-expense-list");
      } else {
        const errorData = await response.json();
        setGlobalError("Error adding expense: " + (errorData.message || "Unknown error"));
      }
    } catch (error) {
      setGlobalError("Error adding expense: " + error.message);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md mt-16 max-w-full">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">Add Expense</h2>

      {/* Global Error Message */}
      {globalError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md text-sm sm:text-base">
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Expense Category */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Expense Category<span className="text-red-500">*</span>
          </label>
          <select
            name="expense_category"
            value={formData.expense_category}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {formErrors.expense_category && (
            <p className="mt-1 text-xs text-red-500">{formErrors.expense_category}</p>
          )}
        </div>

        {/* Expense Date */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Expense Date<span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="expense_date"
            value={formData.expense_date}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          />
          {formErrors.expense_date && (
            <p className="mt-1 text-xs text-red-500">{formErrors.expense_date}</p>
          )}
        </div>

        {/* Quantity */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Quantity<span className="text-red-500"></span>
          </label>
          <input
            type="number"
            name="qty"
            value={formData.qty}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            min="0"
            step="0.01"
          />
          {formErrors.qty && (
            <p className="mt-1 text-xs text-red-500">{formErrors.qty}</p>
          )}
        </div>

        {/* Unit Cost */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Unit Cost<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="unit_cost"
            value={formData.unit_cost}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            min="0"
            step="0.01"
          />
          {formErrors.unit_cost && (
            <p className="mt-1 text-xs text-red-500">{formErrors.unit_cost}</p>
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

        {/* Payment Method */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Payment Method</label>
          <input
            type="text"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          />
        </div>

        {/* Reference */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Reference</label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          />
        </div>

        {/* Additional Cost */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Additional Cost</label>
          <input
            type="number"
            name="additional_cost"
            value={formData.additional_cost}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            min="0"
            step="0.01"
          />
        </div>

        {/* Sub Total */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Sub Total</label>
          <input
            type="text"
            name="sub_total"
            value={formData.sub_total}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 bg-gray-100 text-sm sm:text-base"
          />
        </div>

        {/* Total */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Total</label>
          <input
            type="text"
            name="total"
            value={formData.total}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 bg-gray-100 text-sm sm:text-base"
          />
        </div>

        {/* Expense For */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700">Expense For</label>
          <input
            type="text"
            name="expense_for"
            value={formData.expense_for}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          />
        </div>

        {/* Description */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-1 sm:p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base h-24 resize-y"
          />
        </div>

        {/* Submit Button */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-start">
          <button
            type="submit"
            className="mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;