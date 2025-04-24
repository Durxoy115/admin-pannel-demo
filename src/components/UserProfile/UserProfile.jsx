import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Removed useParams if not needed
import { TfiPlus } from "react-icons/tfi";
import { TbEdit } from "react-icons/tb"; // Import TbEdit icon
import SubAdmin from "../SubAdmin/SubAdmin";
import Products from "../Products/Products";
import AddressBook from "../AddressBook/AddressBook";
import SupportContactList from "../SupportContactList/SupportContactList";
import useToken from "../hooks/useToken";
import CompanyAddress from "../CompanyAddress/CompanyAddress";
import Signature from "../Signature/Signature";
import useUserPermission from "../hooks/usePermission";
import UserPermissionGroup from "../UserPermissionGroup/UserPermissionGroup";

const MyProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editableFields, setEditableFields] = useState({
    first_name: false,
    last_name: false,
    email: false,
    contact: false,
  });
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
  });

  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const { permissions } = useUserPermission();

  const canViewUser = permissions.includes("users.view_user");
  const viewServices = permissions.includes("service.view_service");
  const viewCompany = permissions.includes("company.view_company");
  const viewCompanyBillingAddress = permissions.includes("company.view_billingaddress");
  const canViewUserPermissionGroup = permissions.includes("company.view_billingaddress");
  const canViewAuthoritySign = permissions.includes("company.view_authoritysignature");
  const CanViewSupportContact = permissions.includes("company.view_supportcontact");

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
        const data = await response.json();
        if (response.ok) {
          
          setUserData(data.data);
          setFormData({
            first_name: data.data?.first_name || "",
            last_name: data.data?.last_name || "",
            email: data.data?.email || "",
            contact: data.data?.contact || "",
          });
          if (data.data?.photo) {
            setImagePreview(`${url}${data.data.photo}`);
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

  const toggleEditable = (field) => {
    setEditableFields({ ...editableFields, [field]: !editableFields[field] });
    console.log("toggleEditable",[field], !editableFields[field]);
    
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (field) => {
    // Disable editability after saving
    setEditableFields({ ...editableFields, [field]: false });

    // Check if userData.id is available
    if (!userData?.id) {
      console.error("User ID not available");
      alert("Cannot save changes: User ID not available");
      return;
    }

    // Prepare form data for the API
    const formPayload = new FormData();
    
    formPayload.append(field, formData[field]);

    try {
      const response = await fetch(`${url}/auth/profile/?user_id=${userData.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formPayload,
      });

      const result = await response.json();
      if (response.ok && result.success) {
        // Update userData with the new value
        setUserData({ ...userData, [field]: formData[field] });
      } else {
        console.error("Failed to update profile:", result?.dat?.message);
        alert(`Failed to update ${field}: ${result?.data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  return (
    <div className="p-1 sm:p-6 md:p-8 bg-gray-100 shadow-md mt-14">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold mt-2">My Profile</h2>
        <button
          className="bg-blue-700 text-white px-3 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-lg mt-3 sm:mt-0 hidden sm:block"
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
              <div className="relative">
                <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">First Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    onBlur={() => editableFields.first_name && handleSave("first_name")}
                    readOnly={!editableFields.first_name}
                    className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded-lg bg-gray-100 text-sm sm:text-base pr-10"
                  />
                  <TbEdit
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 sm:hidden cursor-pointer"
                    onClick={() => toggleEditable("first_name")}
                    role="button"
                    aria-label="Edit first name"
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">Last Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    onBlur={() => editableFields.last_name && handleSave("last_name")}
                    readOnly={!editableFields.last_name}
                    className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded-lg bg-gray-100 text-sm sm:text-base pr-10"
                  />
                  <TbEdit
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 sm:hidden cursor-pointer"
                    onClick={() => toggleEditable("last_name")}
                    role="button"
                    aria-label="Edit last name"
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => editableFields.email && handleSave("email")}
                    readOnly={!editableFields.email}
                    className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded-lg bg-gray-100 text-sm sm:text-base pr-10"
                  />
                  <TbEdit
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 sm:hidden cursor-pointer"
                    onClick={() => toggleEditable("email")}
                    role="button"
                    aria-label="Edit email"
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    onBlur={() => editableFields.contact && handleSave("contact")}
                    readOnly={!editableFields.contact}
                    className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded-lg bg-gray-100 text-sm sm:text-base pr-10"
                  />
                  <TbEdit
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 sm:hidden cursor-pointer"
                    onClick={() => toggleEditable("contact")}
                    role="button"
                    aria-label="Edit phone number"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-md p-2 sm:p-4 mt-4 sm:mt-6">
        {canViewUser && <SubAdmin />}
        {canViewUserPermissionGroup && <UserPermissionGroup />}
        {viewServices && <Products />}
        {viewCompany && <CompanyAddress />}
        {viewCompanyBillingAddress && <AddressBook />}
        {canViewAuthoritySign && <Signature />}
        {CanViewSupportContact && <SupportContactList />}
      </div>
    </div>
  );
};

export default MyProfile;