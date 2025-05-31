import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useToken from "../hooks/useToken";

const EditExpenseFromAllList = () => {
  const { expense_id } = useParams();
  const [formData, setFormData] = useState({
    expense_category: "",
    expense_date: "",
    qty: "",
    unit_cost: "",
    payment_method: "",
    reference: "",
    additional_cost: "",
    sub_total: "",
    total: "",
    expense_for: "",
    description: "",
    currency: "",
  });
  const [categories, setCategories] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [globalError, setGlobalError] = useState("");
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
        console.error("Error fetching categories:", data?.data?.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch currencies
  const fetchCurrencies = async () => {
    try {
      const response = await fetch(`${url}/config/currency/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCurrencies(data?.data);
      } else {
        setGlobalError("Error fetching currencies: " + data?.data?.message);
      }
    } catch (error) {
      setGlobalError("Error fetching currencies: " + error?.message);
    }
  };

  // Fetch expense details for editing
  const fetchExpenseDetails = async () => {
    try {
      const response = await fetch(`${url}/expense/list/?expense_id=${expense_id}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        const expense = data.data;
        // Convert ISO date to YYYY-MM-DD format for date input
        const expenseDate = new Date(expense.expense_date).toISOString().split("T")[0];
        setFormData({
          expense_category: expense.expense_category.toString(),
          expense_date: expenseDate,
          qty: expense.qty,
          unit_cost: expense.unit_cost,
          payment_method: expense.payment_method,
          reference: expense.reference,
          additional_cost: expense.additional_cost,
          sub_total: expense.sub_total,
          total: expense.total,
          expense_for: expense.expense_for,
          description: expense.description,
          currency: expense.currency.toString(),
        });
      } else {
        console.error("Error fetching expense details:", data.message);
      }
    } catch (error) {
      console.error("Error fetching expense details:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchCurrencies();
    fetchExpenseDetails();
  }, [url, token, expense_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Calculate sub_total and total dynamically
    if (name === "qty" || name === "unit_cost" || name === "additional_cost") {
      const quantity = name === "qty" ? value : formData.qty;
      const unitCost = name === "unit_cost" ? value : formData.unit_cost;
      const additionalCost = name === "additional_cost" ? value : formData.additional_cost;

      const subTotal = quantity && unitCost ? (quantity * unitCost).toFixed(2) : "";
      const total = subTotal && additionalCost ? (parseFloat(subTotal) + parseFloat(additionalCost)).toFixed(2) : subTotal;

      setFormData((prevData) => ({
        ...prevData,
        sub_total: subTotal,
        total: total || "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      expense_category: parseInt(formData.expense_category),
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
      currency: parseInt(formData.currency),
    };

    try {
      const response = await fetch(`${url}/expense/list/?expense_id=${expense_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Expense updated successfully!");
        navigate("/all-expense-list");
      } else {
        const errorData = await response.json();
        console.error("Error updating expense:", errorData.message);
      }
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md mt-16">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Edit Expense</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Expense Category<span className="text-red-500">*</span>
          </label>
          <select
            name="expense_category"
            value={formData.expense_category}
            onChange={handleChange}
            className="mt-1 h-10 block w-full border border-gray-400 rounded-md"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Expense Date<span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="expense_date"
            value={formData.expense_date}
            onChange={handleChange}
            className="mt-1 h-10 block w-full border border-gray-400 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="qty"
            value={formData.qty}
            onChange={handleChange}
            className="mt-1 h-10 block w-full border border-gray-400 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Unit Cost<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="unit_cost"
            value={formData.unit_cost}
            onChange={handleChange}
            className="mt-1 h-10 block w-full border border-gray-400 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Currency<span className="text-red-500">*</span>
          </label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="mt-1 h-10 block w-full border border-gray-400 rounded-md"
          >
            <option value="">Select Currency</option>
            {currencies.map((currency) => (
              <option key={currency.id} value={currency.id}>
                {currency.currency}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Method</label>
          <input
            type="text"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            className="mt-1 h-10 block w-full border border-gray-400 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Reference</label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            className="mt-1 h-10 block w-full border border-gray-400 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Additional Cost</label>
          <input
            type="number"
            name="additional_cost"
            value={formData.additional_cost}
            onChange={handleChange}
            className="mt-1 h-10 block w-full border border-gray-400 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sub Total</label>
          <input
            type="text"
            name="sub_total"
            value={formData.sub_total}
            readOnly
            className="mt-1 h-10 block w-full border border-gray-400 rounded-md bg-gray-100"
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Total</label>
          <input
            type="text"
            name="total"
            value={formData.total}
            readOnly
            className="mt-1 h-10 block w-full border border-gray-400 rounded-md bg-gray-100"
          />
        </div>

        <div className="col-span-3">
          <label className="block text-sm font-medium text-gray-700">Expense for</label>
          <input
            type="text"
            name="expense_for"
            value={formData.expense_for}
            onChange={handleChange}
            className="mt-1 h-10 block w-full border border-gray-400 rounded-md"
          />
        </div>

        <div className="md:col-span-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 h-16 block w-full border border-gray-400 rounded-md"
          />
        </div>

        <div className="md:col-span-4 flex justify-start">
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditExpenseFromAllList;