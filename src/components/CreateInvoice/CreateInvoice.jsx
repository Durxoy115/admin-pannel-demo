import React, { useEffect, useState } from "react";
import axios from "axios";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import useToken from "../hooks/useToken";
import { useNavigate } from "react-router-dom";

const CreateInvoice = () => {
  const [services, setServices] = useState();
  const [defaultService, setdefaultService] = useState();
  const [vat, setVat] = useState(0);
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();
  // const [item, setItem] = useState(1);
  // const [pdf, setPdf] = useState();

  const [formData, setFormData] = useState({
    service_name: "",
    company_logo: null,
    company_name: "",
    billing_address: "",
    client_id: "",
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
            }));
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
            setdefaultService(data.data[0].name);
          }
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchServiceData();
  }, []);

  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  // const token_new = "0d76e9ba2f36fc5637e12ded4f5cb95393c50cb3";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "vat") setVat(parseFloat(value) || 0);
    if (name === "discount") setDiscount(parseFloat(value) || 0);

    // Recalculate totals when vat or discount changes
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
      const newFormData = {
        ...prev,
        services: updatedServices,
      };
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

  const local_url = "http://192.168.0.131:8002";


// SUBMIT B________

  const handleSubmit = async (e, action) => {
    
    e.preventDefault();

    try {
      const formDataPayload = new FormData();

      // Append all form fields to FormData
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
      formDataPayload.append("total_amount", formData.total_amount); // Use the calculated total
      formDataPayload.append("sub_total", formData.sub_total);
      formDataPayload.append("discount", formData.discount);
      formDataPayload.append("vat", formData.vat);
      formDataPayload.append("company_logo", formData.company_logo);

      // if (formData?.companyLogo) {
      //   formDataPayload.append("company_logo", formData.company_logo);
      // }
      // Append services (you might need to serialize this as JSON or handle it differently based on server expectations)
      formDataPayload.append("services", JSON.stringify(formData.services));
      if (action==="save"){
        const response = await fetch(`${local_url}/service/invoice/`, {
          method: "POST",
          headers: {
            Authorization: `Token ${token_new}`, // Do NOT manually set Content-Type
          },
          body: formDataPayload, // FormData automatically sets the right Content-Type
        });

        if (!response.status) {
          const errorData = await response.json(); // Read error response only once
          throw new Error(errorData.message || "Failed to create invoice.");
        } else {
          // If c, assume response is a file (PDF)
          alert("success")
        }
      }
      else if (action==="preview") {
        {
          const response = await fetch(`${url}/service/invoice-pdf/`, {
            method: "POST",
            headers: {
              Authorization: `Token ${token}`, // Do NOT manually set Content-Type
            },
            body: formDataPayload, // FormData automatically sets the right Content-Type
          });
  
          if (!response.status) {
            const errorData = await response.json(); // Read error response only once
            alert(errorData.message || "Failed to create invoice.");
          } else {
            // If successful, assume response is a file (PDF)
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");
          }
        }
      }
      // alert("Invoice created successfully!");
    } catch (error) {
      console.error("Error creating invoice:", error.message);
      alert("Failed to create invoice: " + error.message);
    }
  };



  const handleCreateInvoice = () => {
    navigate("/invoice-list");
  };

  return (
    <form
      onSubmit={(e)=> handleSubmit(e , "save")}
      className="p-8 w-2/3 mx-auto space-y-6 bg-white  rounded-2xl mt-2"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Create Invoice</h1>
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
          {services?.map((e, key) => {
            return (
              <option key={key} value={e.name}>
                {e.name}
              </option>
            );
          })}
        </select>
        <div>
          <input
            type="file"
            name="company_logo"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                company_logo: e.target.files[0],
              }))
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
        <div>
          <input
            name="vat"
            placeholder="vat"
            value={formData.vat}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <input
            name="discount"
            placeholder="Discount"
            value={formData.discount}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    {services?.map((e, key) => {
                      return (
                        <option key={key} value={e.name}>
                          {e.name}
                        </option>
                      );
                    })}
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
                  ${service?.amount?.toFixed(2)}
                </td>
                <td className="py-2 px-4">
                  <button
                    type="button"
                    onClick={() => removeServiceItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
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
          <PlusIcon className="h-5 w-5 mr-2" /> Add Item
        </button>
      </div>

      <div className="text-right space-y-2 border-t border-gray-200 pt-4">
        <p>Sub Total: ${formData.sub_total.toFixed(2)}</p>
        <p className="text-red-500">
          Discount: - ${parseFloat(formData.discount || 0).toFixed(2)}
        </p>
        <p>VAT: {formData.vat}%</p>
        <p className="text-xl font-semibold">
          TOTAL: ${formData.total_amount.toFixed(2)}
        </p>
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
          // onClick={handleCreateInvoice}//
        >
          Save
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
          onClick={handleCreateInvoice}
        >
          Sent
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          onClick={(e)=> handleSubmit(e , "preview")}
        >
          Preview
        </button>
      </div>
    </form>
  );
};

export default CreateInvoice;
