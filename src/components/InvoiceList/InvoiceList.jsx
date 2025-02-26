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
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage()
  const navigate = useNavigate()

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(
        `${url}/service/invoice/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      const invoiceData = response.data.data.map((invoice) => ({
        invoiceId: invoice.client_invoice_id,
        clientId: invoice.client_id,
        clientName: invoice.client_name,
        companyName: invoice.company_name,
        amount: invoice.total_amount,
        date: invoice.date.split("T")[0],
        paymentStatus: invoice.payment_status,
        paymentMethod: "N/A", // Not provided in the API response
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

  const handleEdit = (invoiceId) => {
    alert(`Edit Invoice: ${invoiceId}`);
    // Implement navigation to an edit page or modal here
  };

  const handleDelete = (invoiceId) => {
    if (window.confirm(`Are you sure you want to delete Invoice ${invoiceId}?`)) {
      setInvoices((prev) =>
        prev.filter((invoice) => invoice.invoiceId !== invoiceId)
      );
    }
  };

  const handleDashboard = () => {
    navigate("/dashboard")
  }
  const handleCreateInvoice = () => {
    navigate("/create-invoice")
  }

  if (loading) return <div className="p-8">Loading invoices...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8 w-full">
      <h1 className="text-3xl font-semibold mb-6">Invoice Details</h1>
      <div>
         {/* Toolbar Section */}
              <div className="bg-gray-800 text-white p-4 rounded-lg flex items-center  mt-4 h-12">
                <p>Invoice List</p>
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-grow text-black px-4 py-2 border border-gray-700 rounded-3xl h-8 ml-4 mr-96"
                />
               <div className="rounded-lg ml-20">
               <input
                  type="text"
                  placeholder="Start date"
                  className=" gap-2 mr-1 rounded-md p-1"
                />
                 <input
                  type="text"
                  placeholder="End Date"
                  className="rounded-md p-1"
                />
               </div>
        
                <div className="ml-96">
                 
                  <button className="text-xl text-white px-4 py-2 rounded-lg mr-2"
                  onClick={handleCreateInvoice} >
                    <CgNotes  />
                  </button>
                  <button className="text-xl text-white px-4 py-2 rounded-lg mr-2"
                  onClick={handleDashboard} >
                    <PiUserListLight  />
                  </button>
                  <button className="text-xl text-white px-4 py-2 rounded-lg">
                    <IoMdRefresh />
                  </button>
                </div>
                <button className="text-xl text-white px-4 py-2 rounded-lg">
                  <BsDownload />
                </button>
              </div>
      </div>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["Invoice ID", "Client ID", "Client Name", "Company Name", "Amount (BDT)", "Date", "Payment Method", "Payment Status", "Actions"].map(
                (heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
                  >
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.invoiceId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{invoice.invoiceId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.clientId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.clientName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.companyName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.amount} BDT</td>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.paymentMethod}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      invoice.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {invoice.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-3">
                  <button
                    onClick={() => handleEdit(invoice.invoiceId)}
                    className="text-blue-500 hover:text-blue-700 transition"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(invoice.invoiceId)}
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
                <td
                  colSpan="9"
                  className="px-6 py-4 text-center text-gray-500 italic"
                >
                  No invoices available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceList;
