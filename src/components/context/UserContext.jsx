
// import React, { createContext, useState, useEffect } from "react";


// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [userType, setUserType] = useState(null); // Store user type (e.g., "Admin", "Client")
//   const [url, getTokenLocalStorage] = useToken();
//   const token = getTokenLocalStorage();

//   // Fetch user profile after login to get user type
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       if (!token) return; // Skip if no token (not logged in)

//       try {
//         const response = await fetch(`${url}/auth/profile/`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Token ${token}`,
//           },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setUserType(data?.data?.user_type?.name || null); // e.g., "Client"
//         } else {
//           console.error("Failed to fetch user profile");
//         }
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//       }
//     };
//     fetchUserProfile();
//   }, [token, url]);

//   return (
//     <UserContext.Provider value={{ userType, setUserType }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

import axios from "axios";
// import useToken from "../hooks/useToken";

// const usePermissionCheck = () => {
//   const [url, getTokenLocalStorage] = useToken();

//   const checkPermission = async (method, extra_url) => {
//     const token = getTokenLocalStorage();
//     try {
//       const response = await axios({
//         method,
//         url: `${url}${extra_url}`,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${token}`,
//         },
//       });

//       if (response.status === 403) return false;
//       return true;
//     } catch (error) {
//       console.error("Axios error:", error);
//       return true;
//     }
//   };

//   return checkPermission;
// };

// export default usePermissionCheck;





