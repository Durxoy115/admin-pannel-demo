import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ClientProfile = () => {
  const { clientId } = useParams(); 
  const navigate = useNavigate();

  const [clientData, setClientData] = useState({
    name: "",
    contact: "",
    email: "",
    company_name: "",
    country: "",
    website_url: "",
    contact_person: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await fetch(`https://admin.zgs.co.com/client/?client_id=${clientId}`, {
          headers: {
            Authorization: "Token 4bc2a75c04006d4e540a8b38f86612dc0b1da466",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setClientData(data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://admin.zgs.co.com/client/?client_id=${clientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token 4bc2a75c04006d4e540a8b38f86612dc0b1da466",
        },
        body: JSON.stringify(clientData),
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
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-semibold mb-8">Edit Client</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "Client Name", name: "name", type: "text" },
              { label: "Mobile Number", name: "contact", type: "tel" },
              { label: "Email", name: "email", type: "email" },
              { label: "Company Name", name: "company_name", type: "text" },
              { label: "Country", name: "country", type: "text" },
              { label: "Website URL", name: "website_url", type: "url" },
              { label: "Contact Person", name: "contact_person", type: "text" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label htmlFor={name} className="block mb-2 font-medium">
                  {label}
                </label>
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={clientData[name]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            ))}
            <div className="col-span-2">
              <label htmlFor="address" className="block mb-2 font-medium">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={clientData.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border rounded-lg"
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              className="px-6 py-2 bg-red-600 text-white rounded-lg"
              onClick={() => navigate("/dashboard")}
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

export default ClientProfile;
