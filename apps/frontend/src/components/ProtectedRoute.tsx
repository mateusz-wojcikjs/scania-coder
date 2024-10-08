// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("authJwtToken");

  if (!token) {
    // If no token is present, redirect to login page
    return <Navigate to="/login" />;
  }

  // If token exists, render the protected component
  return children;
};

export default ProtectedRoute;
