// src/hooks/useUserPermission.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useToken from "./useToken";

const useUserPermission = () => {
  const [permissions, setPermissions] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get(`${url}/user-check-permission/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        // Assuming response.data.data is an array of permission strings
        setPermissions(response.data.data || []);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            localStorage.removeItem("office_token");
            navigate("/login");
          } else if (error.response.status === 403) {
            setError("You don't have permission.");
          } else {
            setError("Failed to fetch permissions.");
          }
        } else {
          setError("Network or server error.");
        }

        console.error("Permission fetch error:", error);
      }
    };

    fetchPermissions();
  }, [url, token, navigate]);

  return { permissions, error };
};

export default useUserPermission;
