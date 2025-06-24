import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import useUserPermission from "../hooks/usePermission";

const AllExpenseCategory = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const { permissions } = useUserPermission();

  const fetchExpenseCategory = async () => {
    try {
      const response = await fetch(`${url}/expense/category/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCategories(data.data || []);
      } else {
        setError("Error fetching expense categories: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      setError("Error fetching expense categories: " + error.message);
    }
  };

  useEffect(() => {
    fetchExpenseCategory();
  }, [url, token]);

  const handleEditExpenseCategory = (id) => navigate(`/edit-expense-category/${id}`);
  const handleAddExpenseCategory = () => navigate("/add-expense-category");

  const handleDeleteCategory = async () => {
    if (!selectedId) return;
    try {
      const response = await fetch(
        `${url}/expense/category/?expense_category_id=${selectedId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (response.ok) {
        setCategories(categories.filter((category) => category.id !== selectedId));
        setIsModalOpen(false);
        setSelectedId(null);
      } else {
        setError("Failed to delete expense category");
      }
    } catch (error) {
      setError("Error deleting expense category: " + error.message);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setSelectedId(null);
  };

  const toggleCategorySelection = (categoryId) => {
    setSelectedCategoryId((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  return (
    <div className="bg-white mt-16 p-1 sm:p-6 md:p-8 w-full mx-auto">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md text-sm sm:text-base">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-black rounded-t-lg text-white px-4 sm:px-6 py-2 sm:py-2">
        <h1 className="text-base sm:text-xl mb-2 sm:mb-0">Expense Category List</h1>
        <IoMdAddCircleOutline
          className="text-lg sm:text-xl cursor-pointer"
          onClick={handleAddExpenseCategory}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border-b border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm" colSpan={4}>
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-4">
                    <span className="w-4 h-4"></span>
                    <span className="text-xs sm:text-sm">SL</span>
                    <span className="text-xs sm:text-sm ml-12">Name</span>
                  </div>
                  <span className="text-xs sm:text-sm">Actions</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center p-4 text-gray-500 text-xs sm:text-sm"
                >
                  No expense categories found
                </td>
              </tr>
            ) : (
              categories.map((category, index) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="border-b border-gray-300 p-2 sm:p-3" colSpan={4}>
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedCategoryId.includes(category.id)}
                          onChange={() => toggleCategorySelection(category.id)}
                          className="w-4 h-4"
                        />
                        <span className="text-xs sm:text-sm">{index + 1}</span>
                        <span className="text-xs sm:text-sm ml-12">{category.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="text-purple-500 hover:text-purple-700"
                          onClick={() => handleEditExpenseCategory(category.id)}
                        >
                          <FiEdit className="w-4 sm:w-5 h-4 sm:h-5" />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => openDeleteModal(category.id)}
                        >
                          <FiTrash2 className="w-4 sm:w-5 h-4 sm:h-5" />
                        </button>
                      </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center w-full max-w-sm">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Confirm Delete</h2>
              <p className="text-gray-700 text-sm sm:text-base">
                Are you sure you want to delete this expense category?
              </p>
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <button
                  className="bg-red-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-red-700 text-sm sm:text-base"
                  onClick={handleDeleteCategory}
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

  export default AllExpenseCategory;