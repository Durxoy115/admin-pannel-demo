import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TfiPlus } from "react-icons/tfi";
import useToken from "../hooks/useToken";

const AddUser = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [userType, setUserType] = useState();
  const [image, setImage] = useState(null);
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${url}/user-type/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserType(data?.data);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [url, token]);

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("first_name", e.target.first_name.value);
    formData.append("last_name", e.target.last_name.value);
    formData.append("email", e.target.userEmail.value);
    formData.append("username", e.target.userName.value);
    formData.append("contact", e.target.userContact.value);
    formData.append("user_type", e.target.user_type.value);
    formData.append("password", e.target.password.value);
    formData.append("dob", e.target.dob.value);

    if (image) {
      formData.append("photo", image);
    }

    try {
      const response = await fetch(`${url}/auth/user/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
        navigate("/profile", { state: { reload: true } });
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert(errorData.detail || "Failed to add Member");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      alert("Please upload a valid image file (e.g., .jpg, .png)");
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleClose = () => {
    navigate("/profile");
  };

  return (
    <div className="">
      <div className="w-full flex justify-center bg-gray-100 min-h-screen mt-12">
      <div className="w-full px-4 sm:px-6 md:px-24 pt-4 sm:pt-6  ">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8  sm:mt-8">Add New Member</h2>

        <form onSubmit={handleSave}>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-10 bg-white p-6 sm:p-8 md:p-10 rounded-md">
            <div className="flex flex-col items-center">
              <label
                htmlFor="imageUpload"
                className="cursor-pointer flex flex-col items-center justify-center text-gray-300 bg-gray-100 rounded-md w-24 sm:w-28 h-24 sm:h-28 border-dashed border-2 border-gray-300"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
              <div>
                <label
                  htmlFor="first_name"
                  className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base"
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  required
                  className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded-lg text-sm sm:text-base"
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
                  id="last_name"
                  name="last_name"
                  required
                  className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded-lg text-sm sm:text-base"
                />
              </div>
              <div>
                <label
                  htmlFor="userEmail"
                  className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="userEmail"
                  name="userEmail"
                  required
                  className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded-lg text-sm sm:text-base"
                />
              </div>
              <div>
                <label
                  htmlFor="userName"
                  className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base"
                >
                  User Name
                </label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded-lg text-sm sm:text-base"
                />
              </div>
              <div>
                <label
                  htmlFor="userContact"
                  className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base"
                >
                  Contact <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="userContact"
                  name="userContact"
                  required
                  className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded-lg text-sm sm:text-base"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded-lg text-sm sm:text-base"
                />
              </div>
              <div>
                <label
                  htmlFor="user_type"
                  className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base"
                >
                  Member Type
                </label>
                <select
                  id="user_type"
                  name="user_type"
                  className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded-lg text-sm sm:text-base"
                >
                  <option value="">Select Member Type</option>
                  {userType?.map((e, key) => (
                    <option key={key} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="dob"
                  className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base"
                >
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  required
                  className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded-lg text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-8 sm:mt-12 mb-6 sm:mb-10">
            <button
              type="button"
              className="px-4 sm:px-6 md:px-28 py-1 sm:py-2 bg-red-600 text-white rounded-lg text-sm sm:text-base w-full sm:w-auto"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 sm:px-6 md:px-28 py-1 sm:py-2 bg-blue-500 text-white rounded-lg text-sm sm:text-base w-full sm:w-auto"
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

export default AddUser; 