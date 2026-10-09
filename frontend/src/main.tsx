import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { StudentStatusProvider } from "./context/StudentStatusContext";
import { router } from "./router";
import DemoBadge from "./components/dev/DemoBadge";
import { claimReload } from "./lib/reloadOnce";
import "./styles/index.css";

// File halaman gagal dimuat (biasanya karena situs baru di-update): muat ulang
// sekali. Kalau baru saja dimuat ulang, error dibiarkan sampai ke ErrorPage.
window.addEventListener("vite:preloadError", (event) => {
  if (!claimReload()) return;
  event.preventDefault();
  window.location.reload();
});

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <StudentStatusProvider>
      <RouterProvider router={router} />
      {USE_MOCK && <DemoBadge />}
    </StudentStatusProvider>
  </AuthProvider>,
);
