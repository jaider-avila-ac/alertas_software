import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AlertasProvider } from "./context/AlertasContext";
import { UserProvider } from "./context/UserContext"; // Importa aquí

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <AlertasProvider>
        <App />
      </AlertasProvider>
    </UserProvider>
  </React.StrictMode>
);
