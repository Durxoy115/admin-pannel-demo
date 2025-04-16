import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import axios from "axios";

const AddSignature = () => {
  const [formData, setFormData] = useState({
    title: "",
    signature: null,
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, signature: e.target.files[0] });
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (isSubmitting) return; // Prevent multiple submissions
      setIsSubmitting(true);
      setSuccessMessage(null);
      setError(null);

      console.log("handleSubmit called"); // Debug log

      const form = new FormData();
      form.append("title", formData.title);
      form.append("signature", formData.signature);

      try {
        const response = await axios.post(
          `${url}/company/authority-signature/`,
          form,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        setSuccessMessage("Signature added successfully!");
        setTimeout(() => {
          navigate("/profile");
          setIsSubmitting(false); // Reset after navigation
        }, 2000);
      } catch (error) {
        const errorMsg =
          error.response?.data?.message || "An error occurred. Please try again.";
        setError(errorMsg);
        setIsSubmitting(false);
      }
    },
    [formData, isSubmitting, navigate, token, url]
  );

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div>
      <div className="w-full mx-auto mt-4 sm:mt-6 md:mt-10 px-1 sm:px-6 md:px-10 py-6 sm:py-8 rounded-md bg-gray-100 min-h-screen">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 mt-8">
          Add Signature
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-6 bg-white rounded-lg p-1 sm:p-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                Signature <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
          </div>

          {successMessage && (
            <p className="text-green-500 text-center mt-4">{successMessage}</p>
          )}
          {error && (
            <p className="text-red-500 text-center mt-4">{error}</p>
          )}

          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-48 bg-red-500 text-white py-2 sm:py-3 rounded-full hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 text-sm sm:text-base"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-48 bg-blue-600 text-white py-2 sm:py-3 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 text-sm sm:text-base disabled:bg-blue-400 disabled:cursor-not-allowed"
             
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSignature;