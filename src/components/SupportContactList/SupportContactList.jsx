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
    <div>
      <div className="mt-16">
        <div className="flex justify-between items-center pl-4 pr-4 ml-10 mr-10">
          <h1 className="text-3xl font-bold mb-4">Support Contact List</h1>
          <button
            className="bg-blue-700 w-20 text-white p-2 rounded-md hover:bg-blue-800"
            onClick={handleContact}
          >
            Add
          </button>
        </div>

        <div className="mt-6 ml-10 mr-10 overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-6 text-left border-b">
                  Social Media Type
                </th>
                <th className="py-3 px-6 text-left border-b">
                  Social Media No/Link
                </th>
                <th className="py-3 px-6 text-center border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="py-3 px-6 border-b">
                    <img
                      src={`https://admin.zgs.co.com${contact.logo}`} // Use contact.logo instead of client.photo
                      alt="logo"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        marginRight: "5px",
                      }}
                    />
                  </td>
                  <td className="py-3 px-6 border-b">{contact.account}</td>
                  <td className=" py-3 px-6   border-b">
                    <div className="flex justify-center gap-2">
                    <FiEdit className="text-purple-500 hover:text-purple-700" />
                    <FiTrash2 className="text-red-500 hover:text-red-700" />
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
