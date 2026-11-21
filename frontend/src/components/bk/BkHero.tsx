import { useMemo } from "react";
import { makeStars } from "@/lib/stars";
import { formatLongDate, greetingFor } from "@/lib/datetime";
import type { BkTeacherProfile } from "@/types/bk";

interface BkHeroProps {
  guru: BkTeacherProfile;
  totalKelas?: number;
  totalSiswa?: number;
}

export default function BkHero({ guru, totalKelas = 6, totalSiswa = 325 }: BkHeroProps) {
  const stars = useMemo(() => makeStars(24, 9), []);
  const now = useMemo(() => new Date(), []);
  const greeting = greetingFor(now);
  const longDate = formatLongDate(now);

  return (
    <div className="relative overflow-hidden rounded-card-lg bg-portal-hero p-6 text-white shadow-lift sm:p-8">
      {/* Taburan bintang & orbit dekoratif */}
      <div className="pointer-events-none absolute inset-0 select-none overflow-hidden" aria-hidden="true">
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${s.y}%`,
              left: `${s.x}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity * 0.65,
            }}
          />
        ))}
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full border border-white/5" />
      </div>

      <div className="relative z-10">
        <p className="text-xs font-medium text-night-text sm:text-sm">{longDate}</p>
        <p className="mt-1 font-accent text-lg text-sun-2 sm:text-xl">{greeting},</p>
        <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {guru.name}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-night-sub">
          Pantau perkembangan potensi, kesiapan jurusan, dan kebutuhan konseling siswa di seluruh sekolah.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {guru.semester && (
            <span className="flex h-7 items-center rounded-full border border-white/20 bg-white/10 px-3 text-xs font-medium text-white backdrop-blur-sm">
              {guru.semester}
            </span>
          )}
          {guru.tahunAjaran && (
            <span className="flex h-7 items-center rounded-full border border-white/20 bg-white/10 px-3 text-xs font-medium text-white backdrop-blur-sm">
              Tahun Ajaran {guru.tahunAjaran}
            </span>
          )}
          <span className="flex h-7 items-center rounded-full border border-tint-blue-fg/30 bg-orbit-1/30 px-3 text-xs font-semibold text-white backdrop-blur-sm">
            {totalKelas} Kelas · {totalSiswa} Siswa
          </span>
        </div>
      </div>
    </div>
  );
}
