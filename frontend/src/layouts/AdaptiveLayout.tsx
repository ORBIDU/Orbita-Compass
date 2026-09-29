import { useAuth } from "@/context/AuthContext";
import PageLoader from "@/components/ui/PageLoader";
import PortalLayout from "./PortalLayout";
import PublicLayout from "./PublicLayout";

/**
 * Layout yang mengikuti status login: belum login → layout publik,
 * sudah login → layout portal. Dipakai /jurusan (keputusan di
 * docs/SPEK_SISWA.md: satu halaman, URL tetap /jurusan) dan halaman 404.
 */
export default function AdaptiveLayout() {
  const { status } = useAuth();
  if (status === "loading") return <PageLoader fullscreen label="Memuat ORBITA..." />;
  return status === "authenticated" ? <PortalLayout /> : <PublicLayout />;
}
