import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TfiPlus } from "react-icons/tfi";
import useToken from "../hooks/useToken";

const AddNewClient = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState(""); // For error or success messages
  const [image, setImage] = useState(null);
  const [document, setDocument] = useState(null);
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    const formData = new FormData();
    formData.append("name", e.target.clientName.value);
    formData.append("contact", e.target.clientMobile.value);
    formData.append("email", e.target.clientEmail.value);
    formData.append("country", e.target.country.value);
    formData.append("company_name", e.target.companyName.value);
    formData.append("website_url", e.target.companyUrl.value);
    formData.append("contact_person", e.target.contactPerson.value);
    formData.append("address", e.target.address.value);
    if (image) formData.append("photo", image);
    if (document) formData.append("contact_doc", document);

    try {
      const response = await fetch(`${url}/client/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });
      const data = await response.json();

      if (response.ok && data.success) {
        console.log("Success:", data);
        navigate("/dashboard", { state: { reload: true } });
      } else {
        // Display specific API error message
        const errorMessage = data.message || "Failed to add client. Please check your input.";
        setMessage(errorMessage);
        console.error("API Error:", data);
      }
    } catch (error) {
      // Handle network or unexpected errors
      const errorMessage = "An error occurred while adding the client. Please try again later.";
      setMessage(errorMessage);
      console.error("Network Error:", error);
    }

    // Debugging: Log FormData entries
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImagePreview(URL.createObjectURL(file));
      setImage(file);
      setMessage(""); // Clear any previous error messages
    } else {
      setMessage("Please upload a valid image file (e.g., .jpg, .png)");
      setImagePreview(null);
      setImage(null);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      setDocument(file);
      setMessage(""); // Clear any previous error messages
    } else {
      setMessage("Please upload a valid document file (e.g., .pdf, .doc, .docx)");
      setDocument(null);
    }
  };

  const handleClose = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 mt-12">
      <div className="flex-grow flex items-center justify-center py-8">
        <div className="w-full px-2 sm:px-4 md:px-28">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8">
            Add New Client
          </h2>
          {/* Display Error Message */}
          {message && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm sm:text-base">
              {message}
            </div>
          )}
          <form onSubmit={handleSave}>
            <div className="flex flex-col sm:flex-row sm:space-x-6">
              {/* Image Uploader */}
              <div className="flex flex-col items-center mb-6 sm:mb-0">
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer flex flex-col items-center justify-center text-gray-300 bg-gray-100 rounded-md w-24 h-24 sm:w-28 sm:h-28 border-dashed border-2 border-gray-300"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <TfiPlus className="text-3xl sm:text-4xl" />
                  )}
                </label>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Form Fields */}
              <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label
                    htmlFor="clientName"
                    className="block mb-2 font-medium text-sm sm:text-base"
                  >
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="clientName"
                    name="clientName"
                    required
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="clientMobile"
                    className="block mb-2 font-medium text-sm sm:text-base"
                  >
                    Client Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="clientMobile"
                    name="clientMobile"
                    required
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="clientEmail"
                    className="block mb-2 font-medium text-sm sm:text-base"
                  >
                    Client Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="clientEmail"
                    name="clientEmail"
                    required
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="companyName"
                    className="block mb-2 font-medium text-sm sm:text-base"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block mb-2 font-medium text-sm sm:text-base"
                  >
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    required
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="companyUrl"
                    className="block mb-2 font-medium text-sm sm:text-base"
                  >
                    Website URL
                  </label>
                  <input
                    type="url"
                    id="companyUrl"
                    name="companyUrl"
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contactPerson"
                    className="block mb-2 font-medium text-sm sm:text-base"
                  >
                    Contact Person
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contractDocument"
                    className="block mb-2 font-medium text-sm sm:text-base"
                  >
                    Contract Document <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id="contractDocument"
                    name="contractDocument"
                    accept=".pdf,.doc,.docx"
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={handleFileUpload}
                  
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="notes"
                    className="block mb-2 font-medium text-sm sm:text-base"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="3"
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="block mb-2 font-medium text-sm sm:text-base"
                  >
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows="3"
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
              <button
                type="button"
                className="w-full sm:w-auto px-20 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 text-sm sm:text-base"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-20 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 text-sm sm:text-base"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewClient;