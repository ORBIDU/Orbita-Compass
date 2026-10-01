import React, { useState, useEffect } from "react";
import {
  Check,
  ChevronRight,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  Download,
  TrendingUp,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import { analyzeCompass, getCompassResult } from "../services/compassService";
import { BRAND } from "@/config/brand";

const PP = "Poppins, sans-serif";

// ═══════════════════════════════════════════════════════════════════════════════
// ORBITA COMPASS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
type CompassState =
  "ready" | "analyzing" | "done" | "upToDate" | "newData";

const COMPASS_STEPS = [
  { label: "Reading Academic Records", delay: 600 },
  { label: "Understanding Interests", delay: 1400 },
  { label: "Mapping Achievements", delay: 2200 },
  { label: "Finding Patterns", delay: 3100 },
  { label: "Generating Recommendations", delay: 4000 },
];

const PROFILE_ITEMS = [
  { label: "Student Profiling", done: true },
  { label: "Academic Records", done: true },
  { label: "Achievement", done: true },
  { label: "BK Observation", done: false },
];

// ─── Compass Result Cards ────────────────────────────────────────────────────
function CBar({
  label,
  pct,
  color,
}: {
  label: string;
  pct: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span
          className="text-[12px] font-semibold text-[#374151]"
          style={{ fontFamily: PP }}
        >
          {label}
        </span>
        <span
          className="text-[13px] font-bold"
          style={{ color, fontFamily: PP }}
        >
          {pct}%
        </span>
      </div>
      <div className="h-2 bg-[#f0f2f8] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ─── Mini SVG Radar (no recharts) ────────────────────────────────────────────
function SvgRadar({
  axes,
  values,
  color,
}: {
  axes: string[];
  values: number[];
  color: string;
}) {
  const N = axes.length;
  const R = 80;
  const cx = 100;
  const cy = 100;
  const angle = (i: number) =>
    (Math.PI * 2 * i) / N - Math.PI / 2;
  const pt = (i: number, r: number) => ({
    x: cx + r * Math.cos(angle(i)),
    y: cy + r * Math.sin(angle(i)),
  });
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const polyPts = values.map((v, i) => pt(i, (v / 100) * R));
  const polyStr = polyPts
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  return (
    <svg
      viewBox="0 0 200 200"
      width="100%"
      style={{ display: "block" }}
    >
      {gridLevels.map((l) => {
        const pts = axes.map((_, i) => pt(i, R * l));
        return (
          <polygon
            key={l}
            points={pts
              .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
              .join(" ")}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={0.8}
          />
        );
      })}
      {axes.map((_, i) => {
        const p = pt(i, R);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x.toFixed(1)}
            y2={p.y.toFixed(1)}
            stroke="#e5e7eb"
            strokeWidth={0.8}
          />
        );
      })}
      <polygon
        points={polyStr}
        fill={color + "28"}
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {polyPts.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={3.5}
          fill={color}
          stroke="white"
          strokeWidth={1.5}
        />
      ))}
      {axes.map((label, i) => {
        const p = pt(i, R + 14);
        return (
          <text
            key={i}
            x={p.x.toFixed(1)}
            y={p.y.toFixed(1)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={9}
            fill="#6b7280"
            fontFamily={PP}
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function CrossHeader({
  n,
  label,
  sublabel,
}: {
  n: string;
  label: string;
  sublabel: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center text-[12px] font-black text-white shrink-0"
        style={{
          background: "linear-gradient(135deg,#0965fa,#00b2dd)",
        }}
      >
        {n}
      </div>
      <div>
        <p
          className="text-[15px] font-bold text-[#1a1d2e]"
          style={{ fontFamily: PP }}
        >
          {label}
        </p>
        <p
          className="text-[11px] text-[#9ca3af]"
          style={{ fontFamily: PP }}
        >
          {sublabel}
        </p>
      </div>
    </div>
  );
}

// ─── Alignment score pill ────────────────────────────────────────────────────
function AlignScore({
  pct,
  label,
  emoji,
}: {
  pct: number;
  emoji: string;
  label: string;
}) {
  const color =
    pct >= 85 ? "#22c55e" : pct >= 70 ? "#f1ad00" : "#ef4444";
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-2xl">{emoji}</span>
      <p
        className="text-[28px] font-black leading-none"
        style={{ color, fontFamily: PP }}
      >
        {pct}%
      </p>
      <p
        className="text-[11px] font-bold"
        style={{ color, fontFamily: PP }}
      >
        {label}
      </p>
    </div>
  );
}

// ─── CompassResultsView ───────────────────────────────────────────────────────
function CompassResultsView({
  onReset,
  hasNewData,
  setHasNewData,
  onNavigate,
}: {
  onReset: () => void;
  hasNewData: boolean;
  setHasNewData: (v: boolean) => void;
  onNavigate?: (page: string) => void;
}) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<"Minat" | "Kompetensi" | "Akademik">("Minat");


  const EDU_PATHS = [
    {
      key: "s1",
      emoji: "🎓",
      label: "S1 / Sarjana",
      sublabel: "Perguruan Tinggi Negeri",
      pct: 94,
      matchColor: "#0965fa",
      desc: "Pendidikan akademik berfokus pada penguasaan bidang ilmu secara mendalam.",
      note: "Pilihan ditampilkan berdasarkan hasil scoring dan profil siswa.",
      majors: [
        { rank: "🥇", name: "Sistem Informasi", pct: 96, minat: ["Teknologi", "Analisis Data", "Problem Solving"], kompetensi: ["Matematika", "Logika", "Pemecahan Masalah"] },
        { rank: "🥈", name: "Informatika", pct: 91, minat: ["Programming", "Teknologi", "Logika"], kompetensi: ["Matematika", "Algoritma", "Komputasi"] },
        { rank: "🥉", name: "Ilmu Komputer", pct: 87, minat: ["Sains Komputer", "Riset", "Teknologi"], kompetensi: ["Matematika", "Pemrograman", "Analisis"] },
      ],
      unis: [
        { name: "Universitas Indonesia", pct: 92 },
        { name: "ITS Surabaya", pct: 89 },
        { name: "Universitas Gadjah Mada", pct: 87 },
      ],
    },
    {
      key: "d4",
      emoji: "🎓",
      label: "D4 / Sarjana Terapan",
      sublabel: "Perguruan Tinggi Negeri / Politeknik",
      pct: 88,
      matchColor: "#7c3aed",
      desc: "Pendidikan vokasi setara S1 dengan penekanan kuat pada penerapan praktis.",
      note: "Pilihan ditampilkan berdasarkan hasil scoring dan profil siswa.",
      majors: [
        { rank: "🥇", name: "Teknologi Rekayasa Komputer", pct: 93, minat: ["Hardware", "Sistem Tertanam", "Teknologi"], kompetensi: ["Teknik", "Elektronika", "Pemrograman"] },
        { rank: "🥈", name: "Akuntansi Terapan", pct: 88, minat: ["Keuangan", "Bisnis", "Analisis"], kompetensi: ["Matematika", "Akuntansi", "Ketelitian"] },
        { rank: "🥉", name: "Manajemen Bisnis", pct: 84, minat: ["Bisnis", "Kepemimpinan", "Strategi"], kompetensi: ["Komunikasi", "Analisis", "Manajemen"] },
      ],
      unis: [
        { name: "Politeknik Negeri Jakarta", pct: 91 },
        { name: "PENS Surabaya", pct: 88 },
        { name: "Polines Semarang", pct: 85 },
      ],
    },
    {
      key: "pts",
      emoji: "🙌🏻",
      label: "PTS",
      sublabel: "Perguruan Tinggi Swasta",
      pct: 86,
      matchColor: "#0d9488",
      desc: `Program studi yang sesuai dengan hasil rekomendasi ${BRAND.name}.`,
      note: "Pilihan disesuaikan dengan hasil scoring.",
      majors: [
        { rank: "🥇", name: "Sistem Informasi", pct: 94, minat: ["Teknologi", "Analisis Data", "Problem Solving"], kompetensi: ["Matematika", "Logika", "Pemecahan Masalah"] },
        { rank: "🥈", name: "Teknik Informatika", pct: 90, minat: ["Programming", "Teknologi", "Logika"], kompetensi: ["Matematika", "Algoritma", "Komputasi"] },
        { rank: "🥉", name: "Manajemen", pct: 85, minat: ["Bisnis", "Kepemimpinan", "Strategi"], kompetensi: ["Komunikasi", "Analisis", "Manajemen"] },
      ],
      unis: [
        { name: "Binus University", pct: 91 },
        { name: "Universitas Telkom", pct: 88 },
        { name: "UPH Karawaci", pct: 84 },
      ],
    },
    {
      key: "ptln",
      emoji: "📆",
      label: "PTLN",
      sublabel: "Perguruan Tinggi Luar Negeri",
      pct: 82,
      matchColor: "#9333ea",
      desc: "S1 / Undergraduate dan program vokasi jika tersedia dan relevan.",
      note: "Pilihan disesuaikan dengan hasil scoring dan program yang tersedia.",
      majors: [
        { rank: "🥇", name: "Computer Science", pct: 91, minat: ["Sains Komputer", "Riset", "Inovasi"], kompetensi: ["Matematika", "Algoritma", "Bahasa Inggris"] },
        { rank: "🥈", name: "Information Systems", pct: 87, minat: ["Teknologi", "Bisnis", "Data"], kompetensi: ["Analisis", "Komunikasi", "Sistem"] },
        { rank: "🥉", name: "Business Analytics", pct: 83, minat: ["Data", "Bisnis", "Pengambilan Keputusan"], kompetensi: ["Statistik", "Analisis", "Bahasa Inggris"] },
      ],
      unis: [
        { name: "NTU Singapore", pct: 85 },
        { name: "Monash University", pct: 83 },
        { name: "RMIT Australia", pct: 80 },
      ],
    },
  ];

  const HIDDEN_PATHS = [
    { emoji: "🏛️", label: "Kedinasan", reason: "Tidak cukup relevan berdasarkan profilmu saat ini." },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* 01 — Arah Pendidikanmu */}
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)]">
          <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest mb-1" style={{ fontFamily: PP }}>{BRAND.compassName}</p>
          <h2 className="text-[17px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>🎯 Arah Pendidikanmu</h2>
          <p className="text-[12px] text-[#6b7280] mt-0.5 leading-relaxed" style={{ fontFamily: PP }}>
            Berdasarkan minat, kompetensi, prestasi, dan profil akademikmu, {BRAND.name} menemukan arah yang paling sesuai untukmu.
          </p>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ background: "linear-gradient(135deg,#0965fa,#00b2dd)" }}>🥇</div>
            <div className="flex-1">
              <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wide" style={{ fontFamily: PP }}>Bidang Utama</p>
              <p className="text-[18px] font-black text-[#1a1d2e]" style={{ fontFamily: PP }}>Teknologi & Komputasi</p>
              <p className="text-[11px] font-semibold text-[#22c55e]" style={{ fontFamily: PP }}>Sangat Selaras</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[36px] font-black text-[#0965fa] leading-none" style={{ fontFamily: PP }}>92%</p>
              <p className="text-[10px] text-[#9ca3af]" style={{ fontFamily: PP }}>Kesesuaian</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Minat", pct: 94, color: "#0965fa" },
              { label: "Kompetensi", pct: 90, color: "#7c3aed" },
              { label: "Akademik", pct: 90, color: "#0d9488" },
            ].map(s => (
              <div key={s.label} className="bg-[#f8f9fc] rounded-xl px-4 py-3 text-center">
                <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wide mb-1" style={{ fontFamily: PP }}>{s.label}</p>
                <p className="text-[22px] font-black leading-none mb-1.5" style={{ color: s.color, fontFamily: PP }}>{s.pct}%</p>
                <div className="h-1 rounded-full bg-[#e5e7eb] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
          <button
            className="w-full py-2.5 rounded-2xl text-[12px] font-bold text-white hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(90deg,#0965fa,#00b2dd)", fontFamily: PP, outline: "none" }}
          >
            Lihat Rekomendasi →
          </button>
        </div>
      </div>

      {/* ── Education Path Recommendations ── */}
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)]">
          <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest mb-1" style={{ fontFamily: PP }}>{BRAND.compassName}</p>
          <h2 className="text-[17px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>🎓 Rekomendasi Pendidikan Lanjutan</h2>
          <p className="text-[12px] text-[#6b7280] mt-0.5" style={{ fontFamily: PP }}>Temukan jalur pendidikan yang paling sesuai dengan profilmu.</p>
        </div>

        <div className="px-6 py-5 flex flex-col gap-3">
          {/* Active path cards */}
          {EDU_PATHS.map((path, idx) => {
            const isActive = selectedPath === path.key;
            const medals = ["🥇", "🥈", "🥉", "4️⃣"];
            return (
              <div key={path.key}>
                {/* Card row */}
                <button
                  onClick={() => {
                    setSelectedPath(isActive ? null : path.key);
                    setSelectedMajor(null);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-left transition-all hover:shadow-sm"
                  style={{ borderColor: isActive ? path.matchColor : "rgba(0,0,0,0.08)", background: isActive ? path.matchColor + "07" : "#fff", outline: "none" }}
                >
                  {/* Medal + emoji */}
                  <span className="text-base shrink-0 w-6 text-center">{medals[idx]}</span>
                  <span className="text-lg shrink-0">{path.emoji}</span>
                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>{path.label}</p>
                    <p className="text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>{path.sublabel}</p>
                  </div>
                  {/* Score + action */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-[18px] font-black" style={{ color: path.matchColor, fontFamily: PP }}>{path.pct}%</span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-xl border transition-all whitespace-nowrap" style={{ borderColor: isActive ? path.matchColor : "rgba(0,0,0,0.08)", color: isActive ? path.matchColor : "#9ca3af", background: isActive ? path.matchColor + "0f" : "transparent", fontFamily: PP }}>
                      {isActive ? "▲ Tutup" : "Lihat Pilihan →"}
                    </span>
                  </div>
                </button>

                {/* Expanded detail */}
                {isActive && (
                  <div className="mt-1.5 ml-2 mr-0 rounded-2xl border p-5 flex flex-col gap-5" style={{ borderColor: path.matchColor + "22", background: path.matchColor + "03" }}>
                    {/* Match context */}
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="text-[14px] font-black" style={{ color: path.matchColor, fontFamily: PP }}>{path.pct}% Kecocokan Profil</p>
                        <p className="text-[11px] text-[#6b7280] mt-0.5 leading-relaxed" style={{ fontFamily: PP }}>{path.desc}</p>
                      </div>
                    </div>

                    {/* Program studi ranking */}
                    <div>
                      <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest mb-2.5" style={{ fontFamily: PP }}>🎯 Program Studi yang Direkomendasikan</p>
                      <div className="flex flex-col gap-2">
                        {path.majors.map(m => {
                          const isMajorActive = selectedMajor === `${path.key}:${m.name}`;
                          return (
                            <div key={m.name}>
                              <button
                                onClick={() => setSelectedMajor(isMajorActive ? null : `${path.key}:${m.name}`)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all hover:shadow-sm"
                                style={{ borderColor: isMajorActive ? path.matchColor : "rgba(0,0,0,0.08)", background: isMajorActive ? path.matchColor + "09" : "#fff", outline: "none" }}
                              >
                                <span className="text-sm shrink-0">{m.rank}</span>
                                <span className="flex-1 text-[13px] font-semibold text-[#1a1d2e]" style={{ fontFamily: PP }}>{m.name}</span>
                                <span className="text-[13px] font-black shrink-0" style={{ color: path.matchColor, fontFamily: PP }}>{m.pct}%</span>
                              </button>

                              {/* Kenapa cocok */}
                              {isMajorActive && (
                                <div className="mt-1 mx-1 rounded-xl border p-4 flex flex-col gap-3" style={{ borderColor: path.matchColor + "1e", background: path.matchColor + "04" }}>
                                  <p className="text-[12px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>💡 Kenapa ini cocok buat kamu?</p>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-[10px] font-bold text-[#0965fa] mb-1.5 uppercase tracking-wide" style={{ fontFamily: PP }}>💙 Minatmu</p>
                                      <div className="flex flex-col gap-1">
                                        {m.minat.map(mi => <span key={mi} className="text-[11px] text-[#374151]" style={{ fontFamily: PP }}>• {mi}</span>)}
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-[10px] font-bold text-[#22c55e] mb-1.5 uppercase tracking-wide" style={{ fontFamily: PP }}>💚 Kompetensimu</p>
                                      <div className="flex flex-col gap-1">
                                        {m.kompetensi.map(k => <span key={k} className="text-[11px] text-[#374151]" style={{ fontFamily: PP }}>• {k}</span>)}
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* University list */}
                    <div>
                      <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest mb-2.5" style={{ fontFamily: PP }}>🏫 Pilihan Kampus</p>
                      <div className="flex flex-col gap-2">
                        {path.unis.map((uni, i) => (
                          <div key={uni.name} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-[rgba(0,0,0,0.07)]">
                            <span className="text-[11px] text-[#c4c8d4] w-4 shrink-0 font-bold text-center" style={{ fontFamily: PP }}>{i + 1}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-semibold text-[#1a1d2e] truncate" style={{ fontFamily: PP }}>{uni.name}</p>
                              <p className="text-[10px] text-[#9ca3af]" style={{ fontFamily: PP }}>
                                {selectedMajor?.startsWith(path.key + ":") ? selectedMajor.split(":")[1] : path.majors[0].name}
                              </p>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="text-[13px] font-black" style={{ color: path.matchColor, fontFamily: PP }}>{uni.pct}%</p>
                              <p className="text-[9px] text-[#9ca3af]" style={{ fontFamily: PP }}>kecocokan profil</p>
                            </div>
                          </div>
                        ))}
                        {/* Orbita recommendation callout */}
                        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl border" style={{ borderColor: "#f1ad0035", background: "#fffbeb" }}>
                          <span className="text-sm shrink-0 mt-0.5">⭐</span>
                          <div>
                            <p className="text-[11px] font-bold text-[#92400e]" style={{ fontFamily: PP }}>Rekomendasi {BRAND.name}</p>
                            <p className="text-[11px] text-[#78350f] leading-relaxed" style={{ fontFamily: PP }}>
                              {path.unis[0]?.name} — paling sesuai dengan profil dan targetmu.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Note */}
                    <p className="text-[10px] text-[#c4c8d4]" style={{ fontFamily: PP }}>* {path.note}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Hidden paths (not relevant) */}
          {HIDDEN_PATHS.length > 0 && (
            <div className="mt-1">
              <p className="text-[10px] font-bold text-[#c4c8d4] uppercase tracking-widest mb-2 px-1" style={{ fontFamily: PP }}>Tidak ditampilkan</p>
              <div className="flex flex-col gap-1.5">
                {HIDDEN_PATHS.map(hp => (
                  <div key={hp.label} className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-dashed border-[rgba(0,0,0,0.08)] bg-[#fafafa]">
                    <span className="text-base shrink-0 opacity-40">{hp.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-[#c4c8d4]" style={{ fontFamily: PP }}>{hp.label}</p>
                      <p className="text-[10px] text-[#d1d5db]" style={{ fontFamily: PP }}>{hp.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-[10px] text-[#c4c8d4] text-center pt-1" style={{ fontFamily: PP }}>
            Hasil berdasarkan profil, minat, kemampuan, dan data akademikmu.
          </p>
        </div>
      </div>

      {/* ── Two-Column: Cross Analysis + Detail Analisis Profil ── */}
      <div className="grid grid-cols-2 gap-5 items-start">

        {/* LEFT: Kesesuaian Bidang + Ringkasan ORBITA */}
        <div className="flex flex-col gap-4">

          {/* Kesesuaian Bidang card */}
          <div className="bg-white rounded-2xl border-2 border-[#f1ad0040] shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#f1ad0025]" style={{ background: "linear-gradient(135deg,#fffbeb,#fefce8)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg,#0965fa,#00b2dd)" }}>
                <span className="text-[15px]">⭐</span>
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Kesesuaian Bidang</p>
                <p className="text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>Interest Profile × Competency Profile</p>
              </div>
            </div>

            {/* Score */}
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-end gap-3 mb-5">
                <div>
                  <div className="w-8 h-8 rounded-full mb-1" style={{ background: "#22c55e" }} />
                  <p className="text-[40px] font-black leading-none" style={{ color: "#22c55e", fontFamily: PP }}>89%</p>
                  <p className="text-[12px] font-bold mt-0.5" style={{ color: "#22c55e", fontFamily: PP }}>Sangat Selaras</p>
                </div>
              </div>

              {/* Three stat boxes */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: "Bidang Minat Dominan", value: "Teknologi & Riset" },
                  { label: "Bidang Kompetensi Dominan", value: "Teknologi & Analisis Data" },
                  { label: "Tingkat Kesesuaian", value: "89% — Sangat Selaras" },
                ].map(stat => (
                  <div key={stat.label} className="rounded-xl border border-[rgba(0,0,0,0.08)] px-3 py-3">
                    <p className="text-[10px] text-[#9ca3af] mb-1 leading-tight" style={{ fontFamily: PP }}>{stat.label}</p>
                    <p className="text-[12px] font-bold text-[#1a1d2e] leading-snug" style={{ fontFamily: PP }}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Catatan ORBITA */}
              <div className="rounded-xl px-4 py-3" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                <p className="text-[11px] font-bold text-[#15803d] mb-1" style={{ fontFamily: PP }}>Catatan {BRAND.name}</p>
                <p className="text-[11px] text-[#166534] leading-relaxed" style={{ fontFamily: PP }}>
                  Minat, kemampuan akademik, dan pengalaman yang kamu miliki menunjukkan arah yang konsisten menuju bidang teknologi sehingga rekomendasi yang diberikan memiliki tingkat keyakinan yang tinggi.
                </p>
              </div>
            </div>
          </div>

          {/* Ringkasan ORBITA card */}
          <div className="rounded-2xl px-5 py-5" style={{ background: "linear-gradient(135deg,#0f172a,#1e1b4b)" }}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(255,255,255,0.08)" }}>
                <span className="text-[18px]">🧠</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold mb-2" style={{ color: "#00b2dd", fontFamily: PP }}>Ringkasan {BRAND.name}</p>
                <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.82)", fontFamily: PP }}>
                  Berdasarkan seluruh data yang telah dianalisis, kamu memiliki potensi kuat pada bidang{" "}
                  <span className="font-bold" style={{ color: "#00b2dd" }}>teknologi</span>{" "}
                  yang membutuhkan kemampuan problem solving, analytical thinking, dan kolaborasi. Minatmu terhadap teknologi juga didukung oleh perkembangan nilai akademik yang konsisten serta pengalaman organisasi yang relevan.
                </p>
              </div>
            </div>
          </div>

          {/* Konsultasi BK button */}
          <button
            onClick={() => onNavigate?.("konsultasi")}
            className="w-full py-3 rounded-2xl text-[13px] font-bold text-white hover:opacity-90 transition-all flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(90deg,#0965fa,#00b2dd)", fontFamily: PP, outline: "none" }}
          >
            💬 Konsultasi Guru BK
          </button>
        </div>

        {/* RIGHT: Detail Analisis Profil */}
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
          <div className="px-6 pt-5 pb-0">
            <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest mb-1" style={{ fontFamily: PP }}>Analisis Mendalam</p>
            <h3 className="text-[15px] font-bold text-[#1a1d2e] mb-4" style={{ fontFamily: PP }}>🔍 Detail Analisis Profil</h3>
            <div className="flex gap-0 border-b border-[rgba(0,0,0,0.06)]">
              {(["Minat", "Kompetensi", "Akademik"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setDetailTab(tab)}
                  className="px-5 py-2.5 text-[12px] font-semibold transition-all border-b-2 -mb-px"
                  style={{
                    borderBottomColor: detailTab === tab ? "#0965fa" : "transparent",
                    color: detailTab === tab ? "#0965fa" : "#6b7280",
                    fontFamily: PP,
                    outline: "none",
                  }}
                >{tab}</button>
              ))}
            </div>
          </div>

          {detailTab === "Minat" && (
            <div className="px-6 py-5 grid grid-cols-[1fr_160px] gap-5 items-start">
              <div className="flex flex-col gap-4">
                <AlignScore pct={92} emoji="🟦" label="Sangat Konsisten" />
                <div className="flex flex-col gap-3">
                  {[
                    ["Minat Dominan", "Teknologi, Riset & Inovasi"],
                    ["Motivasi", "Ingin menciptakan solusi melalui teknologi dan data."],
                    ["Tujuan Karier", "Berkarier pada bidang Teknologi Informasi."],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-start gap-3">
                      <span className="text-[11px] text-[#9ca3af] w-28 shrink-0 font-medium pt-0.5" style={{ fontFamily: PP }}>{k}</span>
                      <span className="text-[12px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-4" style={{ background: "linear-gradient(135deg,#eff6ff,#e0f2fe)" }}>
                  <p className="text-[11px] font-bold text-[#0965fa] mb-1" style={{ fontFamily: PP }}>Analisis Keselarasan Minat</p>
                  <p className="text-[12px] text-[#1e40af] leading-relaxed" style={{ fontFamily: PP }}>
                    Hasil asesmen dan refleksi menunjukkan ketertarikan yang tinggi pada bidang teknologi, analisis data, serta penyelesaian masalah.
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#9ca3af] text-center mb-1 font-medium" style={{ fontFamily: PP }}>Interest Radar</p>
                <SvgRadar axes={["Technology","Research","Creativity","Leadership","Communication"]} values={[92,85,78,88,74]} color="#0965fa" />
              </div>
            </div>
          )}

          {detailTab === "Kompetensi" && (
            <div className="px-6 py-5 grid grid-cols-[1fr_160px] gap-5 items-start">
              <div className="flex flex-col gap-4">
                <AlignScore pct={90} emoji="🟦" label="Sangat Konsisten" />
                <div className="flex flex-col gap-3">
                  {[
                    ["Bidang Dominan", "Teknologi & Analisis Data"],
                    ["Kekuatan Utama", "Pemecahan Masalah & Berpikir Analitis"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-start gap-3">
                      <span className="text-[11px] text-[#9ca3af] w-28 shrink-0 font-medium pt-0.5" style={{ fontFamily: PP }}>{k}</span>
                      <span className="text-[12px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Problem Solving", pct: 95, color: "#0965fa" },
                    { label: "Analisis Data", pct: 93, color: "#8b5cf6" },
                    { label: "Logika", pct: 91, color: "#00b2dd" },
                    { label: "Komunikasi", pct: 84, color: "#22c55e" },
                    { label: "Kolaborasi", pct: 82, color: "#f1ad00" },
                  ].map(s => <CBar key={s.label} label={s.label} pct={s.pct} color={s.color} />)}
                </div>
                <div className="rounded-xl p-4" style={{ background: "linear-gradient(135deg,#f5f3ff,#ede9fe)" }}>
                  <p className="text-[11px] font-bold text-[#7c3aed] mb-1" style={{ fontFamily: PP }}>Analisis Kompetensi</p>
                  <p className="text-[12px] text-[#5b21b6] leading-relaxed" style={{ fontFamily: PP }}>
                    Performa akademik yang konsisten serta berbagai pengalaman menunjukkan kompetensi kuat pada bidang analitis dan teknologi.
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#9ca3af] text-center mb-1 font-medium" style={{ fontFamily: PP }}>Competency Radar</p>
                <SvgRadar axes={["Problem Solving","Leadership","Analytical","Communication","Learning"]} values={[95,90,92,74,87]} color="#8b5cf6" />
              </div>
            </div>
          )}

          {detailTab === "Akademik" && (
            <div className="px-6 py-5 flex flex-col gap-4">
              <AlignScore pct={90} emoji="🟩" label="Sangat Baik" />
              <div className="flex flex-col gap-3">
                {[
                  ["Rata-rata Nilai", "88.4"],
                  ["Ranking Kelas", "Top 5%"],
                  ["Prestasi", "Juara 1 Olimpiade Matematika Nasional"],
                  ["Keunggulan", "Matematika, Fisika, Informatika"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-start gap-3">
                    <span className="text-[11px] text-[#9ca3af] w-28 shrink-0 font-medium pt-0.5" style={{ fontFamily: PP }}>{k}</span>
                    <span className="text-[12px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Matematika", pct: 92, color: "#0965fa" },
                  { label: "Fisika", pct: 88, color: "#7c3aed" },
                  { label: "Informatika", pct: 95, color: "#0d9488" },
                  { label: "Bahasa Indonesia", pct: 85, color: "#f1ad00" },
                  { label: "Bahasa Inggris", pct: 87, color: "#22c55e" },
                ].map(s => <CBar key={s.label} label={s.label} pct={s.pct} color={s.color} />)}
              </div>
            </div>
          )}
        </div>
      </div>

            {/* ── Scholarship Match ── */}
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)]">
          <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest mb-1" style={{ fontFamily: PP }}>Beasiswa</p>
          <h3 className="text-[15px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>💰 Beasiswa yang bisa kamu coba</h3>
          <p className="text-[12px] text-[#6b7280] mt-0.5" style={{ fontFamily: PP }}>Kuliah sudah punya target. Sekarang cari cara untuk mewujudkannya.</p>
        </div>
        <div className="px-6 py-5 flex flex-col gap-2.5">
          {[
            { name: "Beasiswa KIP Kuliah", level: "S1 / D4", scope: "Dalam Negeri", benefit: "Tuition + Living Allowance", eligMatch: 94, matchColor: "#0965fa" },
            { name: "Beasiswa Unggulan Kemendikbud", level: "S1", scope: "Dalam Negeri", benefit: "Biaya kuliah penuh", eligMatch: 86, matchColor: "#7c3aed" },
            { name: "Djarum Foundation", level: "S1", scope: "Dalam Negeri", benefit: "Biaya hidup + pengembangan", eligMatch: 78, matchColor: "#ff7000" },
          ].map(sch => (
            <div key={sch.name} className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-[rgba(0,0,0,0.07)] hover:shadow-sm transition-all">
              <div className="flex flex-col items-center shrink-0 gap-0.5 w-14">
                <span className="text-[18px] font-black leading-none" style={{ color: sch.matchColor, fontFamily: PP }}>{sch.eligMatch}%</span>
                <span className="text-[9px] text-[#9ca3af] text-center" style={{ fontFamily: PP }}>Eligibility<br />Match</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>{sch.name}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#f0f2f8] text-[#374151]" style={{ fontFamily: PP }}>🎓 {sch.level}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#f0f2f8] text-[#374151]" style={{ fontFamily: PP }}>📍 {sch.scope}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#f0fdf4] text-[#15803d]" style={{ fontFamily: PP }}>💸 {sch.benefit}</span>
                </div>
              </div>
              <button className="shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-xl border transition-all hover:opacity-80" style={{ borderColor: sch.matchColor + "30", color: sch.matchColor, background: sch.matchColor + "08", fontFamily: PP, outline: "none" }}>
                Lihat →
              </button>
            </div>
          ))}
          <p className="text-[10px] text-[#c4c8d4] text-center pt-1" style={{ fontFamily: PP }}>* Eligibility Match bukan jaminan diterima — seleksi beasiswa memiliki kriteria tersendiri.</p>
        </div>
      </div>

      {/* 08 — Langkah Selanjutnya */}
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)]">
          <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest mb-1" style={{ fontFamily: PP }}>Action</p>
          <h3 className="text-[15px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>🚀 Langkah Selanjutnya</h3>
          <p className="text-[12px] text-[#6b7280] mt-0.5" style={{ fontFamily: PP }}>
            Rekomendasimu sudah jelas. Sekarang waktunya mulai persiapan.
          </p>
        </div>
        <div className="px-6 py-5 grid grid-cols-3 gap-4">
          {[
            {
              emoji: "🎓",
              title: "SNBP",
              sub: "Optimalkan nilai & prestasi",
              btn: "Mulai →",
              page: "ptn",
              grad: "linear-gradient(135deg,#0965fa,#00b2dd)",
            },
            {
              emoji: "📘",
              title: "SNBT",
              sub: "Latihan & tryout berkala",
              btn: "Mulai →",
              page: "ptn",
              grad: "linear-gradient(135deg,#8b5cf6,#0965fa)",
            },
            {
              emoji: "🏛️",
              title: "Kedinasan",
              sub: "Eksplorasi jalur alternatif",
              btn: "Eksplorasi →",
              page: "skd",
              grad: "linear-gradient(135deg,#ff7000,#f1ad00)",
            },
          ].map(cta => (
            <div key={cta.title} className="rounded-2xl border border-[rgba(0,0,0,0.07)] p-5 flex flex-col gap-3 hover:shadow-md transition-all">
              <span className="text-2xl">{cta.emoji}</span>
              <div>
                <p className="text-[14px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>{cta.title}</p>
                <p className="text-[12px] text-[#9ca3af] leading-relaxed mt-0.5" style={{ fontFamily: PP }}>{cta.sub}</p>
              </div>
              <button
                onClick={() => onNavigate?.(cta.page)}
                className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white hover:opacity-90 active:scale-95 transition-all mt-auto"
                style={{ background: cta.grad, fontFamily: PP, outline: "none" }}
              >
                {cta.btn}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ─── Analyzing animation ────────────────────────────────────────────────────
function CompassAnalyzingView({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [doneSteps, setDoneSteps] = useState<number[]>([]);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const stepTimers = COMPASS_STEPS.map((s, i) =>
      setTimeout(() => {
        setDoneSteps((prev) => [...prev, i]);
        setPct(
          Math.round(((i + 1) / COMPASS_STEPS.length) * 100),
        );
      }, s.delay),
    );
    const done = setTimeout(onComplete, 5200);
    return () => {
      stepTimers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [onComplete]);

  const bar = Array.from({ length: 20 }, (_, i) =>
    i < Math.floor(pct / 5) ? "█" : "░",
  ).join("");

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="bg-[#0f1117] rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-[#ffffff10]">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
            style={{
              background:
                "linear-gradient(135deg,#0965fa,#00b2dd)",
            }}
          >
            🧭
          </div>
          <p
            className="text-[15px] font-bold text-white"
            style={{ fontFamily: "monospace" }}
          >
            {BRAND.name} AI is analyzing your profile...
          </p>
        </div>
        <div className="flex gap-2 mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#0965fa] animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-3 mb-8">
          {COMPASS_STEPS.map((s, i) => (
            <div
              key={s.label}
              className="flex items-center gap-3"
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${doneSteps.includes(i) ? "bg-[#22c55e]" : "bg-[#ffffff10]"}`}
              >
                {doneSteps.includes(i) && (
                  <Check size={11} className="text-white" />
                )}
              </div>
              <span
                className={`text-[13px] transition-all duration-300 ${doneSteps.includes(i) ? "text-[#22c55e]" : "text-[#ffffff40]"}`}
                style={{ fontFamily: "monospace" }}
              >
                {doneSteps.includes(i) ? "✓ " : "  "}
                {s.label}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-[#ffffff10] pt-5">
          <p
            className="text-[11px] text-[#9ca3af] mb-2"
            style={{ fontFamily: "monospace" }}
          >
            Progress
          </p>
          <p
            className="text-[14px] font-bold text-white mb-1"
            style={{ fontFamily: "monospace" }}
          >
            {bar} {pct}%
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Compass Component ──────────────────────────────────────────────────
export default function OrbitaCompassPage({
  onNavigate,
}: {
  onNavigate?: (page: string) => void;
}) {
  const [compassState, setCompassState] = useState<CompassState>("done");
  const [hasNewData, setHasNewData] = useState(false);
  const [, setAnalysis] = useState<any>(null);

  useEffect(() => {
    getCompassResult()
      .then(analysis => {
        if (analysis) setAnalysis(analysis);
      })
      .catch(() => {});
  }, []);

  async function handleTriggerAnalyze() {
    setCompassState("analyzing");
    try {
      setAnalysis(await analyzeCompass());
    } catch (err) {
      console.warn("Compass AI analyze completed with local fallback", err);
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#f8f9fc] p-6 lg:p-8">
      {compassState === "analyzing" ? (
        <CompassAnalyzingView
          onComplete={() => setCompassState("done")}
        />
      ) : (
        <CompassResultsView
          onReset={handleTriggerAnalyze}
          hasNewData={hasNewData}
          setHasNewData={setHasNewData}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}