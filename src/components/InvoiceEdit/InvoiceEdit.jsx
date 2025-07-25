import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useToken from "../hooks/useToken";
import { BsPrinter } from "react-icons/bs";
import { IoIosSend } from "react-icons/io";
import { IoPlayOutline } from "react-icons/io5";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

const InvoiceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [defaultService, setDefaultService] = useState("");
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const fileInputRef = useRef(null);
  const [globalError, setGlobalError] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [billingAccounts, setBillingAccounts] = useState([]);
  const [author, setAuthor] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    client_invoice_id: "",
    invoice_id:"",
    client_id: "",
    client_name: "",
    date: "",
    due_date: "",
    company_name: "",
    authority_signature: "",
    website_url: "",
    client_email: "",
    client_phone: "",
    billing_address: "",
    company_address: "",
    invoice_date: "",
    service_name: "",
    sub_total: 0,
    total_amount: 0,
    services: [],
    company_logo: null,
    company_logo_name: "",
    currency: "",
    payment_terms: "",
    notes: "",
    paid_amount: 0.0,
    due_amount: 0.0,
    remove_service: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isServicesLoading, setIsServicesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [servicesError, setServicesError] = useState(null);

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
  }, [url, token]);

  // Fetch authority signatures
  useEffect(() => {
    const fetchSignature = async () => {
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
          setGlobalError("Error fetching authority signatures: " + data?.data?.message);
        }
      } catch (error) {
        setGlobalError("Error fetching authority signatures: " + error.message);
      }
    };
    fetchSignature();
  }, [url, token]);

  // Fetch currencies
  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const response = await fetch(`${url}/config/currency/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setCurrency(data?.data);
        } else {
          setGlobalError("Error fetching currencies: " + data?.data?.message);
        }
      } catch (error) {
        setGlobalError("Error fetching currencies: " + error.message);
      }
    };
    fetchCurrency();
  }, [url, token]);

  // Fetch invoice data
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
          const services = data?.data?.services.map((service) => ({
            id: service.id,
            service_name: service?.service_name,
            quantity: service.quantity,
            service_package: service?.service_package || "",
            duration: service.duration,
            price: parseFloat(service.amount) / (service.quantity || 1) || 0,
            amount: parseFloat(service.amount) || 0,
            discount: parseFloat(service.discount) || 0,
            vat: parseFloat(service.vat) || 0,
            total_amount: parseFloat(service.total_amount) || 0,
            description: service.description || "",
          }));
          const findAuthor = author.find((a) => a.title === data?.data?.authority_title);

          const fetchedData = {
            client_invoice_id: data.data.client_invoice_id || "",
            client_id: data.data.client_id || "",
            client_name: data.data.client_name || "",
            date: data.data.date ? data.data.date.split("T")[0] : "",
            due_date: data.data.due_date ? data.data.due_date.split("T")[0] : "",
            company_name: data.data.company_name || "",
            website_url: data.data.website_url || "",
            client_email: data.data.client_email || "",
            client_phone: data.data.client_phone || "",
            billing_address: data?.data?.billing_address || "",
            company_address: data?.data?.company_address || "",
            invoice_date: data?.data?.invoice_date || "",
            service_name: data?.data?.service_name || (services.length > 0 ? services[0].name : ""),
            sub_total: parseFloat(data.data.sub_total) || 0,
            total_amount: parseFloat(data.data.total_amount) || 0,
            authority_signature: findAuthor?.id || "",
            services: services,
            company_logo: null,
            company_logo_name: data.data.company_logo ? data.data.company_logo.split("/").slice(-1)[0] : "",
            currency: data?.data?.currency || "",
            payment_terms: data.data.payment_terms || "",
            notes: data.data.notes || "",
            paid_amount: parseFloat(data.data.paid_amount) || 0,
            due_amount: parseFloat(data.data.due_amount) || 0,
            remove_service: data?.data?.remove_service || "",
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
  }, [url, token, id, author]);

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
          setBillingAccounts(data.data);
        } else {
          setGlobalError("Error fetching billing addresses: " + data?.data?.message);
        }
      } catch (error) {
        setGlobalError("Error fetching billing addresses: " + error.message);
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
          setGlobalError("Error fetching company addresses: " + data?.data?.message);
        }
      } catch (error) {
        setGlobalError("Error fetching company addresses: " + error.message);
      }
    };
    fetchAddress();
  }, [url, token]);

  const handleCurrencyChange = (e) => {
    const findCurrencyName = currency?.find((a) => a.currency === e.target.value);
    setFormData((prev) => ({
      ...prev,
      currency: findCurrencyName?.currency,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      const totals = calculateTotals(updatedData);
      return { ...updatedData, ...totals };
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        company_logo: file,
        company_logo_name: file.name,
      }));
    }
  };

  const handleServiceChange = (index, field, value, id) => {
    const updatedServices = [...formData.services];

    if (field === "quantity" || field === "duration") {
      updatedServices[index][field] = parseInt(value, 10) || 0;
    }
    else if(field === "price" ){
      updatedServices[index][field] = parseFloat(value).toFixed(2) || 0;
    }
    else if (field === "discount" || field === "vat") {
      updatedServices[index][field] = parseFloat(value) || 0;
    } else {
      updatedServices[index][field] = value;
    }

    updatedServices[index].amount = (updatedServices[index].quantity || 0) * (updatedServices[index].price || 0);
    const discountAmount = (updatedServices[index].amount * (updatedServices[index].discount || 0)) / 100;
    const amountAfterDiscount = updatedServices[index].amount - discountAmount;
    const vatAmount = (amountAfterDiscount * (updatedServices[index].vat || 0)) / 100;
    updatedServices[index].total_amount = amountAfterDiscount + vatAmount;
    updatedServices[index].id = id;

    setFormData((prev) => {
      const newFormData = { ...prev, services: updatedServices };
      const totals = calculateTotals(newFormData);
      return { ...newFormData, ...totals };
    });
    setErrors((prev) => ({ ...prev, [`${field}_${index}`]: "" }));
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
          service_package: "",
          duration: 0,
          price: 0.0,
          amount: 0.0,
          discount: 0.0,
          discount_amount: 0.0,
          vat: 0.0,
          vat_amount: 0.0,
          total_amount: 0.0,
          description: "",
        },
      ],
    }));
  };

  const removeServiceItem = (index, id) => {
    const updatedServices = formData.services.filter((_, i) => i !== index);
    setFormData((prev) => {
      const removeId = id ? (prev.remove_service || "") + `${id},` : prev.remove_service;
      const newFormData = { ...prev, services: updatedServices, remove_service: removeId };
      const totals = calculateTotals(newFormData);
      return { ...newFormData, ...totals };
    });
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.includes(`_${index}`)) delete newErrors[key];
      });
      return newErrors;
    });
  };

  const calculateTotals = (data = formData) => {
    const subTotal = data.services.reduce((sum, service) => sum + (service.amount || 0), 0);
    const totalAmount = data.services.reduce((sum, service) => sum + (service.total_amount || 0), 0);
    const dueAmount = Math.max(0, totalAmount - (parseFloat(data.paid_amount) || 0));

    return {
      sub_total: parseFloat(subTotal.toFixed(2)),
      total_amount: parseFloat(totalAmount.toFixed(2)),
      due_amount: parseFloat(dueAmount.toFixed(2)),
    };
  };

  const handleSubmit = async (e, action) => {
    e.preventDefault();
    setGlobalError("");
    setErrors({});

    const newErrors = {};
    if (!formData.company_name) newErrors.company_name = "Client Company Name is required";
    if (!formData.billing_address) newErrors.billing_address = "Billing Account is required";
    if (!formData.client_id) newErrors.client_id = "Client ID is required";
    if (!formData.client_name) newErrors.client_name = "Client Name is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.currency) newErrors.currency = "Currency is required";
    if (!formData.client_email) newErrors.client_email = "Client Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.client_email)) newErrors.client_email = "Invalid email format";
    if (formData.client_phone && !/^\+?\d{7,15}$/.test(formData.client_phone))
      newErrors.client_phone = "Invalid phone number format";
    if (formData.services.length === 0) newErrors.services = "At least one service is required";
    formData.services.forEach((service, index) => {
      if (!service.service_name) newErrors[`service_name_${index}`] = "Service Name is required";
      if (service.quantity <= 0) newErrors[`quantity_${index}`] = "Quantity must be greater than 0";
      if (service.price <= 0) newErrors[`price_${index}`] = "Price must be greater than 0";
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setGlobalError("Please correct the errors in the form.");
      return;
    }

    try {
      const formDataPayload = new FormData();
      formDataPayload.append("company_name", formData.company_name);
      formDataPayload.append("company_address", formData.company_address);
      formDataPayload.append("billing_address", formData.billing_address);
      formDataPayload.append("client_id", formData.client_id);
      formDataPayload.append("website_url", formData.website_url);
      formDataPayload.append("client_name", formData.client_name);
      if (formData.authority_signature) {
        formDataPayload.append("authority_signature", formData.authority_signature);
      }
      formDataPayload.append("invoice_date", formData.invoice_date);
      formDataPayload.append("date", formData.date);
      formDataPayload.append("due_date", formData.due_date);
      formDataPayload.append("client_email", formData.client_email);
      formDataPayload.append("client_phone", formData.client_phone);
      formDataPayload.append("total_amount", +(+formData.total_amount).toFixed(2));
      formDataPayload.append("sub_total", +(+formData.sub_total).toFixed(2));
      formDataPayload.append("payment_terms", formData.payment_terms);
      formDataPayload.append("notes", formData.notes);
      formDataPayload.append("paid_amount", +(+formData.paid_amount).toFixed(2));
      formDataPayload.append("due_amount", +(+formData.due_amount).toFixed(2));
      formDataPayload.append("remove_service", formData.remove_service);

      if (currency) {
        const findCurrency = currency.find((c) => c.currency === formData.currency);
        formDataPayload.append("currency", findCurrency?.currency);
        formDataPayload.append("sign", findCurrency?.sign);
      }

      if (formData.company_logo) {
        formDataPayload.append("company_logo", formData.company_logo);
      }

      const servicesWithVat = formData.services.map((service) => ({
        ...service,
        vat: parseFloat(service.vat) || 0,
        discount: parseFloat(service.discount) || 0,
        amount: +(+service.amount).toFixed(2),
        total_amount: +(+service.total_amount).toFixed(2),
      }));
      formDataPayload.append("services", JSON.stringify(servicesWithVat));
      console.log("id---",id)

      let reqUrl = `${url}/service/invoice/?invoice_id=${(id)}`;
      if (action === "save" || action === "sent") {
        if (action === "sent") {
          reqUrl += "&sent=true";
        }
        const response = await fetch(reqUrl, {
          method: "PUT",
          headers: {
            Authorization: `Token ${token}`,
          },
          body: formDataPayload,
        });
        const data = await response.json();
        if (response.ok && data.success) {
          alert(data?.data?.message || "Invoice updated successfully!");
          navigate("/invoice-list");
        } else {
          throw new Error(data?.message || `Failed to update invoice. Status: ${response.status}`);
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
          throw new Error(errorData?.error || "Failed to generate preview.");
        }
        const blob = await response.blob();
        const urlObj = window.URL.createObjectURL(blob);
        window.open(urlObj, "_blank");
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
      setGlobalError(`Failed to generate invoice: ${error.message}`);
    }
  };

  if (isLoading || isServicesLoading) {
    return <p className="text-center py-8">Loading data...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center py-8">{error}</p>;
  }

  if (servicesError) {
    return <p className="text-red-500 text-center py-8">{servicesError}</p>;
  }

  return (
    <div className="bg-gray-100 p-1 sm:p-4 md:p-4 mt-12 md:mt-4 sm:mt-12">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mt-4 mb-2 sm:mt-4 md:mt-12 pl-2 sm:pl-10 md:pl-24">
        Edit Invoice
      </h1>
      {globalError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 mx-auto sm:w-full lg:w-full"
          role="alert"
        >
          <span className="block sm:inline">{globalError}</span>
        </div>
      )}
      <form className="p-1 sm:p-4 md:p-4 sm:w-full lg:w-full mx-auto space-y-4 sm:space-y-6 bg-white rounded-2xl sm:mt-8 md:mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="grid grid-cols-2 gap-4 sm:col-span-1">
            <div>
              <label
                htmlFor="company_name"
                className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
              >
                Client Company Name <span className="text-red-500">*</span>
              </label>
              <input
                id="company_name"
                name="company_name"
                placeholder="Client Company Name"
                value={formData.company_name}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-1 sm:py-2 border ${
                  errors.company_name ? "border-red-500" : "border-gray-300"
                } rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base`}
                required
              />
              {errors.company_name && (
                <p className="text-red-500 text-xs mt-1">{errors.company_name}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="company_logo"
                className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
              >
                Client Company Logo
              </label>
              <div className="relative">
                <input
                  id="company_logo"
                  type="file"
                  name="company_logo"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 truncate cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
                  onClick={() => fileInputRef.current.click()}
                >
                  {formData.company_logo_name || "Choose Company Logo"}
                </div>
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="company_address"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Our Company <span className="text-red-500">*</span>
            </label>
            <select
              id="company_address"
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
            <label
              htmlFor="billing_address"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Billing Account <span className="text-red-500">*</span>
            </label>
            <select
              id="billing_address"
              name="billing_address"
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-1 sm:py-2 border ${
                errors.billing_address ? "border-red-500" : "border-gray-300"
              } rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base`}
              value={formData.billing_address}
              required
            >
              <option value="" disabled>
                Select Account
              </option>
              {billingAccounts.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.gateway}-{address.account_number}
                </option>
              ))}
            </select>
            {errors.billing_address && (
              <p className="text-red-500 text-xs mt-1">{errors.billing_address}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="client_id"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Client ID <span className="text-red-500">*</span>
            </label>
            <input
              id="client_id"
              name="client_id"
              placeholder="Client ID"
              value={formData.client_id}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-1 sm:py-2 border ${
                errors.client_id ? "border-red-500" : "border-gray-300"
              } rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base`}
              required
            />
            {errors.client_id && (
              <p className="text-red-500 text-xs mt-1">{errors.client_id}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="website_url"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
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
            <label
              htmlFor="authority_signature"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
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
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="invoice_date"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Payment Due In (Days)
            </label>
            <input
              id="invoice_date"
              name="invoice_date"
              value={formData.invoice_date}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label
              htmlFor="payment_terms"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Payment Terms
            </label>
            <input
              id="payment_terms"
              name="payment_terms"
              value={formData.payment_terms}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label
              htmlFor="client_name"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Client Name <span className="text-red-500">*</span>
            </label>
            <input
              id="client_name"
              name="client_name"
              placeholder="Client Name"
              value={formData.client_name}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-1 sm:py-2 border ${
                errors.client_name ? "border-red-500" : "border-gray-300"
              } rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base`}
              required
            />
            {errors.client_name && (
              <p className="text-red-500 text-xs mt-1">{errors.client_name}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Date <span className="text-red-500">*</span>
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-1 sm:py-2 border ${
                errors.date ? "border-red-500" : "border-gray-300"
              } rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base`}
              required
            />
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">{errors.date}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="due_date"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Due Date
            </label>
            <input
              id="due_date"
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label
              htmlFor="client_email"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Client Email <span className="text-red-500">*</span>
            </label>
            <input
              id="client_email"
              name="client_email"
              placeholder="Client Email"
              value={formData.client_email}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-1 sm:py-2 border ${
                errors.client_email ? "border-red-500" : "border-gray-300"
              } rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base`}
              required
            />
            {errors.client_email && (
              <p className="text-red-500 text-xs mt-1">{errors.client_email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="client_phone"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Client Phone No.
            </label>
            <input
              id="client_phone"
              name="client_phone"
              placeholder="Client Phone No."
              value={formData.client_phone}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-1 sm:py-2 border ${
                errors.client_phone ? "border-red-500" : "border-gray-300"
              } rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base`}
            />
            {errors.client_phone && (
              <p className="text-red-500 text-xs mt-1">{errors.client_phone}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="currency"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Currency <span className="text-red-500">*</span>
            </label>
            <select
              id="currency"
              name="currency"
              onChange={handleCurrencyChange}
              className={`w-full px-3 sm:px-4 py-1 sm:py-2 border ${
                errors.currency ? "border-red-500" : "border-gray-300"
              } rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base`}
              value={formData.currency}
              required
            >
              <option value="" disabled>
                Select Currency
              </option>
              {currency.map((c) => (
                <option key={c.id} value={c.currency}>
                  {c.currency}
                </option>
              ))}
            </select>
            {errors.currency && (
              <p className="text-red-500 text-xs mt-1">{errors.currency}</p>
            )}
          </div>
        </div>

        <div className="bg-gray-100 p-3 sm:p-4 rounded-2xl overflow-x-auto">
          {errors.services && (
            <p className="text-red-500 text-xs mb-2">{errors.services}</p>
          )}
          <table className="w-full text-xs sm:text-sm text-left text-gray-700 min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-1 sm:py-2 px-2 sm:px-4">#</th>
                <th className="py-1 sm:py-2 px-2 sm:px-4">Service Name</th>
                <th className="py-1 sm:py-2 px-2 sm:px-4">Quantity</th>
                <th className="py-1 sm:py-2 px-2 sm:px-4">Package</th>
                <th className="py-1 sm:py-2 px-2 sm:px-4">Duration</th>
                <th className="py-1 sm:py-2 px-2 sm:px-4">Price</th>
                <th className="py-1 sm:py-2 px-2 sm:px-4">Amount</th>
                <th className="py-1 sm:py-2 px-2 sm:px-4">Discount (%)</th>
                <th className="py-1 sm:py-2 px-2 sm:px-4">VAT (%)</th>
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
                      className={`w-full px-2 sm:px-3 py-1 sm:py-2 border ${
                        errors[`service_name_${index}`] ? "border-red-500" : "border-gray-300"
                      } rounded-lg text-xs sm:text-sm`}
                      onChange={(e) => handleServiceChange(index, "service_name", e.target.value, service.id)}
                      value={service.service_name}
                      required
                    >
                      {services?.map((e, key) => (
                        <option key={key} value={e.name}>
                          {e.name}
                        </option>
                      ))}
                    </select>
                    {errors[`service_name_${index}`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`service_name_${index}`]}</p>
                    )}
                    <textarea
                      id={`service_description_${index}`}
                      name="description"
                      placeholder="Service Description"
                      className="w-full mt-2 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onChange={(e) => handleServiceChange(index, "description", e.target.value, service.id)}
                      value={service.description || ""}
                      rows="2"
                    />
                  </td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4">
                    <input
                      type="number"
                      value={service.quantity || ""}
                      onChange={(e) => handleServiceChange(index, "quantity", parseInt(e.target.value, 10) || 0, service.id)}
                      className={`w-full px-2 sm:px-3 py-1 sm:py-2 border ${
                        errors[`quantity_${index}`] ? "border-red-500" : "border-gray-300"
                      } rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm`}
                      required
                    />
                    {errors[`quantity_${index}`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`quantity_${index}`]}</p>
                    )}
                  </td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4">
                    <select
                      value={service.service_package || ""}
                      onChange={(e) => handleServiceChange(index, "service_package", e.target.value, service.id)}
                      className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
                    >
                      <option value="" disabled>
                        Select Package
                      </option>
                      {["Hourly", "Monthly", "Project Base", "Fixed Price"].map((service_package) => (
                        <option key={service_package} value={service_package}>
                          {service_package}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4">
                    <input
                      type="number"
                      value={service.duration || ""}
                      onChange={(e) => handleServiceChange(index, "duration", parseInt(e.target.value, 10) || 0, service.id)}
                      className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
                    />
                  </td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4">
                    <input
                      type="number"
                      step="0.01"
                      value={+(+service.price).toFixed(2) || ""}
                      onChange={(e) => handleServiceChange(index, "price", parseFloat(e.target.value) || 0, service.id)}
                      className={`w-28 px-2 sm:px-3 py-1 sm:py-2 border ${
                        errors[`price_${index}`] ? "border-red-500" : "border-gray-300"
                      } rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm`}
                      required
                    />
                    {errors[`price_${index}`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`price_${index}`]}</p>
                    )}
                  </td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4">
                    {service.amount.toFixed(2)}
                  </td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4">
                    <input
                      type="number"
                      step="0.01"
                      value={service.discount || ""}
                      onChange={(e) => handleServiceChange(index, "discount", parseFloat(e.target.value) || 0, service.id)}
                      className="w-20 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
                    />
                  </td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4">
                    <input
                      type="number"
                      step="0.01"
                      value={service.vat || ""}
                      onChange={(e) => handleServiceChange(index, "vat", parseFloat(e.target.value) || 0, service.id)}
                      className="w-20 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
                    />
                  </td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4">
                    {service.total_amount.toFixed(2)}
                  </td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4">
                    <button
                      type="button"
                      onClick={() => removeServiceItem(index, service.id)}
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
            <PlusIcon className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2" />
            Add Item
          </button>
        </div>

        <div className="text-right space-y-1 sm:space-y-2 border-t-2 border-gray-200 pt-3 sm:pt-4 border-dashed">
          {/* <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base">Sub Total:</span>
            <span>{formData.sub_total.toFixed(2)}</span>
          </div> */}
          <div className="flex justify-between items-center">
            <span className="text-lg sm:text-xl font-semibold">TOTAL:</span>
            <span className="text-lg sm:text-xl font-semibold">{formData.total_amount.toFixed(2)}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <div className="w-full sm:w-3/4">
              <label
                htmlFor="notes"
                className="block font-medium mb-1 text-sm sm:text-base text-start"
              >
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Notes – any relevant information not already covered"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-sm sm:text-base resize-none"
              />
            </div>
            <div className="w-full sm:w-1/4 flex flex-col justify-between gap-2">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="paid_amount"
                  className="text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap"
                >
                  Paid
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="paid_amount"
                  name="paid_amount"
                  placeholder="Paid Amount"
                  value={formData.paid_amount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-sm sm:text-base"
                />
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="due_amount"
                  className="text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap"
                >
                  Due
                </label>
                <input
                  type="number"
                  id="due_amount"
                  name="due_amount"
                  placeholder="Due Amount"
                  value={formData.due_amount.toFixed(2)}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-sm sm:text-base bg-gray-200"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0 sm:space-x-3">
          <div></div>
          <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "save")}
              className="flex items-center px-3 sm:px-6 py-1 sm:py-2 text-black rounded-md hover:bg-green-600 transition-colors duration-300 text-sm sm:text-base"
              style={{ backgroundColor: "#D8FCCC" }}
            >
              <BsPrinter className="mr-1 sm:mr-2 h-4 sm:h-5 w-4 sm:w-5" />
              <span>Save</span>
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "sent")}
              className="flex items-center px-3 sm:px-6 py-1 sm:py-2 text-black rounded-md hover:bg-green-600 transition-colors duration-300 text-sm sm:text-base"
              style={{ backgroundColor: "#EEE5FF" }}
            >
              <IoIosSend className="mr-1 sm:mr-2 h-4 sm:h-5 w-4 sm:w-5" />
              <span>Sent</span>
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "preview")}
              className="flex items-center px-3 sm:px-6 py-1 sm:py-2 text-black rounded-md hover:bg-green-600 transition-colors duration-300 text-sm sm:text-base"
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

export default InvoiceEdit;