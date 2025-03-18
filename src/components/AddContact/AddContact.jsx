import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";

const AddContact = () => {
  const [formData, setFormData] = useState({
    name: "",
    account: "",
    logo: null,
  });
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  const socialMediaOptions = ["Telegram", "What's App", "Imo", "Viber", "Messenger"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, logo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("account", formData.account);
    formDataToSend.append("link", formData.link || "");
    if (formData.logo) formDataToSend.append("logo", formData.logo);

    try {
      const response = await axios.post(
        `${url}/company/support-contact/`,
        formDataToSend,
        {
          headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Success:", response.data);
      alert("Support contact added successfully!");
      setFormData({ name: "", account: "", link: "", logo: null });
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add support contact.");
    }
  };

  return (
    <div className="mx-auto mt-10 p-8 bg-white rounded-md ml-48 bg-gray-100">
      <h2 className="text-3xl font-bold mb-8">Add Support Contact</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-4 gap-6 bg-white rounded-md p-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Social Media Type<span className="text-red-500">*</span>
            </label>
            <select
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select type
              </option>
              {socialMediaOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Social Media Number<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="account"
              value={formData.account}
              onChange={handleChange}
              placeholder="Enter your social media number"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Social Media Logo<span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Social Media Link<span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="Enter your social media link"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Wrap the button in a div with Flexbox to center it */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-48 bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddContact;