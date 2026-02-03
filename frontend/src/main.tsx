import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Import test utilities for debugging in console
import "@/lib/test-api";

createRoot(document.getElementById("root")!).render(<App />);
