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
    <div className="mt-16 w-full ">
  <div className="w-5/6 mx-auto">
  <div className="flex justify-between items-center  ">
        <h1 className="text-3xl font-bold mb-4">Current Services</h1>
        <button
          className="bg-blue-700 w-20 text-white p-2 rounded-md hover:bg-blue-800"
          onClick={handleAddService}
        >
          Add
        </button>
      </div>

      <div className="grid grid-cols-4 gap-8 p-4">
        {services &&
          services.map((service, index) => (
            <div
              className="relative border border-gray-300 rounded-lg bg-white shadow-lg p-6 text-center transition-transform transform hover:scale-105"
              key={index}
            >
              <h1 className="text-xl font-bold mb-2">{service?.name}</h1>
              <p className="text-gray-600 mb-4">{service.duration}</p>
              <p className="mt-4 text-lg font-semibold text-gray-700">
                Price: {service?.price ? `$${service.price} USD` : "Contact us"}
              </p>
              <hr className="border-gray-300 my-2" />
              <ul className="text-left text-gray-800 mt-4 space-y-2">
                <li className="flex items-center">
                  <span
                    className="text-black mr-2"
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
