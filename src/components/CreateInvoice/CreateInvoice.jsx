import React, { useEffect, useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import useToken from "../hooks/useToken";
import { useNavigate } from "react-router-dom";
import { BsPrinter } from "react-icons/bs";
import { IoIosSend } from "react-icons/io";
import { IoPlayOutline } from "react-icons/io5";

const CreateInvoice = () => {
  const [services, setServices] = useState([]);
  const [defaultService, setDefaultService] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [billingAddresses, setBillingAddresses] = useState([]);
  const [author, setAuthor] = useState([]);
  const [vat, setVat] = useState(0);
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    service_name: "", // Empty to show "Select Service" initially
    company_logo: null,
    company_name: "",
    billing_address: "", // Empty to show "Select Billing Address" initially
    company_address: "", // Empty to show "Select Address" initially
    client_id: "",
    website_url: "",
    authority_signature:"",
    address: "",
    client_name: "",
    date: "",
    payment_status: "",
    invoice_date:"",
    client_email: "",
    client_phone: "",
    sub_total: 0,
    total_amount: 0,
    services: [],
    discount: 0.0,
    vat: 0.0,
  });

  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  // Fetch services
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
          setServices(data?.data);
          if (data.data.length > 0) {
            setDefaultService(data.data[0].name);
            setFormData((prev) => ({
              ...prev,
              services: [
                {
                  service_name: data?.data[0]?.name,
                  quantity: 0,
                  currency: "USD",
                  rate: "Monthly",
                  duration: 0,
                  price: 0,
                  amount: 0,
                },
              ],
            }));
          }
        } else {
          console.error("Failed to fetch service data");
        }
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };
    fetchServiceData();
  }, [url, token]);

  // Fetch billing addresses
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch(`${url}/company/billing-address/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setBillingAddresses(data.data);
        } else {
          console.error("Error fetching billing addresses:", data.message);
        }
      } catch (error) {
        console.error("Error fetching billing addresses:", error);
      }
    };
    fetchAddress();
  }, [url, token]);
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch(`${url}/company/authority-signature/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setAuthor(data.data);
        } else {
          console.error("Error fetching billing addresses:", data.message);
        }
      } catch (error) {
        console.error("Error fetching billing addresses:", error);
      }
    };
    fetchAddress();
  }, [url, token]);

  // Fetch company addresses
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch(`${url}/company/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setAddresses(data.data);
        } else {
          console.error("Error fetching company addresses:", data.message);
        }
      } catch (error) {
        console.error("Error fetching company addresses:", error);
      }
    };
    fetchAddress();
  }, [url, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "vat") setVat(parseFloat(value) || 0);
    if (name === "discount") setDiscount(parseFloat(value) || 0);

    setFormData((prev) => {
      const totals = calculateTotals({ ...prev, [name]: value });
      return { ...prev, ...totals, [name]: value };
    });
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index][field] = value;
    updatedServices[index].amount = updatedServices[index].quantity * updatedServices[index].price;

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
          service_name: defaultService,
          quantity: 0,
          currency: "USD",
          rate: "Monthly",
          duration: 0,
          price: 0,
          amount: 0,
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
      (sum, service) => sum + (service.amount || 0),
      0
    );

    const discountAmount = parseFloat(data.discount) || 0;
    const vatAmount = ((subTotal - discountAmount) * (parseFloat(data.vat) || 0)) / 100;
    const total = subTotal + vatAmount - discountAmount;

    return { sub_total: subTotal, total_amount: total };
  };

  const handleSubmit = async (e, action) => {
    e.preventDefault();
    // console.log("action------", formData.billing_address);

    try {
      const formDataPayload = new FormData();
      formDataPayload.append("service_name", formData.service_name);
      formDataPayload.append("company_name", formData.company_name);
      formDataPayload.append("company_address", formData.company_address); // Updated to use selected value
      formDataPayload.append("billing_address", formData.billing_address);
      formDataPayload.append("client_id", formData.client_id);
      formDataPayload.append("authority_signature", formData.authority_signature);
      formDataPayload.append("invoice_date", formData.invoice_date);
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
      formDataPayload.append("services", JSON.stringify(formData.services));
      console.log("formData.company_log", formData.company_logo)
      if (formData.company_logo){
        formDataPayload.append("company_logo", formData.company_logo);
      }

      if (action === "save" || action === "sent") {
        let req_url = `${url}/service/invoice/`;
        if (action === "sent") {
          req_url += "?sent=true";
        }
        const response = await fetch(`${req_url}`, {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
          },
          body: formDataPayload,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create invoice.");
        } else {
          alert("Invoice created successfully!");
        }
      } else if (action === "preview") {
        const response = await fetch(`${url}/service/invoice-pdf/`, {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
          },
          body: formDataPayload,
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.message || "Failed to create invoice.");
        } else {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          window.open(url, "_blank");
        }
      }
    } catch (error) {
      console.error("Error creating invoice:", error.message);
      alert("Failed to create invoice: " + error.message);
    }
  };

  const handleCreateInvoice = () => {
    navigate("/invoice-list");
  };

  return (
    <div className="bg-gray-100 p-1 sm:p-6 md:p-6 mt-12 md:mt-4 sm:mt-12">
    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mt-2 mb-2 sm:mt-4 md:mt-12 pl-4 sm:pl-12 md:pl-24">
      Create Invoice
    </h1>
    <form className="p-1 sm:p-6 md:p-8 sm:w-full lg:w-5/6 mx-auto space-y-4 sm:space-y-6 bg-white rounded-2xl sm:mt-8 md:mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div>
          <label htmlFor="service_name" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Service Name <span className="text-red-500">*</span>
          </label>
          <select
            id="service_name"
            name="service_name"
            className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
            onChange={handleChange}
            value={formData.service_name}
            required
          >
            <option value="" disabled>
              Select Service
            </option>
            {services?.map((e, key) => (
              <option key={key} value={e.name}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="company_logo" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Company Logo
          </label>
          <input
            type="file"
            id="company_logo"
            name="company_logo"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                company_logo: e.target.files[0],
              }))
            }
            className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <div>
          <label htmlFor="company_name" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Client Company Name <span className="text-red-500">*</span>
          </label>
          <input
            id="company_name"
            name="company_name"
            placeholder="Client Company Name"
            value={formData.company_name}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
            required
          />
        </div>
        <div>
          <label htmlFor="company_address" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Our Company
          </label>
          <select
            id="company_address"
            name="company_address"
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            value={formData.company_address}
          >
            <option value="" disabled>
              Select Our Company
            </option>
            {addresses.map((address) => (
              <option key={address.id} value={parseInt(address.id)}>
                {address.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="billing_address" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Billing Account <span className="text-red-500">*</span>
          </label>
          <select
            id="billing_address"
            name="billing_address"
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            value={formData.billing_address}
            required
          >
            <option value="" disabled>
              Select Account
            </option>
            {billingAddresses.map((address) => (
              <option key={address.id} value={parseInt(address.id)}>
                {address.gateway}-{address.account_number}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="client_id" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Client ID <span className="text-red-500">*</span>
          </label>
          <input
            id="client_id"
            name="client_id"
            placeholder="Client ID"
            value={formData.client_id}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            required
          />
        </div>
        <div>
          <label htmlFor="website_url" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Website URL
          </label>
          <input
            id="website_url"
            name="website_url"
            placeholder="Website URL"
            value={formData.website_url}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          />
        </div>
        <div>
          <label htmlFor="company_address" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Company Author
          </label>
          <select
            id="authority_signature"
            name="authority_signature"
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            value={formData.authority_signature}
          >
            <option value="" disabled>
              Select Author
            </option>
            {author.map((a) => (
              <option key={a.id} value={parseInt(a.id)}>
                {a.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="discount" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
          Payment Due In (Days)
          </label>
          <input
            id="invoice_date"
            name="invoice_date"
            // placeholder="Discount"
            value={formData.payment_date}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label htmlFor="address" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            rows="3"
          />
        </div>
        <div>
          <label htmlFor="client_name" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Client Name <span className="text-red-500">*</span>
          </label>
          <input
            id="client_name"
            name="client_name"
            placeholder="Client Name"
            value={formData.client_name}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            required
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            required
          />
        </div>
        <div>
          <label htmlFor="payment_status" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Payment Status <span className="text-red-500">*</span>
          </label>
          <input
            id="payment_status"
            name="payment_status"
            placeholder="Payment Status"
            value={formData.payment_status}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            required
          />
        </div>
        <div>
          <label htmlFor="client_email" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Client Email <span className="text-red-500">*</span>
          </label>
          <input
            id="client_email"
            name="client_email"
            placeholder="Client Email"
            value={formData.client_email}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            required
          />
        </div>
        <div>
          <label htmlFor="client_phone" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Client Phone No. <span className="text-red-500">*</span>
          </label>
          <input
            id="client_phone"
            name="client_phone"
            placeholder="Client Phone No."
            value={formData.client_phone}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            required
          />
        </div>
        <div>
          <label htmlFor="vat" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            VAT (%)
          </label>
          <input
            id="vat"
            name="vat"
            placeholder="VAT (%)"
            value={formData.vat}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          />
        </div>
        <div>
          <label htmlFor="discount" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Discount
          </label>
          <input
            id="discount"
            name="discount"
            placeholder="Discount"
            value={formData.discount}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="bg-gray-100 p-3 sm:p-4 rounded-2xl overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-left text-gray-700 min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-1 sm:py-2 px-2 sm:px-4">#</th>
              <th className="py-1 sm:py-2 px-2 sm:px-4">Item Name</th>
              <th className="py-1 sm:py-2 px-2 sm:px-4">Quantity</th>
              <th className="py-1 sm:py-2 px-2 sm:px-4">Currency</th>
              <th className="py-1 sm:py-2 px-2 sm:px-4">Rate</th>
              <th className="py-1 sm:py-2 px-2 sm:px-4">Time Duration</th>
              <th className="py-1 sm:py-2 px-2 sm:px-4">Price</th>
              <th className="py-1 sm:py-2 px-2 sm:px-4">Total Amount</th>
              <th className="py-1 sm:py-2 px-2 sm:px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {formData.services.map((service, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-1 sm:py-2 px-2 sm:px-4">{index + 1}</td>
                <td className="py-1 sm:py-2 px-2 sm:px-4">
                  <select
                    id={`service_name_${index}`}
                    name="service_name"
                    className="w-full px-2 sm:px-3 py-1 sm:py-2 border rounded-lg text-xs sm:text-sm"
                    onChange={(e) =>
                      handleServiceChange(index, "service_name", e.target.value)
                    }
                    value={service.service_name}
                    required
                  >
                    {services?.map((e, key) => (
                      <option key={key} value={e.name}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-1 sm:py-2 px-2 sm:px-4">
                  <input
                    type="number"
                    value={service.quantity}
                    onChange={(e) =>
                      handleServiceChange(
                        index,
                        "quantity",
                        parseInt(e.target.value, 10) || 0
                      )
                    }
                    className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
                    required
                  />
                </td>
                <td className="py-1 sm:py-2 px-2 sm:px-4">
                  <select
                    value={service.currency}
                    onChange={(e) =>
                      handleServiceChange(index, "currency", e.target.value)
                    }
                    className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
                    required
                  >
                    {["USD", "Dollar", "Rupee", "Euro", "BDT"].map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-1 sm:py-2 px-2 sm:px-4">
                  <select
                    value={service.rate}
                    onChange={(e) =>
                      handleServiceChange(index, "rate", e.target.value)
                    }
                    className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
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
                <td className="py-1 sm:py-2 px-2 sm:px-4">
                  <input
                    type="number"
                    value={service.duration}
                    onChange={(e) =>
                      handleServiceChange(
                        index,
                        "duration",
                        parseInt(e.target.value, 10) || 0
                      )
                    }
                    className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
                    required
                  />
                </td>
                <td className="py-1 sm:py-2 px-2 sm:px-4">
                  <input
                    type="number"
                    value={service.price}
                    onChange={(e) =>
                      handleServiceChange(
                        index,
                        "price",
                        parseInt(e.target.value, 10) || 0
                      )
                    }
                    className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
                    required
                  />
                </td>
                <td className="py-1 sm:py-2 px-2 sm:px-4">
                  {service?.amount?.toFixed(2)}
                </td>
                <td className="py-1 sm:py-2 px-2 sm:px-4">
                  <button
                    type="button"
                    onClick={() => removeServiceItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 sm:h-5 w-4 sm:w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          onClick={addServiceItem}
          className="mt-3 sm:mt-4 flex items-center text-purple-500 hover:text-purple-700 text-sm sm:text-base"
        >
          <PlusIcon className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2" /> Add Item
        </button>
      </div>

      <div className="text-right space-y-1 sm:space-y-2 border-t-2 border-gray-200 pt-3 sm:pt-4 border-dashed">
        <div className="flex justify-between items-center">
          <span className="text-sm sm:text-base">Sub Total:</span>
          <span>{formData.sub_total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm sm:text-base text-red-500">Discount:</span>
          <span className="text-red-500 text-sm sm:text-base">
            - {parseFloat(formData.discount || 0).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center border-b-2 border-dashed pb-2">
          <span className="text-sm sm:text-base">VAT:</span>
          <span className="text-sm sm:text-base">{formData.vat}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg sm:text-xl font-semibold">TOTAL:</span>
          <span className="text-lg sm:text-xl font-semibold">
            {formData.total_amount.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0 sm:space-x-3">
        <div>
          
            <span></span>
          
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            type="submit"
            onClick={(e) => handleSubmit(e, "save")}
            className="flex items-center px-3 sm:px-6 py-1 sm:py-2 text-black rounded-md hover:bg-green-600 transition-colors duration-300 text-sm sm:text-base"
            style={{ backgroundColor: "#D8FCCC" }}
          >
            <BsPrinter className="mr-1 sm:mr-2 h-4 sm:h-5 w-4 sm:w-5" />
            <span>Save</span>
          </button>
          <button
            type="submit"
            onClick={(e) => handleSubmit(e, "sent")}
            className="flex items-center px-3 sm:px-6 py-1 sm:py-2 text-black rounded-md hover:bg-green-600 transition-colors duration-300 text-sm sm:text-base"
            style={{ backgroundColor: "#EEE5FF" }}
          >
            <IoIosSend className="mr-1 sm:mr-2 h-4 sm:h-5 w-4 sm:w-5" />
            <span>Sent</span>
          </button>
          <button
            type="submit"
            className="flex items-center px-3 sm:px-6 py-1 sm:py-2 text-black rounded-md hover:bg-green-600 transition-colors duration-300 text-sm sm:text-base"
            onClick={(e) => handleSubmit(e, "preview")}
            style={{ backgroundColor: "#CEDBFF" }}
          >
            <IoPlayOutline className="mr-1 sm:mr-2 h-4 sm:h-5 w-4 sm:w-5" />
            <span>Preview</span>
          </button>
        </div>
      </div>
    </form>
  </div>
  );
};

export default CreateInvoice;