import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TfiPlus } from "react-icons/tfi";
import SubAdmin from "../SubAdmin/SubAdmin";
import Products from "../Products/Products";
import AddressBook from "../AddressBook/AddressBook";
import SupportContactList from "../SupportContactList/SupportContactList";
import useToken from "../hooks/useToken";

const MyProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${url}/auth/profile/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data.data);
          if (data.data?.photo) {
            setImagePreview(`https://admin.zgs.co.com${data.data.photo}`);
          }
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [url, token]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditUserProfile = (id) => {
    if (id) {
      navigate(`/edit-user-profile/${id}`);
    } else {
      console.error("User ID not found");
    }
  };

  return (
    <div className="p-1 sm:p-6 md:p-8 bg-gray-100 shadow-md mt-14">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold">My Profile</h2>
        <button
          className="bg-blue-700 text-white px-3 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-lg mt-3 sm:mt-0"
          onClick={() => handleEditUserProfile(userData?.id)}
        >
          Edit
        </button>
      </div>

      <div className="w-full flex flex-col bg-white rounded-md">
        <div className="w-full mx-auto p-2 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-10">
            <div className="flex flex-col">
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
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">First Name</label>
                <input
                  type="text"
                  value={userData?.first_name || ""}
                  readOnly
                  className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded-lg bg-gray-100 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">Last Name</label>
                <input
                  type="text"
                  value={userData?.last_name || ""}
                  readOnly
                  className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded-lg bg-gray-100 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">Email</label>
                <input
                  type="email"
                  value={userData?.email || ""}
                  readOnly
                  className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded-lg bg-gray-100 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">Phone Number</label>
                <input
                  type="tel"
                  value={userData?.contact || ""}
                  readOnly
                  className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded-lg bg-gray-100 text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-md p-2 sm:p-4 mt-4 sm:mt-6">
        <SubAdmin />
        <Products />
        <AddressBook />
        <SupportContactList />
      </div>
    </div>
  );
};

export default MyProfile;