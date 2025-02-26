  import React from "react";

  const Invoice = () => {
    return (
      <div className="p-5 w-full max-w-4xl mx-auto border border-gray-300 shadow-md">
        <div className="flex justify-between items-center mb-5 border-b-2 border-black pb-2">
          <h1 className="text-2xl font-bold text-black">INVOICE</h1>
          <span className="text-lg text-black">#214535</span>
        </div>

        <div className="flex justify-between mb-5">
          <div className="w-1/2">
            <img
              src="placeholder-logo.png" // Replace with the actual ZMS Global Solutions logo or path
              alt="Company Logo"
              className="w-24 mb-2"
            />
            <h2 className="text-lg font-bold mb-1 text-black">Bishal Bas</h2>
            <p className="text-sm text-gray-600">ID: 54455</p>
            <p className="text-sm text-gray-600">Date: 23/04/2024</p>
            <p className="text-sm text-gray-600">Company Name: Generic</p>
            <p className="text-sm text-gray-600">
              Company Address: 207, Prem Sagar Appt., Near Income Tax Office, Ashram Road, Ahmedabad - 380005
            </p>
            <p className="text-sm text-gray-600">Services: Ludo App</p>
          </div>
          <div className="w-1/2">
            <h2 className="text-lg font-bold mb-1 text-black">Billing Address</h2>
            <p className="text-sm text-gray-600">Bank Name: IFIC Bank</p>
            <p className="text-sm text-gray-600">Branch: Mohammadpur Bus Stand</p>
            <p className="text-sm text-gray-600">Account Name: Zay Global Solutions</p>
            <p className="text-sm text-gray-600">Account No.: 352627283872</p>
            <p className="text-sm text-gray-600">Routing No.: 352627</p>
            <p className="text-sm text-gray-600">
              Company Address: 207, Prem Sagar Appt., Near Income Tax Office, Ashram Road, Ahmedabad - 380005
            </p>
          </div>
        </div>

        <table className="w-full border-collapse mb-5">
          <thead>
            <tr className="text-center">
              <th className="py-2 px-4 bg-gray-200 font-bold text-sm text-gray-700">Services Name</th>
              <th className="py-2 px-4 bg-gray-200 font-bold text-sm text-gray-700">Quantity</th>
              <th className="py-2 px-4 bg-gray-200 font-bold text-sm text-gray-700">Rate</th>
              <th className="py-2 px-4 bg-gray-200 font-bold text-sm text-gray-700">Time Duration</th>
              <th className="py-2 px-4 bg-gray-200 font-bold text-sm text-gray-700">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td className="py-2 px-4 text-sm text-gray-600">Ludo App</td>
              <td className="py-2 px-4 text-sm text-gray-600">x 1</td>
              <td className="py-2 px-4 text-sm text-gray-600">Monthly</td>
              <td className="py-2 px-4 text-sm text-gray-600">6 Months</td>
              <td className="py-2 px-4 text-sm text-gray-600">$1200.00</td>
            </tr>
            <tr className="text-center">
              <td className="py-2 px-4 text-sm text-gray-600">King App</td>
              <td className="py-2 px-4 text-sm text-gray-600">x 5</td>
              <td className="py-2 px-4 text-sm text-gray-600">Monthly</td>
              <td className="py-2 px-4 text-sm text-gray-600">6 Months</td>
              <td className="py-2 px-4 text-sm text-gray-600">$1200.00</td>
            </tr>
            <tr className="text-center">
              <td className="py-2 px-4 text-sm text-gray-600">Joda akber App</td>
              <td className="py-2 px-4 text-sm text-gray-600">x 2</td>
              <td className="py-2 px-4 text-sm text-gray-600">Monthly</td>
              <td className="py-2 px-4 text-sm text-gray-600">6 Months</td>
              <td className="py-2 px-4 text-sm text-gray-600">$1200.00</td>
            </tr>
            <tr className="text-center">
              <td className="py-2 px-4 text-sm text-gray-600">Idiot App</td>
              <td className="py-2 px-4 text-sm text-gray-600">x 1</td>
              <td className="py-2 px-4 text-sm text-gray-600">Monthly</td>
              <td className="py-2 px-4 text-sm text-gray-600">6 Months</td>
              <td className="py-2 px-4 text-sm text-gray-600">$1200.00</td>
            </tr>
          </tbody>
        </table>

        <div className="text-right space-y-2 border-t border-gray-300 pt-4">
          <div className="border-t border-b border-dashed" 
            // style={{
            //   borderBottom: "1px dashed gray"
            // }}
          >
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Sub Total</p>
              <p className="text-sm text-gray-600 amount">$1200.00</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-red-500">Discount</p>
              <p className="text-sm text-red-500 amount">- $20.00</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Vat</p>
              <p className="text-sm text-red-500 amount">5 %</p>
            </div>
          </div>
          <div className="flex justify-between items-center border-b border-dashed" 
            // style={{
            //   borderBottom: "1px dashed gray"
            // }}
          >
            <p className="text-lg font-semibold text-black">TOTAL</p>
            <p className="text-xl font-bold text-black">$4800.00</p>
          </div>
        </div>

        <div className="flex justify-between mt-5 border-gray-300 pt-4">
          <p className="text-sm text-gray-600 border-t border-dashed">Client Signature</p>
          <p className="text-sm text-gray-600 border-t border-dashed">Authority Signature</p>
        </div>

        <div className="  text-right mt-5 text-sm text-gray-600">
          <div className="flex justify-between items-center">
          <div>
          <p>Payment is required within 7 days of invoice date.</p>
          </div>
          </div>
       <div>
           
       <p>Email: Z0S@gmail.com</p>
          <p>Phone Number: +88013214335</p>
       </div>
        </div>
      </div>
    );
  };

  export default Invoice;