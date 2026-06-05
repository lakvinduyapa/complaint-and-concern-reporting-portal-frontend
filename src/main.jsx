import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";

import "./index.css";

import { ComplaintProvider } from "./context/ComplaintContext";
import { AdminAuthProvider } from "./context/AdminAuthProvider";


createRoot(document.getElementById("root")).render(

  <StrictMode>

    <AdminAuthProvider>

      <ComplaintProvider>

        <App />

      </ComplaintProvider>

    </AdminAuthProvider>

  </StrictMode>

);