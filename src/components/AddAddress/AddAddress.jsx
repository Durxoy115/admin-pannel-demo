import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import axios from "axios";

const AddAddress = () => {
  const [formData, setFormData] = useState({
    gateway: "",
    bank_name: "",
    branch_name: "",
    account_name: "",
    account_number: "",
    routing_number: "",
    company_address: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.gateway.trim()) {
      newErrors.gateway = "Gateway is required.";
    }
    if (!formData.account_number.trim()) {
      newErrors.account_number = "Account number is required.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      gateway: formData.gateway,
      bank_name: formData.bank_name,
      branch_name: formData.branch_name,
      account_name: formData.account_name,
      account_number: formData.account_number,
      routing_number: formData.routing_number,
      company_address: formData.company_address,
    };

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${url}/company/billing-address/`,
        payload,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Success:", response.data);
      setErrors({});
      navigate("/profile");
    } catch (error) {
      console.error("Error adding address:", error);
      const errorData = error.response?.data;
      const newErrors = {};
      if (errorData) {
        // Map field-specific errors
        if (errorData.gateway) newErrors.gateway = errorData.gateway.join(", ");
        if (errorData.bank_name) newErrors.bank_name = errorData.bank_name.join(", ");
        if (errorData.branch_name) newErrors.branch_name = errorData.branch_name.join(", ");
        if (errorData.account_name) newErrors.account_name = errorData.account_name.join(", ");
        if (errorData.account_number) newErrors.account_number = errorData.account_number.join(", ");
        if (errorData.routing_number) newErrors.routing_number = errorData.routing_number.join(", ");
        if (errorData.company_address) newErrors.company_address = errorData.company_address.join(", ");
        if (errorData.detail) newErrors.general = errorData.detail;
      } else {
        newErrors.general = "An error occurred. Please try again.";
      }
      setErrors(newErrors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto mt-4 sm:mt-6 md:mt-10 px-1 sm:px-6 md:px-32 py-6 sm:py-8 rounded-md bg-gray-100 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 mt-8">
        Create New Billing Address
      </h2>
      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-500 px-4 py-2 rounded mb-4 mx-4 sm:mx-8 text-center">
          {errors.general}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-6 bg-white rounded-lg p-1 md:p-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            { name: "gateway", label: "Gateway", required: true },
            { name: "bank_name", label: "Bank Name", required: false },
            { name: "branch_name", label: "Branch", required: false },
            { name: "account_name", label: "Account Name", required: false },
            { name: "account_number", label: "Account Number", required: true },
            { name: "routing_number", label: "Routing Number", required: false },
          ].map(({ name, label, required }) => (
            <div key={name}>
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={`Enter your ${label.toLowerCase()}`}
                required={required}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
              {errors[name] && (
                <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
              )}
            </div>
          ))}
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
            Company Address
          </label>
          <textarea
            name="company_address"
            value={formData.company_address}
            onChange={handleChange}
            placeholder="Enter your company address"
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            rows="3 sm:rows-4"
          ></textarea>
          {errors.company_address && (
            <p className="text-red-500 text-xs mt-1">{errors.company_address}</p>
          )}
        </div>
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="w-full sm:w-48 bg-red-600 text-white py-2 sm:py-3 rounded-full hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-48 bg-blue-600 text-white py-2 sm:py-3 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 text-sm sm:text-base ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAddress;