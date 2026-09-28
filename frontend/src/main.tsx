import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { AuthProvider } from "./context/AuthContext";
import { StudentStatusProvider } from "./context/StudentStatusContext";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <StudentStatusProvider>
      <App />
    </StudentStatusProvider>
  </AuthProvider>,
);
