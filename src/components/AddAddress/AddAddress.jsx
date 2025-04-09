import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import axios from "axios";

const AddAddress = () => {
  const [formData, setFormData] = useState({
    company_name: "",
    company_logo: "",
    bank_name: "",
    branch_name: "",
    account_name: "",
    account_number: "",
    routing_number: "",
    company_address: "",
  });
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    setFormData({ ...formData, company_logo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const form = new FormData();
    form.append("company_name", formData.company_name);
    form.append("company_logo", formData.company_logo); // real file!
    form.append("bank_name", formData.bank_name);
    form.append("branch_name", formData.branch_name);
    form.append("account_name", formData.account_name);
    form.append("account_number", formData.account_number);
    form.append("routing_number", formData.routing_number);
    form.append("company_address", formData.company_address);
  
    try {
      const response = await axios.post(
        `${url}/company/billing-address/`,
        form,
        {
          headers: {
            Authorization: `Token ${token}`,
            // ❌ DON'T set Content-Type here, let the browser/axios set the boundary
          },
        }
      );
  
      console.log("Success:", response.data);
      navigate("/profile");
    } catch (error) {
      console.error("Error adding address:", error);
      alert("An error occurred. Please try again.");
    }
  };
  

  return (
    <div className="w-full  mx-auto mt-4 sm:mt-6 md:mt-10 px-1 sm:px-6 md:px-32 py-6 sm:py-8 rounded-md bg-gray-100 min-h-screen ">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 mt-8">
        Create New Billing Address
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-6 bg-white rounded-lg  p-1 "
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 ">
          <div>
            <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
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
              placeholder="Enter your company logo"
              required
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
              placeholder="Enter your bank name"
              required
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Branch <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="branch_name"
              value={formData.branch_name}
              onChange={handleChange}
              placeholder="Enter your branch name"
              required
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Account Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="account_name"
              value={formData.account_name}
              onChange={handleChange}
              placeholder="Enter your account name"
              required
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="account_number"
              value={formData.account_number}
              onChange={handleChange}
              placeholder="Enter your account number"
              required
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Routing Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="routing_number"
              value={formData.routing_number}
              onChange={handleChange}
              placeholder="Enter your routing number"
              required
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
            Company Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="company_address"
            value={formData.company_address}
            onChange={handleChange}
            placeholder="Enter your company address"
            required
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            rows="3 sm:rows-4"
          ></textarea>
        </div>
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

export default AddAddress;
