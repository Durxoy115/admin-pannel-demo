import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useToken from "../hooks/useToken";

const InvoiceListToPayment = () => {
  const navigate = useNavigate();
  const { invoice_id } = useParams(); // Extract client_invoice_id from URL
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  const [formData, setFormData] = useState({
    invoice_id: invoice_id || "", // Initialize with URL param
    client_id: "",
    client_name: "",
    client_bank_name: "",
    client_account_no: "",
    date: "",
    contact: "",
    receiver_name: "",
    receiver_bank_name: "",
    receiver_branch: "",
    receiver_account_name: "",
    receiver_account_no: "",
    trans_id: "",
    trans_type: "",
    paid_amount: 0.0,
    due_amount: 0.0,
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchInvoiceDetails = async () => {
    if (!formData.invoice_id) {
      setError("Please provide an Invoice ID");
      return;
    }

    try {
      const response = await fetch(
        `${url}/service/invoice/?invoice_id=${formData.invoice_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("API Response:", data); // Debug log to show data

      if (response.ok) {
        // Handle both single object and array responses
        const invoiceData = data.data;

        if (invoiceData && Object.keys(invoiceData).length > 0) {
          setFormData((prev) => ({
            ...prev,
            invoice_id: invoiceData.client_invoice_id || prev.invoice_id,
            client_id: invoiceData?.client_id || prev.client_id,
            client_name: invoiceData?.client_name || prev.client_name,
            client_bank_name: invoiceData?.gateway || prev.client_bank_name,
            client_account_no: invoiceData?.account_number || prev.client_account_no,
            date: invoiceData.date ? invoiceData.date.split("T")[0] : prev.date,
            contact: invoiceData?.client_phone || prev.contact,
            paid_amount: parseFloat(invoiceData?.paid_amount) || prev.paid_amount,
            due_amount: parseFloat(invoiceData?.due_amount) || prev.due_amount,
          }));
        } else {
          setError("No invoice found for the provided ID");
        }
      } else {
        setError(data.message || "Failed to fetch invoice details");
      }
    } catch (err) {
      setError("An error occurred while fetching invoice details");
    }
  };

  // Automatically fetch invoice details when component mounts
  useEffect(() => {
    if (invoice_id) {
      setFormData((prev) => ({ ...prev, invoice_id })); // Update formData with URL param
      fetchInvoiceDetails();
    }
  }, [invoice_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFetchInvoice = () => {
    fetchInvoiceDetails();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        invoice_id: formData.invoice_id,
        client_id: formData.client_id,
        client_name: formData.client_name || "",
        client_bank_name: formData.client_bank_name || "",
        client_account_no: formData.client_account_no,
        date: formData.date || "",
        contact: formData.contact || "",
        receiver_name: formData.receiver_name,
        receiver_bank_name: formData.receiver_bank_name,
        receiver_branch: formData.receiver_branch,
        receiver_account_name: formData.receiver_account_name,
        receiver_account_no: formData.receiver_account_no,
        trans_id: formData.trans_id,
        trans_type: formData.trans_type || "",
        paid_amount: parseFloat(formData.paid_amount) || 0.0,
        due_amount: parseFloat(formData.due_amount) || 0.0,
      };

      const response = await fetch(`${url}/service/payment/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(data.message);
      } else {
        throw new Error(data.message || "Failed to add payment details");
      }
    } catch (err) {
      setError(err.message || "An error occurred while adding payment details");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col md:px-20">
      <div className="flex md:justify-start px-2 mb-2 md:px-8">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mt-16 md:mt-24">
          Add Payment Details
        </h1>
      </div>
      <div className="flex-1 flex items-center justify-center px-1 sm:px-6 lg:px-8">
        <div className="bg-white p-1 md:p-8 sm:p-1 rounded-lg shadow-lg w-full">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium text-gray-700 mb-4">
                  Client Details
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      label: "Invoice ID",
                      name: "invoice_id",
                      type: "text",
                      required: true,
                    },
                    { label: "Client Name", name: "client_name", type: "text", required: false },
                    { label: "Client ID", name: "client_id", type: "text", required: true },
                    { label: "Transaction ID", name: "trans_id", type: "text", required: true },
                    { label: "Transaction Type", name: "trans_type", type: "text", required: false },
                    { label: "Bank Name", name: "client_bank_name", type: "text", required: false },
                    { label: "Account Number", name: "client_account_no", type: "text", required: true },
                    { label: "Date", name: "date", type: "date", required: true },
                    { label: "Contact", name: "contact", type: "text", required: false },
                    { label: "Paid Amount", name: "paid_amount", type: "number", required: false },
                    { label: "Due Amount", name: "due_amount", type: "number", required: false },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-600">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={field.required}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleFetchInvoice}
                    className="mt-4 px-4 py-2 bg-blue-200 text-blue-700 rounded-md hover:bg-blue-300"
                  >
                    Fetch Invoice
                  </button>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-700 mb-4">
                  Receiver Details
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "Receivers Name", name: "receiver_name", type: "text" },
                    { label: "Bank Name", name: "receiver_bank_name", type: "text" },
                    { label: "Branch", name: "receiver_branch", type: "text" },
                    { label: "Account Name", name: "receiver_account_name", type: "text" },
                    { label: "Account Number", name: "receiver_account_no", type: "text" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-600">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {successMessage && (
              <p className="text-green-500 text-center mt-4">{successMessage}</p>
            )}
            {error && (
              <p className="text-red-500 text-center mt-4">{error}</p>
            )}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-green-200 text-green-700 rounded-md hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 mb-6"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvoiceListToPayment;