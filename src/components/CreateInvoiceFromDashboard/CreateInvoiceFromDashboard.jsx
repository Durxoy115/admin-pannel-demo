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
  const [currency, setCurrency] = useState([]);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [clientData, setClientData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [vat, setVat] = useState(0);
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();
  const { clientId } = useParams();
  const location = useLocation();

  const [formData, setFormData] = useState({
    id: "",
    service_name: "",
    company_logo: null,
    company_name: "",
    billing_address: "",
    company_address: "",
    authority_signature: "",
    invoice_date: "",
    client_id: clientId || "",
    website_url: "",
    address: "",
    client_name: "",
    date: "",
    due_date: "",
    client_email: "",
    client_phone: "",
    sub_total: 0.00,
    total_amount: 0.00,
    services: [],
    discount: 0.0,
    vat: 0.0,
    payment_terms:"",
    currency: "",
    notes: "",
    paid_amount: 0.00,
    due_amount: 0.00,
  });

  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.company_name)
      newErrors.company_name = "Client Company Name is required";
    if (!formData.billing_address)
      newErrors.billing_address = "Billing Account is required";
    if (!formData.client_id) newErrors.client_id = "Client ID is required";
    if (!formData.client_name)
      newErrors.client_name = "Client Name is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.currency) newErrors.currency = "Currency is required";
    if (!formData.client_email)
      newErrors.client_email = "Client Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.client_email))
      newErrors.client_email = "Invalid email format";
    if (!formData.client_phone)
      newErrors.client_phone = "Client Phone No. is required";
    if (formData.services.length === 0)
      newErrors.services = "At least one service is required";
    formData.services.forEach((service, index) => {
      if (!service.service_name)
        newErrors[`service_name_${index}`] = "Service Name is required";
      if (service.quantity <= 0)
        newErrors[`quantity_${index}`] = "Quantity must be greater than 0";
      if (service.price <= 0)
        newErrors[`price_${index}`] = "Price must be greater than 0";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchClientDetails = async () => {
      if (!formData.client_id) return;
      setIsLoading(true);
      try {
        const response = await fetch(
          `${url}/client/?client_id=${formData.client_id}`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const fetchedData = {
            ...data?.data,
            photo: data?.data?.photo ? `${url}${data.data.photo}` : null,
            contact_doc: data?.data?.contact_doc ? data.data.contact_doc : null,
          };
          setClientData(fetchedData);

          setFormData((prev) => ({
            ...prev,
            client_name: fetchedData.name || "",
            client_email: fetchedData.email || "",
            client_phone: fetchedData.contact || "",
            website_url: fetchedData.website_url || "",
            // address: fetchedData.address || "",
            company_name: fetchedData.company_name || "",
          }));
        } else {
          console.error("Failed to fetch client details.", response?.message);
          setGlobalError("Failed to fetch client details.");
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
        setGlobalError("Error fetching client data: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientDetails();
  }, [formData.client_id, token, url]);

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
        const data = await response.json();
        if (response.ok && data.success) {
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
                  service_package: "Monthly",
                  duration: 0,
                  price: 0,
                  amount: 0,
                  description: "",
                },
              ],
            }));
            setDefaultService(data.data[0].name);
          }
        } else {
          setGlobalError("Failed to fetch service data");
        }
      } catch (error) {
        setGlobalError("Error fetching service data: " + error.message);
      }
    };
    fetchServiceData();
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
          setGlobalError(
            "Error fetching authority signatures: " + data.message
          );
        }
      } catch (error) {
        setGlobalError("Error fetching authority signatures: " + error.message);
      }
    };
    fetchAddress();
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
          setGlobalError(
            "Error fetching billing addresses: " + data?.data?.message
          );
        }
      } catch (error) {
        setGlobalError("Error fetching billing addresses: " + error?.message);
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
          setGlobalError("Error fetching company addresses: " + data.message);
        }
      } catch (error) {
        setGlobalError("Error fetching company addresses: " + error?.message);
      }
    };
    fetchAddress();
  }, [url, token]);

  useEffect(() => {
    const fetchAddress = async () => {
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
          setGlobalError("Error fetching company addresses: " + data?.message);
        }
      } catch (error) {
        setGlobalError("Error fetching company addresses: " + error?.message);
      }
    };
    fetchAddress();
  }, [url, token]);

  useEffect(() => {
    if (location.state?.clientId && !formData.client_id) {
      setFormData((prev) => ({ ...prev, client_id: location.state.clientId }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "vat") setVat(parseFloat(value) || 0);
    if (name === "discount") setDiscount(parseFloat(value) || 0);
    if (name === "paid_amount") {
      const dueAmount = Math.max(
        0,
        formData.total_amount - parseFloat(value) || 0
      );
      setFormData((prev) => ({
        ...prev,
        paid_amount: parseFloat(value) || 0,
        due_amount: dueAmount,
      }));
    }

    setFormData((prev) => {
      const totals = calculateTotals({ ...prev, [name]: value });
      return { ...prev, ...totals, [name]: value };
    });
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index][field] = value;
    updatedServices[index].amount =
      updatedServices[index].quantity * updatedServices[index].price;

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
          service_name: defaultService,
          quantity: 0,
          currency: "USD",
          service_package: "Monthly",
          duration: 0,
          price: 0,
          amount: 0,
          description: "",
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
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.includes(`_${index}`)) delete newErrors[key];
      });
      return newErrors;
    });
  };

  const calculateTotals = (data = formData) => {
    const subTotal = data.services.reduce(
      (sum, service) => sum + (service.amount || 0),
      0
    );
    const discountAmount = (subTotal * (parseFloat(data.discount) || 0)) / 100;
    const vatAmount =
      ((subTotal - discountAmount) * (parseFloat(data.vat) || 0)) / 100;
    const total = subTotal - discountAmount + vatAmount;
    const dueAmount = Math.max(0, total - (parseFloat(data.paid_amount) || 0));

    return { sub_total: subTotal, total_amount: total, due_amount: dueAmount };
  };

  const handleSubmit = async (e, action) => {
    e.preventDefault();
    setGlobalError("");
    setErrors({});

    if (!validateForm()) {
      setGlobalError("Please correct the errors in the form.");
      return;
    }

    try {
      const formDataPayload = new FormData();
      formDataPayload.append("company_name", formData.company_name);
      formDataPayload.append("billing_address", formData.billing_address);
      formDataPayload.append("company_address", formData.company_address);
      formDataPayload.append("client_id", formData.client_id);
      formDataPayload.append("website_url", formData.website_url);
      // formDataPayload.append("address", formData.address);
      formDataPayload.append(
        "authority_signature",
        formData.authority_signature
      );
      formDataPayload.append("invoice_date", formData.invoice_date);
      formDataPayload.append("client_name", formData.client_name);
      formDataPayload.append("date", formData.date);
      formDataPayload.append("due_date", formData.due_date);
      formDataPayload.append("client_email", formData.client_email);
      formDataPayload.append("client_phone", formData.client_phone);
      formDataPayload.append("total_amount", +(+formData.total_amount).toFixed(2));
      formDataPayload.append("sub_total", +(+formData.sub_total).toFixed(2));
      formDataPayload.append("discount", formData.discount);
      formDataPayload.append("vat", formData.vat);
      formDataPayload.append("payment_terms", formData.payment_terms);
      formDataPayload.append("notes", formData.notes);
      formDataPayload.append("paid_amount", +(+formData?.paid_amount)?.toFixed(2));
      
      formDataPayload.append("due_amount", +(+formData.due_amount).toFixed(2));
      if (currency) {
        const findCurrency = currency.find((c) => c.id == formData.currency);
        formDataPayload.append("currency", findCurrency.currency);
        formDataPayload.append("sign", findCurrency.sign);
      }
      formDataPayload.append("services", JSON.stringify(formData.services));
      if (formData.company_logo) {
        formDataPayload.append("company_logo", formData.company_logo);
      }
      

      if (action === "save" || action === "sent") {
        let req_url = `${url}/service/invoice/`;
        if (action === "sent") {
          req_url += "?sent=true";
        }
        const response = await fetch(req_url, {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
          },
          body: formDataPayload,
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to create invoice.");
        } else {
          alert("Invoice created successfully!");
          navigate("/invoice-list");
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
          throw new Error(errorData.message || "Failed to generate preview.");
        } else {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          window.open(url, "_blank");
        }
      }
    } catch (error) {
      setGlobalError("Failed to create invoice: " + error.message);
    }
  };

  return (
    <div className="bg-gray-100 p-1 sm:p-6 md:p-6 mt-12 md:mt-4 sm:mt-12">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mt-4 mb-2 sm:mt-4 md:mt-12 pl-2 sm:pl-10 md:pl-24">
        Create Invoice
      </h1>
      {globalError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 mx-auto sm:w-full lg:w-5/6"
          role="alert"
        >
          <span className="block sm:inline">{globalError}</span>
        </div>
      )}
      {isLoading && <div className="text-center">Loading client data...</div>}
      <form className="p-1 sm:p-6 md:p-8 sm:w-full lg:w-5/6 mx-auto space-y-4 sm:space-y-6 bg-white rounded-2xl sm:mt-8 md:mt-8">
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
                <p className="text-red-500 text-xs mt-1">
                  {errors.company_name}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="company_logo"
                className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
              >
                Client Company Logo
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
              {billingAddresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.gateway}-{address.account_number}
                </option>
              ))}
            </select>
            {errors.billing_address && (
              <p className="text-red-500 text-xs mt-1">
                {errors.billing_address}
              </p>
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
                <option key={a.id} value={parseInt(a.id)}>
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
              htmlFor="invoice_date"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Payment Terms
            </label>
            <input
              id="payment_terms"
              name="payment_terms"
              value={formData?.payment_terms}
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
              Client Phone No. <span className="text-red-500"></span>
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
              htmlFor="vat"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
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
            <label
              htmlFor="discount"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Discount (%)
            </label>
            <input
              id="discount"
              name="discount"
              placeholder="Discount (%)"
              value={formData.discount}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
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
              onChange={handleChange}
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
                <option key={c.id} value={parseInt(c.id)}>
                  {c.currency}
                </option>
              ))}
            </select>
            {errors.currency && (
              <p className="text-red-500 text-xs mt-1">{errors.currency}</p>
            )}
          </div>
          {/* <div className="sm:col-span-2 lg:col-span-3">
            <label
              htmlFor="address"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              rows="3"
            />
          </div> */}
        </div>

        <div className="bg-gray-100 p-3 sm:p-4 rounded-2xl overflow-x-auto">
          {errors.services && (
            <p className="text-red-500 text-xs mb-2">{errors.services}</p>
          )}
          <table className="w-full text-xs sm:text-sm text-left text-gray-700 min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-1 sm:py-2 px-2 sm:px-4">#</th>
                <th className="py-1 sm:py-2 px-2 sm:px-4">Service Name</th>
                <th className="py-1 sm:py-2 px-2 sm:px-4">Quantity</th>
                <th className="py-1 sm:py-2 px-2 sm:px-4">Package</th>
                <th className="py-1 sm:py-2 px-2 sm:px-4">Duration</th>
                <th className="py-1 sm:py-2 px-2 sm:px-4">Price</th>
                <th className="py-1 sm:py-2 px-2 sm:px-4">Amount</th>
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
                        errors[`service_name_${index}`]
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg text-xs sm:text-sm`}
                      onChange={(e) =>
                        handleServiceChange(
                          index,
                          "service_name",
                          e.target.value
                        )
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
                    {errors[`service_name_${index}`] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[`service_name_${index}`]}
                      </p>
                    )}
                    <textarea
                      id={`service_description_${index}`}
                      name="description"
                      placeholder="Service Description"
                      className="w-full mt-2 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onChange={(e) =>
                        handleServiceChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      value={service.description || ""}
                      rows="2"
                    />
                  </td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4">
                    <input
                      type="number"
                      value={service.quantity || ""}
                      onChange={(e) =>
                        handleServiceChange(
                          index,
                          "quantity",
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                      className={`w-full px-2 sm:px-3 py-1 sm:py-2 border ${
                        errors[`quantity_${index}`]
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm`}
                      required
                    />
                    {errors[`quantity_${index}`] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[`quantity_${index}`]}
                      </p>
                    )}
                  </td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4">
                    <select
                      value={service?.service_package}
                      onChange={(e) =>
                        handleServiceChange(index, "service_package", e.target.value)
                      }
                      className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
                      required
                    >
                      {["Hourly", "Monthly", "Project Base", "Fixed Price"].map(
                        (service_package) => (
                          <option key={service_package} value={service_package}>
                            {service_package}
                          </option>
                        )
                      )}
                    </select>
                  </td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4">
                    <input
                      type="number"
                      value={service?.duration ? parseInt(service?.duration, 10) || 0 : ""}
                      onChange={(e) =>
                        handleServiceChange(
                          index,
                          "duration",
                          parseInt(e.target.value, 10) || ""
                        )
                      }
                      className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
                      
                    />
                  </td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4">
                    <input
                      type="number"
                      value={+(+service.price ).toFixed(2)|| ""}
                      onChange={(e) =>
                        handleServiceChange(
                          index,
                          "price",
                          parseFloat(e.target.value, 10).toFixed(2) || 0
                        )
                      }
                      className={`w-full px-2 sm:px-3 py-1 sm:py-2 border ${
                        errors[`price_${index}`]
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm`}
                      required
                    />
                    {errors[`price_${index}`] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[`price_${index}`]}
                      </p>
                    )}
                  </td>
                  <td className="py-1 sm:py-2 px-2 sm:px-4">
                    {+(+(service?.amount)?.toFixed(2))}
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
            <span className="text-sm sm:text-base text-red-500">
              Discount ({formData.discount}%):
            </span>
            <span className="text-red-500 text-sm sm:text-base">
              -{" "}
              {(
                (formData.sub_total * (parseFloat(formData.discount) || 0)) /
                100
              ).toFixed(2)}
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

export default CreateInvoiceFromDashboard;
