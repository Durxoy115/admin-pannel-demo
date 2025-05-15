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
    paid_amount: 0.0,
    due_amount: 0.0,
    total_amount: 0.0,
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate due_amount automatically
  useEffect(() => {
    const calculatedDue = parseFloat(formData.total_amount || 0) - parseFloat(formData.paid_amount || 0);
    setFormData((prev) => ({
      ...prev,
      due_amount: isNaN(calculatedDue) ? 0.0 : calculatedDue.toFixed(2),
    }));
  }, [formData.total_amount, formData.paid_amount]);

  // Fetch payment details
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

    console.log("Fetching payment details for paymentId:", paymentId);
    console.log("Using token:", token);
    console.log("API URL:", `${url}/service/payment/?payment_id=${paymentId}`);

    setIsLoading(true);
    try {
      const response = await fetch(
        `${url}/service/payment/?payment_id=${paymentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok && data.success) {
        const paymentData = data.data;
        setFormData({
          invoice_id: paymentData.invoice_id || "",
          client_id: paymentData.client_id || "",
          client_name: paymentData.client_name || "",
          client_bank_name: paymentData.client_bank_name || "",
          client_account_no: paymentData.client_account_no || "",
          date: paymentData.date ? paymentData.date.split("T")[0] : "",
          contact: paymentData.contact || "",
          receiver_name: paymentData.receiver_name || "",
          receiver_bank_name: paymentData.receiver_bank_name || "",
          receiver_branch: paymentData.receiver_branch || "",
          receiver_account_name: paymentData.receiver_account_name || "",
          receiver_account_no: paymentData.receiver_account_no || "",
          trans_id: paymentData.trans_id || "",
          trans_type: paymentData.trans_type || "",
          paid_amount: parseFloat(paymentData.paid_amount) || 0.0,
          due_amount: parseFloat(paymentData.due_amount) || 0.0,
          total_amount: parseFloat(paymentData.total_amount) || 0.0,
        });
      } else {
        setError(data.message || "Failed to fetch payment details");
        console.error("API Error:", data.message);
      }
    } catch (err) {
      setError("An error occurred while fetching payment details");
      console.error("Fetch Error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered with paymentId:", paymentId);
    fetchPaymentDetails();
  }, [paymentId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission to update payment
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
        total_amount: parseFloat(formData.total_amount) || 0.0,
      };

      console.log("Submitting payload:", payload);

      if (action === "save") {
        console.log("Updating payment with PUT request");
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

        console.log("Update response status:", response.status);
        const data = await response.json();
        console.log("Update API Response:", data);

        if (response.ok && data.success) {
          setSuccessMessage(data.message || "Payment updated successfully");
          setTimeout(() => navigate("/payment-history"), 2000);
        } else {
          throw new Error(data.message || "Failed to update payment details");
        }
      } else if (action === "preview") {
        console.log("Generating PDF preview with POST request");
        const response = await fetch(`${url}/service/payment-pdf/?payment_id=${paymentId}&update=true`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(payload),
        });

        console.log("PDF response status:", response.status);
        if (!response.ok) {
          const errorData = await response.json();
          console.error("PDF Error:", errorData);
          throw new Error(errorData.message || "Failed to generate PDF preview");
        }

        const blob = await response.blob();
        const pdfUrl = window.URL.createObjectURL(blob);
        window.open(pdfUrl, "_blank");
      }
    } catch (err) {
      setError(err.message || "An error occurred during the operation");
      console.error("Submit/Preview Error:", err.message);
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
        <div className=" p-1 md:p-8 sm:p-1 rounded-lg shadow-lg w-full">
          { (
            <form onSubmit={(e) => handleSubmit(e, "save")}>
              <div className="grid grid-cols-12 md:grid-cols-2 gap-6">
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
                      { label: "Due Amount", name: "due_amount", type: "number", required: false, readOnly: true },
                      { label: "Total Amount", name: "total_amount", type: "number", required: false },
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
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-700 mb-4">
                    Receiver Details
                  </h2>
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
              {error && (
                <p className="text-red-500 text-center mt-4">{error}</p>
              )}
              <div className="flex justify-center mt-6 gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-md ${
                    "bg-green-200 text-green-700 hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  }`}
                >
                 Save
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, "preview")}
                 className="bg-blue-200 p-2 rounded-md"
                 disabled={isLoading}
                >
                  Preview PDF
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                 className="bg-red-200 p-2 rounded-md"
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