import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineEdit } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { PiUserListLight } from "react-icons/pi";
import { CgNotes } from "react-icons/cg";
import { IoMdRefresh } from "react-icons/io";
import { BsDownload } from "react-icons/bs";
import useToken from "../hooks/useToken";
import { useNavigate } from "react-router-dom";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const navigate = useNavigate();

  // Fetch and filter logic remains unchanged
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
       billingCompanyAddress: invoice.billing_company_name,
        companyName: invoice.company_name,
        amount: invoice.total_amount,
        date: invoice.date.split("T")[0],
        paymentStatus: invoice.payment_status,
        paymentMethod: "N/A",
      }));
      setInvoices(invoiceData);
      setFilteredInvoices(invoiceData);
    } catch (error) {
      setError("Failed to fetch invoices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    let filtered = invoices;
    if (searchQuery) {
      filtered = filtered.filter((invoice) =>
        [invoice.clientName, invoice.companyName, invoice.invoiceId, invoice.billing_company_address].some(
          (field) => field.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    if (startDate)
      filtered = filtered.filter((invoice) => invoice.date >= startDate);
    if (endDate)
      filtered = filtered.filter((invoice) => invoice.date <= endDate);
    setFilteredInvoices(filtered);
  }, [searchQuery, startDate, endDate, invoices]);

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
      const response = await fetch(
        `${url}/service/invoice/?invoice_id=${selectedInvoiceId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Token ${token}` },
        }
      );
      if (response.ok) {
        setInvoices(
          invoices.filter((invoice) => invoice.id !== selectedInvoiceId)
        );
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const handleDashboard = () => navigate("/dashboard");
  const handleCreateInvoice = () => navigate("/create-invoice");
  const handleEditInvoice = (id) => navigate(`/edit-invoice/${id}`);

  if (loading) return <div className="p-4">Loading invoices...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  const getSummaryData = () => {
    const totalAmount = invoices.reduce(
      (acc, invoice) => acc + Number(invoice.amount),
      0
    );
    const paidAmount = invoices
      .filter((invoice) => invoice.paymentStatus === "Paid")
      .reduce((acc, invoice) => acc + Number(invoice.amount), 0);
    const unpaidAmount = invoices
      .filter((invoice) => invoice.paymentStatus === "Unpaid")
      .reduce((acc, invoice) => acc + Number(invoice.amount), 0);
    const cancelledAmount = invoices
      .filter((invoice) => invoice.paymentStatus === "Cancelled")
      .reduce((acc, invoice) => acc + Number(invoice.amount), 0);

    return {
      totalAmount,
      paidAmount,
      unpaidAmount,
      cancelledAmount,
      totalInvoices: invoices.length,
      paidInvoices: invoices.filter(
        (invoice) => invoice.paymentStatus === "Paid"
      ).length,
      unpaidInvoices: invoices.filter(
        (invoice) => invoice.paymentStatus === "Unpaid"
      ).length,
      cancelledInvoices: invoices.filter(
        (invoice) => invoice.paymentStatus === "Cancelled"
      ).length,
    };
  };

  const {
    totalAmount,
    paidAmount,
    unpaidAmount,
    cancelledAmount,
    totalInvoices,
    paidInvoices,
    unpaidInvoices,
    cancelledInvoices,
  } = getSummaryData();

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6">
        Invoice Details
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            title: "INVOICE SENT",
            amount: totalAmount,
            count: totalInvoices,
            color: "text-blue-600",
          },
          {
            title: "PAID INVOICE",
            amount: paidAmount,
            count: paidInvoices,
            color: "text-blue-600",
          },
          {
            title: "UNPAID INVOICE",
            amount: unpaidAmount,
            count: unpaidInvoices,
            color: "text-red-600",
          },
          {
            title: "CANCELLED INVOICES",
            amount: cancelledAmount,
            count: cancelledInvoices,
            color: "text-blue-600",
          },
        ].map((item, index) => (
          <div key={index} className="bg-white shadow p-4 rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold">
              ${item.amount.toLocaleString()}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">{item.title}</p>
            <div className={`text-xs sm:text-sm font-semibold ${item.color}`}>
              {item.count}{" "}
              {item.title.toLowerCase().includes("cancelled")
                ? "Cancelled by clients"
                : item.title.toLowerCase().includes("unpaid")
                ? "Unpaid by clients"
                : "Invoice sent"}
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-gray-800 text-white p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
        <p className="text-sm sm:text-base">Invoice List</p>

        <div className="w-full max-w-96 sm:min-w-64">
          {" "}
          {/* Responsive width */}
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-black px-3 py-1 sm:px-4 sm:py-2 border border-gray-700 rounded-3xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
        
          className="w-1/4 sm:flex-grow text-black px-4 py-2 border border-gray-700 rounded-3xl h-8 sm:ml-4"
        /> */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full sm:w-auto rounded-md p-1 text-black"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full sm:w-auto rounded-md p-1 text-black"
          />
        </div>
        <div className="flex gap-4 sm:ml-auto">
          <button
            className="text-lg sm:text-xl text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg relative group"
            onClick={handleCreateInvoice}
          >
            <CgNotes className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-blue-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              Create Invoice
            </span>
          </button>
          <button
            className="text-lg sm:text-xl text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg relative group"
            onClick={handleDashboard}
          >
            <PiUserListLight className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-blue-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              Dashboard
            </span> 
          </button>
          <button
            className="text-lg sm:text-xl text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg relative group"
            onClick={handleDashboard}
          >
            <IoMdRefresh className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-blue-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              Refresh
            </span>
          </button>
          <button
            className="text-lg sm:text-xl text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg relative group"
            onClick={handleDashboard}
          >
            <BsDownload className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-blue-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              Download
            </span>
          </button>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Invoice ID",
                "Client ID",
                "Client Name",
                "Company Name",
                "Billing Address",
                "Amount (BDT)",
                "Date",
                "Payment Method",
                "Payment Status",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-700 uppercase"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm">
                  {invoice.invoiceId}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm">
                  {invoice.clientId}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm">
                  {invoice.clientName}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm">
                  {invoice.companyName}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm">
                  {invoice.billingCompanyAddress}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm">
                  {invoice.amount} BDT
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm">
                  {invoice.date}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm">
                  {invoice.paymentMethod}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm">
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      invoice.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {invoice.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 flex gap-2 sm:gap-3">
                  <button onClick={() => handleEditInvoice(invoice.id)}>
                    <AiOutlineEdit className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                  </button>
                  <button onClick={() => openDeleteModal(invoice.id)}>
                    <RiDeleteBin6Line className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              Confirm Deletion
            </h2>
            <p className="text-sm sm:text-base">
              Are you sure you want to delete this invoice?
            </p>
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-300 rounded-md text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteInvoice}
                className="px-4 py-2 bg-red-500 text-white rounded-md text-sm sm:text-base"
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
