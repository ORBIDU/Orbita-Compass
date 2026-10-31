import { useMemo } from "react";
import { makeStars } from "@/lib/stars";
import { greetingFor } from "@/lib/datetime";
import type { WaliTeacherProfile } from "@/types/wali";

interface WaliHeroProps {
  wali: WaliTeacherProfile;
  totalStudents?: number;
}

export default function WaliHero({ wali, totalStudents = 36 }: WaliHeroProps) {
  const stars = useMemo(() => makeStars(24, 7), []);
  const greeting = greetingFor(new Date());

  return (
    <div className="relative overflow-hidden rounded-card-lg bg-portal-hero p-6 text-white shadow-lift sm:p-8">
      {/* Taburan bintang dekoratif */}
      <div className="pointer-events-none absolute inset-0 select-none overflow-hidden" aria-hidden="true">
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white opacity-40"
            style={{
              top: `${s.y}%`,
              left: `${s.x}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
            }}
          />
        ))}
        {/* Lingkaran orbit samar */}
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full border border-white/5 pointer-events-none" />
      </div>

      <div className="relative z-10">
        <p className="font-accent text-lg text-sun-2 sm:text-xl">
          {greeting},
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {wali.name}
        </h1>
        <p className="mt-1 text-sm font-medium text-white/70">
          Wali Kelas · {wali.kelas}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="flex h-7 items-center rounded-full border border-white/20 bg-white/10 px-3 text-xs font-medium text-white backdrop-blur-sm">
            {wali.semester}
          </span>
          <span className="flex h-7 items-center rounded-full border border-white/20 bg-white/10 px-3 text-xs font-medium text-white backdrop-blur-sm">
            Tahun Ajaran {wali.tahunAjaran}
          </span>
          <span className="flex h-7 items-center rounded-full border border-tint-blue-fg/30 bg-orbit-1/30 px-3 text-xs font-semibold text-white backdrop-blur-sm">
            👥 {totalStudents} Siswa
          </span>
        </div>
      </div>
    </div>
  );
}
