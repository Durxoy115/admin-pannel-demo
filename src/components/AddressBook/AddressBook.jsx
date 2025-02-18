import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const AddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
  const navigate = useNavigate();

  const fetchAddress = async () => {
    try {
      const response = await fetch(
        "https://admin.zgs.co.com/company/billing-address/",
        {
          headers: {
            Authorization: "Token 4bc2a75c04006d4e540a8b38f86612dc0b1da466",
          },
        }
      );
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
  }, []);

  const handleAddAddress = () => {
    navigate("/add-address");
  };

  const handleEditAddress = (id) => {
    navigate(`/edit-address/${id}`);
  };

  const handleDeleteAddress = async () =>{
    if(!selectedAddressId)
      return;
    try{
      const response = await fetch (`https://admin.zgs.co.com/company/billing-address/?billing_address_id=${selectedAddressId}`,{
        method: "DELETE",
        headers: {
          Authorization: "Token 4bc2a75c04006d4e540a8b38f86612dc0b1da466",
        },
      });
      if(response.ok) {
        setAddresses(addresses.filter((address) => address.id !== selectedAddressId));
        setIsModalOpen(false);
      }
      else {
        console.error("Failed to delete user");
      }
    }
    catch (error) {
      console.error("Error deleting user:", error);
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
      <div className="mt-16">
        <div className="flex justify-between items-center pl-4 pr-4 ml-10 mr-10">
          <h1 className="text-3xl font-bold mb-4">Company Address Book</h1>
          <button
            className="bg-blue-700 w-20 text-white p-2 rounded-md hover:bg-blue-800"
            onClick={handleAddAddress}
          >
            Add
          </button>
        </div>

        <div className="mt-6 ml-10 mr-10 overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-6 text-left border-b">Bank Name</th>
                <th className="py-3 px-6 text-left border-b">Branch Name</th>
                <th className="py-3 px-6 text-left border-b">Account Name</th>
                <th className="py-3 px-6 text-left border-b">Account Number</th>
                <th className="py-3 px-6 text-left border-b">Routing Number</th>
                <th className="py-3 px-6 text-center border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map((address) => (
                <tr key={address.id} className="hover:bg-gray-50">
                  <td className="py-3 px-6 border-b">{address.bank_name}</td>
                  <td className="py-3 px-6 border-b">{address.branch_name}</td>
                  <td className="py-3 px-6 border-b">{address.account_name}</td>
                  <td className="py-3 px-6 border-b">
                    {address.account_number}
                  </td>
                  <td className="py-3 px-6 border-b">
                    {address.routing_number}
                  </td>
                  <td className="py-3 px-6 border-b">
                  <div className=" p-2 flex justify-center gap-2  ">
                    
                    <FiEdit className="text-purple-500 hover:text-purple-700"
                    onClick={() => handleEditAddress(address.id)} />
                  
                  
                    <FiTrash2 className="text-red-500 hover:text-red-700"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="text-gray-700">Are you sure you want to delete this Address?</p>
            <div className="mt-6 flex justify-center gap-4">
              <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700" onClick={handleDeleteAddress}>Delete</button>
              <button className="bg-green-300 px-4 py-2 rounded-md hover:bg-green-400" onClick={closeDeleteModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AddressBook;
