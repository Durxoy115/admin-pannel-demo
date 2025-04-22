import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";
import useUserPermission from "../hooks/usePermission";

const ListOrder = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const {permissions} = useUserPermission();

  const canAddOrder = permissions.includes("service.add_order");
  const canUpdateOrder = permissions.includes("service.change_order");
  const canDeleteOrder = permissions.includes("service.delete_order");

  useEffect(() => {
    fetchOrders();
  }, [url, token]);

  const fetchOrders = () => {
    fetch(`${url}/service/order/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.data);
        } else {
          console.error("Error fetching orders: ", data.message);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setIsLoading(false);
      });
  };

  const handleAddOrder = () => {
    navigate("/add-order");
  };

  const handleDeleteOrder = (orderId) => {
    setOrderToDelete(orderId);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      fetch(`https://admin.zgs.co.com/service/order/?order_id=${orderToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            console.log("Order deleted successfully");
            fetchOrders();
          } else {
            response.json().then((data) => {
              console.error("Error deleting order:", data);
            });
          }
        })
        .catch((error) => {
          console.error("Error deleting order:", error);
        })
        .finally(() => {
          setIsModalOpen(false);
          setOrderToDelete(null);
        });
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setOrderToDelete(null);
  };

  const handleOrderDetails = (order_id) => {
    navigate(`/order-details/${order_id}`);
  };

  return (
    <div className="mx-1 sm:mx-1 md:mx-10 mt-2 sm:mt-6 md:mt-10">
      {/* Header Section */}
      <div className="bg-gray-900 text-white p-1 sm:p-3 md:p-2 flex flex-col sm:flex-row sm:items-center justify-between rounded-t-md gap-2 sm:gap-4 mt-20 md:mt-24 sm:mt-16">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold ">Order List</h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            type="date"
            className="bg-white text-black px-2 sm:px-3 py-1 sm:py-2 rounded-md text-sm sm:text-base w-full sm:w-auto"
            placeholder="Start Date"
          />
          <input
            type="date"
            className="bg-white text-black px-2 sm:px-3 py-1 sm:py-2 rounded-md text-sm sm:text-base w-full sm:w-auto"
            placeholder="End date"
          />
        </div>
        {
          canAddOrder && 
          <IoMdAddCircleOutline
          className="text-white text-xl sm:text-2xl md:text-3xl cursor-pointer"
          onClick={handleAddOrder}
        />
        }
       
      </div>

      {/* Table Section */}
      {isLoading ? (
        <p className="text-center mt-6 sm:mt-8 text-gray-600 text-sm sm:text-base">Loading...</p>
      ) : orders.length > 0 ? (
        <div className="overflow-x-auto rounded-md shadow-md ">
          <table className="table-auto w-full border-collapse min-w-[800px]">
            <thead className="text-black bg-gray-200">
              <tr>
                <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">Service Name</th>
                <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">Order ID</th>
                <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">Price</th>
                <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">Est. Delivery</th>
                <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">Status</th>
                <th className="text-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-50`}
                >
                  <td className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{order.name || "N/A"}</td>
                  <td className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{order.order_id || "N/A"}</td>
                  <td className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{order.price} {order.currency}</td>
                  <td className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                    {order.estimate_delivery_date
                      ? new Date(order.estimate_delivery_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{order.status || "N/A"}</td>
                  <td className="text-center px-3 sm:px-4 py-2 sm:py-3">
                    <div className="flex justify-center space-x-2 sm:space-x-3">
                      {
                        canUpdateOrder && 
                        <FiEdit
                        className="text-purple-500 hover:text-purple-700 w-4 sm:w-5 h-4 sm:h-5 cursor-pointer"
                        onClick={() => handleOrderDetails(order.order_id)}
                      />
                      }
                      {
                        canDeleteOrder && 
                        <FiTrash2
                        className="text-red-500 hover:text-red-700 w-4 sm:w-5 h-4 sm:h-5 cursor-pointer"
                        onClick={() => handleDeleteOrder(order.order_id)}
                      />

                      }
                    
                     
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center mt-6 sm:mt-8 text-gray-600 text-sm sm:text-base">No orders available.</p>
      )}

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center w-full max-w-sm">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">Do you want to delete this order?</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
              <button
                className="w-full sm:w-auto px-3 sm:px-4 py-1 sm:py-2 bg-green-300 rounded hover:bg-green-400 text-sm sm:text-base"
                onClick={cancelDelete}
              >
                No
              </button>
              <button
                className="w-full sm:w-auto px-3 sm:px-4 py-1 sm:py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base"
                onClick={confirmDelete}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOrder;