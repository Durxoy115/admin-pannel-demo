import React, { useState, useEffect } from "react";
import { LuCirclePlus } from "react-icons/lu";
import { AiOutlineEye, AiOutlineEdit } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CgNotes } from "react-icons/cg";
import { IoMdRefresh } from "react-icons/io";
import { BsDownload } from "react-icons/bs";
import { GrNotes } from "react-icons/gr";
import { FaTrash } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { MdOutlineMail } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import useToken from "../hooks/useToken";
import useUserPermission from "../hooks/usePermission";

const Dashboard = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMode, setDeleteMode] = useState("");
  const [clientToDelete, setClientToDelete] = useState(null);
  const [rowHide, setRowHide] = useState({}); // State for row blur/disable
  const { permissions } = useUserPermission();

  const addClient = permissions.includes("users.add_client");
  const canViewInvoiceList = permissions.includes("service.view_invoice")
  const editClient = permissions.includes("users.change_client");
  const canDeleteCient = permissions.includes("users.delete_client");
  const canViewClient = permissions.includes("users.view_client");
  // const canDeleteCient = permissions.includes("users.delete_client");
  const canAddInvoice = permissions.includes("service.add_invoice");
  const navigate = useNavigate();
  const location = useLocation();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  const fetchClients = () => {
    fetch(`${url}/client/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setClients(data.data);
          setFilteredClients(data.data);
        } else {
          console.error("Error fetching clients: ", data.message);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const shouldReload = location.state?.reload;
    if (shouldReload) {
      fetchClients();
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      fetchClients();
    }
  }, [location.state]);

  const handleOpenModal = () => navigate("/addnewclient");
  const handleInvoiceList = () => navigate("/invoice-list");
  const handleClientProfile = (id) => navigate(`/client-info/${id}`);
  const handleClientInvoice = (clientId) =>
    navigate(`/client-invoice-create/${clientId}`);

  const toggleClientSelection = (clientId) => {
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = clients.filter((client) => {
      // Ensure query is a string and non-empty
      if (typeof query !== 'string' || query.trim() === '') return false;
    
      const queryLower = query.toLowerCase();
      // Check client.name (handle undefined/null) and client.id (convert to string)
      return (
        (client.name?.toLowerCase()?.includes(queryLower) || false) ||
        String(client.client_id).toLowerCase().includes(queryLower)
      );
    });
    setFilteredClients(filtered);
  };

  const openDeleteModal = (mode, clientId = null) => {
    setDeleteMode(mode);
    setClientToDelete(clientId);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    if (deleteMode === "single" && clientToDelete) {
      deleteClient(clientToDelete);
    } else if (deleteMode === "bulk") {
      deleteMultipleClients();
    }
  };

  const deleteClient = (clientId) => {
    fetch(`${url}/client/?client_id=${clientId}`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    })
      .then(() => fetchClients())
      .catch((err) => console.error("Error deleting client:", err));
  };

  const deleteMultipleClients = () => {
    const deletePromises = selectedClients.map((clientId) =>
      fetch(`${url}/client/?client_id=${clientId}`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      })
    );
    Promise.all(deletePromises)
      .then(() => {
        setSelectedClients([]);
        fetchClients();
      })
      .catch((err) => console.error("Error deleting clients:", err));
  };

  // Toggle row blur/disable state
  const handleEyeClick = (clientId) => {
    setRowHide((prev) => ({
      ...prev,
      [clientId]: {
        invisible: !prev[clientId]?.invisible,
      },
    }));
  };

  return (
    <>
    {
      canViewClient && 
      <div className="mx-auto p-1 md:p-10">
      <div>
        <h1 className="text-3xl font-semibold mt-16 md:mt-12">Clients Information</h1>
      </div>

      <div className="bg-gray-800 text-white p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 mt-4 min-h-[4rem]">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="text-center sm:text-left">
            <p className="text-sm sm:text-base">Clients Details</p>
          </div>
          <div className="w-full sm:w-64 lg:w-96">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full text-black px-3 py-1 sm:px-4 sm:py-2 border border-gray-700 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:gap-4 w-full sm:w-auto">
          {addClient && (
            <button
              className="text-xl text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg relative group"
              onClick={handleOpenModal}
            >
              <LuCirclePlus className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-blue-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                Add New Client
              </span>
            </button>
          )}

          {
            canViewInvoiceList && 
<button
            className="text-xl text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg relative group"
            onClick={handleInvoiceList}
          >
            <CgNotes className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-blue-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              Invoice List
            </span>
          </button>
          }

          
          <button
            className="text-xl text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg relative group"
            onClick={fetchClients}
          >
            <IoMdRefresh className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-blue-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              Refresh
            </span>
          </button>
          <button className="text-xl text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg relative group">
            <BsDownload className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-blue-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              Download
            </span>
          </button>
          {selectedClients.length > 0 && (
            <button
              className="text-white bg-red-600 px-2 py-1 sm:px-2 sm:py-2 rounded-lg"
              onClick={() => openDeleteModal("bulk")}
            >
              <FaTrash className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <p className="text-center mt-8">Loading...</p>
      ) : filteredClients.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md mx-auto">
          <table className="table-auto w-full border-collapse">
            <thead className="bg-gray-50 text-black">
              <tr>
                <th className="text-left  px-4 py-2 border-b">Client Name</th>
                <th className="text-center px-4 py-2 border-b">Client ID</th>
                <th className="text-left px-4 py-2 border-b">Mobile</th>
                <th className="text-left  px-4 py-2 border-b">Email</th>
                <th className="text-center px-4 py-2 border-b">Company Name</th>
                <th className="text-center  px-4 py-2 border-b">Country</th>
                <th className="text-center px-4 py-2 border-b">Status</th>
                <th className="text-center px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client, index) => (
                <tr
                  key={client.client_id}
                  className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} ${
                    rowHide[client.client_id]?.invisible
                      ? "opacity-30 pointer-events-none-off"
                      : ""
                  } transition-all duration-300`}
                >
                  <td className="text-left px-4 py-2 flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedClients.includes(client.client_id)}
                      onChange={() => toggleClientSelection(client.client_id)}
                      className="mr-3"
                      disabled={rowHide[client.client_id]?.disabled}
                    />
                    <img
                      src={`${url}${client.photo}`}
                      alt="client"
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        marginRight: "5px",
                      }}
                    />
                    {client.name || "N/A"}
                  </td>
                  <td className="text-center">{client.client_id}</td>
                  <td className="flex  gap-2 items-center">
                    <IoIosCall className="text-green-500" />
                    {client.contact}
                  </td>

                  <td>
                    <div className="flex  gap-2 items-center">
                      <MdOutlineMail className="text-red-500" />
                      {client.email}
                    </div>
                  </td>
                  <td className="text-center">{client.company_name}</td>
                  <td className="text-center">{client.country}</td>
                  <td className="text-center">
                    {client.user_id.is_active ? "Active" : "Inactive"}
                  </td>
                  <td>
                    <div className="flex justify-center space-x-2">
                      <button
                        style={{
                          backgroundColor: "#EFEFEF",
                          padding: "2px",
                          borderRadius: "5px",
                        }}
                        onClick={() => handleEyeClick(client.client_id)}
                      >
                        <AiOutlineEye />
                      </button>
                      {editClient && (
                        <button
                          style={{
                            backgroundColor: "#EFE5FF",
                            padding: "2px",
                            borderRadius: "5px",
                            color: "#5800FF",
                          }}
                          className="relative group"
                          onClick={() => handleClientProfile(client.client_id)}
                          disabled={rowHide[client.client_id]?.disabled}
                        >
                          <AiOutlineEdit />
                          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block bg-purple-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            Edit
                          </span>
                        </button>
                      )}
                      {
                        canAddInvoice && 
                        <button
                        style={{
                          backgroundColor: "#FEF9C2",
                          padding: "2px",
                          borderRadius: "5px",
                          color: "#B9AB12",
                        }}
                        className="relative group"
                        onClick={() => handleClientInvoice(client.client_id)}
                        disabled={rowHide[client.client_id]?.disabled}
                      >
                        <GrNotes />
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block bg-yellow-600 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                          Invoice
                        </span>
                      </button>
                      }

                     
                      {
                        canDeleteCient &&
                        <button
                        style={{
                          backgroundColor: "#FFC6B8",
                          padding: "2px",
                          borderRadius: "5px",
                          color: "#FF4242",
                        }}
                        className="relative group"
                        onClick={() =>
                          openDeleteModal("single", client.client_id)
                        }
                        disabled={rowHide[client.client_id]?.disabled}
                      >
                        <RiDeleteBin6Line />
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block bg-red-600 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                          Delete
                        </span>
                      </button>

                      }
                      
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center mt-8">No clients available.</p>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <p>
              Are you sure you want to delete{" "}
              {deleteMode === "single" ? "this client" : "selected clients"}?
            </p>
            <div className="items-center justify-center flex mt-6">
              <button
                className="bg-blue-600 text-white p-2 rounded-lg gap-3"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white p-2 rounded-lg gap-3 ml-2"
                onClick={handleDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
      
    }
    </>
    
  );
};

export default Dashboard;
