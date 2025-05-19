import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";

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
    paid_amount: 0.0, // Previously Paid (sum of previous_payment amounts)
    current_paid: 0.0, // Current Paid
    due_amount: 0.0,
    total_amount: 0.0,
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [previousPayments, setPreviousPayments] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0.0);

  const fetchInvoiceDetails = async () => {
    if (!formData.invoice_id) return;

    try {
      const response = await fetch(
        `${url}/service/payment-invoice/?invoice_id=${formData.invoice_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        const invoiceData = data?.data;

        if (invoiceData && Object.keys(invoiceData).length > 0) {
          const previousPaymentList = invoiceData?.previous_payment || [];
          const totalPreviousPaid = previousPaymentList.reduce(
            (sum, payment) => sum + parseFloat(payment?.amount || 0),
            0
          );

          setPreviousPayments(previousPaymentList);
          setTotalPaid(totalPreviousPaid);

          setFormData((prev) => ({
            ...prev,
            client_id: invoiceData?.client_id || prev.client_id,
            client_name: invoiceData?.client_name || prev.client_name,
            client_bank_name: invoiceData?.receiver?.client_bank_name || prev.client_bank_name,
            client_account_no: invoiceData?.receiver?.client_account_no || prev.client_account_no,
            date: invoiceData.date ? invoiceData.date.split("T")[0] : prev.date,
            contact: invoiceData?.client_phone || prev.contact,
            paid_amount: totalPreviousPaid, // Set Previously Paid
            due_amount: parseFloat(invoiceData?.due_amount) || prev.due_amount,
            total_amount: parseFloat(invoiceData?.total_amount) || prev.total_amount,
            // Receiver details
            receiver_bank_name: invoiceData?.receiver?.bank_name || prev.receiver_bank_name,
            receiver_branch: invoiceData?.receiver?.branch_name || prev.receiver_branch,
            receiver_account_name: invoiceData?.receiver?.account_name || prev.receiver_account_name,
            receiver_account_no: invoiceData?.receiver?.account_number || prev.receiver_account_no,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInvoiceIdBlur = () => {
    if (formData?.invoice_id) {
      fetchInvoiceDetails();
    }
  };

  // Calculate due_amount when current_paid or totalPaid changes
  useEffect(() => {
    const totalPaidWithCurrent = parseFloat(totalPaid) + parseFloat(formData.current_paid || 0);
    const newDueAmount = parseFloat(formData.total_amount || 0) - totalPaidWithCurrent;

    setFormData((prev) => ({
      ...prev,
      due_amount: newDueAmount >= 0 ? newDueAmount.toFixed(2) : 0.0,
    }));
  }, [formData.current_paid, formData.total_amount, totalPaid]);

  const handleSubmit = async (e, action) => {
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
        paid_amount: parseFloat(formData.current_paid) || 0.0, // Send current_paid as paid_amount
        due_amount: parseFloat(formData.due_amount) || 0.0,
        total_amount: parseFloat(formData.total_amount) || 0.0,
      };

      if (action === "save" || action === "sent" ) {
        let req_url = `${url}/service/payment/`;
        if (action === "sent") {
          req_url += "?sent=true";
        }
        const response = await fetch(req_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: payload,
        });
        const data = await response.json();

        if (response.ok && data.success) {
          setSuccessMessage(data.message);
        } else {
          throw new Error(data.message || "Failed to add payment details");
        }
      } else if (action === "preview") {
        const response = await fetch(`${url}/service/payment-pdf/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to generate preview.");
        } else {
          const blob = await response.blob();
          const fileURL = window.URL.createObjectURL(blob);
          window.open(fileURL, "_blank");
        }
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
          <form onSubmit={(e) => handleSubmit(e, "save")}>
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
                      onBlur: handleInvoiceIdBlur,
                    },
                    { label: "Client Name", name: "client_name", type: "text", required: false },
                    { label: "Client ID", name: "client_id", type: "text", required: true },
                    { label: "Transaction ID", name: "trans_id", type: "text", required: false },
                    { label: "Transaction Type", name: "trans_type", type: "text", required: false },
                    { label: "Bank Name", name: "client_bank_name", type: "text", required: false },
                    { label: "Account Number", name: "client_account_no", type: "text", required: false },
                    { label: "Date", name: "date", type: "date", required: true },
                    { label: "Contact", name: "contact", type: "text", required: false },
                    { label: "Previously Total Paid", name: "paid_amount", type: "number", required: false, readOnly: true },
                    { label: "Current Paid", name: "current_paid", type: "number", required: false },
                    { label: "Due Amount", name: "due_amount", type: "number", required: false, readOnly: true },
                    { label: "Total Amount", name: "total_amount", type: "number", required: false, readOnly: true },
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
                        onBlur={field.onBlur}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={field.required}
                        readOnly={field.readOnly}
                      />
                    </div>
                  ))}
                </div>
                {/* Previously Paid Table */}
                <div className="mt-6">
                  <h3 className="text-md font-medium text-gray-700 mb-2">Previously Paid</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Date</label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Amount</label>
                    </div>
                    {previousPayments.map((payment, index) => (
                      <React.Fragment key={index}>
                        <div>
                          <input
                            type="text"
                            value={payment.date ? payment.date.split("T")[0] : ""}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                            readOnly
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            value={payment.amount}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                            readOnly
                          />
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-600">Total Paid</label>
                    <input
                      type="number"
                      value={(parseFloat(totalPaid) + parseFloat(formData.current_paid || 0)).toFixed(2)}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                      readOnly
                    />
                  </div>
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
              <button
                onClick={(e) => handleSubmit(e, "sent")}
                className="px-6 py-2 bg-red-200 text-black rounded-md hover:bg-green-theory
focus:outline-none focus:ring-2 focus:ring-green-500 mb-6 ml-3"
              >
               Sent
              </button>
              <button
                onClick={(e) => handleSubmit(e, "preview")}
                className="px-6 py-2 bg-blue-200 text-black rounded-md hover:bg-green-theory
focus:outline-none focus:ring-2 focus:ring-green-500 mb-6 ml-3"
              >
                Preview
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentAdd;