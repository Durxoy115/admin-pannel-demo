import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

  useEffect(() => {
    // Fetch existing company address data based on the id
    const fetchAddress = async () => {
      try {
        const response = await fetch(`https://admin.zgs.co.com/company/billing-address/?billing_address_id=${id}`, {
          headers: {
            "Authorization": "Token 4bc2a75c04006d4e540a8b38f86612dc0b1da466",
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
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://admin.zgs.co.com/company/billing-address/?billing_address_id=${id}`,
        {
          method: "PUT", // Change to PUT for updating
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Token 4bc2a75c04006d4e540a8b38f86612dc0b1da466",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (data.success) {
        navigate("/profile"); // Redirect to the address book page
      } else {
        alert("Failed to update address: " + data.message);
      }
    } catch (error) {
      console.error("Error updating address:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-md ml-48">
      <h2 className="text-3xl font-bold mb-8">Edit Billing Address</h2>
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
        <div className="flex justify-center items-center gap-6">
        <button
          type="submit"
          className="w-48 bg-blue-500 text-white py-3 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
         Save
        </button>
        <button
          type="submit"
          className="w-48 bg-red-500 text-white py-3 rounded-full hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Cancel
        </button>
        </div>
      </form>
    </div>
  );
};

export default EditCompanyAddress;
