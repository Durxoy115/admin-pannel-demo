import React, { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";

const PaymentHistory = () => {
  const [payments, setPayment] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${url}/service/payment/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setPayment(data.data);
      } else {
        console.error("Error fetching users:", data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddPayment = () => {
    navigate("/add-payment");
  };

  const handleDeleteSubAdmin = async () => {
    if (!selectedPaymentId) return; // Fixed typo: `setSelectedPaymentId` → `selectedPaymentId`

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
        setPayment(
          payments.filter((payment) => payment.id !== selectedPaymentId)
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

  return (
    <div className="p-1 sm:p-1 md:p-8 lg:p-10 min-h-screen bg-gray-50 mt-16">
      {/* Header */}
      <div className="bg-gray-900 text-white p-1 sm:p-1 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mx-auto">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
          Payment History
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <input
            type="date"
            className="w-full sm:w-auto bg-white text-black px-3 py-1.5 rounded-md text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            className="w-full sm:w-auto bg-white text-black px-3 py-1.5 rounded-md text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          className="text-white text-2xl sm:text-3xl hover:text-gray-300 transition-colors"
          onClick={handleAddPayment}
        >
          <IoMdAddCircleOutline />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mx-auto ">
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
            {payments.length > 0 ? (
              payments.map((payment) => (
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
                    <button
                      className="p-1.5 rounded-md bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-700 transition-colors"
                      onClick={() => openDeleteModal(payment.id)}
                    >
                      <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
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
                onClick={handleDeleteSubAdmin}
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