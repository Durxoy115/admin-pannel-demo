import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import Footer from "../Footer/Footer";

const PaymentAdd = () => {
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  const [formData, setFormData] = useState({
    invoice_id: "",
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
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${url}/service/payment/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
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
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-center md:justify-start items-center mb-6 px-4 md:px-16 lg:px-64">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mt-6">
          Add Payment Details
        </h1>
      </div>

      {/* Form Container */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-3/4">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Details */}
              <div>
                <h2 className="text-lg font-medium text-gray-700 mb-4">
                  Client Details
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "Client Name", name: "client_name", type: "text" },
                    { label: "Client ID", name: "client_id", type: "text" },
                    { label: "Invoice ID", name: "invoice_id", type: "text" },
                    { label: "Transaction ID", name: "trans_id", type: "text" },
                    { label: "Transaction Type", name: "trans_type", type: "text" },
                    { label: "Bank Name", name: "client_bank_name", type: "text" },
                    { label: "Account Number", name: "client_account_no", type: "text" },
                    { label: "Date", name: "date", type: "date" },
                    { label: "Contact", name: "contact", type: "text" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-600">
                        {field.label} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Receiver Details */}
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
                        {field.label} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Success/Error Messages */}
            {successMessage && (
              <p className="text-green-500 text-center mt-4">{successMessage}</p>
            )}
            {error && (
              <p className="text-red-500 text-center mt-4">{error}</p>
            )}

            {/* Save Button */}
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

export default PaymentAdd;