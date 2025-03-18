import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";

const ClientProfile = ({ id }) => {
  const navigate = useNavigate();
  const { id: paramId } = useParams(); // Get id from URL params if not passed as prop
  const clientId = id || paramId; // Use prop id if available, otherwise use paramId
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const fileInputRef = useRef(null);
  const docInputRef = useRef(null);

  const [clientData, setClientData] = useState({
    name: "",
    contact: "",
    email: "",
    company_name: "",
    country: "",
    website_url: "",
    contact_person: "",
    address: "",
    photo: null, // URL or null
    contact_doc: null, // URL or null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [photoFile, setPhotoFile] = useState(null); // For new photo upload
  const [docFile, setDocFile] = useState(null); // For new document upload
  const [docFileName, setDocFileName] = useState(""); // Display document file name

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await fetch(`${url}/client/?client_id=${clientId}`, {
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
          setDocFileName(
            data?.data?.contact_doc ? data.data.contact_doc.split('/').slice(-1)[0] : ""
          );
        } else {
          console.error("Failed to fetch client details.");
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientDetails();
  }, [clientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setClientData((prev) => ({ ...prev, photo: URL.createObjectURL(file) }));
    }
  };

  const handleDocChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocFile(file);
      setDocFileName(file.name);
      setClientData((prev) => ({ ...prev, contact_doc: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", clientData.name);
      formData.append("contact", clientData.contact);
      formData.append("email", clientData.email);
      formData.append("company_name", clientData.company_name || "");
      formData.append("country", clientData.country);
      formData.append("website_url", clientData.website_url || "");
      formData.append("contact_person", clientData.contact_person || "");
      formData.append("address", clientData.address || "");
      if (photoFile) {
        formData.append("photo", photoFile);
      }
      if (docFile) {
        formData.append("contact_doc", docFile);
      }

      const response = await fetch(`${url}/client/?client_id=${clientId}`, {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Client details updated successfully!");
        navigate("/dashboard", { state: { reload: true } });
      } else {
        const errorData = await response.json();
        console.error("Error updating client details:", errorData);
        alert("Failed to update client details.");
      }
    } catch (error) {
      console.error("Error during client update:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (isLoading) {
    return <p>Loading client details...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="w-full flex items-center justify-center py-8">
        <div className="w-5/6 ">
          <h2 className="text-3xl font-semibold mb-8">Client Profile</h2>
          <form onSubmit={handleSubmit} className="relative">
            {/* Client Image in Top-Left Corner with Upload Trigger */}
            <div className="absolute top-0 left-0">
              <input
                type="file"
                id="photo"
                name="photo"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
              />
              {clientData.photo ? (
                <div
                  className="relative w-24 h-24 rounded-lg border border-gray-300 cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                >
                  <img
                    src={clientData.photo}
                    alt="Client"
                    className="w-full h-full rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg">
                    <span className="text-white text-sm">Upload New</span>
                  </div>
                </div>
              ) : (
                <div
                  className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center border border-gray-300 cursor-pointer hover:bg-gray-300 transition-colors duration-300"
                  onClick={() => fileInputRef.current.click()}
                >
                  <span className="text-gray-500 text-sm text-center">Upload Image</span>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ml-32">
              {[
                { label: "Client Name*", name: "name", type: "text", required: true },
                { label: "Client Mobile No.*", name: "contact", type: "tel", required: true },
                { label: "Client Email*", name: "email", type: "email", required: true },
                { label: "Company Name*", name: "company_name", type: "text" },
                { label: "Country*", name: "country", type: "text", required: true },
                { label: "Website URL", name: "website_url", type: "url" },
                { label: "Contact Person", name: "contact_person", type: "text" },
              ].map(({ label, name, type, required }) => (
                <div key={name}>
                  <label htmlFor={name} className="block mb-2 font-medium">
                    {label}
                  </label>
                  <input
                    type={type}
                    id={name}
                    name={name}
                    value={clientData?.[name] || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={required}
                  />
                </div>
              ))}

              {/* Document Upload Field */}
              <div>
                <label htmlFor="contact_doc" className="block mb-2 font-medium">
                  Contact Document
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="contact_doc"
                    name="contact_doc"
                    ref={docInputRef}
                    onChange={handleDocChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 truncate cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => docInputRef.current.click()}
                  >
                    {docFileName || "Choose Document"}
                  </div>
                </div>
              </div>

              {/* Address Field */}
              <div className="col-span-2">
                <label htmlFor="address" className="block mb-2 font-medium">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={clientData?.address || ""}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* Notes Field */}
              <div className="col-span-2">
                <label htmlFor="notes" className="block mb-2 font-medium">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="address" // Using address field for notes as per your original form
                  value={clientData?.address || ""}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-center space-x-4 mt-6">
              <button
                type="button"
                className="px-16 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-16 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;