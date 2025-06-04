import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";

const AddSalaryConfig = () => {
  const [formData, setFormData] = useState({
    basic: "",
    house_rent: "",
    medical_allow: "",
    others: "",
    transport_allow: "",
    mobile_allow: "",
    active: true,
  });
  const [globalError, setGlobalError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "active" ? value === "true" : value,
    });
    // Clear field-specific error when user starts typing
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.basic) errors.basic = "Basic percentage is required";
    if (!formData.house_rent) errors.house_rent = "House rent percentage is required";
    if (!formData.medical_allow) errors.medical_allow = "Medical allowance percentage is required";
    if (parseFloat(formData.basic) < 0 || parseFloat(formData.basic) > 100)
      errors.basic = "Basic percentage must be between 0 and 100";
    if (parseFloat(formData.house_rent) < 0 || parseFloat(formData.house_rent) > 100)
      errors.house_rent = "House rent percentage must be between 0 and 100";
    if (parseFloat(formData.medical_allow) < 0 || parseFloat(formData.medical_allow) > 100)
      errors.medical_allow = "Medical allowance percentage must be between 0 and 100";
    if (formData.others && (parseFloat(formData.others) < 0 || parseFloat(formData.others) > 100))
      errors.others = "Others percentage must be between 0 and 100";
    if (formData.transport_allow && (parseFloat(formData.transport_allow) < 0 || parseFloat(formData.transport_allow) > 100))
      errors.transport_allow = "Transport percentage must be between 0 and 100";
    if (formData.mobile_allow && (parseFloat(formData.mobile_allow) < 0 || parseFloat(formData.mobile_allow) > 100))
      errors.mobile_allow = "Mobile allowance percentage must be between 0 and 100";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("basic", parseFloat(formData.basic).toFixed(2));
    formDataToSend.append("house_rent", parseFloat(formData.house_rent).toFixed(2));
    formDataToSend.append("medical_allow", parseFloat(formData.medical_allow).toFixed(2));
    formDataToSend.append("others", parseFloat(formData.others || 0).toFixed(2));
    formDataToSend.append("transport_allow", parseFloat(formData.transport_allow || 0).toFixed(2));
    formDataToSend.append("mobile_allow", parseFloat(formData.mobile_allow || 0).toFixed(2));
    formDataToSend.append("active", formData.active);

    try {
      const response = await axios.post(`${url}/company/salary-config/`, formDataToSend, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        alert("Salary configuration added successfully!");
        navigate("/profile");
      } else {
        setGlobalError("Failed to add salary configuration: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      setGlobalError("Error adding salary configuration: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="p-1 sm:p-6 lg:p-8 min-h-screen bg-gray-100 flex">
      <div className="w-full mt-8 sm:mt-10 rounded-md">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-8 pt-8 md:pt-6 sm:pt-8">
          Add Salary Configuration
        </h2>

        {globalError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md text-sm sm:text-base">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 px-4 sm:px-8 pb-6 sm:pb-8 bg-white p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Basic (%)<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="basic"
                value={formData.basic}
                onChange={handleChange}
                placeholder="Enter basic percentage"
                required
                min="0"
                max="100"
                step="0.01"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
              {formErrors.basic && <p className="mt-1 text-xs text-red-500">{formErrors.basic}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                House Rent (%)<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="house_rent"
                value={formData.house_rent}
                onChange={handleChange}
                placeholder="Enter house rent percentage"
                required
                min="0"
                max="100"
                step="0.01"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
              {formErrors.house_rent && <p className="mt-1 text-xs text-red-500">{formErrors.house_rent}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Medical Allowance (%)<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="medical_allow"
                value={formData.medical_allow}
                onChange={handleChange}
                placeholder="Enter medical allowance percentage"
                required
                min="0"
                max="100"
                step="0.01"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
              {formErrors.medical_allow && <p className="mt-1 text-xs text-red-500">{formErrors.medical_allow}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Others (%)
              </label>
              <input
                type="number"
                name="others"
                value={formData.others}
                onChange={handleChange}
                placeholder="Enter others percentage"
                min="0"
                max="100"
                step="0.01"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
              {formErrors.others && <p className="mt-1 text-xs text-red-500">{formErrors.others}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Transport (%)
              </label>
              <input
                type="number"
                name="transport_allow"
                value={formData.transport_allow}
                onChange={handleChange}
                placeholder="Enter transport percentage"
                min="0"
                max="100"
                step="0.01"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
              {formErrors.transport_allow && <p className="mt-1 text-xs text-red-500">{formErrors.transport_allow}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Mobile Allowance (%)
              </label>
              <input
                type="number"
                name="mobile_allow"
                value={formData.mobile_allow}
                onChange={handleChange}
                placeholder="Enter mobile allowance percentage"
                min="0"
                max="100"
                step="0.01"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
              {formErrors.mobile_allow && <p className="mt-1 text-xs text-red-500">{formErrors.mobile_allow}</p>}
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Status<span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="active"
                    value="true"
                    checked={formData.active === true}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm sm:text-base text-gray-700">Active</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="active"
                    value="false"
                    checked={formData.active === false}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm sm:text-base text-gray-700">Inactive</span>
                </label>
              </div>
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

export default AddSalaryConfig;
