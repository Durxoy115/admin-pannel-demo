import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useToken from "../hooks/useToken";

const EditCompany = () => {
  const [formData, setFormData] = useState({
    name: "",
    logo: null, // For file upload
    email: "",
    contact: "",
  });
  const [existingLogo, setExistingLogo] = useState(""); // To display current logo URL

  const { id } = useParams();
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch(`${url}/company/?company_id=${id}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          // Assuming API returns something like { name, logo (URL), email, contact }
          const fetchedData = data.data;
          setFormData({
            name: fetchedData.name || "",
            logo: null, // Reset logo for file input (file can't be pre-set)
            email: fetchedData.email || "",
            contact: fetchedData.contact || "",
          });
          setExistingLogo(fetchedData.logo || ""); // Store logo URL separately
        } else {
          alert("Failed to fetch company data: " + data.message);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
        alert("An error occurred while fetching data. Please try again.");
      }
    };

    fetchAddress();
  }, [id, url, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, logo: e.target.files[0] });
    setExistingLogo(""); // Clear existing logo preview when a new file is selected
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataPayload = new FormData(); // Use FormData for file upload
      formDataPayload.append("name", formData.name);
      if (formData.logo) {
        formDataPayload.append("logo", formData.logo); // Only append if a new file is selected
      }
      formDataPayload.append("email", formData.email);
      formDataPayload.append("contact", formData.contact);

      const response = await fetch(`${url}/company/?company_id=${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formDataPayload, // Send as FormData instead of JSON
      });

      const data = await response.json();
      if (data.success) {
        navigate("/profile");
      } else {
        alert("Failed to update company: " + data.message);
      }
    } catch (error) {
      console.error("Error updating company:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="w-full mx-auto mt-4 sm:mt-6 md:mt-10 sm:px-4 md:px-8 py-6 sm:py-8 bg-gray-100 min-h-screen rounded-md">
      <h2 className="text-2xl sm:text-3xl mt-10 font-bold mb-6 sm:mb-8">Edit Company</h2>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 bg-white p-1 md:p-8 sm:p-1 rounded-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Company Logo <span className="text-red-500">*</span>
            </label>
            {existingLogo && !formData.logo && (
              <div className="mb-2">
                <img
                  src={existingLogo}
                  alt="Current Logo"
                  className="w-20 h-20 object-cover rounded-md"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label htmlFor="contact" className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="contact"
              id="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
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

export default EditCompany;