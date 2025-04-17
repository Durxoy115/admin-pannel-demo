import React, { useEffect, useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import useToken from "../hooks/useToken";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { BsPrinter } from "react-icons/bs";
import { IoIosSend } from "react-icons/io";
import { IoPlayOutline } from "react-icons/io5";

const CreateInvoiceFromDashboard = () => {
  const [services, setServices] = useState();
  const [defaultService, setDefaultService] = useState();
  const [addresses, setAddresses] = useState([]);
  const [billingAddresses, setBillingAddresses] = useState([]);
  const [author, setAuthor] = useState([]);
  const [vat, setVat] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [clientData, setClientData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { clientId } = useParams();
  const location = useLocation();

  const [formData, setFormData] = useState({
    service_name: "",
    company_logo: null,
    company_name: "",
    billing_address: "",
    company_address: "",
    authority_signature:"",
    invoice_date:"",
    client_id: clientId || "",
    website_url: "",
    address: "",
    client_name: "",
    date: "",
    payment_status: "",
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

  useEffect(() => {
    const fetchClientDetails = async () => {
      if (!formData.client_id) return;
      setIsLoading(true);
      try {
        const response = await fetch(`${url}/client/?client_id=${formData.client_id}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const fetchedData = {
            ...data?.data,
            photo: data?.data?.photo ? `https://admin.zgs.co.com${data.data.photo}` : null,
            contact_doc: data?.data?.contact_doc ? data.data.contact_doc : null,
          };
          setClientData(fetchedData);

          setFormData((prev) => ({
            ...prev,
            client_name: fetchedData.name || "",
            client_email: fetchedData.email || "",
            client_phone: fetchedData.contact || "",
            website_url: fetchedData.website_url || "",
            address: fetchedData.address || "",
            company_name: fetchedData.company_name || "",
          }));
        } else {
          console.error("Failed to fetch client details.", response.message);
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientDetails();
  }, [formData.client_id, token, url]);
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

  useEffect(() => {
    if (location.state?.clientId && !formData.client_id) {
      setFormData((prev) => ({ ...prev, client_id: location.state.clientId }));
    }
  }, [location.state]);

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
            setFormData((prev) => ({
              ...prev,
              service_name: data?.data[0]?.name,
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
            setDefaultService(data.data[0].name);
          }
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchServiceData();
  }, [url, token]);

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
          if (data.data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              billing_address: data.data[0].id,
            }));
          }
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
        const response = await fetch(`${url}/company/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setAddresses(data.data);
          if (data.data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              company_address: data.data[0].id,
            }));
          }
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
    const vatAmount =
      ((subTotal - discountAmount) * (parseFloat(data.vat) || 0)) / 100;
    const total = subTotal + vatAmount - discountAmount;

    return { sub_total: subTotal, total_amount: total };
  };

  const handleSubmit = async (e, action) => {
    e.preventDefault();
    console.log("action------", action);

    try {
      const formDataPayload = new FormData();
      formDataPayload.append("service_name", formData.service_name);
      formDataPayload.append("company_name", formData.company_name);
      formDataPayload.append("billing_address", formData.billing_address);
      formDataPayload.append("company_address", formData.company_address);
      formDataPayload.append("client_id", formData.client_id);
      formDataPayload.append("website_url", formData.website_url);
      formDataPayload.append("address", formData.address);
      formDataPayload.append("authority_signature", formData.authority_signature);
      formDataPayload.append("invoice_date", formData.invoice_date);
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
      if (formData.company_logo) {
        formDataPayload.append("company_logo", formData.company_logo);
      }

      if (action === "save" || action === "sent") {
        let req_url = `${url}/service/invoice/`;
        if (action === "sent") {
          req_url += "&sent=true";
        }
        const response = await fetch(req_url, {
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
    <div className="bg-gray-100 p-1 mt-4">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mt-16 pl-24">
        Create Invoice
      </h1>
      <form className="p-1 sm:p-1 md:p-8 sm:w-full lg:w-5/6 mx-auto space-y-4 sm:space-y-6 bg-white rounded-2xl sm:mt-8 md:mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-600">
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
              {services?.map((e, key) => (
                <option key={key} value={e.name}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-600">
              Company Logo
            </label>
            <input
              type="file"
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
            <label className="block text-sm sm:text-base font-medium text-gray-600">
              Client Company Name <span className="text-red-500">*</span>
            </label>
            <input
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-600">
              Our Company  <span className="text-red-500">*</span>
            </label>
            <select
              name="company_address"
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              value={formData.company_address}
              required
            >
              <option value="" disabled>
                Select Company
              </option>
              {addresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-600">
              Billing Account <span className="text-red-500">*</span>
            </label>
            <select
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
                <option key={address.id} value={address.id}>
                  {address.gateway}-{address.account_number}
                </option>
              ))}
            </select>
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
            value={formData.invoice_date}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          />
        </div> 
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-600">
              Client ID <span className="text-red-500">*</span>
            </label>
            <input
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-600">
              Website URL
            </label>
            <input
              name="website_url"
              value={formData.website_url}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-sm sm:text-base font-medium text-gray-600">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-600">
              Client Name <span className="text-red-500">*</span>
            </label>
            <input
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-600">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-600">
              Payment Status <span className="text-red-500">*</span>
            </label>
            <input
              name="payment_status"
              value={formData.payment_status}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-600">
              Client Email <span className="text-red-500">*</span>
            </label>
            <input
              name="client_email"
              value={formData.client_email}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-600">
              Client Phone No. <span className="text-red-500">*</span>
            </label>
            <input
              name="client_phone"
              value={formData.client_phone}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-600">
              VAT (%)
            </label>
            <input
              name="vat"
              value={formData.vat}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-600">
              Discount
            </label>
            <input
              name="discount"
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
                      {["USD", "Dollar", "Rupee", "Euro", "BDT"].map(
                        (currency) => (
                          <option key={currency} value={currency}>
                            {currency}
                          </option>
                        )
                      )}
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
            <label className="flex items-center space-x-2 text-gray-600 text-sm sm:text-base">
              
              <span></span>
            </label>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              type="submit"
              onClick={(e) => handleSubmit(e, "save")}
              className="flex items-center px-3 sm:px-6 py-1 sm:py-2 text-black rounded-md hover:bg-green-600 transition-colors duration-300 text-sm sm:text-base"
              style={{ backgroundColor: "#D8FCCC" }}
            >
              <BsPrinter className="mr-1 sm:mr-2 h-4 sm:h-5 w-4 sm:w-5" onClick={handleCreateInvoice} />
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

export default CreateInvoiceFromDashboard;
