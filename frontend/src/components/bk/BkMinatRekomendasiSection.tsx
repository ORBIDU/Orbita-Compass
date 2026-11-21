import { useState } from "react";
import { Compass, GraduationCap, Medal, Sparkles, Star } from "lucide-react";
import type { BkEducationTrack, BkEducationTrackData } from "@/types/bk";

interface BkMinatRekomendasiSectionProps {
  minatList: string[];
  bakatList: string[];
  rekomendasiPendidikan: Record<BkEducationTrack, BkEducationTrackData>;
}

export default function BkMinatRekomendasiSection({
  minatList,
  bakatList,
  rekomendasiPendidikan,
}: BkMinatRekomendasiSectionProps) {
  const [track, setTrack] = useState<BkEducationTrack>("ptn");
  const cfg = rekomendasiPendidikan[track];

  return (
    <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
      {/* Kolom Kiri: Gambaran Minat & Bakat */}
      <section className="flex flex-col gap-5 rounded-card border border-rim-soft bg-white p-5 shadow-card sm:p-6">
        <div>
          <h3 className="text-base font-bold text-space-2 sm:text-lg">Gambaran Minat & Bakat</h3>
          <p className="mt-0.5 text-xs text-prose-dim">
            Bidang yang diminati dan potensi unggulan siswa berdasarkan asesmen
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-prose-dim">
              Minat Dominan
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {minatList.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center gap-1.5 rounded-full bg-tint-blue-bg px-3 py-1.5 text-xs font-semibold text-tint-blue-fg"
                >
                  <Sparkles size={12} aria-hidden="true" />
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-rim-soft pt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-prose-dim">
              Bakat & Kekuatan
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {bakatList.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 rounded-full bg-tint-orange-bg px-3 py-1.5 text-xs font-semibold text-tint-orange-fg"
                >
                  <Star size={12} aria-hidden="true" />
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Kolom Kanan: Target & Rekomendasi Pendidikan */}
      <section className="flex flex-col gap-4 rounded-card border border-rim-soft bg-white p-5 shadow-card sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-space-2 sm:text-lg">
              Target & Rekomendasi Pendidikan
            </h3>
            <p className="mt-0.5 text-xs text-prose-dim">
              Keselarasan jurusan berdasarkan akademik, minat, dan potensi
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Jalur pendidikan"
            className="inline-flex self-start rounded-xl bg-surface-toggle p-1"
          >
            {(
              [
                { id: "ptn", label: "PTN" },
                { id: "kedinasan", label: "Kedinasan" },
              ] as const
            ).map((opt) => {
              const active = track === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTrack(opt.id)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                    active ? "bg-white text-orbit-1 shadow-toggle" : "text-prose-dim hover:text-space-2"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bidang Keilmuan */}
        <div className="rounded-xl border border-orbit-1/20 bg-compass-soft p-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-orbit-1 shadow-sm">
              <Compass size={17} aria-hidden="true" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-orbit-1">
                Bidang Keilmuan Selaras
              </p>
              <p className="text-sm font-bold text-space-2">{cfg.bidangNama}</p>
            </div>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-prose">{cfg.bidangDesc}</p>
        </div>

        {/* Target Banner */}
        <div className="rounded-xl bg-portal-hero p-4 text-white">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-night-text">
            <GraduationCap size={14} aria-hidden="true" />
            <span>{cfg.targetLabel}</span>
          </div>
          <p className="mt-1 text-base font-bold text-white">{cfg.targetNama}</p>
          <p className="mt-0.5 text-xs text-night-sub">{cfg.targetProdi}</p>
        </div>

        {/* Top 3 Rekomendasi */}
        <div>
          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-prose-dim">
            Top 3 Rekomendasi
          </p>
          <div className="space-y-2">
            {cfg.recommendations.map((rec, idx) => {
              const badgeStyle =
                rec.pct >= 90
                  ? "bg-tint-green-bg text-tint-green-fg"
                  : rec.pct >= 85
                  ? "bg-tint-blue-bg text-tint-blue-fg"
                  : "bg-tint-amber-bg text-tint-amber-fg";
              return (
                <div
                  key={rec.label}
                  className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 ${
                    idx === 0
                      ? "border-orbit-1/25 bg-surface-blue/60"
                      : "border-rim-soft bg-surface-soft/70"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      idx === 0
                        ? "bg-gradient-sun text-white"
                        : "bg-white text-space-2 border border-rim-soft"
                    }`}
                  >
                    <Medal size={14} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-space-2">{rec.label}</p>
                    <p className="truncate text-[11px] text-prose-dim">{rec.sub}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${badgeStyle}`}>
                    {rec.pct}% Sesuai
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
