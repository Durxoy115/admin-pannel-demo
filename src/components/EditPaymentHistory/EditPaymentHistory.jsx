import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useToken from "../hooks/useToken";

const EditPaymentHistory = () => {
  const { id: paymentId } = useParams();
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
    current_paid: 0.0, // Current Paid (for this payment)
    due_amount: 0.0,
    total_amount: 0.0,
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previousPayments, setPreviousPayments] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0.0);

  // Fetch payment and invoice details
  const fetchPaymentDetails = async () => {
    if (!paymentId) {
      setError("No payment ID provided");
      console.error("No paymentId provided");
      return;
    }

    if (!token) {
      setError("No authentication token available");
      console.error("No token available");
      return;
    }

    setIsLoading(true);
    try {
      // Fetch payment details
      const paymentResponse = await fetch(
        `${url}/service/payment/?payment_id=${paymentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const paymentData = await paymentResponse.json();
      console.log("Payment API Response:", paymentData);

      if (!paymentResponse.ok || !paymentData.success) {
        throw new Error(paymentData.message || "Failed to fetch payment details");
      }

      const payment = paymentData.data;

      // Fetch invoice details to get previous payments
      const invoiceResponse = await fetch(
        `${url}/service/payment-invoice/?invoice_id=${payment.invoice_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const invoiceData = await invoiceResponse.json();
      console.log("Invoice API Response:", invoiceData);

      if (invoiceResponse.ok && invoiceData.data) {
        const invoice = invoiceData.data;
        const previousPaymentList = invoice.previous_payment || [];
        const totalPreviousPaid = previousPaymentList.reduce(
          (sum, payment) => sum + parseFloat(payment.amount || 0),
          0
        );

        setPreviousPayments(previousPaymentList);
        setTotalPaid(totalPreviousPaid);

        setFormData({
          invoice_id: payment.invoice_id || "",
          client_id: payment.client_id || "",
          client_name: payment.client_name || "",
          client_bank_name: invoice?.receiver?.bank_name || payment.client_bank_name || "",
          client_account_no: invoice?.receiver?.account_number || payment.client_account_no || "",
          date: payment.date ? payment.date.split("T")[0] : "",
          contact: payment.contact || invoice?.client_phone || "",
          receiver_name: payment.receiver_name || "",
          receiver_bank_name: invoice?.receiver?.bank_name || payment.receiver_bank_name || "",
          receiver_branch: invoice?.receiver?.branch_name || payment.receiver_branch || "",
          receiver_account_name: invoice?.receiver?.account_name || payment.receiver_account_name || "",
          receiver_account_no: invoice?.receiver?.account_number || payment.receiver_account_no || "",
          ...(formData.trans_id && { trans_id: formData.trans_id }),
          trans_type: payment.trans_type || "",
          paid_amount: totalPreviousPaid, // Sum of previous payments
          current_paid: parseFloat(payment.paid_amount) || 0.0, // Current payment amount
          due_amount: parseFloat(invoice?.due_amount) || 0.0,
          total_amount: parseFloat(invoice?.total_amount) || 0.0,
        });
      } else {
        throw new Error(invoiceData.message || "Failed to fetch invoice details");
      }
    } catch (err) {
      setError("An error occurred while fetching payment details");
      console.error("Fetch Error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentDetails();
  }, [paymentId]);

  // Calculate due_amount when current_paid or totalPaid changes
  useEffect(() => {
    const totalPaidWithCurrent = parseFloat(totalPaid) + parseFloat(formData.current_paid || 0);
    const newDueAmount = parseFloat(formData.total_amount || 0) - totalPaidWithCurrent;

    setFormData((prev) => ({
      ...prev,
      due_amount: newDueAmount >= 0 ? newDueAmount.toFixed(2) : 0.0,
    }));
  }, [formData.current_paid, formData.total_amount, totalPaid]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e, action = "save") => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const payload = {
        payment_id: paymentId,
        invoice_id: formData.invoice_id,
        client_id: formData.client_id,
        client_name: formData.client_name || "",
        client_bank_name: formData.client_bank_name || "",
        client_account_no: formData.client_account_no || "",
        date: formData.date || "",
        contact: formData.contact || "",
        receiver_name: formData.receiver_name || "",
        receiver_bank_name: formData.receiver_bank_name || "",
        receiver_branch: formData.receiver_branch || "",
        receiver_account_name: formData.receiver_account_name || "",
        receiver_account_no: formData.receiver_account_no || "",
        trans_id: formData.trans_id || "",
        trans_type: formData.trans_type || "",
        paid_amount: parseFloat(formData.current_paid) || 0.0, // Send current_paid as paid_amount
        due_amount: parseFloat(formData.due_amount) || 0.0,
        total_amount: parseFloat(formData.total_amount) || 0.0,
      };

      console.log("Submitting payload:", payload);
      console.log("Action:", action);

      if (action === "save") {
        const response = await fetch(
          `${url}/service/payment/?payment_id=${paymentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await response.json();
        console.log("Update API Response:", data);

        if (response.ok && data.success) {
          setSuccessMessage(data.message || "Payment updated successfully");
          setTimeout(() => navigate("/payment-history"), 1500);
        } else {
          throw new Error(data.message || "Failed to update payment details");
        }
      } else if (action === "sent") {
        const response = await fetch(
          `${url}/service/payment/?sent=true&payment_id=${paymentId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await response.json();
        console.log("Sent API Response:", data);

        if (response.ok && data.success) {
          setSuccessMessage(data.message || "Payment sent successfully");
          setTimeout(() => navigate("/payment-history"), 1500);
        } else {
          throw new Error(data.message || "Failed to send payment details");
        }
      } else if (action === "preview") {
        const response = await fetch(
          `${url}/service/payment-pdf/?payment_id=${paymentId}&update=true`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to generate PDF preview");
        }

        const blob = await response.blob();
        const pdfUrl = window.URL.createObjectURL(blob);
        window.open(pdfUrl, "_blank");
      }
    } catch (err) {
      setError(err.message || "An error occurred during the operation");
      console.error("Submit/Preview/Sent Error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/payment-history");
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col md:px-20">
      <div className="flex md:justify-start px-2 mb-2 md:px-8">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mt-16 md:mt-24">
          Edit Payment Details
        </h1>
      </div>
      <div className="flex-1 flex items-center justify-center px-1 sm:px-6 lg:px-8">
        <div className="bg-white p-1 md:p-8 sm:p-1 rounded-lg shadow-lg w-full">
          { (
            <form onSubmit={(e) => handleSubmit(e, "save")}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-700 mb-4">Client Details</h2>
                  <div className="space-y-4">
                    {[
                      {
                        label: "Invoice ID",
                        name: "invoice_id",
                        type: "text",
                        required: true,
                        readOnly: true,
                      },
                      { label: "Client Name", name: "client_name", type: "text", required: false },
                      { label: "Client ID", name: "client_id", type: "text", required: true },
                      { label: "Transaction ID", name: "trans_id", type: "text", required: false },
                      { label: "Transaction Type", name: "trans_type", type: "text", required: false },
                      { label: "Bank Name", name: "client_bank_name", type: "text", required: false },
                      { label: "Account Number", name: "client_account_no", type: "text", required: false },
                      { label: "Date", name: "date", type: "date", required: true },
                      { label: "Contact", name: "contact", type: "text", required: false },
                      { label: "Previously Paid", name: "paid_amount", type: "number", required: false, readOnly: true },
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
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required={field.required}
                          readOnly={field.readOnly}
                          disabled={field.readOnly}
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
                  <h2 className="text-lg font-medium text-gray-700 mb-4">Receiver Details</h2>
                  <div className="space-y-4">
                    {[
                      { label: "Receiver's Name", name: "receiver_name", type: "text" },
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
              {error && <p className="text-red-500 text-center mt-4">{error}</p>}
              <div className="flex justify-center mt-6 gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-md ${
                    isLoading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-200 text-green-700 hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  }`}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, "sent")}
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-md ${
                    isLoading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-red-200 text-black hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  }`}
                >
                  {isLoading ? "Processing..." : "Sent"}
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, "preview")}
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-md ${
                    isLoading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-200 text-black hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  }`}
                >
                  {isLoading ? "Processing..." : "Preview PDF"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-md ${
                    isLoading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-red-200 text-black hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPaymentHistory;