import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import axios from "axios";

const AddCompanyAddress = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    logo: null,
  });
  const [error, setError] = useState(null); // State for error message
  const [successMessage, setSuccessMessage] = useState(null); // State for success message
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, logo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success message

    const form = new FormData();
    form.append("name", formData.name);
    form.append("logo", formData.logo);
    form.append("email", formData.email);
    form.append("contact", formData.contact);

    try {
      const response = await axios.post(`${url}/company/`, form, {
        headers: {
          Authorization: `Token ${token}`,
          // Let browser/axios handle Content-Type for FormData
        },
      });

      if (response.data.success) {
        setSuccessMessage(response.data.message || "Company address added successfully!");
        setTimeout(() => {
          navigate("/profile"); // Navigate after showing success message
        }, 2000); // Delay navigation to allow user to see success message
      } else {
        throw new Error(response.data.message || "Failed to add company address");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="w-full mx-auto mt-4 sm:mt-6 md:mt-10 px-1 sm:px-6 md:px-32 py-6 sm:py-8 rounded-md bg-gray-100 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 mt-8">
        Create New Company Address
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-6 bg-white rounded-lg p-1 md:p-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your company name"
              required
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Company Logo <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email" // Changed to type="email" for validation
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel" // Changed to type="tel" for better phone input
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter your mobile no"
              required // Added required attribute
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
        </div>
        {/* Error and Success Messages */}
        {error && (
          <p className="text-red-500 text-center text-sm sm:text-base mt-4">
            {error}
          </p>
        )}
        {successMessage && (
          <p className="text-green-500 text-center text-sm sm:text-base mt-4">
            {successMessage}
          </p>
        )}
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full sm:w-48 bg-blue-600 text-white py-2 sm:py-3 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 text-sm sm:text-base"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCompanyAddress;