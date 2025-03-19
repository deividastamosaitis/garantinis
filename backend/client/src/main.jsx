import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/app.css";
import App from "./App.jsx";
import "react-toastify/ReactToastify.css";
import "flowbite";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <ToastContainer position="top-center" />
  </StrictMode>
);
