import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";

const AddProductCard = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
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
      navigate("/profile"); // Navigate after successful submission
    } catch (error) {
      console.error("Error adding service:", error);
    }
  };

  const handleAddservicepath = () => {
    navigate("/profile");
  };

  // Fetch services on load
  useEffect(() => {
    fetchServices();
  }, [token, url]);

  return (
    <div className="bg-gray-50 min-h-screen mt-20">
      <h1 className="text-2xl sm:text-3xl font-semibold mt-6 sm:mt-8 md:mt-10 ml-4 sm:ml-8 md:ml-44">
        Add Our Products & Services
      </h1>
      <div className="flex flex-col md:items-center md:justify-start">
        {/* Form Section */}
        <div className="mt-4 sm:mt-6 sm:w-full md:w-5/6  px-1 sm:px-6 md:px-8">
          <form
            className="bg-white p-1 sm:p-6 rounded-lg shadow-md space-y-4 sm:space-y-5"
            onSubmit={handleAddService}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base">Name*</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base"
                  placeholder="Enter service name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base">Short Description*</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base"
                  placeholder="Enter short description"
                  value={formData.short_description}
                  onChange={(e) =>
                    setFormData({ ...formData, short_description: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base">Price*</label>
                <input
                  type="number"
                  className="w-full border rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base"
                  placeholder="Enter service price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base">Type*</label>
                <select
                  className="w-full border rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base"
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
                <label className="block font-medium mb-1 text-sm sm:text-base">Currency*</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base"
                  placeholder="Enter currency"
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base">Image*</label>
                <input
                  type="file"
                  className="w-full border rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                 
                />
              </div>
            </div>
            <div className="mt-4 w-full lg:w-3/4">
              <label className="block font-medium mb-1 text-sm sm:text-base">Project Information*</label>
              <ReactQuill
                className="w-full"
                theme="snow"
                value={formData.description}
                onChange={(value) =>
                  setFormData({ ...formData, description: value })
                }
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 sm:px-6 py-1 sm:py-2 mt-4 sm:mt-6 rounded-lg w-full sm:w-60 mx-auto shadow-md flex items-center justify-center text-sm sm:text-base"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductCard;