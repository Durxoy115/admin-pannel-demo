import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";

const AddTotalSalaryAmount = () => {
  const [formData, setFormData] = useState({
    date: "",
    amount: 0.00,
    currency: "",
    reference: "",
  });
  const [currencies, setCurrencies] = useState([]);
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(`${url}/config/currency/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setCurrencies(response.data.data || []);
      } catch (error) {
        console.error("Error fetching currencies:", error);
        alert("Failed to fetch currencies.");
      }
    };
    fetchCurrencies();
  }, [url, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      date: formData.date,
      amount: parseFloat(formData.amount),
      currency: parseInt(formData.currency),
      reference: formData.reference || null,
    };

    try {
      const response = await axios.post(`${url}/expense/salary-credit/`, payload, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Success:", response.data);
      alert("Credit added successfully!");
      setFormData({ date: "", amount: 0.00, currency: "", reference: "" });
      navigate("/employee-salary-list");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add credit.");
    }
  };

  return (
    <div className="p-1 sm:p-6 lg:p-8 min-h-screen bg-gray-100 flex">
      <div className="w-full mt-8 sm:mt-10 rounded-md">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-8 pt-8 md:pt-6 sm:pt-8">
          Add Total Salary Amount
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6 px-4 sm:px-8 pb-6 sm:pb-8 bg-white p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Date<span className="text-red-500"></span>
              </label>
              <input
                type="date"
                name="date"
                value={formData?.date}
                onChange={handleChange}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Amount<span className="text-red-500"></span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData?.amount}
                onChange={handleChange}
                placeholder="Enter Amount"
                step="0.01"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Currency<span className="text-red-500"></span>
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="" disabled>
                  Select Currency
                </option>
                {currencies.map((currency) => (
                  <option key={currency.id} value={currency.id}>
                    {currency.currency} ({currency.sign})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full sm:w-48 bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 text-sm sm:text-base transition-colors duration-200"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTotalSalaryAmount;