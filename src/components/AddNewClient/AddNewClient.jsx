import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TfiPlus } from "react-icons/tfi";

const AddNewClient = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    navigate("/dashboard");
  };

  return (
    <div className="w-full  flex items-center justify-center">
      <div className="w-full ">
        <h2 className="text-3xl font-semibold mb-8 ml-64 ">Add New Client</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = {
              name: e.target.clientName.value,
              contact: e.target.clientMobile.value,
              email: e.target.clientEmail.value,
              country: e.target.country.value,
              company_name: e.target.companyName.value,
              wensite_url: e.target.companyUrl.value,
              client_id: e.target.clientId.value,
              contact_person: e.target.contactPerson.value,
              address: e.target.address.value,
            };
            handleSave(formData);
          }}
        >
          <div className="grid grid-cols-3 gap-6 ">
            <div className="flex flex-col items-center col-span-1 ms-auto">
              <label
                htmlFor="imageUpload"
                className="cursor-pointer flex flex-col items-center justify-center text-gray-300 bg-gray-100 rounded-md w-28 h-28 border-dashed border-2 border-gray-300 "
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <TfiPlus className="text-4xl" />
                )}
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-6">
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
                  Client Mobile Number <span className="text-red-500">*</span>
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
                 Client Email <span className="text-red-500">*</span>
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
                <label htmlFor="companyName" className="block mb-2 font-medium">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
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
                <label htmlFor="companyUrl" className="block mb-2 font-medium">
                  Website URL
                </label>
                <input
                  type="url"
                  id="companyUrl"
                  name="companyUrl"
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
  <select
    id="currency"
    name="currency"
    required
    className="w-full px-4 py-2 border rounded-lg"
  >
    <option value="" disabled selected>
      Select Currency
    </option>
    <option value="USD">USD </option>
    <option value="CAD">CAD </option>
    <option value="AUD">AUD</option>
    <option value="BDT">BDT</option>
    <option value="INR">INR</option>
    <option value="GBP">GBP</option>
    <option value="RUB">RUB</option>
    <option value="EUR">EUR</option>
    <option value="JPY">JPY</option>
    <option value="CNY">CNY</option>
  </select>
</div>


              <div>
                <label htmlFor="contactPerson" className="block mb-2 font-medium">
                  Contact Person
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
  <label htmlFor="contractDocument" className="block mb-2 font-medium">
    Contract Document <span className="text-red-500">*</span>
  </label>
  <input
    type="file"
    id="contractDocument"
    name="contractDocument"
    accept=".pdf,.doc,.docx"
    required
    className="w-full px-4 py-2 border rounded-lg"
  />
</div>

              <div className="col-span-2">
                <label htmlFor="address" className="block mb-2 font-medium">
                  Notes
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg"
                ></textarea>
              </div>
              <div className="col-span-2">
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
            </div>
            
          </div>
          <div className="flex justify-end space-x-4 mt-6 mb-10">
            <button
              type="button"
              className="px-6 py-2 bg-red-600 text-white rounded-lg"
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
