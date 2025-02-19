import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams, useNavigate } from "react-router-dom";
import useToken from ".././components/hooks/useToken"

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState({
    name: "",
    short_description: "",
    description: "",
    price: "",
    currency: "",
    type: "",
    image: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [url,getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  // Fetch existing service data
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await fetch(
          `${url}/service/?service_id=${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        if(response.ok){
            const serviceData = await response.json();
            setServiceData(serviceData?.data)
        }

        if (!response.ok) {
          throw new Error("Failed to fetch service data");
        }

        const serviceData = await response.json();
        console.log(serviceData)
        setServiceData({
          name: serviceData.name || "",
          short_description: serviceData.short_description || "",
          description: serviceData.description || "",
          price: serviceData.price || "",
          currency: serviceData.currency || "",
          type: serviceData.type || "",
          image: null,
        });
      } catch (error) {
        console.error("Error fetching service data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceData();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setServiceData((prevData) => ({ ...prevData, image: e.target.files[0] }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", serviceData.name);
    formData.append("short_description", serviceData.short_description);
    formData.append("description", serviceData.description);
    formData.append("price", serviceData.price);
    formData.append("currency", serviceData.currency);
    formData.append("type", serviceData.type);
    if (serviceData.image) {
      formData.append("image", serviceData.image);
    }

    try {
      const response = await fetch(
        `${url}/service/?service_id=${id}`,
        {
          method: "PUT",
          headers: {
            Authorization:  `Token ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update service");
      }

      
      navigate("/profile");
    } catch (error) {
      console.error("Error updating service:", error);
      alert("Failed to update service. Please try again.");
    }
  };

  if (isLoading) {
    return <p>Loading service data...</p>;
  }

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-semibold mb-8">Edit Product/Service</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: "Name", name: "name", type: "text" },
              { label: "Short Description", name: "short_description", type: "text" },
              { label: "Price", name: "price", type: "number" },
              { label: "Currency", name: "currency", type: "text" },
              { label: "Type", name: "type", type: "select", options: ["", "Product", "Service"] },
            ].map(({ label, name, type, options }) => (
              <div key={name}>
                <label htmlFor={name} className="block mb-2 font-medium">
                  {label}*
                </label>
                {type === "select" ? (
                  <select
                    id={name}
                    name={name}
                    value={serviceData[name]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  >
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    id={name}
                    name={name}
                    value={serviceData[name]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                )}
              </div>
            ))}
            <div>
              <label htmlFor="image" className="block mb-2 font-medium">
                Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="mt-4 w-full">
            <label htmlFor="description" className="block mb-2 font-medium">
              Description*
            </label>
            <ReactQuill
              id="description"
              className="w-full"
              theme="snow"
              value={serviceData.description}
              onChange={(value) =>
                setServiceData((prevData) => ({ ...prevData, description: value }))
              }
            />
          </div>

          <div className="flex justify-center items-center space-x-4 mt-6">
            <button
              type="button"
              className="px-6 py-2 bg-red-600 text-white rounded-lg"
              onClick={() => navigate("/profile")}
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

export default EditService;
