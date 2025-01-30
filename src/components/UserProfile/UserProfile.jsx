import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TfiPlus } from "react-icons/tfi";

const MyProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("https://admin.zgs.co.com/auth/profile/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token 4bc2a75c04006d4e540a8b38f86612dc0b1da466",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data.data);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

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

  return (
    <div className="p-6">
      <div className="flex items-start justify-around mb-4">
        <h2 className="text-3xl font-semibold">My Profile</h2>
        <button className="bg-blue-700 text-lg p-2 text-white rounded">Edit</button>
      </div>

      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-full max-w-6xl bg-white p-6 rounded-lg shadow-md relative">
          <div className="grid grid-cols-3 gap-6 items-start">
            <div className="flex flex-col items-center col-span-1">
              <label
                htmlFor="imageUpload"
                className="cursor-pointer flex flex-col items-center justify-center text-gray-300 bg-gray-100 rounded-md w-28 h-28 border-dashed border-2 border-gray-300"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <TfiPlus className="text-4xl" />
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
            <div className="col-span-2 grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">First Name</label>
                <input
                  type="text"
                  value={userData?.first_name || ""}
                  readOnly
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Last Name</label>
                <input
                  type="text"
                  value={userData?.last_name || ""}
                  readOnly
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Email</label>
                <input
                  type="email"
                  value={userData?.email || ""}
                  readOnly
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Phone Number</label>
                <input
                  type="tel"
                  value={userData?.contact || ""}
                  readOnly
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;