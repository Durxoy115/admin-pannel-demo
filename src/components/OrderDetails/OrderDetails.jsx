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
  }, [orderId]);

  const fetchOrderDetails = () => {
    fetch(`${url}/service/order/?order_id=${orderId}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Convert the date fields to the format YYYY-MM-DD
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

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-semibold mb-8">Order Details</h2>
        <form>
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: "Service Name", name: "name", type: "text" },
              { label: "Duration", name: "duration", type: "text" },
              { label: "Price", name: "price", type: "text" },
              { label: "Client ID", name: "client_id", type: "text", disabled: true },
              { label: "Order ID", name: "order_id", type: "text", disabled: true },
            ].map(({ label, name, type, disabled }) => (
              <div key={name}>
                <label htmlFor={name} className="block mb-2 font-medium">
                  {label}
                </label>
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  disabled={disabled}
                />
              </div>
            ))}
            
            {/* Add Date Fields */}
            {[
              { label: "Order Date", name: "order_date", type: "date" },
              { label: "Estimated Delivery Date", name: "estimate_delivery_date", type: "date" },
              { label: "Delivery Date", name: "delivery_date", type: "date" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label htmlFor={name} className="block mb-2 font-medium">
                  {label}
                </label>
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            ))}

            <div className="col-span-3">
              <label htmlFor="details" className="block mb-2 font-medium">
                Details
              </label>
              <textarea
                id="details"
                name="details"
                value={formData.details || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter order details here..."
              />
            </div>
          </div>

          <div className="flex justify-center items-center space-x-4 mt-6">
            <button
              type="button"
              className="px-6 py-2 bg-red-600 text-white rounded-lg"
              onClick={() => navigate("/order-list")}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg"
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
