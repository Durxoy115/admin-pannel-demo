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
    setErrors((prev) => ({ ...prev, [e.target.name]: null, general: null }));
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

      const data = response.data;
      if (data.success) {
        console.log("Success:", data);
        setErrors({}); // Clear all errors on success
        navigate("/profile");
      } else {
        const newErrors = {};
        if (data.message) newErrors.general = data.message;
        // Map field-specific errors if present
        if (data.errors) {
          if (data.errors.gateway) newErrors.gateway = Array.isArray(data.errors.gateway) ? data.errors.gateway.join(", ") : data.errors.gateway;
          if (data.errors.bank_name) newErrors.bank_name = Array.isArray(data.errors.bank_name) ? data.errors.bank_name.join(", ") : data.errors.bank_name;
          if (data.errors.branch_name) newErrors.branch_name = Array.isArray(data.errors.branch_name) ? data.errors.branch_name.join(", ") : data.errors.branch_name;
          if (data.errors.account_name) newErrors.account_name = Array.isArray(data.errors.account_name) ? data.errors.account_name.join(", ") : data.errors.account_name;
          if (data.errors.account_number) newErrors.account_number = Array.isArray(data.errors.account_number) ? data.errors.account_number.join(", ") : data.errors.account_number;
          if (data.errors.routing_number) newErrors.routing_number = Array.isArray(data.errors.routing_number) ? data.errors.routing_number.join(", ") : data.errors.routing_number;
          if (data.errors.company_address) newErrors.company_address = Array.isArray(data.errors.company_address) ? data.errors.company_address.join(", ") : data.errors.company_address;
          if (data.errors.non_field_errors) newErrors.general = Array.isArray(data.errors.non_field_errors) ? data.errors.non_field_errors.join(", ") : data.errors.non_field_errors;
        }
        setErrors(newErrors);
      }
    } catch (error) {
      console.error("Error adding address:", error);
      const errorData = error.response?.data;
      const newErrors = {};
      if (errorData) {
        if (errorData.message) newErrors.general = errorData.message;
        // Map field-specific errors
        if (errorData.gateway) newErrors.gateway = Array.isArray(errorData.gateway) ? errorData.gateway.join(", ") : errorData.gateway;
        if (errorData.bank_name) newErrors.bank_name = Array.isArray(errorData.bank_name) ? errorData.bank_name.join(", ") : errorData.bank_name;
        if (errorData.branch_name) newErrors.branch_name = Array.isArray(errorData.branch_name) ? errorData.branch_name.join(", ") : errorData.branch_name;
        if (errorData.account_name) newErrors.account_name = Array.isArray(errorData.account_name) ? errorData.account_name.join(", ") : errorData.account_name;
        if (errorData.account_number) newErrors.account_number = Array.isArray(errorData.account_number) ? errorData.account_number.join(", ") : errorData.account_number;
        if (errorData.routing_number) newErrors.routing_number = Array.isArray(errorData.routing_number) ? errorData.routing_number.join(", ") : errorData.routing_number;
        if (errorData.company_address) newErrors.company_address = Array.isArray(errorData.company_address) ? errorData.company_address.join(", ") : errorData.company_address;
        if (errorData.detail) newErrors.general = errorData.detail;
        if (errorData.non_field_errors) newErrors.general = Array.isArray(errorData.non_field_errors) ? errorData.non_field_errors.join(", ") : errorData.non_field_errors;
      } else {
        newErrors.general = "An error occurred while adding the address. Please try again.";
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