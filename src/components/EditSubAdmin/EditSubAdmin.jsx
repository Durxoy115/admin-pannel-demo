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
    dob:"",
    user_type: { name: "" },
  });
  const [imagePreview, setImagePreview] = useState(null); // For image preview
  const [image, setImage] = useState(null); // For new image file
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${url}/auth/user/?user_id=${id}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data?.data);
          // Set the initial image preview if photo exists
          if (data?.data?.photo) {
            setImagePreview(`https://admin.zgs.co.com${data.data.photo}`);
          }
        } else {
          console.error("Failed to fetch user details.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [id, url, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("first_name", userData.first_name);
      formData.append("last_name", userData.last_name);
      formData.append("email", userData.email);
      formData.append("username", userData.username);
      formData.append("username", userData.user_key);
      formData.append("username", userData.dob);
      formData.append("contact", userData.contact);
      formData.append("user_type", userData.user_type.id); // Send user_type ID

      // Append the image only if a new one was uploaded
      if (image) {
        formData.append("photo", image);
      }

      // Log FormData contents for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
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
        navigate("/profile", { state: { reload: true } });
      } else {
        const errorData = await response.json();
        console.error("Error updating user details:", errorData);
        alert("Failed to update user details.");
      }
    } catch (error) {
      console.error("Error during user update:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (isLoading) {
    return <p>Loading user details...</p>;
  }

  return (
    <div className="w-full flex items-center justify-center bg-gray-100">
      <div className="w-5/6 min-h-screen">
        <h2 className="text-3xl font-semibold mb-8">Member Profile</h2>
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md">
          <div className="flex gap-10 mb-6">
            {/* Image Previewer and Uploader (Top-Left) */}
            <div className="flex flex-col items-center">
              <label
                htmlFor="imageUpload"
                className="cursor-pointer flex flex-col items-center justify-center text-gray-300 bg-gray-100 rounded-md w-28 h-28 border-dashed border-2 border-gray-300"
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

            {/* Form Fields */}
            <div className="grid grid-cols-3 gap-6 w-full">
              {[
                { label: "First Name", name: "first_name", type: "text" },
                { label: "Last Name", name: "last_name", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "User Name", name: "username", type: "text" },
                { label: "Password", name: "password", type: "password" },
                { label: "Date of Birth", name: "dob", type: "date" },
                { label: "Mobile Number", name: "contact", type: "tel" },
                { label: "Member Type", name: "user_type", type: "text", readOnly: true },
              ].map(({ label, name, type, readOnly }) => (
                <div key={name}>
                  <label htmlFor={name} className="block mb-2 font-medium">
                    {label}
                  </label>
                  <input
                    type={type}
                    id={name}
                    name={name}
                    value={
                      name === "user_type" ? userData.user_type.name : (userData[name] || "")
                    }
                    onChange={name === "user_type" ? undefined : handleChange}
                    readOnly={readOnly}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center items-center space-x-4 mt-16 mb-10">
            <button
              type="button"
              className="px-24 py-2 bg-red-600 text-white rounded-lg"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-24 py-2 bg-blue-500 text-white rounded-lg"
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