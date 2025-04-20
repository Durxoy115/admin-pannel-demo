import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TfiPlus } from "react-icons/tfi";
import useToken from "../hooks/useToken";

const AddUser = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [userType, setUserType] = useState([]);
  const [userGroups, setUserGroup] = useState([]);
  const [groups, setGroups] = useState([]);
  const [image, setImage] = useState(null);
  const [url, getTokenLocalStorage] = useToken();
  const [errors, setErrors] = useState({}); // For client-side validation
  const [message, setMessage] = useState({}); // For API errors
  const token = getTokenLocalStorage();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    userEmail: "",
    userName: "",
    userContact: "",
    user_type: "",
    password: "",
    dob: "",
  });

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
        const data = await response.json();
        if (response.ok && data.success) {
          setUserType(data?.data || []);
        } else {
          setMessage((prev) => ({
            ...prev,
            general: "Failed to fetch user types. Please try again.",
          }));
        }
      } catch (error) {
        setMessage((prev) => ({
          ...prev,
          general: "Network error while fetching user types.",
        }));
      }
    };
    fetchUserData();
  }, [url, token]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${url}/user-group/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setUserGroup(data?.data || []);
        } else {
          setMessage((prev) => ({
            ...prev,
            general: "Failed to fetch user groups. Please try again.",
          }));
        }
      } catch (error) {
        setMessage((prev) => ({
          ...prev,
          general: "Network error while fetching user groups.",
        }));
      }
    };
    fetchUserData();
  }, [url, token]);

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.first_name) newErrors.first_name = "First name is required.";
    if (!data.last_name) newErrors.last_name = "Last name is required.";
    if (!data.userEmail) {
      newErrors.userEmail = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(data.userEmail)) {
      newErrors.userEmail = "Invalid email format.";
    }
    if (!data.userContact) newErrors.userContact = "Contact is required.";
    if (!data.password) newErrors.password = "Password is required.";
    else if (data.password.length < 8) newErrors.password = "Password must be at least 8 characters.";
    if (!data.dob) newErrors.dob = "Date of birth is required.";
    if (!data.user_type) newErrors.user_type = "Member type is required.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setMessage((prev) => ({ ...prev, [name]: "" }));
  };

  const parseErrorMessage = (message) => {
    const newMessages = {};
    if (!message) return newMessages;

    // Split by commas to separate field errors
    const errorParts = message.split(",").map((part) => part.trim());

    errorParts.forEach((part) => {
      // Expect format "field: error message"
      const [field, errorMsg] = part.split(":").map((s) => s.trim());
      if (field && errorMsg) {
        // Map API field names to form field names
        const fieldMap = {
          username: "userName",
          email: "userEmail",
          contact: "userContact",
          user_type: "user_type",
          password: "password",
          dob: "dob",
          groups: "groups",
        };
        const formField = fieldMap[field] || field;
        newMessages[formField] = errorMsg;
      } else {
        newMessages.general = part;
      }
    });

    return newMessages;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage({});

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const apiFormData = new FormData();
    apiFormData.append("first_name", formData.first_name);
    apiFormData.append("last_name", formData.last_name);
    apiFormData.append("email", formData.userEmail);
    apiFormData.append("username", formData.userName);
    apiFormData.append("contact", formData.userContact);
    apiFormData.append("user_type", formData.user_type);
    apiFormData.append("password", formData.password);
    apiFormData.append("dob", formData.dob);

    if (groups.length) {
      apiFormData.append("groups", JSON.stringify(groups));
    }
    if (image) {
      apiFormData.append("photo", image);
    }

    try {
      const response = await fetch(`${url}/auth/user/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: apiFormData,
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert("User added successfully!");
        navigate("/profile", { state: { reload: true } });
      } else {
        const newMessages = {};
        // Handle standard error format
        if (data.email) newMessages.userEmail = data.message.join(", ");
        if (data.username) newMessages.userName = data.message.join(", ");
        if (data.contact) newMessages.userContact = data.contact.join(", ");
        if (data.user_type) newMessages.user_type = data.user_type.join(", ");
        if (data.password) newMessages.password = data.password.join(", ");
        if (data.dob) newMessages.dob = data.dob.join(", ");
        if (data.groups) newMessages.groups = data.groups.join(", ");
        if (data.detail || data.non_field_errors) {
          newMessages.general = data.detail || data.non_field_errors.join(", ");
        }
        // Handle custom message format
        if (data.message) {
          Object.assign(newMessages, parseErrorMessage(data.message));
        }
        if (Object.keys(newMessages).length === 0) {
          newMessages.general = "An error occurred. Please try again.";
        }
        setMessage(newMessages);
      }
    } catch (error) {
      setMessage({ general: "Network error. Please try again." });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, photo: "" }));
      setMessage((prev) => ({ ...prev, photo: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        photo: "Please upload a valid image file (e.g., .jpg, .png)",
      }));
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleToGroups = (e) => {
    const newGroups = Array.from(e.target.selectedOptions)
      .filter((option) => option.value !== "" && !isNaN(parseInt(option.value)))
      .map((option) => parseInt(option.value));
    setGroups(newGroups);
    setErrors((prev) => ({ ...prev, groups: "" }));
    setMessage((prev) => ({ ...prev, groups: "" }));
  };

  const handleClose = () => {
    navigate("/profile");
  };

  return (
    <div className="">
      <div className="w-full flex justify-center bg-gray-100 min-h-screen mt-10">
        <div className="w-full px-1 sm:px-6 md:px-24 pt-4 sm:pt-6">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-8 sm:mt-8">
            Add New Member
          </h2>
          {message.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
              {message.general}
            </div>
          )}
          <form onSubmit={handleSave}>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-10 bg-white p-1 sm:p-8 md:p-10 rounded-md">
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
                {errors.photo && (
                  <p className="text-red-500 text-xs mt-1">{errors.photo}</p>
                )}
                {message.photo && (
                  <p className="text-red-500 text-xs mt-1">{message.photo}</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
                {[
                  { id: "first_name", label: "First Name", type: "text", required: true },
                  { id: "last_name", label: "Last Name", type: "text", required: true },
                  { id: "userEmail", label: "Email", type: "email", required: true },
                  { id: "userName", label: "User Name", type: "text" },
                  { id: "userContact", label: "Contact", type: "tel", required: true },
                  { id: "password", label: "Password", type: "password", required: true },
                  {
                    id: "user_type",
                    label: "Member Type",
                    type: "select",
                    options: userType,
                    required: true,
                  },
                  {
                    id: "groups",
                    label: "User Permission Group",
                    type: "select",
                    multiple: true,
                    options: userGroups,
                  },
                  { id: "dob", label: "Date of Birth", type: "date", required: true },
                ].map(({ id, label, type, required, options, multiple }) => (
                  <div key={id}>
                    <label
                      htmlFor={id}
                      className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base"
                    >
                      {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    {type === "select" ? (
                      <select
                        id={id}
                        name={id}
                        multiple={multiple}
                        value={id === "groups" ? groups : formData[id]}
                        onChange={id === "groups" ? handleToGroups : handleChange}
                        className={`w-full px-3 sm:px-4 py-1 sm:py-2 border ${
                          errors[id] || message[id] ? "border-red-500" : "border-gray-300"
                        } rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required={required}
                      >
                        <option value="" disabled>
                          {`Select ${label}`}
                        </option>
                        {options?.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type}
                        id={id}
                        name={id}
                        value={formData[id]}
                        onChange={handleChange}
                        required={required}
                        className={`w-full px-3 sm:px-4 py-1 sm:py-2 border ${
                          errors[id] || message[id] ? "border-red-500" : "border-gray-300"
                        } rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    )}
                    {errors[id] && (
                      <p className="text-red-500 text-xs mt-1">{errors[id]}</p>
                    )}
                    {message[id] && (
                      <p className="text-red-500 text-xs mt-1">{message[id]}</p>
                    )}
                  </div>
                ))}
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