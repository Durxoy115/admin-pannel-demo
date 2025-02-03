import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";


const SubAdmin = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://admin.zgs.co.com/auth/user/", {
        headers: {
          Authorization: "Token 4bc2a75c04006d4e540a8b38f86612dc0b1da466",
        },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        console.error("Error fetching users:", data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
        <div className="mt-8 flex bg-black rounded-lg text-white justify-between justify-center items-center pl-4 pr-4">
        <h1 className="text-2xl font-semibold mb-4">Sub-Admin List</h1>
    <IoMdAddCircleOutline className="text-xl"></IoMdAddCircleOutline>
        </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2 text-left">Sub-Admin Name</th>
              <th className="border border-gray-300 p-2 text-left">User Name</th>
              <th className="border border-gray-300 p-2 text-left">Email</th>
              <th className="border border-gray-300 p-2 text-left">Contact</th>
              <th className="border border-gray-300 p-2 text-left">Member Type</th>
              <th className="border border-gray-300 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">
                  {user.first_name} {user.last_name || "N/A"}
                </td>
                <td className="border border-gray-300 p-2">{user.username}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">{user.contact || "N/A"}</td>
                <td className="border border-gray-300 p-2">{user.user_type?.name || "N/A"}</td>
                <td className="border border-gray-300 p-2 flex gap-2">
                  <button className="text-purple-500 hover:text-purple-700">
                    <FiEdit />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubAdmin;