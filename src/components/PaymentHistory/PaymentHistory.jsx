import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import Footer from "../Footer/Footer";

const PaymentHistory = () => {
  const [payments, setPayment] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const navigate = useNavigate();
  const [url,getTokenLocalStorage] = useToken();
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
    if (!setSelectedPaymentId) return;
    
    try {
      const response = await fetch(`${url}/service/payment/?payment_id=${selectedPaymentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        setPayment(payments.filter((payment) => payment.id !== selectedPaymentId));
        setIsModalOpen(false);
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
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
    <div className="p-4">
      <div className="bg-gray-900  text-white p-2 flex items-center justify-between rounded-lg ml-10 mr-10">
             <h2 className="text-lg font-semibold ">Payment History</h2>
             <div className="flex space-x-2 ml-60">
               <input
                 type="date"
                 className="bg-white text-black px-2 py-1 rounded-md"
                 placeholder="Start Date"
               />
               <input
                 type="date"
                 className="bg-white text-black px-2 py-1 rounded-md"
                 placeholder="End date"
               />
             </div>
             <IoMdAddCircleOutline
               className="text-white text-2xl mr-6 cursor-pointer"
               onClick={handleAddPayment}
             />
           </div>

      <div className="overflow-x-auto ml-10 mr-10">
        <table className="min-w-full ">
          <thead className="bg-gray-100">
            <tr>
              <th className=" p-2 text-left">Client Name</th>
              <th className=" p-2 text-left">Client Id</th>
              <th className=" p-2 text-left">Invoice Id</th>
              <th className="p-2 text-left">Transaction Id</th>
              <th className=" p-2 text-left">Date</th>
              <th className=" p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className=" p-2">{payment.client_name}</td>
                <td className=" p-2">{payment.client_id}</td>
                <td className=" p-2">{payment.invoice_id}</td>
                <td className=" p-2">{payment.trans_id || "N/A"}</td>
                <td className=" p-2">{payment.date || "N/A"}</td>
                <td className=" p-2 flex gap-2">
                 
                  <button style={{backgroundColor: "#FFC6B8"}} className="text-red-500 hover:text-red-700 p-1" onClick={() => openDeleteModal(payment.id)}>
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="text-gray-700">Are you sure you want to delete this member?</p>
            <div className="mt-6 flex justify-center gap-4">
              <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700" onClick={handleDeleteSubAdmin}>Delete</button>
              <button className="bg-green-300 px-4 py-2 rounded-md hover:bg-green-400" onClick={closeDeleteModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
     
    </div>
  );
};

export default PaymentHistory;
