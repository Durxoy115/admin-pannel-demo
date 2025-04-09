import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useToken from "../hooks/useToken";

const EditCompanyAddress = () => {
  const [formData, setFormData] = useState({
    bank_name: "",
    branch_name: "",
    account_name: "",
    account_number: "",
    routing_number: "",
    company_address: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch(`${url}/company/billing-address/?billing_address_id=${id}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setFormData(data.data);
        } else {
          alert("Failed to fetch address");
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        alert("An error occurred. Please try again.");
      }
    };

    fetchAddress();
  }, [id, url, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${url}/company/billing-address/?billing_address_id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        navigate("/profile");
      } else {
        alert("Failed to update address: " + data.message);
      }
    } catch (error) {
      console.error("Error updating address:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="w-full  mx-auto mt-4 sm:mt-6 md:mt-10 sm:px-4  md:px-8 py-6 sm:py-8 bg-gray-100 min-h-screen rounded-md">
      <h2 className="text-2xl sm:text-3xl mt-10  font-bold mb-6 sm:mb-8">Edit Billing Address</h2>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 bg-white p-1 md:p-8 sm:p-1 rounded-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label htmlFor="bank_name" className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="bank_name"
              id="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
              placeholder="Enter your bank name"
              required
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label htmlFor="branch_name" className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Branch <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="branch_name"
              id="branch_name"
              value={formData.branch_name}
              onChange={handleChange}
              placeholder="Enter your branch name"
              required
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label htmlFor="account_name" className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Account Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="account_name"
              id="account_name"
              value={formData.account_name}
              onChange={handleChange}
              placeholder="Enter your account name"
              required
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label htmlFor="account_number" className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="account_number"
              id="account_number"
              value={formData.account_number}
              onChange={handleChange}
              placeholder="Enter your account number"
              required
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label htmlFor="routing_number" className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Routing Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="routing_number"
              id="routing_number"
              value={formData.routing_number}
              onChange={handleChange}
              placeholder="Enter your routing number"
              required
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
        </div>
        <div>
          <label htmlFor="company_address" className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
            Company Address
          </label>
          <textarea
            name="company_address"
            id="company_address"
            value={formData.company_address}
            onChange={handleChange}
            placeholder="Enter your company address"
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            rows="3 sm:rows-4"
          ></textarea>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-4 sm:mt-6">
          <button
            type="submit"
            className="w-full sm:w-48 bg-blue-500 text-white py-2 sm:py-3 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 text-sm sm:text-base"
          >
            Save
          </button>
          <button
            type="button"
            className="w-full sm:w-48 bg-red-500 text-white py-2 sm:py-3 rounded-full hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-blue-300 text-sm sm:text-base"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCompanyAddress;