import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const AddressBook = () => {
  const [addresses, setAddresses] = useState([]);
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

  const handleEditAddress = () => {
    navigate("/edit-address");
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
                    onClick={handleEditAddress} />
                  
                  
                    <FiTrash2 className="text-red-500 hover:text-red-700"/>
                  
                </div>
                  </td>
                
                
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddressBook;
