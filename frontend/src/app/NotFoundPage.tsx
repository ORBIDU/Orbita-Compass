import { Compass } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/config/navigation";
import { ButtonLink } from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { usePageTitle } from "@/lib/usePageTitle";
import { PAGE_TITLES } from "@/content/common";

export default function NotFoundPage() {
  usePageTitle(PAGE_TITLES.notFound);
  const { status } = useAuth();
  const loggedIn = status === "authenticated";
  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto px-4 py-10">
      <EmptyState
        icon={Compass}
        title="Halaman tidak ditemukan"
        description="Sepertinya kamu keluar dari orbit. Alamat yang dibuka tidak ada atau sudah dipindahkan."
        action={
          <ButtonLink to={loggedIn ? ROUTES.portal : ROUTES.landing}>
            {loggedIn ? "Kembali ke Dashboard" : "Kembali ke beranda"}
          </ButtonLink>
        }
      />
    </div>
  );
}
