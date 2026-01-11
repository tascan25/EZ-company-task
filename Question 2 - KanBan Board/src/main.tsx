import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import KanBanContextProvider from "./store/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <KanBanContextProvider>
      <App />
    </KanBanContextProvider>
  </StrictMode>
);
