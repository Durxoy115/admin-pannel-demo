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
  }, []);

  const formData = new FormData();

  console.log(userType);

  const handleSave = async (e) => {
    e.preventDefault();

    formData.append("first_name", e.target.first_name.value);
    formData.append("last_name", e.target.last_name.value);
    formData.append("email", e.target.userEmail.value);
    formData.append("username", e.target.userName.value);
    formData.append("contact", e.target.userContact.value);
    formData.append("user_type", e.target.user_type.value);
    formData.append("password", e.target.password.value);
    formData.append("dateOfBirth", e.target.userDateOfBirth.value);

    // If image is uploaded, append it to the form data
    if (image) {
      formData.append("image", image);
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

    // For debugging purposes (remove in production)
    for (let [key, value] of formData) {
      console.log(`${key}: ${value}`);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImagePreview(URL.createObjectURL(file));
    setImage(file);
  };

  const handleClose = () => {
    navigate("/profile");
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full ">
        <h2 className="text-3xl font-semibold mb-8 ml-64 ">Add New Member</h2>

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-3 gap-6 ">
            <div className="flex flex-col items-center col-span-1 ms-auto">
              <label
                htmlFor="imageUpload"
                className="cursor-pointer flex flex-col items-center justify-center text-gray-300 bg-gray-100 rounded-md w-28 h-28 border-dashed border-2 border-gray-300 "
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
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
                <label
                  htmlFor="userFirstName"
                  className="block mb-2 font-medium"
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label
                  htmlFor="userLastName"
                  className="block mb-2 font-medium"
                >
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="userEmail" className="block mb-2 font-medium">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="userEmail"
                  name="userEmail"
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label htmlFor="userName" className="block mb-2 font-medium">
                  User Name
                </label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="userContact" className="block mb-2 font-medium">
                  Contact <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="userContact"
                  name="userContact"
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="userContact" className="block mb-2 font-medium">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label
                  htmlFor="userMemberType"
                  className="block mb-2 font-medium"
                >
                  Member Type
                </label>
                <select 
                  type="text"
                  id="user_type"
                  name="user_type"
                  className="w-full px-4 py-2 border rounded-lg"
                >
                    {userType?.map((e, key) => {
                        return <option key={key} value={e.id}>{e.name}</option>;
                    })}
                </select>
              </div>
              <div>
                <label
                  htmlFor="userDateOfBirth"
                  className="block mb-2 font-medium"
                >
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="userDateOfBirth"
                  name="userDateOfBirth"
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6 mb-10">
            <button
              type="button"
              className="px-6 py-2 bg-red-600 text-white rounded-lg"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
