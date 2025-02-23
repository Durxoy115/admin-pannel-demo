import React, { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([
    {
      invoiceId: "INV-001",
      clientId: "CL-101",
      clientName: "John Doe",
      companyName: "Doe Enterprises",
      amount: 5000,
      date: "2025-02-15",
      paymentMethod: "Credit Card",
      paymentStatus: "Paid",
    },
    {
      invoiceId: "INV-002",
      clientId: "CL-102",
      clientName: "Jane Smith",
      companyName: "Smith Solutions",
      amount: 7500,
      date: "2025-02-16",
      paymentMethod: "Bank Transfer",
      paymentStatus: "Pending",
    },
    {
      invoiceId: "INV-003",
      clientId: "CL-103",
      clientName: "Michael Johnson",
      companyName: "Johnson Tech",
      amount: 6200,
      date: "2025-02-17",
      paymentMethod: "PayPal",
      paymentStatus: "Paid",
    },
  ]);

  const handleEdit = (invoiceId) => {
    alert(`Edit Invoice: ${invoiceId}`);
    // Here you can add navigation to an edit page or open a modal
  };

  const handleDelete = (invoiceId) => {
    if (window.confirm(`Are you sure you want to delete Invoice ${invoiceId}?`)) {
      setInvoices((prev) => prev.filter((invoice) => invoice.invoiceId !== invoiceId));
    }
  };

  return (
    <div className="p-8 w-full">
      <h1 className="text-3xl font-semibold mb-6">Invoice List</h1>
      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Invoice ID",
                "Client ID",
                "Client Name",
                "Company Name",
                "Amount (BDT)",
                "Date",
                "Payment Method",
                "Payment Status",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
                >
                  {heading}
                </th>
              ))}
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
