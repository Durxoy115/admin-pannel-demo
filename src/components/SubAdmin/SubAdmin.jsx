import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import axios from "axios";
import useUserPermission from "../hooks/usePermission";

const SubAdmin = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const {permissions} = useUserPermission();

  

  const canAddUser = permissions.includes("users.add_user");
  const canUpdateUser = permissions.includes("users.change_user");
  const canDeletedUser = permissions.includes("users.delete_user");
  
  


  const fetchUsers = async () => {
    try {
      const response = await fetch(`${url}/auth/user/`, {
        headers: {
          Authorization: `Token ${token}`,
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
  }, [url, token]);

  const handleEditSubAdmin = (id) => {
    navigate(`/edit-user/${id}`);
  };

  const handleAddSubAdmin = () => {
    navigate("/add-user");
  };

  const handleDeleteSubAdmin = async () => {
    if (!selectedUserId) return;

    try {
      const response = await fetch(
        `${url}/auth/user/?user_id=${selectedUserId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== selectedUserId));
        setIsModalOpen(false);
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };
// console.log("------", canViewUserList)
  return (
      <div className=" bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-black rounded-t-lg text-white pl-3 sm:pl-4 pr-3 sm:pr-4 py-1 sm:py-2">
        <h1 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-0">Sub-Admin List</h1>
        {
          canAddUser && 
          <IoMdAddCircleOutline
          className="text-lg sm:text-xl cursor-pointer"
          onClick={handleAddSubAdmin}
        />
        }
          
        
        
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 ">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left text-xs sm:text-sm">Name</th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left text-xs sm:text-sm">User Name</th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left text-xs sm:text-sm">Password</th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left text-xs sm:text-sm">Email</th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left text-xs sm:text-sm">Mobile</th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left text-xs sm:text-sm">Member Type</th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left text-xs sm:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border-b border-gray-300 p-1 sm:p-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="mr-2 sm:mr-3 w-4 h-4"
                    />
                    {user.photo && (
                      <img
                        src={`${url}${user.photo}`}
                        alt="user"
                        className="w-5 sm:w-6 h-5 sm:h-6 rounded-full mr-1 sm:mr-2"
                      />
                    )}
                    <span className="text-xs sm:text-sm">
                      {user.first_name} {user.last_name}
                    </span>
                  </div>
                </td>
                <td className="border-b border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">{user.username}</td>
                <td className="border-b border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">********</td>
                <td className="border-b border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">{user.email}</td>
                <td className="border-b border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">{user.contact || "N/A"}</td>
                <td className="border-b border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">{user.user_type?.name || "N/A"}</td>
                <td className="border-b border-gray-300 p-1 sm:p-2">
                  <div className="flex gap-2">
                    {
                      canUpdateUser && 
                      <button
                      className="text-purple-500 hover:text-purple-700"
                      onClick={() => handleEditSubAdmin(user.id)}
                    >
                      <FiEdit className="w-4 sm:w-5 h-4 sm:h-5" />
                    </button>
                    }
                   {
                    canDeletedUser && 
                    <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => openDeleteModal(user.id)}
                  >
                    <FiTrash2 className="w-4 sm:w-5 h-4 sm:h-5" />
                  </button>
                   }
                   
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
              Are you sure you want to delete this member?
            </p>
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                className="bg-red-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-red-700 text-sm sm:text-base"
                onClick={handleDeleteSubAdmin}
              >
                Delete
              </button>
              <button
                className="bg-green-300 px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-green-400 text-sm sm:text-base"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    
  );
};

export default SubAdmin;