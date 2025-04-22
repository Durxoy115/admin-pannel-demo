// src/hooks/useUserPermission.js
import { useState, useEffect } from "react";
import axios from "axios";
import useToken from "./useToken";

const useUserPermission = () => {
  const [permissions, setPermissions] = useState([]);
  const [error, setError] = useState(null);
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
        setError("Failed to fetch permissions");
        console.error("Permission fetch error:", error);
      } 
    };

    fetchPermissions();
  }, [url, token]);

  return { permissions, error };
};

export default useUserPermission;