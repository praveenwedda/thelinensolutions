import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App";
import { AuthProvider } from "./lib/auth";
import { DataProviderRoot } from "./lib/data/DataContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DataProviderRoot>
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#2C2417",
                color: "#FAF7F2",
                border: "1px solid #4A3C27",
                fontFamily: "Montserrat, sans-serif",
              },
            }}
          />
        </DataProviderRoot>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
