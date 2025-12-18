import React from "react";
import { Navigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";

const PrivateRoute = ({ children, requiredRole }) => {
  const isLoggedin = sessionStorage.getItem("isLoggedin") === "true";
  const token = sessionStorage.getItem("token");
  const decoded = getUserFromToken(token);
  const role = sessionStorage.getItem("role") || decoded?.role;

  if (!isLoggedin) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
