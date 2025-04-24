import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TfiPlus } from "react-icons/tfi";
import { IoArrowBack } from "react-icons/io5";
import useToken from "../hooks/useToken";

const EditUserProfile = () => {
  const [editProfile, setEditProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    photo: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [checkEmail, setCheckEmail] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null); // State for API error messages
  const { id } = useParams();
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await fetch(`${url}/auth/user/?user_id=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setCheckEmail(data?.data?.email);
          setEditProfile({
            first_name: data?.data?.first_name || "",
            last_name: data?.data?.last_name || "",
            email: data?.data?.email || "",
            contact: data?.data?.contact || "",
            photo: null,
          });
          if (data?.data?.photo) {
            setImagePreview(`${url}${data.data.photo}`);
          }
        } else {
          setErrorMessage(data.data.message || "Failed to fetch client details");
        }
      } catch (error) {
        setErrorMessage("An error occurred while fetching client data");
        console.error("Error fetching client data:", error);
      }
    };

    fetchClientDetails();
  }, [id, url, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProfile({ ...editProfile, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditProfile({ ...editProfile, photo: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null); // Clear previous error messages

    const formData = new FormData();
    formData.append("first_name", editProfile.first_name);
    formData.append("last_name", editProfile.last_name);
    formData.append("contact", editProfile.contact);
    if (checkEmail !== editProfile.email) {
      formData.append("email", editProfile.email);
    }
    if (editProfile.photo) {
      formData.append("photo", editProfile.photo);
    }

    try {
      const response = await fetch(`${url}/auth/profile/?user_id=${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (response.ok && result.success) {
        alert("Profile updated successfully!");
        // navigate("/profile"); // Redirect to profile page
      } else {
        setErrorMessage(result?.data?.message || "Failed to update profile");
      }
    } catch (error) {
      setErrorMessage("An error occurred while updating the profile");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="px-1 sm:px-2 md:px-24 py-2 bg-gray-100 min-h-screen">
      <div className="relative mx-auto">
        <button
          className="absolute top-0 left-0 p-2 text-2xl sm:text-3xl text-black"
          onClick={() => navigate(-1)}
        >
          {/* <IoArrowBack /> */}
        </button>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 mt-16">
          Edit Profile
        </h2>
        {/* Display error message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="w-full flex flex-col">
          <div className="w-full bg-white p-1 sm:p-6 md:p-8 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 items-start">
              <div className="flex flex-col items-center">
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer flex flex-col items-center justify-center text-gray-300 bg-gray-100 rounded-md w-24 sm:w-28 h-24 sm:h-28 border-dashed border-2 border-gray-300"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
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
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    value={editProfile.first_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-1 sm:py-2 border bg-gray-200 rounded-lg text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label
                    htmlFor="last_name"
                    className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    value={editProfile.last_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-1 sm:py-2 border bg-gray-200 rounded-lg text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={editProfile.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-1 sm:py-2 border bg-gray-200 rounded-lg text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact"
                    className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    id="contact"
                    value={editProfile.contact}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-1 sm:py-2 border bg-gray-200 rounded-lg text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-4 sm:mt-6">
              <button
                type="submit"
                className="bg-blue-700 w-full sm:w-72 text-sm sm:text-lg p-2 sm:px-6 sm:py-3 rounded-lg text-white"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserProfile;