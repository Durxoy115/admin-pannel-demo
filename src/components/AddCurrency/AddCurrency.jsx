import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";

const AddCurrency = () => {
  const [formData, setFormData] = useState({
    currency: "",
    sign: "",
  });
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
    const formDataToSend = new FormData();
    formDataToSend.append("currency", formData.currency);
    formDataToSend.append("sign", formData.sign);
    

    try {
      const response = await axios.post(
        `${url}/config/currency/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Token ${token}`,
            // "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Success:", response.data);
      alert("Currency added successfully!");
      setFormData({ currency: "", sign: ""});
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add support contact.");
    }
  };

  return (
    <div className="p-1 sm:p-6 lg:p-8 min-h-screen bg-gray-100 flex ">
      <div className="w-full  mt-8 sm:mt-10 rounded-md">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-8  pt-8 md:pt-6 sm:pt-8">
          Add Currency
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6 px-4 sm:px-8 pb-6 sm:pb-8  bg-white p-10 ">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
       
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                placeholder="Enter Currency"
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
               Sign<span className="text-red-500"></span>
              </label>
              <input
                type="text"
                name="sign"
                value={formData.sign}
                onChange={handleChange}
                
                
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
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

export default AddCurrency;