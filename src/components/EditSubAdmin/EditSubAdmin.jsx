import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";

const EditSubAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [url,getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    contact: "",
    user_type: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `${url}/auth/user/?user_id=${id}`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserData(data?.data);
        } else {
          console.error("Failed to fetch client details.");
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${url}/auth/user/?user_id=${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        alert("User details updated successfully!");
        navigate("/profile", { state: { reload: true } });
      } else {
        const errorData = await response.json();
        console.error("Error updating client details:", errorData);
        alert("Failed to update user details.");
      }
    } catch (error) {
      console.error("Error during user update:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (isLoading) {
    return <p>Loading client details...</p>;
  }

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-semibold mb-8">Member Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: "First Name", name: "first_name", type: "text" },
              { label: "Last Name", name: "last_name", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "User Name", name: "username", type: "text" },
              { label: "Mobile Number", name: "contact", type: "tel" },
              { label: "Member Type", name: "user_type", type: "text" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label htmlFor={name} className="block mb-2 font-medium">
                  {label}
                </label>
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={(name === "user_type") ? userData.user_type.name : (userData[name] || "")}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            ))}
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

export default EditSubAdmin;