import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";

const AddProductCard = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate()
  const [url,getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const [formData, setFormData] = useState({
    name: "",
    short_description: "",
    description: "",
    price: "",
    currency: "",
    type: "",
    image: null,
  });
  console.log(services)
  const apiUrl = `${url}/service/`;

  // Fetch service data from API
  const fetchServices = async () => {
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // Submit new service to API
  const handleAddService = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("name", formData.name);
    formdata.append("short_description", formData.short_description);
    formdata.append("description", formData.description);
    formdata.append("price", formData.price);
    formdata.append("currency", formData.currency);
    formdata.append("type", formData.type);
    if (formData.image) {
      formdata.append("image", formData.image);
    }

    try {
      const response = await axios.post(apiUrl, formdata, {
        headers: {
          //   "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });
      setServices((prev) => [response.data, ...prev]); // Add new service to list
      setFormData({
        name: "",
        short_description: "",
        description: "",
        price: "",
        currency: "",
        type: "",
        image: null,
      });
    } catch (error) {
      console.error("Error adding service:", error);
    }
  };

  const handleAddservicepath = () => {
    navigate("/profile");
  }

  // Fetch services on load
  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mt-6 ml-28 ">
        Add Our Products & Services
      </h1>

      {/* Form Section */}
      <form
        className="bg-white p-6 rounded-lg shadow-md mt-6 w-3/4 space-y-4 "
        onSubmit={handleAddService}
      >
        <div className="grid grid-cols-4 gap-6">
          <div>
            <label className="block font-medium mb-1">Name*</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter service name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Short Description*</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter short description"
              value={formData.short_description}
              onChange={(e) =>
                setFormData({ ...formData, short_description: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Price*</label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter service price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Type*</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              required
            >
              <option value="">Select</option>
              <option value="Product">Product</option>
              <option value="Service">Service</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Currency*</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter currency"
              value={formData.currency}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Image*</label>
            <input
              type="file"
              className="w-full border rounded-lg px-3 py-2"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files[0] })
              }
              required
            />
          </div>
        </div>
        <div className="mt-4 w-3/4">
          <label className="block font-medium mb-1">Project Information*</label>
          <ReactQuill
            className="w-full "
            theme="snow"
            value={formData.description}
            onChange={(value) =>
              setFormData({ ...formData, description: value })
            }
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 mt-6 rounded-lg w-60 mx-auto shadow-md flex items-center justify-center mt-auto"
          onClick={handleAddservicepath}
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default AddProductCard;
