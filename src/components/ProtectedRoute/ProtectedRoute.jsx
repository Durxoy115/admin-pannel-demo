// components/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const ProtectedRoute = ({ element: Component, allowedUserTypes }) => {
  const { userType } = useContext(UserContext);

  // If userType is not yet loaded, show a loading state (optional)
  if (!userType) {
    return <div>Loading...</div>;
  }

  // Check if the user's type is allowed to access this route
  if (allowedUserTypes.includes(userType)) {
    return Component;
  }

  // Redirect to a default route if user type is not allowed
  return <Navigate to="/dashboard" />;
};

export default ProtectedRoute;