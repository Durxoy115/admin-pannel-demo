import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import useToken from "../hooks/useToken";
import useUserPermission from "../hooks/usePermission";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const {permissions} = useUserPermission();


  const canAddService = permissions.includes("service.add_service");
  const canUpdateService = permissions.includes("service.change_service");
  const canDeleteService = permissions.includes("service.delete_service");


  const fetchProducts = async () => {
    try {
      const response = await fetch(`${url}/service/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.json();
      if (data?.success) {
        setProducts(data?.data);
      } else {
        console.error("The problem is", data.message);
      }
    } catch (error) {
      console.error("Error fetching Services:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [url, token]);

  const handleAddProduct = () => {
    navigate("/add-product");
  };

  const handleEditProduct = (id) => {
    navigate(`/edit-service/${id}`);
  };

  const openDeleteModal = (serviceId) => {
    setSelectedProductId(serviceId);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
  };

  const handleDelete = async () => {
    if (!selectedProductId) return;

    try {
      const response = await fetch(
        `${url}/service/?service_id=${selectedProductId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== selectedProductId)
        );
      } else {
        console.error("Failed to delete the service.");
        alert("Error: Unable to delete service.");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("An error occurred while deleting the service.");
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <div className="mt-4 sm:mt-6 md:mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between  mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0">
          Our Products and Services List
        </h1>

        {
          canAddService && 
          <button
          className="bg-blue-700 w-full sm:w-20 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-blue-800 text-sm sm:text-base"
          onClick={handleAddProduct}
        >
          Add
        </button>
        }
       
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8  sm:p-4">
        {products &&
          products.map((product, index) => (
            <div
              className="relative border border-gray-300 rounded-lg bg-white shadow-lg p-4 sm:p-6 text-center transition-transform transform hover:scale-105"
              key={index}
            >
              <h1 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{product?.name}</h1>
              <p className="text-gray-600 text-sm sm:text-base mb-2 sm:mb-4">{product.short_description}</p>
              <hr className="border-gray-300 my-1 sm:my-2" />
              <ul className="text-left text-gray-800 mt-2 sm:mt-4 space-y-1 sm:space-y-2 text-sm sm:text-base">
                <li className="flex items-center">
                  <span
                    className="text-black mr-2"
                    dangerouslySetInnerHTML={{ __html: product?.description }}
                  ></span>
                </li>
              </ul>

              <p className="mt-2 sm:mt-4 text-base sm:text-lg font-semibold text-gray-700">
                Price: {product?.price ? `$${product.price} USD` : "Contact us"}
              </p>
              {
                canUpdateService && 
                <CiEdit
                className="absolute top-3 sm:top-4 right-3 sm:right-4 text-black bg-gray-100 text-lg sm:text-xl cursor-pointer"
                onClick={() => handleEditProduct(product.id)}
              /> 
              }
              {
                canDeleteService && 
                <RiDeleteBin6Line
                className="absolute top-3 sm:top-4 right-9 sm:right-10 bg-gray-100 text-gray-700 text-lg sm:text-xl cursor-pointer"
                onClick={() => openDeleteModal(product.id)}
              />
              }
            
            </div>
          ))}
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center w-full max-w-sm">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Confirm Delete</h2>
            <p className="text-gray-700 text-sm sm:text-base">
              Are you sure you want to delete this service?
            </p>
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                className="bg-red-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-red-700 text-sm sm:text-base w-full sm:w-auto"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="bg-green-300 px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-green-400 text-sm sm:text-base w-full sm:w-auto"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;