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
    product_information: "",
  });
  const [url,getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuillChange = (value) => {
    setFormData({ ...formData, product_information: value });
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
    <div className="max-w-4xl  mt-10 p-8 bg-white rounded-md  ml-20">
      <h2 className="text-3xl font-bold mb-8">Create New Order</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Service/Product Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Price<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Order Date<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="order_date"
              value={formData.order_date}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Estimate Delivery Date
            </label>
            <input
              type="date"
              name="estimate_delivery_date"
              value={formData.estimate_delivery_date}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
               Delivery Date
            </label>
            <input
              type="date"
              name="delivery_date"
              value={formData.delivery_date}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Client ID<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2 text-start ml-2">
            Product Information
          </label>
          <ReactQuill
            value={formData.product_information}
            onChange={handleQuillChange}
            className="bg-white border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex justify-center space-x-4">
        <button
            type="button"
            onClick={handleCancel}
            className="w-48 bg-red-500 text-white py-3 rounded-full hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-48 bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700"
          >
            Save Order
          </button>
         
        </div>
      </form>
    </div>
  );
};

export default OrderAdd;
