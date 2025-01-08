import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/app.css";
import App from "./App.jsx";
import "flowbite";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
