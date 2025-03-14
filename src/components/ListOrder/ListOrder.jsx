import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";

const ListOrder = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  useEffect(() => {
    fetchOrders();
  }, []);

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
            fetchOrders(); // Refresh the order list after deletion
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
    navigate(`/order-details/${order_id}`)
  }

  return (
    <div className="m-10">
      {/* Header Section */}
      <div className="bg-gray-900 text-white p-2 flex items-center justify-between rounded-t-lg">
        <h2 className="text-lg font-semibold">Order List</h2>
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
          onClick={handleAddOrder}
        />
      </div>

      {/* Table Section */}
      {isLoading ? (
        <p className="text-center mt-8">Loading...</p>
      ) : orders.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow-md mt-6">
          <table className="table-auto w-full border-collapse">
            <thead className="text-black">
              <tr>
                <th className="text-left px-4 py-2">Service Name</th>
                <th className="text-left px-4 py-2">Order ID</th>
                <th className="text-left px-4 py-2">Price</th>
                <th className="text-left px-4 py-2">Est. Delivery</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-center px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                >
                  <td className="text-left px-4 py-2">{order.name || "N/A"}</td>
                  <td className="text-left px-4 py-2">
                    {order.order_id || "N/A"}
                  </td>
                  <td className="text-left px-4 py-2">
                    {order.price} {order.currency}
                  </td>
                  <td className="text-left px-4 py-2">
                    {new Date(order.estimate_delivery_date).toLocaleDateString()}
                  </td>
                  <td className="text-left px-4 py-2">{order.status}</td>
                  <td className="text-center px-4 py-2">
                    <div className="flex justify-center space-x-2">
                      <FiEdit className="text-purple-500 hover:text-purple-700 cursor-pointer"
                      onClick={() => handleOrderDetails(order.order_id)} />
                      <FiTrash2
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        onClick={() => handleDeleteOrder(order.order_id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center mt-8 text-gray-600">No orders available.</p>
      )}

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Do you want to delete this order?
            </h3>
            <div className="flex gap-4 justify-center">
              <button
                className="px-4 py-2 bg-green-300 rounded hover:bg-green-400"
                onClick={cancelDelete}
              >
                No
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
