import React, { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { AiOutlineEdit } from "react-icons/ai";
import { VscFilePdf } from "react-icons/vsc";
import { MdSend } from "react-icons/md"; // Added for Sent button
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import useUserPermission from "../hooks/usePermission";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [currencyTotals, setCurrencyTotals] = useState({});
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const { permissions } = useUserPermission();

  const canAddPayment = permissions.includes("service.add_payment");
  const canUpdatePayment = permissions.includes("service.change_payment");
  const canDeletePayment = permissions.includes("service.delete_payment");

  // Fetch payments
  const fetchPayments = async () => {
    try {
      const response = await fetch(`${url}/service/payment/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        const allData = data?.data;
        const paid_due_amount = {};
        const paymentData = [];
        for (let i = 0; i < allData.length; i++) {
          paymentData.push({
            id: allData[i].id,
            client_name: allData[i].client_name,
            client_id: allData[i].client_id,
            invoice_id: allData[i].invoice_id,
            trans_id: allData[i].trans_id,
            date: allData[i].date?.split("T")[0],
            total_amount: allData[i].total_amount,
            paid_amount: allData[i].paid_amount,
            due_amount: allData[i].due_amount,
            sign: allData[i].sign,
            last_due: allData[i].last_due,
            currency: allData[i].currency,
            invoice_paid: allData[i].invoice_paid,
            payment_pdf: allData[i].payment_pdf,
          });
          if (!(allData[i].currency in paid_due_amount)) {
            paid_due_amount[allData[i].currency] = {
              paid_amount: 0,
              due_amount: 0,
              symbol: allData[i]?.sign,
            };
          }
          if (allData[i].last_due === true) {
            paid_due_amount[allData[i].currency].paid_amount +=
              parseFloat(allData[i].paid_amount) + parseFloat(allData[i].invoice_paid || 0);
            paid_due_amount[allData[i].currency].due_amount += parseFloat(allData[i].due_amount);
          } else {
            paid_due_amount[allData[i].currency].paid_amount += parseFloat(allData[i].paid_amount);
          }
        }
        setCurrencies(Object.keys(paid_due_amount));
        setSelectedCurrency(Object.keys(paid_due_amount)[0] || "");
        setCurrencyTotals(paid_due_amount);
        setPayments(paymentData);
        setFilteredPayments(
          paymentData.filter((payment) => payment.currency === Object.keys(paid_due_amount)[0])
        );
      } else {
        console.error("Error fetching payments:", data.message);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Filter payments based on date and currency
  useEffect(() => {
    let filtered = payments;
    if (startDate) {
      filtered = filtered.filter((payment) => payment.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((payment) => payment.date <= endDate);
    }
    if (selectedCurrency) {
      filtered = filtered.filter((payment) => payment.currency === selectedCurrency);
    }
    const paid_due_amount = {};
    for (let i = 0; i < filtered.length; i++) {
      if (!(filtered[i].currency in paid_due_amount)) {
        paid_due_amount[filtered[i].currency] = {
          paid_amount: 0,
          due_amount: 0,
          symbol: filtered[i]?.sign,
        };
      }
      if (filtered[i].last_due === true) {
        paid_due_amount[filtered[i].currency].paid_amount +=
          parseFloat(filtered[i].paid_amount) + parseFloat(filtered[i].invoice_paid || 0);
        paid_due_amount[filtered[i].currency].due_amount += parseFloat(filtered[i].due_amount);
      } else {
        paid_due_amount[filtered[i].currency].paid_amount += parseFloat(filtered[i].paid_amount);
      }
    }
    setCurrencyTotals(paid_due_amount);
    setFilteredPayments(filtered);
  }, [startDate, endDate, selectedCurrency, payments]);

  const handleAddPayment = () => {
    navigate("/add-payment");
  };

  const handleDeletePayment = async () => {
    if (!selectedPaymentId) return;

    try {
      const response = await fetch(
        `${url}/service/payment/?payment_id=${selectedPaymentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        setPayments(payments.filter((payment) => payment.id !== selectedPaymentId));
        setFilteredPayments(
          filteredPayments.filter((payment) => payment.id !== selectedPaymentId)
        );
        setIsModalOpen(false);
      } else {
        console.error("Failed to delete payment");
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedPaymentId(id);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setSelectedPaymentId(null);
  };

  const handlePaymentHistory = (id) => {
    navigate(`/edit-payment-history/${id}`);
  };

  // const previewPDF = async (id) => {
  //   try {
  //     const response = await fetch(`${url}/service/payment-pdf/?payment_id=${id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Token ${token}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       console.error("PDF Error:", errorData);
  //       throw new Error(errorData.message || "Failed to generate PDF preview");
  //     }

  //     const blob = await response.blob();
  //     const pdfUrl = window.URL.createObjectURL(blob);
  //     window.open(pdfUrl, "_blank");
  //   } catch (error) {
  //     console.error("Error generating PDF preview:", error.message);
  //   }
  // };

  const previewPDF = (payment_pdf) => {
    window.open(`${url}${payment_pdf}`, '_blank');
  };
  const handleSendPayment = async (id) => {
    try {
      const response = await fetch(
        `${url}/service/payment/?sent=true&payment_id=${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("Sent API Response:", data);

      if (response.ok && data.success) {
        alert(data.message || "Payment sent successfully");
        fetchPayments(); // Refresh payments to reflect any changes
      } else {
        console.error("Failed to send payment:", data.message);
        alert(data.message || "Failed to send payment");
      }
    } catch (error) {
      console.error("Error sending payment:", error);
      alert("An error occurred while sending the payment");
    }
  };

  return (
    <div className="p-1 sm:p-1 md:p-8 lg:p-10 min-h-screen bg-gray-50 mt-16">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {[
          {
            title: "TOTAL PAID AMOUNT",
            amount: currencyTotals[selectedCurrency]?.paid_amount || 0,
            color: "text-blue-600",
            render: (
              <div className="relative">
                {/* <div className="absolute top-0 right-0">
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="text-black text-xs sm:text-sm border rounded-md p-1"
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div> */}
                <h2 className="text-lg sm:text-xl font-semibold">
                  {currencyTotals[selectedCurrency]?.symbol || ""}
                  {(currencyTotals[selectedCurrency]?.paid_amount || 0).toLocaleString()}
                </h2>
              </div>
            ),
          },
          {
            title: "TOTAL DUE AMOUNT",
            amount: currencyTotals[selectedCurrency]?.due_amount || 0,
            color: "text-red-600",
            render: (
              <div className="relative">
                <div className="absolute top-0 right-0">
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="text-black text-xs sm:text-sm border rounded-md p-1"
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold">
                  {currencyTotals[selectedCurrency]?.symbol || ""}
                  {(currencyTotals[selectedCurrency]?.due_amount || 0).toLocaleString()}
                </h2>
              </div>
            ),
          },
        ].map((item, index) => (
          <div key={index} className="bg-white shadow p-4 rounded-lg">
            {item.render}
            <p className="text-xs sm:text-sm text-gray-600">{item.title}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="bg-gray-900 text-white p-1 sm:p-1 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mx-auto">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
          Payment History
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full sm:w-auto bg-white text-black px-3 py-1.5 rounded-md text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full sm:w-auto bg-white text-black px-3 py-1.5 rounded-md text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {canAddPayment && (
          <button
            className="text-white text-2xl sm:text-3xl hover:text-gray-300 transition-colors"
            onClick={handleAddPayment}
          >
            <IoMdAddCircleOutline />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto mx-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-100 text-gray-700 text-xs sm:text-sm">
            <tr>
              <th className="p-3 sm:p-4 text-left font-medium">Client Name</th>
              <th className="p-3 sm:p-4 text-left font-medium">Client ID</th>
              <th className="p-3 sm:p-4 text-left font-medium">Invoice ID</th>
              <th className="p-3 sm:p-4 text-left font-medium">Transaction ID</th>
              <th className="p-3 sm:p-4 text-left font-medium">Date</th>
              <th className="p-3 sm:p-4 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b hover:bg-gray-50 text-xs sm:text-sm"
                >
                  <td className="p-3 sm:p-4">{payment.client_name}</td>
                  <td className="p-3 sm:p-4">{payment.client_id}</td>
                  <td className="p-3 sm:p-4">{payment.invoice_id}</td>
                  <td className="p-3 sm:p-4">{payment.trans_id || "N/A"}</td>
                  <td className="p-3 sm:p-4">{payment.date || "N/A"}</td>
                  <td className="p-3 sm:p-4 flex gap-2">
                    {canUpdatePayment && (
                      <button
                        className="p-1.5 rounded-md text-green-500 hover:bg-green-200 hover:text-green-700 transition-colors"
                        onClick={() => previewPDF(payment?.payment_pdf)}
                        title="Preview PDF"
                      >
                        <VscFilePdf className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}
                    {canUpdatePayment && (
                      <button
                        className="p-1.5 rounded-md text-blue-500 hover:bg-blue-200 hover:text-blue-700 transition-colors"
                        onClick={() => handlePaymentHistory(payment.id)}
                        title="Edit"
                      >
                        <AiOutlineEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}
                    {/* {canUpdatePayment && (
                      <button
                        className="p-1.5 rounded-md text-red-500 hover:bg-red-200 hover:text-red-700 transition-colors"
                        onClick={() => handleSendPayment(payment.id)}
                        title="Send"
                      >
                        <MdSend className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )} */}
                    {canDeletePayment && (
                      <button
                        className="p-1.5 rounded-md text-red-500 hover:bg-red-200 hover:text-red-700 transition-colors"
                        onClick={() => openDeleteModal(payment.id)}
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No payment history available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">
              Confirm Delete
            </h2>
            <p className="text-gray-700 text-sm sm:text-base text-center">
              Are you sure you want to delete this payment?
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm sm:text-base"
                onClick={handleDeletePayment}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 text-sm sm:text-base"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;