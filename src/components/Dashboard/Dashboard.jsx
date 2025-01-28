import React, { useState, useEffect } from "react";
import { LuCirclePlus } from "react-icons/lu";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEdit } from "react-icons/ai";
import { TbNotes } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CgNotes } from "react-icons/cg";
import { IoMdRefresh } from "react-icons/io";
import { BsDownload } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";

const Dashboard = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch client data from API
  const fetchClients = () => {
    fetch("https://admin.zgs.co.com/client/", {
      headers: {
        Authorization: "Token 4bc2a75c04006d4e540a8b38f86612dc0b1da466",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setClients(data.data); // Update the client list
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

  // Fetch clients on load or when "reload" signal is passed from AddNewClient
  useEffect(() => {
    const shouldReload = location.state?.reload;
    if (shouldReload) {
      fetchClients(); // Reload data
      navigate(location.pathname, { replace: true, state: {} }); // Clear reload signal
    } else {
      fetchClients();
    }
  }, [location.state]);

  // Navigate to AddNewClient page
  const handleOpenModal = () => {
    navigate("/addnewclient");
  };
  const handleClientProfile = (Id) => {
    navigate(`/client-profile/${Id}`)
  }

  return (
    <div>
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-semibold mt-6 ml-28">Clients Information</h1>
      </div>

      {/* Toolbar Section */}
      <div className="bg-gray-800 text-white p-4 rounded-lg flex items-center ml-28 mr-28 mt-4 h-16">
        <p>Clients Details</p>
        <input
          type="text"
          placeholder="Search..."
          className="flex-grow px-4 py-2 border border-gray-700 rounded-3xl h-8 ml-4 mr-96"
        />

        <div className="ml-96">
          <button className="text-xl text-white px-4 py-2 rounded-lg mr-2" onClick={handleOpenModal}>
            <LuCirclePlus />
          </button>
          <button className="text-xl text-white px-4 py-2 rounded-lg mr-2">
            <CgNotes />
          </button>
          <button className="text-xl text-white px-4 py-2 rounded-lg">
            <IoMdRefresh />
          </button>
        </div>
        <button className="text-xl text-white px-4 py-2 rounded-lg">
          <BsDownload />
        </button>
      </div>

      {/* Content Section */}
      {isLoading ? (
        <p className="text-center mt-8">Loading...</p>
      ) : clients.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md mt-6 mx-28">
  <table className="table-auto w-full border-collapse">
    <thead className="bg-gray-800 text-white">
      <tr>
        <th className="text-left px-4 py-2">Client Name</th>
        <th className="text-left px-4 py-2">Client ID</th>
        <th className="text-left px-4 py-2">Mobile</th>
        <th className="text-left px-4 py-2">Email</th>
        <th className="text-left px-4 py-2">Company Name</th>
        <th className="text-left px-4 py-2">Country</th>
        <th className="text-center px-4 py-2">Status</th>
        <th className="text-center px-4 py-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {clients.map((client, index) => (
        <tr
          key={index}
          className={`border-b ${
            index % 2 === 0 ? "bg-gray-100" : "bg-white"
          }`}
        >
          <td className="text-left px-4 py-2">{client.name || "N/A"}</td>
          <td className="text-left px-4 py-2">{client.client_id || "N/A"}</td>
          <td className="text-left px-4 py-2">{client.contact || "N/A"}</td>
          <td className="text-left px-4 py-2">{client.email || "N/A"}</td>
          <td className="text-left px-4 py-2">{client.company_name || "N/A"}</td>
          <td className="text-left px-4 py-2">{client.country || "N/A"}</td>
          <td className="text-center px-4 py-2">
            <span
              className={`px-2 py-1 rounded-full text-sm ${
                client.user_id.is_active
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {client.user_id.is_active ? "Active" : "Inactive"}
            </span>
          </td>
          <td className="text-center px-4 py-2">
            <div className="flex justify-center space-x-2">
              <button className="p-2 bg-gray-50 text-black rounded-lg">
                <AiOutlineEye />
              </button>
              <button className="p-2 bg-purple-100 text-black rounded-lg" onClick={() =>handleClientProfile(client.client_id)}>
                <AiOutlineEdit />
              </button>
              <button className="p-2 bg-yellow-100 text-black rounded-lg">
                <TbNotes />
              </button>
              <button className="p-2 bg-red-200 text-black rounded-lg">
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
        <p className="text-center mt-8 text-gray-600">No clients available.</p>
      )}
    </div>
  );
};

export default Dashboard;
