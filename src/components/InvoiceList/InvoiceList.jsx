import React, { useEffect, useState } from "react";
import axios from "axios";
import {  AiOutlineEdit } from "react-icons/ai";
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
        [invoice.clientName, invoice.companyName, invoice.invoiceId].some((field) =>
          field.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (startDate) filtered = filtered.filter((invoice) => invoice.date >= startDate);
    if (endDate) filtered = filtered.filter((invoice) => invoice.date <= endDate);

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
      const response = await fetch(`${url}/service/invoice/?invoice_id=${selectedInvoiceId}`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });
  
      if (response.ok) {
        setInvoices(invoices.filter((invoice) => invoice.id !== selectedInvoiceId));
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

  const getSummaryData = () => {
    const totalAmount = invoices.reduce((acc, invoice) => acc + Number(invoice.amount), 0);
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
      paidInvoices: invoices.filter((invoice) => invoice.paymentStatus === "Paid").length,
      unpaidInvoices: invoices.filter((invoice) => invoice.paymentStatus === "Unpaid").length,
      cancelledInvoices: invoices.filter((invoice) => invoice.paymentStatus === "Cancelled").length,
    };
  };

  const { 
    totalAmount, paidAmount, unpaidAmount, cancelledAmount,
    totalInvoices, paidInvoices, unpaidInvoices, cancelledInvoices
  } = getSummaryData();

  return (
    <div className="p-8 w-full">
      <h1 className="text-3xl font-semibold mb-6">Invoice Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow p-4 rounded-lg">
          <h2 className="text-xl font-semibold">${totalAmount.toLocaleString()}</h2>
          <p className="text-sm text-gray-600">INVOICE SENT</p>
          <div className="text-blue-600 font-semibold">{totalInvoices} Invoice sent</div>
        </div>

        <div className="bg-white shadow p-4 rounded-lg">
          <h2 className="text-xl font-semibold">${paidAmount.toLocaleString()}</h2>
          <p className="text-sm text-gray-600">PAID INVOICE</p>
          <div className="text-blue-600 font-semibold">{paidInvoices} Paid by clients</div>
        </div>

        <div className="bg-white shadow p-4 rounded-lg">
          <h2 className="text-xl font-semibold">${unpaidAmount.toLocaleString()}</h2>
          <p className="text-sm text-gray-600">UNPAID INVOICE</p>
          <div className="text-red-600 font-semibold">{unpaidInvoices} Unpaid by clients</div>
        </div>

        <div className="bg-white shadow p-4 rounded-lg">
          <h2 className="text-xl font-semibold">${cancelledAmount.toLocaleString()}</h2>
          <p className="text-sm text-gray-600">CANCELLED INVOICES</p>
          <div className="text-blue-600 font-semibold">{cancelledInvoices} Cancelled by clients</div>
        </div>
      </div>
      {/* Toolbar */}
      <div className="bg-gray-800 text-white p-4 rounded-lg flex items-center mt-4 h-12">
        <p>Invoice List</p>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow text-black px-4 py-2 border border-gray-700 rounded-3xl h-8 ml-4 mr-96"
        />
        <div className="rounded-lg ml-20">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mr-1 rounded-md p-1 text-black" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-md p-1 text-black" />
        </div>
        <div className="ml-96 flex gap-6">
          <button className="text-xl" onClick={handleCreateInvoice}><CgNotes /></button>
          <button className="text-xl" onClick={handleDashboard}><PiUserListLight /></button>
          <button className="text-xl" onClick={fetchInvoices}><IoMdRefresh /></button>
        </div>
        <button className="text-xl ml-4"><BsDownload /></button>
      </div>

      {/* Invoice Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["Invoice ID", "Client ID", "Client Name", "Company Name", "Amount (BDT)", "Date", "Payment Method", "Payment Status", "Actions"]
                .map((heading) => (
                  <th key={heading} className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">
                    {heading}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{invoice.invoiceId}</td>
                <td className="px-6 py-4">{invoice.clientId}</td>
                <td className="px-6 py-4">{invoice.clientName}</td>
                <td className="px-6 py-4">{invoice.companyName}</td>
                <td className="px-6 py-4">{invoice.amount} BDT</td>
                <td className="px-6 py-4">{invoice.date}</td>
                <td className="px-6 py-4">{invoice.paymentMethod}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    invoice.paymentStatus === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {invoice.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-3">
                  <button onClick={() => handleEditInvoice(invoice.id)}><AiOutlineEdit className="h-5 w-5 text-blue-500" /></button>
                  <button onClick={() => openDeleteModal(invoice.id)}><RiDeleteBin6Line className="h-5 w-5 text-red-500" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this invoice?</p>
            <div className="mt-6 flex justify-end gap-4">
              <button onClick={closeDeleteModal} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
              <button onClick={handleDeleteInvoice} className="px-4 py-2 bg-red-500 text-white rounded-md">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
