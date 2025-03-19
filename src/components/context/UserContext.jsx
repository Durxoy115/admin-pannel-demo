
import React, { createContext, useState, useEffect } from "react";
import useToken from "../hooks/useToken";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userType, setUserType] = useState(null); // Store user type (e.g., "Admin", "Client")
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  // Fetch user profile after login to get user type
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return; // Skip if no token (not logged in)

      try {
        const response = await fetch(`${url}/auth/profile/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserType(data?.data?.user_type?.name || null); // e.g., "Client"
        } else {
          console.error("Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, [token, url]);

  return (
    <UserContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserContext.Provider>
  );
};