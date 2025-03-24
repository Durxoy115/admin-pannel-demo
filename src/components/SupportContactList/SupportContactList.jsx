import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import useToken from "../hooks/useToken";

const SupportContactList = () => {
  const [contacts, setContact] = useState([]);
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  const fetchAddress = async () => {
    try {
      const response = await fetch(`${url}/company/support-contact/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setContact(data.data);
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

  const handleContact = () => {
    navigate("/add-support-contact");
  };

  return (
    <div className=" sm:p-2 lg:p-1 min-h-screen bg-white">
      <div className="mt-12 sm:mt-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mx-4 sm:mx-4 lg:mx-10 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
            Support Contact List
          </h1>
          <button
            className="bg-blue-700 w-full sm:w-20 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition-colors duration-200 text-sm sm:text-base"
            onClick={handleContact}
          >
            Add
          </button>
        </div>

        <div className="overflow-x-auto mx-4 sm:mx-6 lg:mx-10">
          <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 sm:py-3 px-4 sm:px-6 text-left border-b text-xs sm:text-sm md:text-base font-medium text-gray-700">
                  Social Media Type
                </th>
                <th className="py-2 sm:py-3 px-4 sm:px-6 text-left border-b text-xs sm:text-sm md:text-base font-medium text-gray-700">
                  Social Media No/Link
                </th>
                <th className="py-2 sm:py-3 px-4 sm:px-6 text-center border-b text-xs sm:text-sm md:text-base font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="py-2 sm:py-3 px-4 sm:px-6 border-b">
                    <img
                      src={`https://admin.zgs.co.com${contact.logo}`}
                      alt="logo"
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-2 sm:mr-3 object-cover"
                    />
                  </td>
                  <td className="py-2 sm:py-3 px-4 sm:px-6 border-b text-xs sm:text-sm text-gray-700">
                    {contact.account}
                  </td>
                  <td className="py-2 sm:py-3 px-4 sm:px-6 border-b">
                    <div className="flex justify-center gap-2 sm:gap-3">
                      <FiEdit className="text-purple-500 hover:text-purple-700 h-4 w-4 sm:h-5 sm:w-5 cursor-pointer" />
                      <FiTrash2 className="text-red-500 hover:text-red-700 h-4 w-4 sm:h-5 sm:w-5 cursor-pointer" />
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

export default SupportContactList;