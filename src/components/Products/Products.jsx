import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";


const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://admin.zgs.co.com/service/", {
        headers: {
          Authorization: "Token 4bc2a75c04006d4e540a8b38f86612dc0b1da466",
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

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center pl-4 pr-4 ml-10 mr-10">
        <h1 className="text-3xl font-bold mb-4">Our Products and Services List</h1>
        <button
          className="bg-blue-700 w-20 text-white p-2 rounded-md hover:bg-blue-800"
          onClick={handleAddProduct}
        >
          Add
        </button>
      </div>

      <div className="grid grid-cols-4 gap-8 p-4 ml-10 mr-10">
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
                  <span className="text-blue-500 mr-2">•</span> Helps understand performance.
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">•</span> Research to anticipate trends.
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">•</span> Insights into consumer behavior.
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">•</span> Investing in analytics & research.
                </li>
              </ul>
              <p className="mt-4 text-lg font-semibold text-gray-700">
                Price: {product?.price ? `$${product.price} USD` : "Contact us"}
              </p>
              <CiEdit className="absolute top-4 right-4 text-black  bg-gray-100 text-xl">
                
              </CiEdit>
              <RiDeleteBin6Line className="absolute top-4 right-10 bg-gray-100 text-gray-700 text-xl">
                
              </RiDeleteBin6Line>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Products;
