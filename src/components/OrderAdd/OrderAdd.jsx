import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useToken from "../hooks/useToken";

const OrderAdd = () => {
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    price: "",
    order_date: "",
    estimate_delivery_date: "",
    delivery_date: "",
    client_id: "",
    details: "",
  });
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuillChange = (value) => {
    setFormData({ ...formData, details: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${url}/service/order/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        navigate("/order-list");
      } else {
        alert("Failed to place order: " + data.message);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/order-list");
  };

  return (
    <div className="w-full  mx-auto px-1 sm:px-6 md:px-10 py-6 sm:py-8 md:py-10 bg-gray-100 rounded-md min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 mt-12">Create New Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 bg-white p-1 sm:p-8 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Service/Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base"
            />
          </div>
          <div>
            <label htmlFor="duration" className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              id="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base"
            />
          </div>
          <div>
            <label htmlFor="order_date" className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Order Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="order_date"
              id="order_date"
              value={formData.order_date}
              onChange={handleChange}
              required
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base"
            />
          </div>
          <div>
            <label htmlFor="estimate_delivery_date" className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Estimate Delivery Date
            </label>
            <input
              type="date"
              name="estimate_delivery_date"
              id="estimate_delivery_date"
              value={formData.estimate_delivery_date}
              onChange={handleChange}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base"
            />
          </div>
          <div>
            <label htmlFor="delivery_date" className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Delivery Date
            </label>
            <input
              type="date"
              name="delivery_date"
              id="delivery_date"
              value={formData.delivery_date}
              onChange={handleChange}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base"
            />
          </div>
          <div>
            <label htmlFor="client_id" className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Client ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="client_id"
              id="client_id"
              value={formData.client_id}
              onChange={handleChange}
              required
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base"
            />
          </div>
        </div>
        <div>
          <label htmlFor="details" className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base text-start">
            Product Information
          </label>
          <ReactQuill
            id="details"
            value={formData.details}
            onChange={handleQuillChange}
            className="bg-white border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full sm:w-48 bg-red-500 text-white py-2 sm:py-3 rounded-full hover:bg-red-600 text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-48 bg-blue-600 text-white py-2 sm:py-3 rounded-full hover:bg-blue-700 text-sm sm:text-base"
          >
            Save Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderAdd;