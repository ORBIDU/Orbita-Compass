import { GraduationCap } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { ButtonLink } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";

/** Kerangka sementara. Halaman lengkap dikerjakan di Fase 5. */
export default function BeasiswaPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-ink">Explore Beasiswa</h1>
        <p className="mt-1 text-sm text-ink-muted">Temukan beasiswa yang cocok dengan jalur pendidikan pilihanmu.</p>
        <Card className="mt-6">
          <EmptyState
            icon={GraduationCap}
            title="Daftar beasiswa sedang disiapkan"
            description="Sementara itu, lihat dulu rekomendasi jurusan dan jalurmu di Orbita Compass."
            action={
              <ButtonLink to={ROUTES.compass} variant="primary">
                Buka Orbita Compass
              </ButtonLink>
            }
          />
        </Card>
      </div>
    </div>
  );
}
