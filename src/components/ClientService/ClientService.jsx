import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";

const ClientService = ({ clientId }) => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  const fetchServices = async () => {
    try {
      const response = await fetch(`${url}/service/client-service/?client_id=${clientId}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.json();
      if (data?.success) {
        setServices(data?.data);
      } else {
        console.error("The problem is", data.message);
      }
    } catch (error) {
      console.error("Error fetching Services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [clientId]);

  const handleAddService = () => {
    navigate("/add-order");
  };

  return (
    <div className="mt-4 sm:mt-8 md:mt-12 w-full">
      <div className="w-full  mx-auto px-4 sm:px-6 md:px-28">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Current Services</h1>
          <button
            className="bg-blue-700 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-blue-800 transition-colors duration-300 mt-4 sm:mt-0 w-full sm:w-auto"
            onClick={handleAddService}
          >
            Add
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 p-2 sm:p-4">
          {services &&
            services.map((service, index) => (
              <div
                className="relative border border-gray-300 rounded-lg bg-white shadow-lg p-3 sm:p-4 text-center transition-transform transform hover:scale-105"
                key={index}
              >
                <h1 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{service?.name}</h1>
                <p className="text-gray-600 text-sm sm:text-base mb-1 sm:mb-2">{service.duration}</p>
                <p className="mt-2 sm:mt-4 text-base sm:text-lg font-semibold text-gray-700">
                  Price: {service?.price ? `$${service.price} USD` : "Contact us"}
                </p>
                <hr className="border-gray-300 my-1 sm:my-2" />
                <ul className="text-left text-gray-800 mt-2 sm:mt-4 space-y-1 sm:space-y-2">
                  <li className="flex items-center">
                    <span
                      className="text-black mr-1 sm:mr-2 text-sm sm:text-base"
                      dangerouslySetInnerHTML={{ __html: service?.details }}
                    ></span>
                  </li>
                </ul>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ClientService;