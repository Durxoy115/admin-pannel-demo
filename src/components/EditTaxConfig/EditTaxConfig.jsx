import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import useToken from "../hooks/useToken";

const EditTaxConfig = () => {
  const [formData, setFormData] = useState({
    title: "",
    min: "",
    max: "",
    range_per: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams(); // Use useParams to get id from /edit-tax-config/:id
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  useEffect(() => {
    const fetchTaxConfig = async () => {
      if (!id) {
        setError("Tax configuration ID is missing.");
        setLoading(false);
        return;
      }

      if (!url || !token) {
        setError("API URL or token is missing.");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching tax config with URL:", `${url}/company/tax-config/?tax_config_id=${id}`);
        console.log("Using token:", token);

        const response = await axios.get(
          `${url}/company/tax-config/?tax_config_id=${id}`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        console.log("API Response:", response.data);

        // Expect response structure like { success: true, data: { title, min, max, range_per } }
        if (response.data.success) {
          const { title, min, max, range_per } = response.data.data;
          setFormData({
            title,
            min: min.toString(),
            max: max.toString(),
            range_per: range_per.toString(),
          });
          setLoading(false);
        } else {
          setError(`Failed to load tax configuration: ${response.data.message}`);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching tax config:", error);
        setError(error.response?.data?.message || "Failed to load tax configuration.");
        setLoading(false);
      }
    };

    fetchTaxConfig();
  }, [id, url, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      alert("Tax configuration ID is missing.");
      return;
    }

    try {
      console.log("Submitting to URL:", `${url}/company/tax-config/?tax_config_id=${id}`);
      console.log("Submitting data:", formData);

      const response = await axios.put(
        `${url}/company/tax-config/?tax_config_id=${id}`,
        {
          ...formData,
          min: parseFloat(formData.min),
          max: parseFloat(formData.max),
          range_per: parseFloat(formData.range_per),
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Success:", response.data);
      alert("Tax configuration updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating tax config:", error);
      alert(error.response?.data?.message || "Failed to update tax configuration.");
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-1 sm:p-6 lg:p-8 min-h-screen bg-gray-100 flex">
      <div className="w-full mt-8 sm:mt-10 rounded-md">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-8 pt-8 md:pt-6 sm:pt-8">
          Edit Tax Config
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6 px-4 sm:px-8 pb-6 sm:pb-8 bg-white p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Title<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter tax title"
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Minimum Amount<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="min"
                value={formData.min}
                onChange={handleChange}
                placeholder="Enter minimum amount"
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Maximum Amount<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="max"
                value={formData.max}
                onChange={handleChange}
                placeholder="Enter maximum amount"
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Tax Percentage<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="range_per"
                value={formData.range_per}
                onChange={handleChange}
                placeholder="Enter tax percentage"
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full sm:w-48 bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 text-sm sm:text-base transition-colors duration-200"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaxConfig;