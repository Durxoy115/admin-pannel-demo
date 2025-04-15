import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useToken from "../hooks/useToken";

const EditSupportContact = () => {
  const [formData, setFormData] = useState({
    name: "",
    account: "",
    link: "",
    logo: null, // Added for file upload
  });
  const [existingLogo, setExistingLogo] = useState(""); // Store current logo URL
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(""); // For success/error messages
  const { id } = useParams();
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const socialMediaOptions = ["Telegram", "What's App", "Imo", "Viber", "Messenger"];

  useEffect(() => {
    const fetchAddress = async () => {
      setIsLoading(true);
      setMessage("");
      try {
        const response = await fetch(`${url}/company/support-contact/?support_contact_id=${id}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const data = await response.json();
        console.log("API Response:", data); // Debugging: Log response
        if (data.success) {
          // Handle array or object response
          const fetchedData = Array.isArray(data.data) ? data.data[0] : data.data;
          setFormData({
            name: fetchedData.name || "",
            account: fetchedData.account || "",
            link: fetchedData.link || "",
            logo: null, // File input can't be pre-set
          });
          setExistingLogo(fetchedData.logo || "");
        } else {
          setMessage(`Failed to fetch contact: ${data.message}`);
        }
      } catch (error) {
        console.error("Error fetching contact:", error);
        setMessage("An error occurred while fetching data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id && token) {
      fetchAddress();
    } else {
      setMessage("Missing contact ID or authentication token.");
      setIsLoading(false);
    }
  }, [id, url, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(""); // Clear message on input change
  };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type.startsWith("image/")) {
//       setFormData({ ...formData, logo: file });
//       setExistingLogo(""); // Clear existing logo preview
//       setMessage("");
//     } else {
//       setMessage("Please upload a valid image file (e.g., .jpg, .png)");
//       setFormData({ ...formData, logo: null });
//     }
//   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Basic URL validation
    if (formData.link && !isValidUrl(formData.link)) {
      setMessage("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    try {
      const formDataPayload = new FormData();
      formDataPayload.append("name", formData.name);
      formDataPayload.append("account", formData.account);
      formDataPayload.append("link", formData.link);
    //   if (formData.logo) {
    //     formDataPayload.append("logo", formData.logo); // Only append if a new file is selected
    //   }

      const response = await fetch(`${url}/company/support-contact/?support_contact_id=${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formDataPayload, // Use FormData to support file upload
      });

      const data = await response.json();
      if (data.success) {
        setMessage("Support contact updated successfully!");
        setTimeout(() => navigate("/profile"), 2000); // Redirect after showing success
      } else {
        setMessage(`Failed to update contact: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };
//   const handleSave = () => {
//     navigate("/profile");
//   };

  // Simple URL validation function
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">Loading...</div>;
  }

  return (
    <div className="p-1 sm:p-6 lg:p-8 min-h-screen bg-gray-100 flex">
      <div className="w-full mt-8 sm:mt-10 rounded-md">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 px-4 sm:px-8 pt-6 sm:pt-8">
          Edit Support Contact
        </h2>
        {/* Display Success/Error Message */}
        {message && (
          <div
            className={`mb-4 mx-4 sm:mx-8 p-4 rounded-lg text-sm sm:text-base ${
              message.includes("success")
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6 px-4 sm:px-8 pb-6 sm:pb-8 bg-white p-10 rounded-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Social Media Type <span className="text-red-500">*</span>
              </label>
              <select
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
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
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Social Media Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="account"
                value={formData.account}
                onChange={handleChange}
                placeholder="Enter your social media number"
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Social Media Link
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="Enter your social media link"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <button
              type="submit"
              className="w-full sm:w-48 bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 text-sm sm:text-base transition-colors duration-200"
            //   onClick={handleSave}
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-48 bg-red-600 text-white py-2 sm:py-3 px-4 rounded-full hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 text-sm sm:text-base transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSupportContact;