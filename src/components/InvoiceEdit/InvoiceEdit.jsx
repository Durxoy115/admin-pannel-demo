import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useToken from "../hooks/useToken";
import Footer from "../Footer/Footer";

const InvoiceEdit = () => {
  const { id } = useParams();
  console.log("Invoice ID from params:", id);
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [defaultService, setDefaultService] = useState("");
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    client_invoice_id: "",
    client_id: "",
    client_name: "",
    date: "",
    payment_status: "",
    company_name: "",
    website_url: "",
    address: "",
    client_email: "",
    client_phone: "",
    billing_address: "",
    service_name: "",
    sub_total: 0,
    discount: 0.0,
    vat: 0,
    total_amount: 0,
    services: [],
    company_logo: null, // Changed to store file object
    company_logo_name: "", // To display file name
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isServicesLoading, setIsServicesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [servicesError, setServicesError] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await fetch(`${url}/service/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setServices(data?.data || []);
          if (data.data.length > 0) {
            const firstService = data?.data[0].name;
            setDefaultService(firstService);
            setFormData((prev) => ({
              ...prev,
              service_name: firstService,
              services: [],
            }));
          }
        } else {
          throw new Error(`Failed to fetch services. Status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setServicesError(`Failed to load services: ${error.message}`);
      } finally {
        setIsServicesLoading(false);
      }
    };

    fetchServiceData();
  }, []);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const response = await fetch(`${url}/service/invoice/?invoice_id=${id}`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          console.log("Fetched data:", data);
          const services = data?.data?.services.map((service) => ({
            id: service.id,
            service_name: service.service_name,
            quantity: service.quantity,
            currency: "USD",
            rate: service.rate,
            duration: service.duration,
            price: parseFloat(service.amount) / service.quantity || 0,
            total_amount: parseFloat(service.amount) || 0,
          }));
          const fetchedData = {
            client_invoice_id: data.data.client_invoice_id || "",
            client_id: data.data.client_id || "",
            client_name: data.data.client_name || "",
            date: data.data.date ? data.data.date.split("T")[0] : "",
            payment_status: data.data.payment_status || "",
            company_name: data.data.company_name || "",
            website_url: data.data.website_url || "",
            address: data.data.address || "",
            client_email: data.data.client_email || "",
            client_phone: data.data.client_phone || "",
            billing_address: data.data.billing_address || "",
            service_name:
              data.data.service_name || (services.length > 0 ? services[0].name : ""),
            sub_total: parseFloat(data.data.sub_total) || 0,
            discount: parseFloat(data.data.discount) || 0,
            vat: parseFloat(data.data.vat) || 0,
            total_amount: parseFloat(data.data.total_amount) || 0,
            services: services,
            company_logo: null, // File object will be set on upload
            company_logo_name: data.data.company_logo
              ? data.data.company_logo.split('/').slice(-1)[0]
              : "", // Extract file name from URL
          };
          setFormData(fetchedData);
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
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "discount" || name === "vat") && !/^\d*\.?\d{0,2}$/.test(value)) return;

    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      const totals = calculateTotals(updatedData);
      return { ...updatedData, ...totals };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        company_logo: file, // Store the file object
        company_logo_name: file.name, // Display the file name
      }));
    }
  };

  const handleServiceChange = (index, field, value, id) => {
    const updatedServices = [...formData.services];

    if (field === "quantity" || field === "duration") {
      updatedServices[index][field] = parseInt(value, 10) || 0;
    } else if (field === "price") {
      updatedServices[index][field] = parseFloat(value) || 0;
    } else {
      updatedServices[index][field] = value;
    }

    updatedServices[index].total_amount =
      (updatedServices[index].quantity || 0) * (updatedServices[index].price || 0);
    updatedServices[index]["id"] = id;

    setFormData((prev) => {
      const newFormData = { ...prev, services: updatedServices };
      const totals = calculateTotals(newFormData);
      return { ...newFormData, ...totals };
    });
  };

  const addServiceItem = () => {
    setFormData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          id: null,
          service_name: defaultService,
          quantity: 0,
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
    setFormData((prev) => {
      const newFormData = { ...prev, services: updatedServices };
      const totals = calculateTotals(newFormData);
      return { ...newFormData, ...totals };
    });
  };

  const calculateTotals = (data = formData) => {
    const subTotal = data.services.reduce(
      (sum, service) => sum + (service.total_amount || 0),
      0
    );
    const discountAmount = parseFloat(data.discount) || 0;
    const vatAmount = ((subTotal - discountAmount) * (parseFloat(data.vat) || 0)) / 100;
    const total = subTotal + vatAmount - discountAmount;

    return {
      sub_total: parseFloat(subTotal.toFixed(2)),
      discount: parseFloat(discountAmount.toFixed(2)),
      vat: parseFloat(data.vat),
      total_amount: parseFloat(total.toFixed(2)),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataPayload = new FormData();
      formDataPayload.append("service_name", formData.service_name);
      formDataPayload.append("company_name", formData.company_name);
      formDataPayload.append("billing_address", formData.billing_address);
      formDataPayload.append("client_id", formData.client_id);
      formDataPayload.append("website_url", formData.website_url);
      formDataPayload.append("address", formData.address);
      formDataPayload.append("client_name", formData.client_name);
      formDataPayload.append("date", formData.date);
      formDataPayload.append("payment_status", formData.payment_status);
      formDataPayload.append("client_email", formData.client_email);
      formDataPayload.append("client_phone", formData.client_phone);
      formDataPayload.append("total_amount", formData.total_amount);
      formDataPayload.append("sub_total", formData.sub_total);
      formDataPayload.append("discount", formData.discount);
      formDataPayload.append("vat", formData.vat);
      if (formData.company_logo) {
        formDataPayload.append("company_logo", formData.company_logo);
      }
      formDataPayload.append("services", JSON.stringify(formData.services));

      const response = await fetch(`${url}/service/invoice/?invoice_id=${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formDataPayload,
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        navigate("/invoice-list");
      } else {
        throw new Error(`Failed to update invoice. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
      alert(`Failed to update invoice: ${error.message}`);
    }
  };

  if (isLoading || isServicesLoading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p className="text-red-500 p-5">{error}</p>;
  }

  if (servicesError) {
    return <p className="text-red-500 p-5">{servicesError}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <form
        onSubmit={handleSubmit}
        className="p-8 w-full max-w-4xl mx-auto space-y-6 bg-white rounded-2xl mt-2"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Edit Invoice</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <input
            name="client_invoice_id"
            placeholder="Client Invoice ID*"
            value={formData.client_invoice_id}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          {/* Custom File Input */}
          <div className="relative">
            <input
              type="file"
              name="company_logo"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 truncate cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
              onClick={() => fileInputRef.current.click()}
            >
              {formData.company_logo_name || "Choose Company Logo"}
            </div>
          </div>

          <input
            name="company_name"
            placeholder="Company Name*"
            value={formData.company_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
          <input
            name="billing_address"
            placeholder="Company Billing Address*"
            value={formData.billing_address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            name="client_id"
            placeholder="Client ID*"
            value={formData.client_id}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            name="website_url"
            placeholder="Website URL"
            value={formData.website_url}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <textarea
            name="address"
            placeholder="Address*"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 col-span-3"
            required
          />
          <input
            name="client_name"
            placeholder="Client Name*"
            value={formData.client_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            name="payment_status"
            placeholder="Payment Status*"
            value={formData.payment_status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            name="client_email"
            placeholder="Client Email*"
            value={formData.client_email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            name="client_phone"
            placeholder="Client Phone No.*"
            value={formData.client_phone}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            name="vat"
            type="number"
            step="0.01"
            placeholder="VAT (%)"
            value={formData.vat}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            name="discount"
            type="number"
            step="0.01"
            placeholder="Discount"
            value={formData.discount}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
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
                      value={service.service_name}
                      onChange={(e) =>
                        handleServiceChange(index, "service_name", e.target.value, service.id)
                      }
                      className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {services?.map((e, key) => (
                        <option key={key} value={e.name}>
                          {e.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      value={service.quantity}
                      onChange={(e) =>
                        handleServiceChange(index, "quantity", parseInt(e.target.value, 10), service.id)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </td>
                  <td className="py-2 px-4">
                    <select
                      value={service.currency}
                      onChange={(e) =>
                        handleServiceChange(index, "currency", e.target.value, service.id)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      {["USD", "Dollar", "Rupee", "Euro", "BDT"].map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-4">
                    <select
                      value={service.rate}
                      onChange={(e) =>
                        handleServiceChange(index, "rate", e.target.value, service.id)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      {["Hourly", "Monthly", "Project Base", "Fixed Price"].map((rate) => (
                        <option key={rate} value={rate}>
                          {rate}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      value={service.duration}
                      onChange={(e) =>
                        handleServiceChange(index, "duration", parseInt(e.target.value, 10), service.id)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      step="0.01"
                      value={service.price}
                      onChange={(e) =>
                        handleServiceChange(index, "price", e.target.value, service.id)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </td>
                  <td className="py-2 px-4">${service.total_amount.toFixed(2)}</td>
                  <td className="py-2 px-4">
                    <button
                      type="button"
                      onClick={() => removeServiceItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
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
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Item
          </button>
        </div>

        <div className="text-right space-y-2 border-t border-gray-200 pt-4">
          <p>Sub Total: ${formData.sub_total.toFixed(2)}</p>
          <p className="text-red-500">
            Discount: - ${parseFloat(formData.discount || 0).toFixed(2)}
          </p>
          <p>VAT: ${parseFloat(formData.vat || 0)}%</p>
          <p className="text-xl font-semibold">
            TOTAL: ${formData.total_amount.toFixed(2)}
          </p>
        </div>

        <div className="flex justify-end space-x-4 mb-6">
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
            Send
          </button>
        </div>
      </form>
     
    </div>
    
  );
};

export default InvoiceEdit;