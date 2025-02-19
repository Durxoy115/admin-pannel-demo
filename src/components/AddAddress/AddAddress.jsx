import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";

const AddAddress = () => {
  const [formData, setFormData] = useState({
    bank_name: "",
    branch_name: "",
    account_name: "",
    account_number: "",
    routing_number: "",
    company_address: "",
  });
  const navigate = useNavigate();
  const [url,getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${url}/company/billing-address/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (data.success) {
        
        navigate("/profile"); // Redirect to the address book page
      } else {
        alert("Failed to add address: " + data.message);
      }
    } catch (error) {
      console.error("Error adding address:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white  rounded-md ml-48">
      <h2 className="text-3xl font-bold mb-8">Create New Billing Address</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Bank Name<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
              placeholder="Enter your bank name"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Branch<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="branch_name"
              value={formData.branch_name}
              onChange={handleChange}
              placeholder="Enter your branch name"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Account Name<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="account_name"
              value={formData.account_name}
              onChange={handleChange}
              placeholder="Enter your account name"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Account Number<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="account_number"
              value={formData.account_number}
              onChange={handleChange}
              placeholder="Enter your account number"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Routing Number<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="routing_number"
              value={formData.routing_number}
              onChange={handleChange}
              placeholder="Enter your routing number"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Company Address<span className="text-red-500">*</span></label>
          <textarea
            name="company_address"
            value={formData.company_address}
            onChange={handleChange}
            placeholder="Enter your company address"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-48 bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default AddAddress;
