// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// const InvoiceEdit = () => {
//   const { invoiceId } = useParams();
//   const navigate = useNavigate();
//   const [invoiceData, setInvoiceData] = useState(null);

//   useEffect(() => {
//     // Dummy API call simulation
//     fetch(`https://dummyjson.com/invoices/${invoiceId}`)
//       .then((res) => res.json())
//       .then((data) => setInvoiceData(data))
//       .catch((error) => console.error("Error fetching invoice data:", error));
//   }, [invoiceId]);

//   const generatePDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(18);
//     doc.text("Invoice Details", 14, 22);
//     doc.setFontSize(12);

//     if (invoiceData) {
//       doc.autoTable({
//         startY: 30,
//         head: [["Field", "Value"]],
//         body: [
//           ["Invoice ID", invoiceData.id],
//           ["Client ID", invoiceData.clientId],
//           ["Client Name", invoiceData.clientName],
//           ["Company Name", invoiceData.companyName],
//           ["Amount", `${invoiceData.amount} ${invoiceData.currency}`],
//           ["Date", invoiceData.date],
//           ["Payment Method", invoiceData.paymentMethod],
//           ["Payment Status", invoiceData.paymentStatus],
//         ],
//       });
//       doc.save(`Invoice_${invoiceData.id}.pdf`);
//     }
//   };

//   if (!invoiceData) return <p>Loading invoice details...</p>;

//   return (
//     <div className="w-full flex flex-col items-center justify-center">
//       <div className="w-full max-w-4xl">
//         <h2 className="text-3xl font-semibold mb-8">Edit Invoice</h2>
//         <div className="grid grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow">
//           <p>
//             <strong>Invoice ID:</strong> {invoiceData.id}
//           </p>
//           <p>
//             <strong>Client ID:</strong> {invoiceData.clientId}
//           </p>
//           <p>
//             <strong>Client Name:</strong> {invoiceData.clientName}
//           </p>
//           <p>
//             <strong>Company Name:</strong> {invoiceData.companyName}
//           </p>
//           <p>
//             <strong>Amount:</strong> {invoiceData.amount} {invoiceData.currency}
//           </p>
//           <p>
//             <strong>Date:</strong> {invoiceData.date}
//           </p>
//           <p>
//             <strong>Payment Method:</strong> {invoiceData.paymentMethod}
//           </p>
//           <p>
//             <strong>Payment Status:</strong> {invoiceData.paymentStatus}
//           </p>
//         </div>

//         <div className="flex justify-center items-center space-x-4 mt-6">
//           <button
//             className="px-6 py-2 bg-gray-500 text-white rounded-lg"
//             onClick={() => navigate("/invoice-list")}
//           >
//             Back
//           </button>
//           <button
//             className="px-6 py-2 bg-green-500 text-white rounded-lg"
//             onClick={generatePDF}
//           >
//             Download PDF
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoiceEdit; 