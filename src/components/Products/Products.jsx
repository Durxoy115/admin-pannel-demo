import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import useToken from "../hooks/useToken";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const navigate = useNavigate();
  const [url,getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

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
  }, []);

  const handleAddProduct = () => {
    navigate("/add-product");
  };

  const handleEditProduct = (id) => {
    navigate(`/edit-service/${id}`)
  }

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
    <div className="mt-16 ">
      <div className="flex justify-between items-center pl-4 pr-4 ">
        <h1 className="text-3xl font-bold mb-4">
          Our Products and Services List
        </h1>
        <button
          className="bg-blue-700 w-20 text-white p-2 rounded-md hover:bg-blue-800"
          onClick={handleAddProduct}
        >
          Add
        </button>
      </div>

      <div className="grid grid-cols-4 gap-8 p-4 ">
        {products &&
          products.map((product, index) => (
            <div
              className="relative border border-gray-300 rounded-lg bg-white shadow-lg p-6 text-center transition-transform transform hover:scale-105"
              key={index}
            >
              <h1 className="text-xl font-bold mb-2">{product?.name}</h1>
              <p className="text-gray-600 mb-4">{product.short_description}</p>
              <hr className="border-gray-300 my-2" />
              <ul className="text-left text-gray-800 mt-4 space-y-2">
                <li className="flex items-center">
                  <span
                    className="text-black mr-2"
                    dangerouslySetInnerHTML={{ __html: product?.description }}
                  ></span>
                </li>
              </ul>

              <p className="mt-4 text-lg font-semibold text-gray-700">
                Price: {product?.price ? `$${product.price} USD` : "Contact us"}
              </p>
              <CiEdit className="absolute top-4 right-4 text-black bg-gray-100 text-xl" onClick={() => handleEditProduct(product.id)} />
              <RiDeleteBin6Line
                className="absolute top-4 right-10 bg-gray-100 text-gray-700 text-xl cursor-pointer"
                onClick={() => openDeleteModal(product.id)}
              />
            </div>
          ))}
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="text-gray-700">
              Are you sure you want to delete this service?
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={handleDelete}
              >
                {" "}
                Delete
              </button>
              <button
                className="bg-green-300 px-4 py-2 rounded-md hover:bg-green-400"
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
