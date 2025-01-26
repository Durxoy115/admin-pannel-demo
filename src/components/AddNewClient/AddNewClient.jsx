import React from "react";
import { useNavigate } from "react-router-dom";

const AddNewClient = () => {
  const navigate = useNavigate();

  const handleSave = async (formData) => {
    try {
      const response = await fetch("https://admin.zgs.co.com/client/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token 4bc2a75c04006d4e540a8b38f86612dc0b1da466",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
        navigate("/dashboard", { state: { reload: true } });
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert(errorData.detail || "Failed to add client");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleClose = () => {
    navigate("/dashboard");
  };

  return (
    <div className="">
      <div className=" p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-6">Add New Client</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = {
              clientName: e.target.clientName.value,
              clientMobile: e.target.clientMobile.value,
              clientEmail: e.target.clientEmail.value,
              country: e.target.country.value,
              companyName: e.target.companyName.value,
              companyUrl: e.target.companyUrl.value,
              clientId: e.target.clientId.value,
              currency: e.target.currency.value,
              contactPerson: e.target.contactPerson.value,
              notes: e.target.notes.value,
              address: e.target.address.value,
            };
            handleSave(formData);
          }}
        >
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="clientName" className="block mb-2 font-medium">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="clientMobile" className="block mb-2 font-medium">
                Mobile <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="clientMobile"
                name="clientMobile"
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="clientEmail" className="block mb-2 font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="clientEmail"
                name="clientEmail"
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="country" className="block mb-2 font-medium">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="country"
                name="country"
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="companyName" className="block mb-2 font-medium">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="companyUrl" className="block mb-2 font-medium">
                Company URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="companyUrl"
                name="companyUrl"
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="clientId" className="block mb-2 font-medium">
                Client ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="clientId"
                name="clientId"
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="currency" className="block mb-2 font-medium">
                Currency <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="currency"
                name="currency"
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="contactPerson" className="block mb-2 font-medium">
                Contact Person <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
           
         
          </div>
          <div>
              <label htmlFor="notes" className="block mb-2 font-medium">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                className="w-full px-4 py-2 border rounded-lg"
              ></textarea>
            </div>
            <div>
              <label htmlFor="address" className="block mb-2 font-medium">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows="3"
                className="w-full px-4 py-2 border rounded-lg"
              ></textarea>
            </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewClient;
