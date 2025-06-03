import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { CiViewList } from "react-icons/ci";
import useUserPermission from "../hooks/usePermission";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const { permissions } = useUserPermission();

  // Define status choices
  const statusChoices = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "On Leave", label: "On Leave" },
    { value: "Resigned", label: "Resigned" },
    { value: "Terminated", label: "Terminated" },
  ];

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${url}/employee/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.json();
      if (data.success && data.data) {
        setEmployees(data.data);
        setFilteredEmployees(data.data);
      } else {
        setError(
          "Error fetching employees: " + (data.message || "No data returned")
        );
      }
    } catch (error) {
      setError("Error fetching employees: " + error.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [url, token]);

  // Filter employees based on status and search query
  useEffect(() => {
    let filtered = [...employees];
    if (selectedStatus) {
      filtered = filtered.filter(
        (employee) => employee.status === selectedStatus
      );
    }
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (employee) =>
          employee.full_name.toLowerCase().includes(lowerQuery) ||
          employee.contact.toLowerCase().includes(lowerQuery) ||
          employee.email.toLowerCase().includes(lowerQuery)
      );
    }
    setFilteredEmployees(filtered);
  }, [selectedStatus, searchQuery, employees]);

  const toggleEmployeeSelection = (id) => {
    setSelectedEmployeeIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };
  const handleAddEmployee = () => {
    navigate("/add-employee");
  };
  const handleEditEmployee = (id) => {
    navigate(`/edit-employee/${id}`);
  }

  return (
    <div className="bg-white mt-16 p-4 sm:p-6 md:p-8 w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-black rounded-t-lg text-white px-4 sm:px-6 py-2 sm:py-2">
        <h1 className="text-lg sm:text-xl mb-2 sm:mb-0">Employee List</h1>
        <IoMdAddCircleOutline 
        onClick={handleAddEmployee}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Search and Status Filter */}
      <div className="p-3 rounded-md flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap bg-gray-100">
        <div className="flex-1 min-w-[150px]">
          <input
            type="text"
            className="block w-72 border border-gray-300 rounded-md p-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 h-8"
            placeholder="Search by name, phone, or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="min-w-[120px]">
          <select
            className="block w-28 border border-gray-300 rounded-md p-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 h-8"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {statusChoices.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-xs">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedEmployeeIds(
                        filteredEmployees.map((employee) => employee.id)
                      );
                    } else {
                      setSelectedEmployeeIds([]);
                    }
                  }}
                  checked={
                    selectedEmployeeIds.length === filteredEmployees.length &&
                    filteredEmployees.length > 0
                  }
                />
              </th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left">
                Profile
              </th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left">
                Full Name
              </th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left">
                Employee ID
              </th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left">
                Job Title
              </th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left">
                Joining Date
              </th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left">
                Contact
              </th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left">
                Email
              </th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left">
                Status
              </th>
              <th className="border-b border-gray-300 p-1 sm:p-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  className="text-center p-3 text-gray-500 text-xs"
                >
                  No employees found
                </td>
              </tr>
            ) : (
              filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="border-b border-gray-300 p-1 sm:p-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={selectedEmployeeIds.includes(employee.id)}
                      onChange={() => toggleEmployeeSelection(employee.id)}
                    />
                  </td>
                  <td className="border-b border-gray-300 p-1 sm:p-2">
                    <img
                      src={
                        employee.photo
                          ? `${url}${employee.photo}`
                          : ""
                      }
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) =>
                        (e.target.src = "")
                      }
                    />
                  </td>
                  <td className="border-b border-gray-300 p-1 sm:p-2">
                    {employee.full_name}
                  </td>
                  <td className="border-b border-gray-300 p-1 sm:p-2">
                    {employee.employee_id}
                  </td>
                  <td className="border-b border-gray-300 p-1 sm:p-2">
                    {employee.job_title}
                  </td>
                  <td className="border-b border-gray-300 p-1 sm:p-2">
                    {new Date(employee.joining_date).toLocaleDateString(
                      "en-US",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </td>
                  <td className="border-b border-gray-300 p-1 sm:p-2">
                    {employee.contact}
                  </td>
                  <td className="border-b border-gray-300 p-1 sm:p-2">
                    {employee.email}
                  </td>
                  <td className="border-b border-gray-300 p-1 sm:p-2">
                    <span className="bg-green-400 p-2 rounded-md">{employee.status}</span>
                  </td>
                  <td className="border-b border-gray-300 p-1 sm:p-2">
                    <div className="flex gap-2">
                      <button className="text-purple-500 hover:text-purple-700">
                        <FiEdit className="w-4 sm:w-5 h-4 sm:h-5"
                        onClick={() => handleEditEmployee(employee.id)}
                        />
                      </button>
                      <button className="text-green-500 hover:text-green-700">
                        <CiViewList className="w-4 sm:w-5 h-4 sm:h-5" />
                      </button>

                      <button className="text-red-500 hover:text-red-700">
                        <FiTrash2 className="w-4 sm:w-5 h-4 sm:h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
