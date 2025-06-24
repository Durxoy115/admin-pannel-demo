import React, { useState } from "react";
import axios from "axios";
import useToken from "../hooks/useToken";

const AddTaxConfig = () => {
  const [formData, setFormData] = useState({
    title: "",
    min: "",
    max: "",
    range_per: "",
  });
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${url}/company/tax-config/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Success:", response.data);
      alert("Tax configuration added successfully!");
      setFormData({ title: "", min: "", max: "", range_per: "" });
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add tax configuration.");
    }
  };

  return (
    <div className="p-1 sm:p-6 lg:p-8 min-h-screen bg-gray-100 flex ">
      <div className="w-full mt-8 sm:mt-10 rounded-md">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-8 pt-8 md:pt-6 sm:pt-8">
          Add Tax Config
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6 px-4 sm:px-8 pb-6 sm:pb-8 bg-white p-10 ">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Title<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter tax title"
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Minimum Amount<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="min"
                value={formData.min}
                onChange={handleChange}
                placeholder="Enter minimum amount"
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Maximum Amount<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="max"
                value={formData.max}
                onChange={handleChange}
                placeholder="Enter maximum amount"
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Tax Percentage<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="range_per"
                value={formData.range_per}
                onChange={handleChange}
                placeholder="Enter tax percentage"
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
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

export default AddTaxConfig;