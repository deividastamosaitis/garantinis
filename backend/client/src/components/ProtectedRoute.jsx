import React from "react";
import { Navigate, useLoaderData } from "react-router-dom";

export const authLoader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return token;
};

const ProtectedRoute = ({ children }) => {
  const token = useLoaderData();
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
