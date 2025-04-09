import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useToken from "../hooks/useToken";

const OrderDetails = () => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, url, token]);

  const fetchOrderDetails = () => {
    fetch(`${url}/service/order/?order_id=${orderId}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const { order_date, estimate_delivery_date, delivery_date } = data.data;

          const formatDate = (date) => {
            if (!date) return "";
            return new Date(date).toISOString().split("T")[0];
          };

          setFormData({
            ...data.data,
            order_date: formatDate(order_date),
            estimate_delivery_date: formatDate(estimate_delivery_date),
            delivery_date: formatDate(delivery_date),
          });
        } else {
          console.error("Error fetching order details: ", data.message);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching order details:", error);
        setIsLoading(false);
      });
  };

  const handleUpdateOrder = () => {
    fetch(`${url}/service/order/?order_id=${formData.order_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Order Updated Successfully");
          setFormData(data.data);
          navigate("/order-list");
        } else {
          console.error("Error updating order: ", data.message);
        }
      })
      .catch((error) => console.error("Error updating order:", error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (isLoading) return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="w-full flex justify-center min-h-screen bg-gray-100">
      <div className="w-full l px-1 sm:px-6 md:px-20 py-6 sm:py-8 md:py-10">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-2 sm:mb-8 mt-12">Order Details</h2>
        <form>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              { label: "Service Name", name: "name", type: "text" },
              { label: "Duration", name: "duration", type: "text" },
              { label: "Price", name: "price", type: "text" },
              { label: "Client ID", name: "client_id", type: "text", disabled: true },
              { label: "Order ID", name: "order_id", type: "text", disabled: true },
              { label: "Order Date", name: "order_date", type: "date" },
              { label: "Estimated Delivery Date", name: "estimate_delivery_date", type: "date" },
              { label: "Delivery Date", name: "delivery_date", type: "date" },
            ].map(({ label, name, type, disabled }) => (
              <div key={name}>
                <label htmlFor={name} className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                  {label}
                </label>
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded-lg text-sm sm:text-base"
                  disabled={disabled}
                />
              </div>
            ))}

            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <label htmlFor="details" className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base">
                Details
              </label>
              <textarea
                id="details"
                name="details"
                value={formData.details || ""}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-4 border rounded-lg h-32 sm:h-48 text-sm sm:text-base"
                placeholder="Enter order details here..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row relative justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-4 mb-10 sm:mt-6">
            <button
              type="button"
              className="w-full sm:w-64 px-4 sm:px-6 py-1 sm:py-2 bg-red-600 text-white rounded-lg text-sm sm:text-base"
              onClick={() => navigate("/order-list")}
            >
              Cancel
            </button>
            <button
              type="button"
              className="w-full sm:w-64 px-4 sm:px-6 py-1 sm:py-2 bg-blue-500 text-white rounded-lg text-sm sm:text-base"
              onClick={handleUpdateOrder}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderDetails;