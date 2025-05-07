import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";

const ClientProfile = ({ id }) => {
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const clientId = id || paramId;
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const fileInputRef = useRef(null);
  const docInputRef = useRef(null);
  const [checkEmail, setCheckEmail] = useState()

  const [clientData, setClientData] = useState({
    name: "",
    contact: "",
    email: "",
    company_name: "",
    country: "",
    website_url: "",
    contact_person: "",
    address: "",
    photo: null,
    contact_doc: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [photoFile, setPhotoFile] = useState(null);
  const [docFile, setDocFile] = useState(null);
  const [docFileName, setDocFileName] = useState("");
  const [error, setError] = useState(null); // State for API errors
  const [fieldErrors, setFieldErrors] = useState({}); // State for field-specific errors

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await fetch(`${url}/client/?client_id=${clientId}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          
          const fetchedData = {
            ...data?.data,
            photo: data?.data?.photo ? `${url}${data.data.photo}` : null,
            contact_doc: data?.data?.contact_doc ? data.data.contact_doc : null,
          };
          setClientData(fetchedData);
          setCheckEmail(data?.data?.email);
          setDocFileName(
            data?.data?.contact_doc
              ? data.data.contact_doc.split("/").slice(-1)[0]
              : ""
          );
        } else {
          const errorData = await response.json();
          setError(
            errorData?.message ||
              `Failed to fetch client details (Status: ${response?.status})`
          );
        }
      } catch (error) {
        setError(error?.data?.message);
        console.error("Error fetching client data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientDetails();
  }, [clientId, token, url]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({ ...prevData, [name]: value }));
    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setPhotoFile(file);
      setClientData((prev) => ({ ...prev, photo: URL.createObjectURL(file) }));
      setFieldErrors((prev) => ({ ...prev, photo: null }));
    } else {
      setFieldErrors((prev) => ({
        ...prev,
        photo: "Please upload a valid image file (e.g., .jpg, .png)",
      }));
      setPhotoFile(null);
      setClientData((prev) => ({ ...prev, photo: null }));
    }
  };

  const handleDocChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      setDocFile(file);
      setDocFileName(file.name);
      setClientData((prev) => ({
        ...prev,
        contact_doc: URL.createObjectURL(file),
      }));
      setFieldErrors((prev) => ({ ...prev, contact_doc: null }));
    } else {
      setFieldErrors((prev) => ({
        ...prev,
        contact_doc:
          "Please upload a valid document file (e.g., .pdf, .doc, .docx)",
      }));
      setDocFile(null);
      setDocFileName("");
      setClientData((prev) => ({ ...prev, contact_doc: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setFieldErrors({}); // Clear previous field errors

    try {
      const formData = new FormData();
      formData.append("name", clientData.name);
      formData.append("contact", clientData.contact);
      if (checkEmail != clientData.email) {
        formData.append("email", clientData.email);
      }
      
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
      const data = await response.json();
      if (response.ok && data.success) {
        alert("Client details updated successfully!");
        navigate("/dashboard", { state: { reload: true } });
      } else {
        console.log("erorrrrr")
        setError(data?.message);
    
      }
    } catch (error) {
      console.log("ewrorrrr",error)
      setError(error?.message);
      console.error("Error during client update:", error);
    }
  };

  if (isLoading) {
    return <p className="text-center mt-8">Loading client details...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow flex items-center justify-center py-4 sm:py-6 md:py-8">
        <div className="w-full px-2 sm:px-6 lg:px-24">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-6 mt-12">
            Client Profile
          </h2>

          {/* Display General Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-700 hover:text-red-900"
              >
                ✕
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
              {/* Image Uploader */}
              <div className="mb-4 sm:mb-0 lg:w-40">
                <div className="relative">
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
                      className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg border border-gray-300 cursor-pointer"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <img
                        src={clientData.photo}
                        alt="Client"
                        className="w-full h-full rounded-lg object-cover"
                        onError={(e) => (e.target.src = "/default-image.jpg")}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg">
                        <span className="text-white text-xs">Upload New</span>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg bg-gray-200 flex items-center justify-center border border-gray-300 cursor-pointer hover:bg-gray-300 transition-colors duration-300"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <span className="text-gray-500 text-xs text-center px-2">
                        Upload Image
                      </span>
                    </div>
                  )}
                </div>
                {fieldErrors.photo && (
                  <p className="text-red-600 text-xs mt-1">{fieldErrors.photo}</p>
                )}
              </div>

              {/* Form Fields */}
              <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                {[
                  { label: "Client Name*", name: "name", type: "text", required: true },
                  { label: "Client Mobile No.*", name: "contact", type: "tel", required: true },
                  { label: "Client Email*", name: "email", type: "email", required: true },
                  { label: "Company Name", name: "company_name", type: "text" },
                  { label: "Country*", name: "country", type: "text", required: true },
                  { label: "Website URL", name: "website_url", type: "url" },
                  { label: "Contact Person", name: "contact_person", type: "text" },
                ].map(({ label, name, type, required }) => (
                  <div key={name}>
                    <label
                      htmlFor={name}
                      className="block mb-1 font-medium text-xs sm:text-sm md:text-base"
                    >
                      {label}
                    </label>
                    <input
                      type={type}
                      id={name}
                      name={name}
                      value={clientData[name] || ""}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        fieldErrors[name] ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base`}
                      required={required}
                    />
                    {fieldErrors[name] && (
                      <p className="text-red-600 text-xs mt-1">{fieldErrors[name]}</p>
                    )}
                  </div>
                ))}

                {/* Document Upload Field */}
                <div>
                  <label
                    htmlFor="contact_doc"
                    className="block mb-1 font-medium text-xs sm:text-sm md:text-base"
                  >
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
                      accept=".pdf,.doc,.docx"
                    />
                    <div
                      className={`w-full px-3 py-2 border ${
                        fieldErrors.contact_doc ? "border-red-500" : "border-gray-300"
                      } rounded-lg bg-gray-100 text-gray-700 truncate cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base`}
                      onClick={() => docInputRef.current.click()}
                    >
                      {docFileName || "Choose Document"}
                    </div>
                  </div>
                  {fieldErrors.contact_doc && (
                    <p className="text-red-600 text-xs mt-1">{fieldErrors.contact_doc}</p>
                  )}
                </div>

                {/* Address Field */}
                <div className="col-span-1 sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="block mb-1 font-medium text-xs sm:text-sm md:text-base"
                  >
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={clientData.address || ""}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-3 py-2 border ${
                      fieldErrors.address ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base`}
                  ></textarea>
                  {fieldErrors.address && (
                    <p className="text-red-600 text-xs mt-1">{fieldErrors.address}</p>
                  )}
                </div>

                {/* Notes Field */}
                <div className="col-span-1 sm:col-span-2">
                  <label
                    htmlFor="notes"
                    className="block mb-1 font-medium text-xs sm:text-sm md:text-base"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={clientData.notes || ""}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-3 py-2 border ${
                      fieldErrors.notes ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base`}
                  ></textarea>
                  {fieldErrors.notes && (
                    <p className="text-red-600 text-xs mt-1">{fieldErrors.notes}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
              <button
                type="button"
                className="w-full sm:w-auto px-20 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 text-sm sm:text-base"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-20 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 text-sm sm:text-base"
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