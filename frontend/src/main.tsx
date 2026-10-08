import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { StudentStatusProvider } from "./context/StudentStatusContext";
import { router } from "./router";
import { USE_MOCK } from "./services/config";
import DemoBadge from "./components/dev/DemoBadge";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <StudentStatusProvider>
      <RouterProvider router={router} />
      {USE_MOCK && <DemoBadge />}
    </StudentStatusProvider>
  </AuthProvider>,
);
