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

const Dashboard = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMode, setDeleteMode] = useState("");
  const [clientToDelete, setClientToDelete] = useState(null);

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
          setFilteredClients(data.data); // Initialize filteredClients
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
    const filtered = clients.filter((client) =>
      client.name?.toLowerCase().includes(query.toLowerCase())
    );
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

  return (
    <div className=" mx-auto p-10">
      <div>
        <h1 className="text-3xl font-semibold mt-12 ">Clients Information</h1>
      </div>

      <div className="bg-gray-800 text-white p-4 rounded-lg flex items-center mt-4 h-16 justify-between">
      <div className="flex gap-4">
      <div >
          <p>Clients Details</p>
        </div>

        <div>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="flex-grow text-black px-4 py-2 border border-gray-700 rounded-3xl h-8 w-3/4 "
          />
        </div>
      </div>
        <div>
          <button
            className="text-xl text-white px-4 py-2 rounded-lg mr-2"
            onClick={handleOpenModal}
          >
            <LuCirclePlus />
          </button>
          <button
            className="text-xl text-white px-4 py-2 rounded-lg mr-2"
            onClick={handleInvoiceList}
          >
            <CgNotes />
          </button>
          <button
            className="text-xl text-white px-4 py-2 rounded-lg"
            onClick={fetchClients}
          >
            <IoMdRefresh />
          </button>
          <button className="text-xl text-white px-4 py-2 rounded-lg">
            <BsDownload />
          </button>
        </div>

        {selectedClients.length > 0 && (
          <button
            className="ml-4 text-white bg-red-600 px-2 py-2 rounded-lg"
            onClick={() => openDeleteModal("bulk")}
          >
            <FaTrash />
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="text-center mt-8">Loading...</p>
      ) : filteredClients.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md  mx-auto">
          <table className="table-auto w-full border-collapse">
            <thead className="bg-gray-50 text-black">
              <tr>
                <th className="text-left px-4 py-2 border-b">Client Name</th>
                <th className="text-left px-4 py-2 border-b">Client ID</th>
                <th className="text-left px-4 py-2 border-b">Mobile</th>
                <th className="text-left px-4 py-2 border-b">Email</th>
                <th className="text-left px-4 py-2 border-b">Company Name</th>
                <th className="text-left px-4 py-2 border-b">Country</th>
                <th className="text-center px-4 py-2 border-b">Status</th>
                <th className="text-center px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client, index) => (
                <tr
                  key={client.client_id}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="text-left px-4 py-2 flex items-center ">
                    <input
                      type="checkbox"
                      checked={selectedClients.includes(client.client_id)}
                      onChange={() => toggleClientSelection(client.client_id)}
                      className="mr-3"
                    />
                    <img
                      src={`https://admin.zgs.co.com${client.photo}`}
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
                  <td>{client.client_id}</td>
                  <td className="flex items-center gap-2">
                    <IoIosCall className="text-green-500" />
                    {client.contact}
                  </td>

                  <td>
                    <div className="flex items-center gap-2">
                      <MdOutlineMail className="text-red-500" />
                      {client.email}
                    </div>
                  </td>

                  <td>{client.company_name}</td>
                  <td>{client.country}</td>
                  <td className="text-center">
                    {client.user_id.is_active ? "Active" : "Inactive"}
                  </td>
                  <td>
                    <div className="flex justify-center space-x-2 ">
                      <button
                        style={{ backgroundColor: "#EFEFEF", padding: "2px" }}
                      >
                        <AiOutlineEye />
                      </button>

                      <button
                        style={{
                          backgroundColor: "#EFE5FF",
                          padding: "2px",
                          borderRadius: "5px",
                          color: "#5800FF",
                        }}
                        onClick={() => handleClientProfile(client.client_id)}
                      >
                        <AiOutlineEdit />
                      </button>
                      <button
                        style={{
                          backgroundColor: "#FEF9C2",
                          padding: "2px",
                          borderRadius: "5px",
                          color: "#B9AB12",
                        }}
                      >
                        <GrNotes />
                      </button>
                      <button
                        style={{
                          backgroundColor: "#FFC6B8",
                          padding: "2px",
                          borderRadius: "5px",
                          color: "#FF4242",
                        }}
                        onClick={() =>
                          openDeleteModal("single", client.client_id)
                        }
                      >
                        <RiDeleteBin6Line />
                      </button>
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
                className="bg-blue-600 text-black p-2 rounded-lg gap-3 "
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-black p-2 rounded-lg gap-3 ml-2"
                onClick={handleDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
