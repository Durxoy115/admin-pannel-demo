import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import useToken from "../hooks/useToken";

const AddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  const fetchAddress = async () => {
    try {
      const response = await fetch(`${url}/company/billing-address/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setAddresses(data.data);
      } else {
        console.error("The problem is", data.message);
      }
    } catch (error) {
      console.error("Error fetching Services:", error);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, [url, token]);

  const handleAddAddress = () => {
    navigate("/add-address");
  };

  const handleEditAddress = (id) => {
    navigate(`/edit-address/${id}`);
  };

  const handleDeleteAddress = async () => {
    if (!selectedAddressId) return;
    try {
      const response = await fetch(
        `${url}/company/billing-address/?billing_address_id=${selectedAddressId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (response.ok) {
        setAddresses(addresses.filter((address) => address.id !== selectedAddressId));
        setIsModalOpen(false);
      } else {
        console.error("Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedAddressId(id);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setSelectedAddressId(null);
  };

  return (
    <div>
      <div className="mt-4 sm:mt-6 md:mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between   mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0">Company Billing Address </h1>
          <button
            className="bg-blue-700 w-full sm:w-20 text-white  sm:px-4 py-1 sm:py-2 rounded-md hover:bg-blue-800 text-sm sm:text-base"
            onClick={handleAddAddress}
          >
            Add
          </button>
        </div>

        <div className="mt-4 sm:mt-6   sm:mr-2 md:mr-2 overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md ">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 sm:py-3 px-4 sm:px-6 text-left border-b text-xs sm:text-sm">Gateway</th>
                {/* <th className="py-2 sm:py-3 px-4 sm:px-6 text-left border-b text-xs sm:text-sm">Company Logo</th> */}
                <th className="py-2 sm:py-3 px-4 sm:px-6 text-left border-b text-xs sm:text-sm">Bank Name</th>
                <th className="py-2 sm:py-3 px-4 sm:px-6 text-left border-b text-xs sm:text-sm">Branch Name</th>
                <th className="py-2 sm:py-3 px-4 sm:px-6 text-left border-b text-xs sm:text-sm">Account Name</th>
                <th className="py-2 sm:py-3 px-4 sm:px-6 text-left border-b text-xs sm:text-sm">Account Number</th>
                <th className="py-2 sm:py-3 px-4 sm:px-6 text-left border-b text-xs sm:text-sm">Routing Number</th>
                <th className="py-2 sm:py-3 px-4 sm:px-6 text-center border-b text-xs sm:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map((address) => (
                <tr key={address.id} className="hover:bg-gray-50">
                  <td className="py-2 sm:py-3 px-4 sm:px-6 border-b text-xs sm:text-sm">{address.gateway}</td>
                  {/* <td className="py-2 sm:py-3 px-4 sm:px-6 border-b">
                    <img
                      src={`${url}/${address.company_logo}`}
                      alt="logo"
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-2 sm:mr-3 object-cover"
                    />
                  </td> */}
                  <td className="py-2 sm:py-3 px-4 sm:px-6 border-b text-xs sm:text-sm">{address.bank_name}</td>
                  <td className="py-2 sm:py-3 px-4 sm:px-6 border-b text-xs sm:text-sm">{address.branch_name}</td>
                  <td className="py-2 sm:py-3 px-4 sm:px-6 border-b text-xs sm:text-sm">{address.account_name}</td>
                  <td className="py-2 sm:py-3 px-4 sm:px-6 border-b text-xs sm:text-sm">{address.account_number}</td>
                  <td className="py-2 sm:py-3 px-4 sm:px-6 border-b text-xs sm:text-sm">{address.routing_number}</td>
                  <td className="py-2 sm:py-3 px-4 sm:px-6 border-b">
                    <div className="flex justify-center gap-2 sm:gap-3">
                      <FiEdit
                        className="text-purple-500 hover:text-purple-700 w-4 sm:w-5 h-4 sm:h-5 cursor-pointer"
                        onClick={() => handleEditAddress(address.id)}
                      />
                      <FiTrash2
                        className="text-red-500 hover:text-red-700 w-4 sm:w-5 h-4 sm:h-5 cursor-pointer"
                        onClick={() => openDeleteModal(address.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center w-full max-w-sm">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Confirm Delete</h2>
              <p className="text-gray-700 text-sm sm:text-base">
                Are you sure you want to delete this Address?
              </p>
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <button
                  className="bg-red-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-red-700 text-sm sm:text-base w-full sm:w-auto"
                  onClick={handleDeleteAddress}
                >
                  Delete
                </button>
                <button
                  className="bg-green-300 px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-green-400 text-sm sm:text-base w-full sm:w-auto"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressBook;