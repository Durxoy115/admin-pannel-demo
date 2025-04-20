import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";

const EditUserRole = () => {
  const { id } = useParams(); // Get role ID from URL
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const [formData, setFormData] = useState({
    name: "",
  });
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [userGroupPermission, setUserGroupPermission] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch role details and permissions on mount
  useEffect(() => {
    const fetchRoleDetails = async () => {
      try {
        const response = await fetch(`${url}/user-group/?user_group_id=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const roleData = data?.data;
          setFormData({ name: roleData.name || "" });
          // Ensure permissions are strings to match <select> value
          const permissions =
            roleData.permissions?.map((perm) => String(perm)) || [];
          setSelectedPermissions(permissions);
          console.log("Fetched permissions:", permissions); // Debug
        } else {
          setErrors((prev) => ({
            ...prev,
            general: "Failed to fetch role details. Please try again.",
          }));
        }
      } catch (error) {
        console.error("Error fetching role details:", error);
        setErrors((prev) => ({
          ...prev,
          general: "Network error while fetching role details.",
        }));
      }
    };

    const fetchPermissions = async () => {
      try {
        const response = await fetch(`${url}/user-permission/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserGroupPermission(data?.data || []);
          console.log("Fetched all permissions:", data?.data); // Debug
        } else {
          setErrors((prev) => ({
            ...prev,
            general: "Failed to fetch user permissions. Please try again.",
          }));
        }
      } catch (error) {
        console.error("Error fetching user permissions:", error);
        setErrors((prev) => ({
          ...prev,
          general: "Network error while fetching user permissions.",
        }));
      }
    };

    const initializeData = async () => {
      setIsLoading(true);
      await Promise.all([fetchRoleDetails(), fetchPermissions()]);
      setIsLoading(false);
    };

    initializeData();
  }, [id, url, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, name: null }));
  };

  const handlePermissionChange = (e) => {
    const selected = Array.from(e.target.selectedOptions)
      .filter((option) => option.value !== "")
      .map((option) => option.value); // Keep as strings to match <select> value
    setSelectedPermissions(selected);
    setErrors((prev) => ({ ...prev, permissions: null }));
    console.log("Selected permissions:", selected); // Debug
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Role name is required.";
    }
    if (selectedPermissions.length === 0) {
      newErrors.permissions = "At least one permission is required.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      name: formData.name,
      permissions_id: selectedPermissions.map((perm) => parseInt(perm)), // Convert to integers for API
    };

    try {
      const response = await axios.put(
        `${url}/user-group/?user_group_id=${id}`,
        payload,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Success:", response.data);
      setErrors({});
      alert("User role updated successfully!");
      // navigate("/roles"); // Adjust the navigation path as needed
    } catch (error) {
      console.error("Error:", error);
      const errorData = error.response?.data;
      const newErrors = {};
      if (errorData?.name) {
        newErrors.name = errorData.name.join(", ");
      }
      if (errorData?.permissions) {
        newErrors.permissions = errorData.permissions.join(", ");
      }
      if (errorData?.detail) {
        newErrors.general = errorData.detail;
      } else {
        newErrors.general = "Failed to update user role. Please try again.";
      }
      setErrors(newErrors);
    }
  };

  if (isLoading) {
    return (
      <div className="p-1 sm:p-6 lg:p-8 min-h-screen bg-gray-100 flex">
        <p className="text-center mt-10 text-gray-600">Loading role details...</p>
      </div>
    );
  }

  return (
    <div className="p-1 sm:p-6 lg:p-8 min-h-screen bg-gray-100 flex">
      <div className="w-full mt-8 sm:mt-10 rounded-md">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 px-4 sm:px-8 pt-6 sm:pt-8">
          Edit User Role
        </h2>
        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 mx-4 sm:mx-8">
            {errors.general}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 px-4 sm:px-8 pb-6 sm:pb-8 bg-white p-10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter role name"
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                User Role Permission<span className="text-red-500">*</span>
              </label>
              <select
                name="permissions_id"
                multiple
                value={selectedPermissions}
                onChange={handlePermissionChange}
                className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded-lg text-sm sm:text-base"
              >
                <option value="">Select Permissions</option>
                {userGroupPermission.map((opt) => (
                  <option key={opt.id} value={String(opt.id)}>
                    {opt.name}
                  </option>
                ))}
              </select>
              {errors.permissions && (
                <p className="text-red-500 text-xs mt-1">{errors.permissions}</p>
              )}
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => navigate("/roles")} // Adjust the navigation path as needed
              className="w-full sm:w-48 bg-red-600 text-white py-2 sm:py-3 px-4 rounded-full hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 text-sm sm:text-base transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-48 bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 text-sm sm:text-base transition-colors duration-200"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserRole;