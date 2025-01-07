import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { LogsProvider } from "./context/LogsContext";
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: "#00BFFF",
          colorBackground: "white",
          colorText: "black",
        },
      }}
      afterSignOutUrl="/"
    >
      <LogsProvider>
        <App />
      </LogsProvider>
    </ClerkProvider>
  </StrictMode>
);
