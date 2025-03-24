import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams, useNavigate } from "react-router-dom";
import useToken from "../components/hooks/useToken";

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
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  // Fetch existing service data
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await fetch(`${url}/service/?service_id=${id}`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (data?.success) {
            setServiceData(data?.data);
          } else {
            console.error("Failed to fetch service data:", data.message);
          }
        } else {
          throw new Error("Failed to fetch service data");
        }
      } catch (error) {
        console.error("Error fetching service data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceData();
  }, [id, url, token]);

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
      const response = await fetch(`${url}/service/?service_id=${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          navigate("/profile");
        } else {
          throw new Error(result.message || "Failed to update service");
        }
      } else {
        throw new Error("Failed to update service");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      alert("Failed to update service. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <p className="text-center mt-10 text-gray-600">Loading service data...</p>
    );
  }

  return (
    <div className="w-full flex justify-center min-h-screen bg-gray-100">
      <div className="w-full  px-4 sm:px-6 md:px-20 sm:pt-6 mt-16">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 sm:mt-4">
          Edit Product/Service
        </h2>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 ">
            {[
              { label: "Name", name: "name", type: "text" },
              {
                label: "Short Description",
                name: "short_description",
                type: "text",
              },
              { label: "Price", name: "price", type: "number" },
              { label: "Currency", name: "currency", type: "text" },
              {
                label: "Type",
                name: "type",
                type: "select",
                options: ["", "Product", "Service"],
              },
            ].map(({ label, name, type, options }) => (
              <div key={name}>
                <label
                  htmlFor={name}
                  className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base"
                >
                  {label} <span className="text-red-500">*</span>
                </label>
                {type === "select" ? (
                  <select
                    id={name}
                    name={name}
                    value={serviceData[name]}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded-lg text-sm sm:text-base"
                    required
                  >
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option || "Select Type"}
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
                    className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded-lg text-sm sm:text-base"
                    required
                  />
                )}
              </div>
            ))}
            <div>
              <label
                htmlFor="image"
                className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base"
              >
                Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleFileChange}
                className="w-full px-3 sm:px-4 py-1 sm:py-2 border rounded-lg text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="mt-4 sm:mt-6 w-full">
            <label
              htmlFor="description"
              className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <ReactQuill
              id="description"
              className="w-full bg-white"
              theme="snow"
              value={serviceData.description}
              onChange={(value) =>
                setServiceData((prevData) => ({
                  ...prevData,
                  description: value,
                }))
              }
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-6 sm:mt-8 mb-6 sm:mb-10 md:space-x-8">
            <button
              type="button"
              className="w-full sm:w-40 px-6 sm:px-8 py-1 sm:py-2 bg-red-600 text-white rounded-lg text-sm sm:text-base"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-40 px-6 sm:px-8 py-1 sm:py-2 bg-blue-500 text-white rounded-lg text-sm sm:text-base"
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
