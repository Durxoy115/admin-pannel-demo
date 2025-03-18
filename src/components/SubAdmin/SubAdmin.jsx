import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";

const SubAdmin = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]); // State to track selected users
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

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
  }, []);

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

  // Function to toggle user selection
  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="p-4 bg-white">
      <div className="flex bg-black rounded-t-lg text-white justify-between items-center pl-4 pr-4">
        <h1 className="text-2xl font-semibold mb-4">Sub-Admin List</h1>
        <IoMdAddCircleOutline
          className="text-xl cursor-pointer"
          onClick={handleAddSubAdmin}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b border-gray-300 p-2 text-left">Name</th>
              
              <th className="border-b border-gray-300 p-2 text-left">
                User Name
              </th>
              <th className="border-b border-gray-300 p-2 text-left">
                Password
              </th>
              <th className="border-b border-gray-300 p-2 text-left">Email</th>
              <th className="border-b border-gray-300 p-2 text-left">
                Mobile
              </th>
              <th className="border-b border-gray-300 p-2 text-left">
                Member Type
              </th>
              <th className="border-b border-gray-300 p-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border-b border-gray-300 items-center p-2">
                  <div className="flex">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="mr-3"
                    />
                    {user.photo && (
                      <img
                        src={`https://admin.zgs.co.com${user.photo}`}
                        alt="user"
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          marginRight: "5px",
                        }}
                      />
                    )}
                    {user.first_name} {user.last_name}
                  </div>
                  
                </td>
                <td className="border-b border-gray-300 p-2">
                  {user.username}
                </td>
                <td className="border-b border-gray-300 p-2">
                  <p>********</p>
                </td>
                <td className="border-b border-gray-300 p-2">{user.email}</td>
                <td className="border-b border-gray-300 p-2">
                  {user.contact || "N/A"}
                </td>
                <td className="border-b border-gray-300 p-2">
                  {user.user_type?.name || "N/A"}
                </td>
                <td className="border-b border-gray-300 p-2 ">
                  <div className="flex gap-2">
                    <button
                      className="text-purple-500 hover:text-purple-700"
                      onClick={() => handleEditSubAdmin(user.id)}
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => openDeleteModal(user.id)}
                    >
                      <FiTrash2 />
                    </button>
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
            <p className="text-gray-700">
              Are you sure you want to delete this member?
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={handleDeleteSubAdmin}
              >
                Delete
              </button>
              <button
                className="bg-green-300 px-4 py-2 rounded-md hover:bg-green-400"
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
