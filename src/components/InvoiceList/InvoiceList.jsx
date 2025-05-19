import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineEdit } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { PiUserListLight } from "react-icons/pi";
import { CgNotes } from "react-icons/cg";
import { IoMdRefresh } from "react-icons/io";
import { BsDownload } from "react-icons/bs";
import { VscFilePdf } from "react-icons/vsc";
import { GrNotes } from "react-icons/gr";
import useToken from "../hooks/useToken";
import { useNavigate } from "react-router-dom";
import useUserPermission from "../hooks/usePermission";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD"); // Default to USD
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const navigate = useNavigate();
  const { permissions } = useUserPermission();

  const canAddInvoice = permissions.includes("service.add_invoice");
  const canEditInvoice = permissions.includes("service.change_invoice");
  const canDeleteInvoice = permissions.includes("service.delete_invoice");

  // Fetch currencies from API with token
  const fetchCurrencies = async () => {
    try {
      const response = await axios.get(`${url}/config/currency/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const currencyData = response?.data?.data.map((currency) => ({
        code: currency.currency,
        symbol: currency.sign,
      }));
      setCurrencies(currencyData);
      // Set default currency to USD if available, else first currency
      const defaultCurrency = currencyData.find((c) => c.code === "USD")?.code || currencyData[0]?.code;
      setSelectedCurrency(defaultCurrency);
    } catch (error) {
      console.error("Failed to fetch currencies:", error);
      setError("Failed to load currency data.");
    }
  };

  // Fetch invoices
  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`${url}/service/invoice/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const invoiceData = response?.data?.data.map((invoice) => ({
        id: invoice.id,
        invoiceId: invoice.client_invoice_id,
        clientId: invoice.client_id,
        client_invoice_id: invoice.client_invoice_id,
        clientName: invoice.client_name,
        billingCompanyAddress: invoice.billing_company_name,
        companyName: invoice.company_name,
        amount: invoice.total_amount,
        paidAmount: invoice.paid_amount,
        dueAmount: invoice.due_amount,
        date: invoice?.date?.split("T")[0],
        paymentMethod: invoice.gateway,
        accountNumber: invoice.account_number,
        invoice_pdf: invoice?.invoice_pdf,
        sign: invoice?.sign,
      }));
      setInvoices(invoiceData);
      setFilteredInvoices(invoiceData);
    } catch (error) {
      setError("Failed to fetch invoices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
    fetchInvoices();
  }, []);

  useEffect(() => {
    let filtered = invoices;
    if (typeof searchQuery === 'string' && searchQuery.trim() !== '') {
      filtered = filtered.filter((invoice) =>
        [
          invoice.clientName,
          invoice.clientId,
          invoice.companyName,
          invoice.invoiceId,
          invoice.billing_company_address,
        ].some((field) => {
          const fieldStr = field != null ? String(field) : '';
          return fieldStr.toLowerCase().includes(searchQuery.toLowerCase());
        })
      );
    }
    if (startDate)
      filtered = filtered.filter((invoice) => invoice.date >= startDate);
    if (endDate)
      filtered = filtered.filter((invoice) => invoice.date <= endDate);
    setFilteredInvoices(filtered);
  }, [searchQuery, startDate, endDate, invoices]);

  const openDeleteModal = (id) => {
    setSelectedInvoiceId(id);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setSelectedInvoiceId(null);
  };

  const handleDeleteInvoice = async () => {
    if (!selectedInvoiceId) return;
    try {
      const response = await fetch(
        `${url}/service/invoice/?invoice_id=${selectedInvoiceId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Token ${token}` },
        }
      );
      if (response.ok) {
        setInvoices(
          invoices.filter((invoice) => invoice.id !== selectedInvoiceId)
        );
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const handleDashboard = () => navigate("/dashboard");
  const handleCreateInvoice = () => navigate("/create-invoice");
  const handleEditInvoice = (id) => {
    navigate(`/edit-invoice/${id}`);
  };
  const handleInvoiceListToPayment = (invoice_id) => {
    navigate(`/invoice-to-payment/${invoice_id}`);
  };

  if (loading) return <div className="p-4">Loading invoices...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  const getSummaryData = () => {
    // Initialize currency-specific totals dynamically
    const currencyTotals = currencies.reduce((acc, currency) => ({
      ...acc,
      [currency.code]: {
        amount: 0,
        count: 0,
        paidAmount: 0,
        paidCount: 0,
        dueAmount: 0,
        dueCount: 0,
        symbol: currency.symbol,
      },
    }), {});

    // Sum amounts by currency for filtered invoices
    filteredInvoices.forEach((invoice) => {
      const currencyCode = currencies.find((c) => c.symbol === invoice.sign)?.code || "Unknown";
      if (currencyTotals[currencyCode]) {
        currencyTotals[currencyCode].amount += Number(invoice.amount || 0);
        currencyTotals[currencyCode].count += 1;
        currencyTotals[currencyCode].paidAmount += Number(invoice.paidAmount || 0);
        if (Number(invoice.paidAmount) > 0) {
          currencyTotals[currencyCode].paidCount += 1;
        }
        currencyTotals[currencyCode].dueAmount += Number(invoice.dueAmount || 0);
        if (Number(invoice.dueAmount) > 0) {
          currencyTotals[currencyCode].dueCount += 1;
        }
      }
    });

    return {
      currencyTotals,
      totalInvoices: filteredInvoices.length,
    };
  };

  const { currencyTotals, totalInvoices } = getSummaryData();

  const previewPDF = (invoice_pdf) => {
    window.open(`${url}${invoice_pdf}`, '_blank');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6">
        Invoice Details
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          {
            title: "INVOICE SENT",
            amount: currencyTotals[selectedCurrency]?.amount || 0,
            count: currencyTotals[selectedCurrency]?.count || 0,
            color: "text-blue-600",
            render: (
              <div className="relative">
                {/* <div className="absolute top-0 right-0">
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="text-black text-xs sm:text-sm border rounded-md p-1"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code}
                      </option>
                    ))}
                  </select>
                </div> */}
                <h2 className="text-lg sm:text-xl font-semibold">
                  {currencyTotals[selectedCurrency]?.symbol || ""}
                  {(currencyTotals[selectedCurrency]?.amount || 0).toLocaleString()}
                </h2>
              </div>
            ),
          },
          {
            title: "PAID AMOUNT",
            amount: currencyTotals[selectedCurrency]?.paidAmount || 0,
            count: currencyTotals[selectedCurrency]?.paidCount || 0,
            color: "text-blue-600",
            render: (
              <div className="relative">
                {/* <div className="absolute top-0 right-0">
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="text-black text-xs sm:text-sm border rounded-md p-1"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code}
                      </option>
                    ))}
                  </select>
                </div> */}
                <h2 className="text-lg sm:text-xl font-semibold">
                  {currencyTotals[selectedCurrency]?.symbol || ""}
                  {(currencyTotals[selectedCurrency]?.paidAmount || 0).toLocaleString()}
                </h2>
              </div>
            ),
          },
          {
            title: "DUE AMOUNT",
            amount: currencyTotals[selectedCurrency]?.dueAmount || 0,
            count: currencyTotals[selectedCurrency]?.dueCount || 0,
            color: "text-red-600",
            render: (
              <div className="relative">
                <div className="absolute top-0 right-0">
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="text-black text-xs sm:text-sm border rounded-md p-1"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code}
                      </option>
                    ))}
                  </select>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold">
                  {currencyTotals[selectedCurrency]?.symbol || ""}
                  {(currencyTotals[selectedCurrency]?.dueAmount || 0).toLocaleString()}
                </h2>
              </div>
            ),
          },
        ].map((item, index) => (
          <div key={index} className="bg-white shadow p-4 rounded-lg">
            {item.render}
            <p className="text-xs sm:text-sm text-gray-600">{item.title}</p>
            <div className={`text-xs sm:text-sm font-semibold ${item.color}`}>
              {item.count}{" "}
              {item.title.toLowerCase().includes("due")
                ? "Unpaid by clients"
                : item.title.toLowerCase().includes("paid")
                ? "Paid by clients"
                : "Invoice sent"}
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-gray-800 text-white p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
        <p className="text-sm sm:text-base">Invoice List</p>
        <div className="w-full max-w-96 sm:min-w-64">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-black px-3 py-1 sm:px-4 sm:py-2 border border-gray-700 rounded-3xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full sm:w-auto rounded-md p-1 text-black"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full sm:w-auto rounded-md p-1 text-black"
          />
        </div>
        <div className="flex gap-4 sm:ml-auto">
          {canAddInvoice && (
            <button
              className="text-lg sm:text-xl text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg relative group"
              onClick={handleCreateInvoice}
            >
              <CgNotes className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-blue-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                Create Invoice
              </span>
            </button>
          )}
          <button
            className="text-lg sm:text-xl text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg relative group"
            onClick={handleDashboard}
          >
            <PiUserListLight className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-blue-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              Dashboard
            </span>
          </button>
          <button
            className="text-lg sm:text-xl text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg relative group"
            onClick={fetchInvoices}
          >
            <IoMdRefresh className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-blue-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              Refresh
            </span>
          </button>
          <button
            className="text-lg sm:text-xl text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg relative group"
            onClick={handleDashboard}
          >
            <BsDownload className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-blue-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              Download
            </span>
          </button>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Invoice ID",
                "Client ID",
                "Client Name",
                "Company Name",
                "Amount",
                "Date",
                "Payment Method",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-700 uppercase"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm">
                  {invoice.invoiceId}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm">
                  {invoice.clientId}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm">
                  {invoice.clientName}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm">
                  {invoice.companyName}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm">
                  {invoice?.sign}{invoice?.amount}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm">
                  {invoice.date}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm">
                  {invoice.paymentMethod}-{invoice.accountNumber}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 flex gap-2 sm:gap-3 items-center">
                  {canEditInvoice && (
                    <button onClick={() => previewPDF(invoice?.invoice_pdf)}>
                      <VscFilePdf className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                    </button>
                  )}
                  {canEditInvoice && (
                    <button onClick={() => handleInvoiceListToPayment(invoice?.client_invoice_id)}>
                      <GrNotes className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                    </button>
                  )}
                  {canEditInvoice && (
                    <button onClick={() => handleEditInvoice(invoice?.client_invoice_id)}>
                      <AiOutlineEdit className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                    </button>
                  )}
                  {canDeleteInvoice && (
                    <button onClick={() => openDeleteModal(invoice.id)}>
                      <RiDeleteBin6Line className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              Confirm Deletion
            </h2>
            <p className="text-sm sm:text-base">
              Are you sure you want to delete this invoice?
            </p>
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-300 rounded-md text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteInvoice}
                className="px-4 py-2 bg-red-500 text-white rounded-md text-sm sm:text-base"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;