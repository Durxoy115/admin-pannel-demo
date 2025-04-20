import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import { TfiPlus } from "react-icons/tfi";

const EditSubAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    contact: "",
    password: "",
    dob: "",
    user_type: { id: "", name: "" },
    groups: [],
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [checkEmail, setCheckEmail] = useState(null);
  const [checkPassword, setCheckPassword] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userTypes, setUserTypes] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${url}/auth/user/?user_id=${id}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setCheckEmail(data?.data?.email);
          setCheckPassword(data?.data?.password);
          setUserData(data?.data);
          // Ensure groups is an array of IDs
          const groupIds =
            data?.data?.groups?.map((group) => parseInt(group.id || group)) ||
            [];
          setSelectedGroups(groupIds);
          if (data?.data?.photo) {
            setImagePreview(`https://admin.zgs.co.com${data.data.photo}`);
          }
        } else {
          console.error("Failed to fetch user details.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchUserTypes = async () => {
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
          setUserTypes(data?.data);
        } else {
          console.error("Failed to fetch user types");
        }
      } catch (error) {
        console.error("Error fetching user types:", error);
      }
    };

    const fetchUserGroups = async () => {
      try {
        const response = await fetch(`${url}/user-group/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserGroups(data?.data || []);
        } else {
          console.error("Failed to fetch user groups");
        }
      } catch (error) {
        console.error("Error fetching user groups:", error);
      }
    };

    const initializeData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchUserDetails(),
        fetchUserTypes(),
        fetchUserGroups(),
      ]);
      setIsLoading(false);
    };

    initializeData();
  }, [id, url, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "user_type") {
      setUserData((prevData) => ({
        ...prevData,
        user_type: { ...prevData.user_type, id: value },
      }));
    } else {
      setUserData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      console.log("Selected file:", file);
    } else {
      alert("Please upload a valid image file (e.g., .jpg, .png)");
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleToGroups = (e) => {
    const newGroups = Array.from(e.target.selectedOptions)
      .filter((option) => option.value !== "" && !isNaN(parseInt(option.value)))
      .map((option) => parseInt(option.value));
    setSelectedGroups(newGroups);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("first_name", userData.first_name);
      formData.append("last_name", userData.last_name);
      if (checkEmail != userData.email) {
        formData.append("email", userData.email);
      }
      if (checkPassword != userData.password) {
        formData.append("password", userData.password);
      }
      formData.append("username", userData.username);
      formData.append("contact", userData.contact);
      formData.append("dob", userData.dob);
      formData.append("user_type", userData.user_type.id);

      // if (userData.password) {
      //   formData.append("password", userData.password);
      // }

      if (image) {
        formData.append("photo", image);
      }

      if (selectedGroups.length) {
        // Append groups as a single array, consistent with AddUser
        formData.append("groups", selectedGroups);
      }

      const response = await fetch(`${url}/auth/user/?user_id=${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("User details updated successfully!");
        // navigate("/profile", { state: { reload: true } });
      } else {
        const errorData = await response.json();
        console.error("Error updating user details:", errorData);
        alert(errorData.detail || "Failed to update user details.");
      }
    } catch (error) {
      console.error("Error during user update:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <p className="text-center mt-10 text-gray-600">Loading user details...</p>
    );
  }

  return (
    <div className="w-full flex justify-center bg-gray-100 min-h-screen">
      <div className="w-full sm:px-6 md:px-24 sm:pt-6">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 md:mt-20 sm:mt-4">
          Member Profile
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-1 sm:p-6 md:p-8 rounded-md"
        >
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-10 mb-4 sm:mb-6">
            {/* Image Previewer and Uploader */}
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
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
              {[
                {
                  label: "First Name",
                  name: "first_name",
                  type: "text",
                  required: true,
                },
                {
                  label: "Last Name",
                  name: "last_name",
                  type: "text",
                  required: true,
                },
                {
                  label: "Email",
                  name: "email",
                  type: "email",
                  required: true,
                },
                {
                  label: "User Name",
                  name: "username",
                  type: "text",
                  required: true,
                },
                {
                  label: "Password",
                  name: "password",
                  type: "password",
                  required: false,
                },
                {
                  label: "Date of Birth",
                  name: "dob",
                  type: "date",
                  required: true,
                },
                {
                  label: "Mobile Number",
                  name: "contact",
                  type: "tel",
                  required: true,
                },
              ].map(({ label, name, type, required }) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base"
                  >
                    {label}
                    {required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={type}
                    id={name}
                    name={name}
                    value={userData[name] || ""}
                    onChange={handleChange}
                    required={required}
                    className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded-lg text-sm sm:text-base"
                  />
                </div>
              ))}

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
                  value={userData.user_type.id || ""}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded-lg text-sm sm:text-base"
                >
                  <option value="">Select Member Type</option>
                  {userTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="groups"
                  className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base"
                >
                  User Permission Group
                </label>
                <select
                  id="groups"
                  name="groups"
                  multiple
                  value={selectedGroups}
                  onChange={handleToGroups}
                  className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded-lg text-sm sm:text-base"
                >
                  <option value="">Select Group</option>
                  {userGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-8 sm:mt-12 mb-6 sm:mb-10">
            <button
              type="button"
              className="w-full sm:w-48 px-4 sm:px-6 py-1 sm:py-2 bg-red-600 text-white rounded-lg text-sm sm:text-base"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-48 px-4 sm:px-6 py-1 sm:py-2 bg-blue-500 text-white rounded-lg text-sm sm:text-base"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubAdmin;
