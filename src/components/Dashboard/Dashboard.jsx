import React, { useState, useEffect } from "react";
import { LuCirclePlus } from "react-icons/lu";
import { CgNotes } from "react-icons/cg";
import { IoMdRefresh } from "react-icons/io";
import { BsDownload } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";

const Dashboard = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchClients = () => {
    fetch("https://admin.zgs.co.com/client/", {
      headers: {
        Authorization: "Token 4bc2a75c04006d4e540a8b38f86612dc0b1da466",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setClients(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchClients();
  }, [location.state?.reload]);

  const handleOpenModal = () => {
    navigate("/addnewclient");
  };

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
                <th className="px-4 py-2">Client Name</th>
                <th className="px-4 py-2">Client ID</th>
                <th className="px-4 py-2">Mobile</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Company Name</th>
                <th className="px-4 py-2">Currency</th>
                <th className="px-4 py-2">Country</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
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
                  <td className="px-4 py-2">{client.clientName}</td>
                  <td className="px-4 py-2">{client.clientId}</td>
                  <td className="px-4 py-2">{client.clientMobile}</td>
                  <td className="px-4 py-2">{client.clientEmail}</td>
                  <td className="px-4 py-2">{client.companyName}</td>
                  <td className="px-4 py-2">{client.currency}</td>
                  <td className="px-4 py-2">{client.country}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        client.status === "Active"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <button className="px-2 py-1 bg-blue-500 text-white rounded-lg">
                        View
                      </button>
                      <button className="px-2 py-1 bg-yellow-500 text-white rounded-lg">
                        Edit
                      </button>
                      <button className="px-2 py-1 bg-red-500 text-white rounded-lg">
                        Delete
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
