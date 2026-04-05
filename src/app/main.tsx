import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles/global.css";
import App from "./App.tsx";
import { ThemeProvider } from "@/components/common/theme-provider-wrapper.tsx";
import { TooltipProvider } from "@/components/ui/tooltip";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </TooltipProvider>
  </StrictMode>,
);
