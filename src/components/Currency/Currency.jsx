import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import useToken from "../hooks/useToken";
import useUserPermission from "../hooks/usePermission";

const Currency = () => {
  const [currency, setCurrency] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [message, setMessage] = useState(""); // For success/error messages
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const {permissions} = useUserPermission();

  const canAddUserPermissionGroup = permissions.includes("configuration.add_currency");
  const canEditUserPermissionGroup = permissions.includes("configuration.change_currency");
  const canDeleteUserPermissionGroup = permissions.includes("configuration.delete_currency");


  const fetchAddress = async () => {
    try {
      const response = await fetch(`${url}/config/currency/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCurrency(data.data);
      } else {
        setMessage(`Failed to fetch currency: ${data?.data?.message}`);
        console.error("API Error:", data?.data?.message);
      }
    } catch (error) {
      setMessage("Error fetching Currency. Please try again.");
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, [url, token]);

  const handleDeleteContact = async () => {
    if (!selectedContactId) return;

    try {
      const response = await fetch(
        `${url}/config/currency/?currency_id=${selectedContactId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        setCurrency(currency.filter((contact) => contact.id !== selectedContactId));
        setMessage("Currency deleted successfully!");
        setIsModalOpen(false);
        setSelectedContactId(null);
        // Clear success message after 3 seconds
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(`Failed to delete contact: ${data?.data?.message || "Unknown error"}`);
      }
    } catch (error) {
      setMessage("Error deleting contact. Please try again.");
      console.error("Error deleting contact:", error);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedContactId(id);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setSelectedContactId(null);
  };

  const handleUserRole = () => {
    navigate("/add-currency");
  };

  const handleEdit = (id) => {
    navigate(`/edit-currency/${id}`);
  };
  

  return (
    <div className="sm:p-2 lg:p-1  bg-white">
      <div className="mt-12 sm:mt-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
            Currency
          </h1>
          {
            canAddUserPermissionGroup && 
            <button
            className="bg-blue-700 w-full sm:w-20 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition-colors duration-200 text-sm sm:text-base"
            onClick={handleUserRole}
          >
            Add
          </button>
          }
          
        </div>

        {/* Display Success/Error Message */}
        {message && (
          <div
            className={`mb-4 p-4 rounded-lg text-sm sm:text-base ${
              message.includes("success")
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 sm:py-3 px-4 sm:px-6 text-left border-b text-xs sm:text-sm md:text-base font-medium text-gray-700">
                  Name
                </th>
                <th className="py-2 sm:py-3 px-4 sm:px-6 text-left border-b text-xs sm:text-sm md:text-base font-medium text-gray-700">
                  Sign
                </th>
                <th className="py-2 sm:py-3 px-4 sm:px-6 text-end border-b text-xs sm:text-sm md:text-base font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currency.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
              
                  <td className="py-2 sm:py-3 px-4 sm:px-6 border-b text-xs sm:text-sm text-gray-700">
                    {contact.currency}
                  </td>
                  <td className="py-2 sm:py-3 px-4 sm:px-6 border-b text-xs sm:text-sm text-gray-700">
                    {contact.sign}
                  </td>
                  <td className="py-2 sm:py-3 px-4 sm:px-6 border-b">
                    <div className="flex justify-end gap-2 sm:gap-3">
                      {
                        canEditUserPermissionGroup && 
                        <FiEdit
                        className="text-purple-500 hover:text-purple-700 h-4 w-4 sm:h-5 sm:w-5 cursor-pointer"
                        onClick={() => handleEdit(contact.id)}
                      />
                      }
                      {
                        canDeleteUserPermissionGroup && 
                        <FiTrash2
                        className="text-red-500 hover:text-red-700 h-4 w-4 sm:h-5 sm:w-5 cursor-pointer"
                        onClick={() => openDeleteModal(contact.id)}
                      />
                      }
                    
                    
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this user role?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                onClick={handleDeleteContact}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Currency;