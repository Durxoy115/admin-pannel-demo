import React, { useEffect, useState } from "react";
import axios from "axios";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import useToken from "../hooks/useToken";

const CreateInvoice = () => {
  const [services, setServices] = useState();
  const [pdf, setPdf] = useState();
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
    total_amount: 0,
    services: [
      {
        service_name: "",
        quantity: 1,
        currency: "USD",
        rate: "Monthly",
        duration: 1,
        total_amount: 0,
      },
    ],
    discount: 0,
    vat: 0,
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

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({ ...prev, [name]: value }));
       
    console.log(name, formData)
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index][field] = value;
    updatedServices[index].totalAmount =
      updatedServices[index].quantity * updatedServices[index].duration * 200; // Sample calculation
    setFormData((prev) => ({
      ...prev,
      services: updatedServices,
    }));
  };

  const addServiceItem = () => {
    setFormData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          serviceName: "",
          quantity: 1,
          currency: "USD",
          rate: "Monthly",
          duration: 1,
          totalAmount: 0,
        },
      ],
    }));
  };

  const removeServiceItem = (index) => {
    const updatedServices = formData.services.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, services: updatedServices }));
  };

  const calculateTotals = () => {
    const subTotal = formData.services.reduce(
      (sum, service) => sum + service.totalAmount,
      0
    );
    const total =
      subTotal - formData.discount + (subTotal * formData.vat) / 100;
    return { subTotal, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { subTotal, total } = calculateTotals();

    // Create a FormData object to handle both JSON data and files
    const formDataPayload = new FormData();

    // // Append all form fields to FormData
    // formDataPayload.append("service_name", formData.service_name);
    // formDataPayload.append("company_name", formData.company_name);
    // formDataPayload.append("billing_address", formData.billing_address);
    // formDataPayload.append("client_id", formData.client_id);
    // formDataPayload.append("website_url", formData.website_url);
    // formDataPayload.append("address", formData.address);
    // formDataPayload.append("client_name", formData.client_name);
    // formDataPayload.append("date", formData.date);
    // formDataPayload.append("payment_status", formData.payment_status);
    // formDataPayload.append("client_email", formData.client_email);
    // formDataPayload.append("client_phone", formData.client_phone);
    formDataPayload.append("total_amount", total); // Use the calculated total
    formDataPayload.append("sub_total", subTotal);
    // formDataPayload.append("discount", formData.discount);
    // formDataPayload.append("vat", formData.vat);


    // Append services (you might need to serialize this as JSON or handle it differently based on server expectations)
    formDataPayload.append("services", JSON.stringify(formData.services));

    // Append the file if it exists
    if (formData.companyLogo) {
      formDataPayload.append("company_logo", formData.company_logo);
    }

    try {
      await axios.post(`${url}/service/invoice/`, formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data", // Change to multipart/form-data for file uploads
        },
      });
   
      alert("Invoice created successfully!");
     
    } catch (error) {
      console.error(
        "Error creating invoice:",
        error.response ? error.response.data : error.message
      );
      alert(
        "Failed to create invoice: " +
          (error.response ? error.response.data : error.message)
      );
    }
  };

  const { subTotal, total } = calculateTotals();

//  const handlePDFView = () =>{
//   useEffect(() => {
//     const fetchPdfPreview = async () => {
//       try {
//         const response = await fetch("http://192.168.0.131:8001/service/invoice/14/", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             // Authorization: `Token ${token}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setPdf(data?.data);
//         } else {
//           console.error("Failed to fetch user data");
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };
//     fetchPdfPreview();
//   }, []);
//  }

 const previewInvoice = async (invoiceId) => {
  try {
      const response = await fetch("http://192.168.0.131:8002/service/invoice/14/", {
          method: "GET",
          headers: {
              // "Accept": "application/pdf",
          },
      });

      if (!response.ok) {
          throw new Error("Failed to load the invoice.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank"); // Opens in a new tab
  } catch (error) {
      console.error("Error previewing invoice:", error);
  }
};
 
  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 w-full max-w-4xl mx-auto space-y-6 bg-white  rounded-2xl"
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
          />
        </div>
        <div>
          <input
            name="company_name"
            placeholder="Company Name*"
            value={formData.company_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <input
            name="billing_address"
            placeholder="Company Billing Address*"
            value={formData.billing_address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <input
            name="client_id"
            placeholder="Client ID*"
            value={formData.client_id}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <input
            name="website_url"
            placeholder="Website URL"
            value={formData.website_url}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="col-span-3">
          <textarea
            name="address"
            placeholder="Address*"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <input
            name="client_name"
            placeholder="Client Name*"
            value={formData.client_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <input
            name="payment_status"
            placeholder="Payment Status*"
            value={formData.payment_status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <input
            name="client_email"
            placeholder="Client Email*"
            value={formData.client_email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <input
            name="client_phone"
            placeholder="Client Phone No.*"
            value={formData.client_phone}
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
                  >
                    {services?.map((e, key) => {
                      return (
                        <option key={key} value={e.id}>
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
                  />
                </td>
                <td className="py-2 px-4">
                  <select
                    value={service.currency}
                    onChange={(e) =>
                      handleServiceChange(index, "currency", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  />
                </td>
                <td className="py-2 px-4">
                  ${service.total_amount.toFixed(2)}
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
        <p>Sub Total: ${subTotal.toFixed(2)}</p>
        <p className="text-red-500">
          Discount: - ${formData.discount.toFixed(2)}
        </p>
        <p>VAT: {formData.vat}%</p>
        <p className="text-xl font-semibold">TOTAL: ${total.toFixed(2)}</p>
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
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          onClick={() => previewInvoice(1)}
        >
          Preview
        </button>
      </div>
    </form>
  );
};

export default CreateInvoice;
