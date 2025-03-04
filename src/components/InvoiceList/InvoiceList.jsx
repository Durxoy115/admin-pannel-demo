import React, { useEffect, useState } from "react";
import axios from "axios";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { PiUserListLight } from "react-icons/pi";
import { CgNotes } from "react-icons/cg";
import { IoMdRefresh } from "react-icons/io";
import { BsDownload } from "react-icons/bs";
import useToken from "../hooks/useToken";
import { useNavigate } from "react-router-dom";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const navigate = useNavigate();

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`${url}/service/invoice/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const invoiceData = response.data.data.map((invoice) => ({
        id: invoice.id,
        invoiceId: invoice.client_invoice_id,
        clientId: invoice.client_id,
        clientName: invoice.client_name,
        companyName: invoice.company_name,
        amount: invoice.total_amount,
        date: invoice.date.split("T")[0],
        paymentStatus: invoice.payment_status,
        paymentMethod: "N/A", // Placeholder since not in response
      }));
      setInvoices(invoiceData);
    } catch (err) {
      setError("Failed to fetch invoices.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const openDeleteModal = (id) => {
    setSelectedInvoiceId(id);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setSelectedInvoiceId(null);
  };

  const handleDeleteInvoice = async () => {
    if (!selectedInvoiceId) return;

    try {
      const response = await fetch(`${url}/service/invoice/?invoice_id=${selectedInvoiceId}`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });

      if (response.ok) {
        setInvoices(invoices.filter((invoice) => invoice.invoiceId !== selectedInvoiceId));
        setIsModalOpen(false);
      } else {
        console.error("Failed to delete invoice");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const handleDashboard = () => navigate("/dashboard");
  const handleCreateInvoice = () => navigate("/create-invoice");
  const handleEditInvoice = (id) => navigate(`/edit-invoice/${id}`);

  if (loading) return <div className="p-8">Loading invoices...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8 w-full">
      <h1 className="text-3xl font-semibold mb-6">Invoice Details</h1>

      {/* Toolbar Section */}
      <div className="bg-gray-800 text-white p-4 rounded-lg flex items-center mt-4 h-12">
        <p>Invoice List</p>
        <input
          type="text"
          placeholder="Search..."
          className="flex-grow text-black px-4 py-2 border border-gray-700 rounded-3xl h-8 ml-4 mr-96"
        />
        <div className="rounded-lg ml-20">
          <input type="text" placeholder="Start date" className="gap-2 mr-1 rounded-md p-1" />
          <input type="text" placeholder="End Date" className="rounded-md p-1" />
        </div>
        <div className="ml-96 flex gap-2">
          <button className="text-xl text-white" onClick={handleCreateInvoice}><CgNotes /></button>
          <button className="text-xl text-white" onClick={handleDashboard}><PiUserListLight /></button>
          <button className="text-xl text-white" onClick={fetchInvoices}><IoMdRefresh /></button>
        </div>
        <button className="text-xl text-white ml-4"><BsDownload /></button>
      </div>

      {/* Invoice Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Invoice ID", "Client ID", "Client Name", "Company Name",
                "Amount (BDT)", "Date", "Payment Method", "Payment Status", "Actions"
              ].map((heading) => (
                <th key={heading} className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{invoice.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.clientId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.clientName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.companyName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.amount} BDT</td>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.paymentMethod}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    invoice.paymentStatus === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {invoice.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-3">
                  <button
                    onClick={() => handleEditInvoice(invoice?.id)}
                    className="text-blue-500 hover:text-blue-700 transition"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(invoice.id)}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center text-gray-500 italic">No invoices available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this invoice?</p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-red-600 rounded-md"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                onClick={handleDeleteInvoice}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
