import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useToken from "../hooks/useToken";

const InvoiceEdit = () => {
  const { id } = useParams(); 
  console.log("Invoice ID from params:", id); 
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  const [formData, setFormData] = useState({
    client_invoice_id: "",
    client_id: "",
    client_name: "",
    date: "",
    payment_status: "",
    company_name: "",
    company_logo: null,
    website_url: "",
    address: "",
    client_email: "",
    client_phone: "",
    billing_address: "",
    service_name: "",
    sub_total: 0,
    discount: 0,
    vat: 0,
    total_amount: 0,
    services: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // const id = parseInt(id, 10); // Convert invoiceId to integer
    // if (isNaN(id)) {
    //   setError("Invalid Invoice ID. Please use a valid integer ID.");
    //   setIsLoading(false);
    //   return;
    // }

    const fetchInvoiceData = async () => {
      try {
        const response = await fetch(
          `${url}/service/invoice/?invoice_id=${id}`, // Use integer id
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched data:", data); // Debug log for response
          const services = data.data.services.map((service) => ({
            service_name: service.service_name,
            quantity: service.quantity,
            currency: "USD", // Default from image
            rate: service.rate,
            duration: service.duration,
            price: parseFloat(service.amount) / service.quantity || 0, // Derive price, handle division by zero
            total_amount: parseFloat(service.amount) || 0,
          }));
          setFormData({
            client_invoice_id: data.data.client_invoice_id || "",
            client_id: data.data.client_id || "",
            client_name: data.data.client_name || "",
            date: data.data.date ? data.data.date.split("T")[0] : "", // Format date
            payment_status: data.data.payment_status || "",
            company_name: data.data.company_name || "",
            company_logo: data.data.company_logo || null,
            website_url: data.data.website_url || "",
            address: data.data.address || "",
            client_email: data.data.client_email || "",
            client_phone: data.data.client_phone || "",
            billing_address: data.data.billing_address || "",
            service_name: data.data.service_name || "",
            sub_total: parseFloat(data.data.sub_total) || 0,
            discount: parseFloat(data.data.discount) || 0,
            vat: parseFloat(data.data.vat) || 0,
            total_amount: parseFloat(data.data.total_amount) || 0,
            services: services,
          });
        } else {
          throw new Error(`Failed to fetch invoice data. Status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching invoice data:", error);
        setError(`Failed to load invoice data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoiceData();
  }, [id, token, url]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index][field] =
      field === "quantity" || field === "duration" || field === "price"
        ? parseInt(value, 10) || 0
        : value;
    updatedServices[index].total_amount =
      (updatedServices[index].quantity || 0) * (updatedServices[index].price || 0);
    const sub_total = updatedServices.reduce(
      (sum, service) => sum + (service.total_amount || 0),
      0
    );
    setFormData((prev) => ({
      ...prev,
      services: updatedServices,
      sub_total: sub_total,
      total_amount: sub_total - prev.discount + (sub_total * prev.vat) / 100,
    }));
  };

  const addServiceItem = () => {
    setFormData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          service_name: "Ludo App",
          quantity: 1,
          currency: "USD",
          rate: "Monthly",
          duration: 0,
          price: 0,
          total_amount: 0,
        },
      ],
    }));
  };

  const removeServiceItem = (index) => {
    const updatedServices = formData.services.filter((_, i) => i !== index);
    const sub_total = updatedServices.reduce(
      (sum, service) => sum + (service.total_amount || 0),
      0
    );
    setFormData((prev) => ({
      ...prev,
      services: updatedServices,
      sub_total: sub_total,
      total_amount: sub_total - prev.discount + (sub_total * prev.vat) / 100,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = parseInt(id, 10);
    try {
      const response = await fetch(
        `${url}/service/invoice/?invoice_id=${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            services: formData.services.map((service) => ({
              service_name: service.service_name,
              quantity: service.quantity,
              rate: service.rate,
              duration: service.duration,
              amount: service.total_amount,
            })),
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        navigate("/invoices"); // Redirect to invoice list
      } else {
        throw new Error(`Failed to update invoice. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
    }
  };

  if (isLoading) {
    return <p>Loading invoice data...</p>;
  }

  if (error) {
    return <p className="text-red-500 p-5">{error}</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 w-full max-w-4xl mx-auto space-y-6 bg-white rounded-2xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Edit Invoice</h1>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <select
          type="text"
          id="service_name"
          name="service_name"
          className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
          onChange={handleChange}
          required
        >
          {/* Placeholder for services; replace with actual data if available */}
          <option value="React">React</option>
          <option value="Ludo App">Ludo App</option>
        </select>
        <div>
          <input
            type="file"
            name="company_logo"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, company_logo: e.target.files[0] }))
            }
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>
        <div>
          <input
            name="company_name"
            placeholder="Company Name*"
            value={formData.company_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>
        <div>
          <input
            name="billing_address"
            placeholder="Company Billing Address*"
            value={formData.billing_address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <input
            name="client_id"
            placeholder="Client ID*"
            value={formData.client_id}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <input
            name="website_url"
            placeholder="Website URL"
            value={formData.website_url}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div className="col-span-3">
          <textarea
            name="address"
            placeholder="Address*"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <input
            name="client_name"
            placeholder="Client Name*"
            value={formData.client_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <input
            name="payment_status"
            placeholder="Payment Status*"
            value={formData.payment_status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <input
            name="client_email"
            placeholder="Client Email*"
            value={formData.client_email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <input
            name="client_phone"
            placeholder="Client Phone No.*"
            value={formData.client_phone}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-2xl">
        <table className="w-full text-sm text-left text-gray-700">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Item Name</th>
              <th className="py-2 px-4">Quantity</th>
              <th className="py-2 px-4">Currency</th>
              <th className="py-2 px-4">Rate</th>
              <th className="py-2 px-4">Time Duration</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">Total Amount</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {formData.services.map((service, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">
                  <select
                    type="text"
                    id="service_name"
                    name="service_name"
                    className="w-full px-4 py-2 border rounded-lg"
                    onChange={(e) =>
                      handleServiceChange(index, "service_name", e.target.value)
                    }
                    required
                  >
                    {/* Placeholder for services; replace with actual data if available */}
                    <option value="React">React</option>
                    <option value="Ludo App">Ludo App</option>
                  </select>
                </td>
                <td className="py-2 px-4">
                  <input
                    type="number"
                    value={service.quantity}
                    onChange={(e) =>
                      handleServiceChange(
                        index,
                        "quantity",
                        parseInt(e.target.value, 10)
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </td>
                <td className="py-2 px-4">
                  <select
                    value={service.currency}
                    onChange={(e) =>
                      handleServiceChange(index, "currency", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    {["USD", "Dollar", "Rupee", "Euro", "BDT"].map(
                      (currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      )
                    )}
                  </select>
                </td>
                <td className="py-2 px-4">
                  <select
                    value={service.rate}
                    onChange={(e) =>
                      handleServiceChange(index, "rate", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    {["Hourly", "Monthly", "Project Base", "Fixed Price"].map(
                      (rate) => (
                        <option key={rate} value={rate}>
                          {rate}
                        </option>
                      )
                    )}
                  </select>
                </td>
                <td className="py-2 px-4">
                  <input
                    type="number"
                    value={service.duration}
                    onChange={(e) =>
                      handleServiceChange(
                        index,
                        "duration",
                        parseInt(e.target.value, 10)
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </td>
                <td className="py-2 px-4">
                  <input
                    type="number"
                    value={service.price}
                    onChange={(e) =>
                      handleServiceChange(
                        index,
                        "price",
                        parseInt(e.target.value, 10)
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </td>
                <td className="py-2 px-4">
                  ${service?.total_amount?.toFixed(2)}
                </td>
                <td className="py-2 px-4">
                  <button
                    type="button"
                    onClick={() => removeServiceItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          onClick={addServiceItem}
          className="mt-4 flex items-center text-purple-500 hover:text-purple-700"
        >
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Item
        </button>
      </div>

      <div className="text-right space-y-2 border-t border-gray-200 pt-4">
        <p>Sub Total: ${formData?.sub_total?.toFixed(2)}</p>
        <p className="text-red-500">
          Discount: - ${formData?.discount?.toFixed(2)}
        </p>
        <p>VAT: {formData.vat}%</p>
        <p className="text-xl font-semibold">TOTAL: ${formData?.total_amount?.toFixed(2)}</p>
      </div>

      <div className="flex justify-end space-x-4">
        <label className="flex items-center space-x-2 text-gray-600">
          <input
            type="checkbox"
            className="h-4 w-4 text-purple-600 focus:ring-purple-500"
          />
          Do you want signature field
        </label>
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Save
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
        >
          Sent
        </button>
      
      </div>
    </form>
  );
};

export default InvoiceEdit;