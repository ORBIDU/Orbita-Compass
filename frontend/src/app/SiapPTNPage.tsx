import React, { useState } from "react";
import { ArrowLeft, ChevronRight, ChevronDown, X, Check, Lock, TrendingUp, TrendingDown, Minus } from "lucide-react";
import LatihanTKAPage from "./LatihanTKAPage";
import { SNBPRationalizationFlow } from "./SNBPPage";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const PP = "Poppins, sans-serif";
const BLUE = "#2563EB";
const BL = "#eff6ff";

// ─── Types ────────────────────────────────────────────────────────────────────
type MainTab     = "snbp" | "snbt";
type SNBTTab     = "latihan" | "tryout" | "performance";
type LatihanMode = "guided" | "custom";
type LatihanView = "main" | "overview" | "hasil";
type TryoutView  = "list" | "wizard" | "hasil";
type JalurTab    = "snbp" | "snbt" | "mandiri";

const MATERI_LIST = [
  "Penalaran Umum",
  "Pengetahuan Kuantitatif",
  "Literasi Bahasa Indonesia",
  "Literasi Bahasa Inggris",
  "Penalaran Matematika",
];

const MATERI_SUBS: Record<string, string[]> = {
  "Literasi Bahasa Indonesia": ["Kemampuan memahami bacaan dan menulis", "Pengetahuan dan pemahaman umum"],
  "Literasi Bahasa Inggris":   ["Reading Comprehension", "Vocabulary & Grammar"],
  "Penalaran Matematika":      ["Aljabar & Fungsi", "Peluang & Statistika"],
};

const SUBMATERI: Record<string, { name: string; level: string; status: "done" | "active" | "locked" }[]> = {
  "Penalaran Matematika": [
    { name: "Persamaan Linear", level: "Menengah", status: "done" },
    { name: "Fungsi",           level: "Menengah", status: "active" },
    { name: "Peluang",          level: "Sulit",    status: "locked" },
    { name: "Statistika",       level: "Sulit",    status: "locked" },
    { name: "Geometri",         level: "Menengah", status: "locked" },
  ],
  "Penalaran Umum": [
    { name: "Analogi",           level: "Mudah",    status: "done" },
    { name: "Silogisme",         level: "Menengah", status: "active" },
    { name: "Penalaran Deduktif",level: "Sulit",    status: "locked" },
  ],
  "Pengetahuan Kuantitatif": [
    { name: "Aritmetika",   level: "Mudah",    status: "done" },
    { name: "Aljabar",      level: "Menengah", status: "active" },
    { name: "Perbandingan", level: "Menengah", status: "locked" },
  ],
  "Literasi Bahasa Indonesia": [
    { name: "Pemahaman Bacaan",  level: "Mudah",    status: "done" },
    { name: "Analisis Teks",     level: "Menengah", status: "active" },
    { name: "Penalaran Bahasa",  level: "Sulit",    status: "locked" },
  ],
  "Literasi Bahasa Inggris": [
    { name: "Reading Comprehension",  level: "Mudah",    status: "done" },
    { name: "Vocabulary in Context",  level: "Menengah", status: "active" },
    { name: "Critical Reading",       level: "Sulit",    status: "locked" },
  ],
};

const UNIVS = [
  "Universitas Indonesia — Teknik Informatika",
  "Institut Teknologi Bandung — Teknik Informatika",
  "Universitas Gadjah Mada — Ilmu Komputer",
  "Institut Teknologi Sepuluh Nopember — Informatika",
  "Universitas Airlangga — Sistem Informasi",
  "Universitas Brawijaya — Teknik Informatika",
];

const RADAR_DATA = [
  { subject: "PU", value: 88 },
  { subject: "PK", value: 74 },
  { subject: "LI", value: 70 },
  { subject: "LE", value: 75 },
  { subject: "PM", value: 91 },
];

const TREND_DATA = [
  { name: "TO 1",  score: 560, target: 685, chance: 34 },
  { name: "TO 2",  score: 582, target: 685, chance: 48 },
  { name: "TO 3",  score: 618, target: 685, chance: 62 },
  { name: "Lat 1", score: 608, target: 685, chance: 57 },
  { name: "TO 4",  score: 655, target: 685, chance: 82 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Divider() {
  return <div className="border-t border-[rgba(0,0,0,0.06)] my-10" />;
}
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9ca3af] mb-3" style={{ fontFamily: PP }}>
      {children}
    </p>
  );
}
function Timeline({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-col">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-4">
          <div className="flex flex-col items-center shrink-0">
            <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-bold"
              style={{ borderColor: BLUE, color: BLUE, background: i === 0 ? BL : "white", fontFamily: PP }}>
              {i + 1}
            </div>
            {i < steps.length - 1 && <div className="w-px h-8 mt-1 bg-[#e5e7eb]" />}
          </div>
          <p className="text-[14px] text-[#374151] pt-1 pb-8 leading-snug" style={{ fontFamily: PP }}>{step}</p>
        </div>
      ))}
    </div>
  );
}

function SegCtrl<T extends string>({
  tabs, active, onChange, size = "md", variant = "default",
}: { tabs: { key: T; label: string }[]; active: T; onChange: (k: T) => void; size?: "sm" | "md"; variant?: "default" | "colored" }) {
  const px = size === "sm" ? "px-5 py-2" : "px-7 py-2.5";
  if (variant === "colored") {
    return (
      <div className="flex gap-1 p-1 rounded-2xl w-fit" style={{ background: "rgba(9,101,250,0.10)" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => onChange(t.key)}
            className={`${px} rounded-xl text-[13px] font-bold transition-all`}
            style={{
              background: active === t.key ? `linear-gradient(135deg, ${BLUE} 0%, #00b2dd 100%)` : "transparent",
              color: active === t.key ? "white" : BLUE,
              boxShadow: active === t.key ? "0 2px 8px rgba(9,101,250,0.35)" : "none",
              fontFamily: PP, outline: "none",
            }}>
            {t.label}
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className="flex gap-1 p-1 rounded-2xl bg-[#f1f5f9] w-fit">
      {tabs.map(t => (
        <button key={t.key} onClick={() => onChange(t.key)}
          className={`${px} rounded-xl text-[13px] font-semibold transition-all`}
          style={{
            background: active === t.key ? "white" : "transparent",
            color: active === t.key ? "#0f172a" : "#94a3b8",
            boxShadow: active === t.key ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
            fontFamily: PP, outline: "none",
          }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── OVERVIEW MATERI (full-page early return) ────────────────────────────────
function OverviewMateriPage({
  materi, submateri, onBack, onMulai,
}: { materi: string; submateri: string; onBack: () => void; onMulai: () => void }) {
  const [soal, setSoal]         = useState(20);
  const [timer, setTimer]       = useState(false);
  const [pembahasan, setPembahasan] = useState<"setiap" | "selesai">("selesai");

  return (
    <div className="flex flex-col h-full bg-[#f8faff]">
      <div className="shrink-0 bg-white border-b border-[rgba(0,0,0,0.07)] px-8 py-4 flex items-center gap-3">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] font-medium hover:opacity-70"
          style={{ color: BLUE, fontFamily: PP, outline: "none" }}>
          <ArrowLeft size={15} /> Kembali
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-8 py-10 flex flex-col gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: BLUE, fontFamily: PP }}>Overview Materi</p>
            <h1 className="text-[24px] font-bold text-[#0f172a] mb-0.5" style={{ fontFamily: PP }}>{submateri}</h1>
            <p className="text-[13px] text-[#64748b]" style={{ fontFamily: PP }}>{materi}</p>
          </div>

          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.07)] p-6 flex flex-col gap-6">
            {/* Jumlah soal */}
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-[13px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Jumlah Soal</p>
                <p className="text-[14px] font-bold" style={{ color: BLUE, fontFamily: PP }}>{soal}</p>
              </div>
              <input type="range" min={10} max={50} step={10} value={soal} onChange={e => setSoal(+e.target.value)}
                className="w-full" style={{ accentColor: BLUE }} />
              <div className="flex justify-between mt-1">
                {[10,20,30,40,50].map(n => (
                  <span key={n} className="text-[10px] text-[#94a3b8]" style={{ fontFamily: PP }}>{n}</span>
                ))}
              </div>
            </div>

            {/* Timer */}
            <div>
              <p className="text-[13px] font-bold text-[#0f172a] mb-3" style={{ fontFamily: PP }}>Timer</p>
              <div className="flex gap-3">
                {([["off","Tanpa Timer"],["on","Pakai Timer"]] as [string,string][]).map(([k,lbl]) => (
                  <button key={k} onClick={() => setTimer(k === "on")}
                    className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold border transition-all"
                    style={{ background: (k==="on")===timer ? BLUE : "white", color: (k==="on")===timer ? "white" : "#374151", borderColor: (k==="on")===timer ? BLUE : "rgba(0,0,0,0.1)", fontFamily: PP, outline: "none" }}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {/* Pembahasan */}
            <div>
              <p className="text-[13px] font-bold text-[#0f172a] mb-3" style={{ fontFamily: PP }}>Tampilkan Pembahasan</p>
              <div className="flex gap-3">
                {([["setiap","Langsung setiap soal"],["selesai","Setelah selesai"]] as [typeof pembahasan,string][]).map(([k,lbl]) => (
                  <button key={k} onClick={() => setPembahasan(k)}
                    className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold border transition-all"
                    style={{ background: pembahasan===k ? BLUE : "white", color: pembahasan===k ? "white" : "#374151", borderColor: pembahasan===k ? BLUE : "rgba(0,0,0,0.1)", fontFamily: PP, outline: "none" }}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={onMulai}
            className="w-full py-4 rounded-2xl text-[15px] font-bold text-white hover:opacity-90 active:scale-95 transition-all"
            style={{ background: BLUE, fontFamily: PP, outline: "none" }}>
            Mulai Latihan
          </button>
          <div className="h-6" />
        </div>
      </div>
    </div>
  );
}

// ─── HASIL LATIHAN (single scrollable page) ───────────────────────────────────
function HasilLatihanPage({ onBack }: { onBack: () => void }) {
  const perSubtest = [
    { label: "Penalaran Umum",            pct: 88 },
    { label: "Pengetahuan Kuantitatif",   pct: 74 },
    { label: "Penalaran Matematika",      pct: 91 },
    { label: "Literasi Bahasa Indonesia", pct: 65 },
    { label: "Literasi Bahasa Inggris",   pct: 72 },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8faff]">
      <div className="shrink-0 bg-white border-b border-[rgba(0,0,0,0.07)] px-8 py-4 flex items-center">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] font-medium hover:opacity-70 transition-opacity"
          style={{ color: BLUE, fontFamily: PP, outline: "none" }}>
          <ArrowLeft size={15} /> Kembali ke Latihan
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-8 py-10 flex flex-col gap-8">

          {/* Hero */}
          <div className="text-center">
            <p className="text-[13px] font-semibold text-[#94a3b8] mb-5" style={{ fontFamily: PP }}>Latihan Selesai</p>
            <div className="text-[96px] font-bold leading-none mb-2" style={{ color: BLUE, fontFamily: PP }}>82</div>
            <p className="text-[15px] text-[#94a3b8]" style={{ fontFamily: PP }}>Skor Latihan</p>
          </div>

          {/* Ringkasan */}
          <div className="grid grid-cols-5 gap-2">
            {[
              { label: "Accuracy", val: "84%",   color: BLUE },
              { label: "Durasi",   val: "34 mnt", color: "#374151" },
              { label: "Benar",    val: "41",     color: "#22c55e" },
              { label: "Salah",    val: "9",      color: "#ef4444" },
              { label: "Kosong",   val: "0",      color: "#94a3b8" },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-3 text-center border border-[rgba(0,0,0,0.07)]">
                <p className="text-[16px] font-bold mb-0.5" style={{ color: s.color, fontFamily: PP }}>{s.val}</p>
                <p className="text-[10px] text-[#94a3b8]" style={{ fontFamily: PP }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* AI Insight */}
          <div className="rounded-2xl border border-[rgba(37,99,235,0.12)] p-6" style={{ background: BL }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-4" style={{ color: BLUE, fontFamily: PP }}>AI Insight</p>
            <div className="flex flex-col gap-3">
              {[
                "Kamu mengalami peningkatan sebesar 8% dibanding latihan sebelumnya.",
                "Penalaran Matematika menunjukkan perkembangan yang baik.",
                "Namun, Literasi Bahasa Indonesia masih menjadi area yang perlu lebih banyak latihan.",
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: BLUE }} />
                  <p className="text-[13px] text-[#374151] leading-relaxed" style={{ fontFamily: PP }}>{t}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Performa per Subtest */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.07)] p-6">
            <p className="text-[13px] font-bold text-[#0f172a] mb-5" style={{ fontFamily: PP }}>Performa per Subtest</p>
            <div className="flex flex-col gap-4">
              {perSubtest.map(s => (
                <div key={s.label}>
                  <div className="flex justify-between mb-1.5">
                    <p className="text-[13px] text-[#374151]" style={{ fontFamily: PP }}>{s.label}</p>
                    <p className="text-[13px] font-bold" style={{ color: s.pct >= 80 ? "#22c55e" : s.pct >= 70 ? BLUE : "#f97316", fontFamily: PP }}>{s.pct}%</p>
                  </div>
                  <div className="h-2.5 rounded-full bg-[#f1f5f9] overflow-hidden">
                    <div className="h-full rounded-full"
                      style={{ width: `${s.pct}%`, background: s.pct >= 80 ? "#22c55e" : s.pct >= 70 ? BLUE : "#f97316" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.07)] p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: BLUE, fontFamily: PP }}>AI Recommendation</p>
            <div className="flex flex-col mt-4 mb-6">
              {[
                "Review Pembahasan",
                "Lanjutkan ke materi berikutnya",
                "Ikuti Tryout Mingguan",
              ].map((step, i, arr) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                      style={{ background: BLUE, fontFamily: PP }}>{i + 1}</div>
                    {i < arr.length - 1 && <div className="w-px h-6 bg-[#e5e7eb] my-1" />}
                  </div>
                  <p className="text-[13px] text-[#374151] pt-0.5 pb-5" style={{ fontFamily: PP }}>{step}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              <button className="w-full py-3.5 rounded-2xl text-[14px] font-bold text-white hover:opacity-90 active:scale-95"
                style={{ background: BLUE, fontFamily: PP, outline: "none" }}>
                Review Pembahasan
              </button>
              <button className="w-full py-3.5 rounded-2xl text-[14px] font-semibold border hover:bg-[#f8faff]"
                style={{ borderColor: "rgba(0,0,0,0.1)", color: "#374151", fontFamily: PP, outline: "none" }}>
                Lanjut Belajar
              </button>
              <button onClick={onBack} className="w-full py-3 text-[13px]"
                style={{ color: "#94a3b8", fontFamily: PP, outline: "none" }}>
                Kerjakan Lagi
              </button>
            </div>
          </div>

          <div className="h-6" />
        </div>
      </div>
    </div>
  );
}

// ─── TKA DATA ────────────────────────────────────────────────────────────────
type TKASubtest = "PU" | "PK" | "LBI" | "LBE" | "PM";
type TKAMatStatus = "done" | "active" | "pending";
type TKADifficulty = "Dasar" | "Menengah" | "Sulit";
interface TKAMatItem { name: string; status: TKAMatStatus; progress?: number; difficulty: TKADifficulty; }

const TKA_DATA: Record<TKASubtest, { label: string; desc: string; color: string; items: TKAMatItem[] }> = {
  PU: {
    label: "Penalaran Umum",
    desc: "Kemampuan berpikir logis, analitis, dan penalaran verbal-numerik.",
    color: "#2563EB",
    items: [
      { name: "Analogi Verbal",       status: "done",    progress: 100, difficulty: "Dasar" },
      { name: "Silogisme",            status: "active",  progress: 55,  difficulty: "Menengah" },
      { name: "Penalaran Deduktif",   status: "pending",               difficulty: "Sulit" },
      { name: "Penalaran Induktif",   status: "pending",               difficulty: "Menengah" },
      { name: "Penalaran Numerik",    status: "pending",               difficulty: "Sulit" },
    ],
  },
  PK: {
    label: "Pengetahuan Kuantitatif",
    desc: "Pemahaman konsep matematika dasar dan penerapannya secara kuantitatif.",
    color: "#7c3aed",
    items: [
      { name: "Aritmetika Dasar",       status: "done",    progress: 100, difficulty: "Dasar" },
      { name: "Aljabar",                status: "active",  progress: 40,  difficulty: "Menengah" },
      { name: "Perbandingan & Proporsi",status: "pending",               difficulty: "Menengah" },
      { name: "Geometri Dasar",         status: "pending",               difficulty: "Menengah" },
      { name: "Statistika Dasar",       status: "pending",               difficulty: "Sulit" },
    ],
  },
  LBI: {
    label: "Literasi Bahasa Indonesia",
    desc: "Kemampuan membaca, memahami, dan menganalisis teks bahasa Indonesia.",
    color: "#059669",
    items: [
      { name: "Pemahaman Bacaan",       status: "done",    progress: 100, difficulty: "Dasar" },
      { name: "Ide Pokok & Gagasan",    status: "active",  progress: 65,  difficulty: "Menengah" },
      { name: "Analisis Teks Sastra",   status: "pending",               difficulty: "Menengah" },
      { name: "Penalaran Bahasa",       status: "pending",               difficulty: "Sulit" },
      { name: "Kosakata dalam Konteks", status: "pending",               difficulty: "Menengah" },
    ],
  },
  LBE: {
    label: "Literasi Bahasa Inggris",
    desc: "Kemampuan membaca dan memahami teks bahasa Inggris akademik.",
    color: "#d97706",
    items: [
      { name: "Reading Comprehension", status: "done",    progress: 100, difficulty: "Dasar" },
      { name: "Vocabulary in Context", status: "active",  progress: 30,  difficulty: "Menengah" },
      { name: "Grammar in Use",        status: "pending",               difficulty: "Menengah" },
      { name: "Critical Analysis",     status: "pending",               difficulty: "Sulit" },
    ],
  },
  PM: {
    label: "Penalaran Matematika",
    desc: "Penalaran berbasis konsep matematika tingkat menengah hingga lanjut.",
    color: "#dc2626",
    items: [
      { name: "Persamaan & Pertidaksamaan", status: "done",    progress: 100, difficulty: "Dasar" },
      { name: "Fungsi & Grafik",            status: "active",  progress: 45,  difficulty: "Menengah" },
      { name: "Peluang & Statistika",       status: "pending",               difficulty: "Sulit" },
      { name: "Geometri & Pengukuran",      status: "pending",               difficulty: "Menengah" },
      { name: "Barisan & Deret",            status: "pending",               difficulty: "Sulit" },
    ],
  },
};
const TKA_ORDER: TKASubtest[] = ["PU", "PK", "LBI", "LBE", "PM"];

// ─── TKA STATUS & DIFFICULTY BADGES ──────────────────────────────────────────
function TKAStatusBadge({ status }: { status: TKAMatStatus }) {
  const cfg = {
    done:    { label: "Selesai",           bg: "#f0fdf4", color: "#16a34a" },
    active:  { label: "Sedang Dipelajari", bg: BL,        color: BLUE },
    pending: { label: "Belum Dimulai",     bg: "#f8fafc",  color: "#94a3b8" },
  }[status];
  return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: cfg.bg, color: cfg.color, fontFamily: PP }}>{cfg.label}</span>;
}
function TKADiffBadge({ level }: { level: TKADifficulty }) {
  const cfg = {
    Dasar:    { bg: "#f1f5f9", color: "#64748b" },
    Menengah: { bg: BL,        color: BLUE },
    Sulit:    { bg: "#f5f3ff", color: "#7c3aed" },
  }[level];
  return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: cfg.bg, color: cfg.color, fontFamily: PP }}>{level}</span>;
}

// ─── TKA CONFIG MODAL ────────────────────────────────────────────────────────
function TKAConfigModal({ materi, subtestColor, onClose }: { materi: TKAMatItem; subtestColor: string; onClose: () => void }) {
  const [jumlah, setJumlah]   = useState<number | "custom">(20);
  const [custom, setCustom]   = useState("");
  const [timerOn, setTimerOn] = useState(false);
  const [durasi, setDurasi]   = useState("30");
  const [mode, setMode]       = useState<"per" | "selesai">("selesai");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full flex flex-col overflow-hidden" style={{ maxWidth: 680 }}>
        <div className="px-8 py-6 border-b border-[#f1f5f9] flex items-start justify-between">
          <div>
            <p className="text-[20px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>{materi.name}</p>
            <p className="text-[13px] text-[#94a3b8] mt-1" style={{ fontFamily: PP }}>Konfigurasikan sesi latihan sebelum memulai.</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#e2e8f0] transition-all ml-6 shrink-0" style={{ outline: "none" }}>
            <X size={16} color="#64748b" />
          </button>
        </div>
        <div className="px-8 py-7 flex flex-col gap-7">
          <div>
            <p className="text-[14px] font-bold text-[#0f172a] mb-3" style={{ fontFamily: PP }}>Jumlah Soal</p>
            <div className="flex gap-2">
              {([10, 20, 30, "custom"] as const).map(n => (
                <button key={n} onClick={() => setJumlah(n)}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold border-2 transition-all"
                  style={{ fontFamily: PP, outline: "none", borderColor: jumlah === n ? subtestColor : "#E5E7EB", background: jumlah === n ? `${subtestColor}12` : "transparent", color: jumlah === n ? subtestColor : "#374151" }}>
                  {n === "custom" ? "Custom" : n}
                </button>
              ))}
            </div>
            {jumlah === "custom" && (
              <input value={custom} onChange={e => setCustom(e.target.value)} type="number" placeholder="Masukkan jumlah soal"
                className="mt-3 w-full px-4 py-3 rounded-xl border text-[14px] focus:outline-none"
                style={{ borderColor: subtestColor, fontFamily: PP }} />
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[14px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Timer</p>
              <button onClick={() => setTimerOn(v => !v)} className="relative w-12 h-6 rounded-full transition-all" style={{ background: timerOn ? subtestColor : "#e2e8f0", outline: "none" }}>
                <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all" style={{ left: timerOn ? "26px" : "2px" }} />
              </button>
            </div>
            {timerOn ? (
              <div className="flex items-center gap-2">
                <input value={durasi} onChange={e => setDurasi(e.target.value)} type="number"
                  className="w-20 px-3 py-2.5 rounded-xl border text-[13px] focus:outline-none text-center" style={{ borderColor: subtestColor, fontFamily: PP }} />
                <p className="text-[13px] text-[#64748b]" style={{ fontFamily: PP }}>menit</p>
              </div>
            ) : <p className="text-[13px] text-[#94a3b8]" style={{ fontFamily: PP }}>Latihan tanpa batas waktu</p>}
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#0f172a] mb-3" style={{ fontFamily: PP }}>Mode Pembahasan</p>
            {(["per", "selesai"] as const).map(opt => (
              <label key={opt} className="flex items-start gap-3 mb-3 last:mb-0 cursor-pointer">
                <div onClick={() => setMode(opt)} className="w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer mt-0.5 shrink-0"
                  style={{ borderColor: mode === opt ? subtestColor : "#d1d5db" }}>
                  {mode === opt && <div className="w-2 h-2 rounded-full" style={{ background: subtestColor }} />}
                </div>
                <p className="text-[14px] text-[#374151]" style={{ fontFamily: PP }}>
                  {opt === "per" ? "Tampilkan pembahasan setiap soal" : "Tampilkan pembahasan setelah latihan selesai"}
                </p>
              </label>
            ))}
          </div>
        </div>
        <div className="px-8 py-5 border-t border-[#f1f5f9] flex gap-3">
          <button onClick={onClose} className="flex-1 py-3.5 rounded-2xl text-[14px] font-semibold border border-[#E5E7EB] text-[#374151] hover:bg-[#f8fafc] transition-all" style={{ fontFamily: PP, outline: "none" }}>Batal</button>
          <button className="flex-1 py-3.5 rounded-2xl text-[14px] font-bold text-white hover:opacity-90 transition-all" style={{ background: subtestColor, fontFamily: PP, outline: "none" }}>Mulai Latihan</button>
        </div>
      </div>
    </div>
  );
}

// ─── TKA SUBTEST PICKER (bottom sheet) ───────────────────────────────────────
function TKASubtestPicker({ current, onChange, onClose }: { current: TKASubtest; onChange: (s: TKASubtest) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full flex justify-center pb-6 px-4" style={{ animation: "slideUp 0.28s cubic-bezier(0.16,1,0.3,1)" }}>
        <div className="bg-white rounded-3xl shadow-2xl w-full flex flex-col overflow-hidden" style={{ maxWidth: 640 }}>
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-10 h-1 rounded-full bg-[#e2e8f0]" />
          </div>
          <div className="px-8 pt-2 pb-5 border-b border-[#f1f5f9] flex items-start justify-between">
            <div>
              <p className="text-[19px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Pilih Subtes TKA</p>
              <p className="text-[13px] text-[#94a3b8] mt-1" style={{ fontFamily: PP }}>Pilih subtes yang ingin dipelajari.</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#e2e8f0] transition-all" style={{ outline: "none" }}>
              <X size={16} color="#64748b" />
            </button>
          </div>
          <div className="px-8 py-6 flex flex-col gap-3">
            {TKA_ORDER.map(s => {
              const data = TKA_DATA[s];
              const isActive = s === current;
              const doneCount = data.items.filter(i => i.status === "done").length;
              const pct = Math.round((doneCount / data.items.length) * 100);
              return (
                <button key={s} onClick={() => { onChange(s); onClose(); }}
                  className="w-full text-left rounded-2xl border-2 px-6 py-5 transition-all hover:shadow-md"
                  style={{ borderColor: isActive ? data.color : "#E5E7EB", background: isActive ? `${data.color}0d` : "white", outline: "none" }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black text-white shrink-0" style={{ background: data.color }}>{s}</div>
                      <div>
                        <p className="text-[15px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>{data.label}</p>
                        <p className="text-[12px] text-[#94a3b8]" style={{ fontFamily: PP }}>{data.items.length} Materi</p>
                      </div>
                    </div>
                    {isActive && <Check size={18} strokeWidth={2.5} color={data.color} />}
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex-1 h-1.5 rounded-full bg-[#e2e8f0] overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: data.color }} />
                    </div>
                    <p className="text-[11px] font-bold shrink-0" style={{ color: data.color, fontFamily: PP }}>{pct}%</p>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="h-2" />
        </div>
      </div>
      <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
    </div>
  );
}

// ─── TKA GUIDED LEARNING ─────────────────────────────────────────────────────
function TKAGuidedLearning() {
  const [subtest,    setSubtest]    = useState<TKASubtest>("PU");
  const [modalItem,  setModalItem]  = useState<TKAMatItem | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const data       = TKA_DATA[subtest];
  const doneCount  = data.items.filter(i => i.status === "done").length;
  const totalCount = data.items.length;
  const progress   = Math.round((doneCount / totalCount) * 100);

  function btnLabel(s: TKAMatStatus) { return s === "done" ? "Lihat Materi" : s === "active" ? "Lanjutkan" : "Mulai"; }
  function btnStyle(s: TKAMatStatus, color: string) {
    if (s === "done")   return { background: "transparent", color: "#22c55e", border: "1.5px solid #22c55e" };
    if (s === "active") return { background: color, color: "white", border: "none" };
    return { background: "#f8fafc", color: "#94a3b8", border: "1px solid #E5E7EB" };
  }

  return (
    <div className="flex flex-col gap-5">
      {/* ── Parent Card (subtest) ── */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] px-8 py-7" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black text-white shrink-0" style={{ background: data.color }}>{subtest}</div>
            <div className="flex-1">
              <p className="text-[22px] font-bold text-[#0f172a] leading-tight" style={{ fontFamily: PP }}>{data.label}</p>
              <p className="text-[13px] text-[#94a3b8] mt-0.5" style={{ fontFamily: PP }}>{totalCount} Materi · {doneCount} Selesai</p>
            </div>
          </div>
        </div>
        <p className="text-[13px] text-[#64748b] mb-5" style={{ fontFamily: PP }}>{data.desc}</p>

        {/* Progress bar */}
        <div className="h-2 rounded-full bg-[#e2e8f0] overflow-hidden mb-2">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: data.color }} />
        </div>
        <div className="flex items-center justify-between mb-5">
          <p className="text-[12px] text-[#94a3b8]" style={{ fontFamily: PP }}>Progress Belajar</p>
          <p className="text-[12px] font-bold" style={{ color: data.color, fontFamily: PP }}>{progress}%</p>
        </div>

        {/* Ganti Mata Pelajaran button */}
        <div className="flex justify-end">
          <button onClick={() => setShowPicker(true)}
            className="px-5 py-2.5 rounded-xl text-[13px] font-bold border-2 transition-all hover:bg-[#f8fafc]"
            style={{ borderColor: "#E5E7EB", color: "#374151", fontFamily: PP, outline: "none" }}>
            Ganti Mata Pelajaran
          </button>
        </div>
      </div>

      {/* ── AI Recommendation Strip ── */}
      <div className="rounded-xl border px-4 py-3 flex items-center gap-3" style={{ background: `${data.color}0d`, borderColor: `${data.color}25` }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: data.color }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <p className="text-[12px] text-[#374151] leading-relaxed" style={{ fontFamily: PP }}>
          AI merekomendasikan <span className="font-bold text-[#0f172a]">{data.label}</span> — akurasi minggu ini{" "}
          <span className="font-bold" style={{ color: "#f97316" }}>68%</span>
        </p>
      </div>

      {/* ── Child Materi Cards ── */}
      <div className="flex flex-col gap-3">
        {data.items.map((item, idx) => {
          const isDone   = item.status === "done";
          const isActive = item.status === "active";
          const bs = btnStyle(item.status, data.color);
          const progColor = isDone ? "#22c55e" : data.color;
          return (
            <div key={idx} className="bg-white rounded-2xl border px-6 py-5 flex items-center gap-5 transition-all hover:shadow-md"
              style={{ borderColor: isActive ? data.color : "#E5E7EB", boxShadow: isActive ? `0 0 0 1px ${data.color}22` : "none" }}>
              {/* Left: index / check */}
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-[13px] font-bold"
                style={{ background: isActive ? `${data.color}15` : isDone ? "#f0fdf4" : "#f8fafc", color: isActive ? data.color : isDone ? "#22c55e" : "#94a3b8", fontFamily: PP }}>
                {isDone ? <Check size={15} strokeWidth={3} color="#22c55e" /> : idx + 1}
              </div>

              {/* Middle: name + badges + progress */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                  <p className="text-[15px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>{item.name}</p>
                  <TKADiffBadge level={item.difficulty} />
                  <TKAStatusBadge status={item.status} />
                </div>
                {item.progress !== undefined && (
                  <div className="flex items-center gap-2.5 max-w-[280px]">
                    <div className="flex-1 h-1.5 rounded-full bg-[#f1f5f9] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${item.progress}%`, background: progColor }} />
                    </div>
                    <p className="text-[11px] font-bold shrink-0" style={{ color: progColor, fontFamily: PP }}>{item.progress}%</p>
                  </div>
                )}
              </div>

              {/* Right: button */}
              <button onClick={() => setModalItem(item)}
                className="shrink-0 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all hover:opacity-80"
                style={{ ...bs, fontFamily: PP, outline: "none" }}>
                {btnLabel(item.status)}
              </button>
            </div>
          );
        })}
      </div>

      {modalItem  && <TKAConfigModal materi={modalItem} subtestColor={data.color} onClose={() => setModalItem(null)} />}
      {showPicker && <TKASubtestPicker current={subtest} onChange={setSubtest} onClose={() => setShowPicker(false)} />}
    </div>
  );
}

// ─── PRACTICE CENTER — mode select + config ───────────────────────────────────
function PracticeCenterContent({
  onMulaiSubmateri, onMulaiCustom,
  selectedMateri, setSelectedMateri,
}: {
  onMulaiSubmateri: (sub: string) => void;
  onMulaiCustom: () => void;
  selectedMateri: string;
  setSelectedMateri: (m: string) => void;
}) {
  const [mode, setMode] = useState<LatihanMode>("guided");
  const [showGanti, setShowGanti] = useState(false);

  // Custom config
  const [customNama, setCustomNama]       = useState("");
  const [customChecked, setCustomChecked] = useState<string[]>([]);
  const [customSoal, setCustomSoal]       = useState("30");
  const [customTimer, setCustomTimer]     = useState("45");
  const [customBahas, setCustomBahas]     = useState<"setiap" | "selesai">("selesai");

  function toggleCustom(m: string) {
    setCustomChecked(c => c.includes(m) ? c.filter(x => x !== m) : [...c, m]);
  }

  const sub = SUBMATERI[selectedMateri] ?? [];
  const doneCount = sub.filter(s => s.status === "done").length;
  const progress  = sub.length ? Math.round((doneCount / sub.length) * 100) : 0;


  // ─ Tab nav ─
  const modeTabs: { key: LatihanMode; label: string }[] = [
    { key: "guided", label: "Guided Practice" },
  ];

  // ─ AI Guided ─
  if (mode === "guided") {
    return (
      <div className="flex flex-col gap-5">
        {/* Mode tabs */}
        <div className="flex p-1 rounded-2xl bg-[#f1f5f9]">
          {modeTabs.map(t => (
            <button key={t.key} onClick={() => setMode(t.key)}
              className="flex-1 py-2 rounded-xl text-[13px] font-semibold transition-all"
              style={{ fontFamily: PP, background: mode === t.key ? "white" : "transparent", color: mode === t.key ? "#0f172a" : "#64748b", boxShadow: mode === t.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none", outline: "none" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Selected materi header */}
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.07)] p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9ca3af] mb-1" style={{ fontFamily: PP }}>Mata Pelajaran</p>
              <p className="text-[20px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>{selectedMateri}</p>
              {MATERI_SUBS[selectedMateri] && (
                <p className="text-[12px] text-[#64748b] mt-0.5" style={{ fontFamily: PP }}>
                  {MATERI_SUBS[selectedMateri].join(" · ")}
                </p>
              )}
            </div>
            <button onClick={() => setShowGanti(v => !v)}
              className="px-4 py-2 rounded-xl text-[12px] font-bold border transition-all hover:bg-[#f8faff]"
              style={{ borderColor: "rgba(0,0,0,0.1)", color: BLUE, fontFamily: PP, outline: "none" }}>
              {showGanti ? "Tutup" : "Ganti"}
            </button>
          </div>

          {/* Ganti picker dropdown */}
          {showGanti && (
            <div className="pt-4 border-t border-[#f1f5f9] grid grid-cols-2 gap-2 mb-4">
              {MATERI_LIST.map(m => (
                <button key={m} onClick={() => { setSelectedMateri(m); setShowGanti(false); }}
                  className="px-3.5 py-2.5 rounded-xl text-[12px] font-semibold text-left transition-all border"
                  style={{
                    fontFamily: PP, outline: "none",
                    borderColor: m === selectedMateri ? BLUE : "rgba(0,0,0,0.08)",
                    background: m === selectedMateri ? BL : "white",
                    color: m === selectedMateri ? BLUE : "#374151",
                  }}>
                  {m}
                </button>
              ))}
            </div>
          )}

          {/* Progress */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 h-2 rounded-full bg-[#f1f5f9] overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${progress}%`, background: BLUE }} />
            </div>
            <p className="text-[12px] font-bold shrink-0" style={{ color: BLUE, fontFamily: PP }}>{progress}%</p>
          </div>
        </div>

        {/* AI Recommendation strip */}
        <div className="rounded-xl border px-4 py-3 flex items-center gap-3" style={{ background: BL, borderColor: "rgba(37,99,235,0.15)" }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: BLUE }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <p className="text-[12px] text-[#374151] leading-relaxed" style={{ fontFamily: PP }}>
            AI merekomendasikan fokus pada <span className="font-bold text-[#0f172a]">{sub.find(s=>s.status==="active")?.name ?? "materi aktif"}</span> — akurasi minggu ini <span className="font-bold" style={{ color: "#f97316" }}>68%</span>
          </p>
        </div>

        {/* Submateri list */}
        <div className="flex flex-col gap-2.5">
          <p className="text-[13px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Daftar Submateri</p>
          {sub.map((item, idx) => (
            <div key={item.name}
              className="bg-white rounded-2xl border border-[rgba(0,0,0,0.07)] p-4 flex items-center justify-between transition-all hover:shadow-sm"
              style={{ opacity: item.status === "locked" ? 0.6 : 1 }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[12px] font-bold shrink-0"
                  style={{
                    background: item.status === "done" ? "#f0fdf4" : item.status === "active" ? BL : "#f8fafc",
                    color: item.status === "done" ? "#22c55e" : item.status === "active" ? BLUE : "#94a3b8",
                    fontFamily: PP,
                  }}>
                  {item.status === "done" ? <Check size={14} strokeWidth={3} /> : idx + 1}
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>{item.name}</p>
                  <p className="text-[11px] text-[#94a3b8]" style={{ fontFamily: PP }}>Tingkat: {item.level}</p>
                </div>
              </div>

              {item.status === "done" && (
                <button onClick={() => onMulaiSubmateri(item.name)}
                  className="px-4 py-2 rounded-xl text-[12px] font-bold border transition-all hover:bg-[#f8faff]"
                  style={{ borderColor: "rgba(0,0,0,0.1)", color: "#374151", fontFamily: PP, outline: "none" }}>
                  Kerjakan Lagi
                </button>
              )}
              {item.status === "active" && (
                <button onClick={() => onMulaiSubmateri(item.name)}
                  className="px-4 py-2 rounded-xl text-[12px] font-bold text-white hover:opacity-90 transition-all"
                  style={{ background: BLUE, fontFamily: PP, outline: "none" }}>
                  Mulai
                </button>
              )}
              {item.status === "locked" && (
                <div className="p-2 rounded-xl bg-[#f8fafc]">
                  <Lock size={14} color="#94a3b8" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

// ─── TRYOUT LANDING ───────────────────────────────────────────────────────────
function TryoutLandingContent({
  onKerjakan, onLihatLaporan,
}: { onKerjakan: () => void; onLihatLaporan: () => void }) {
  const TRYOUTS = [
    { no: 1, status: "available" as const },
    { no: 2, status: "locked" as const },
    { no: 3, status: "done" as const },
    { no: 4, status: "locked" as const },
    { no: 5, status: "locked" as const },
    { no: 6, status: "locked" as const },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: BLUE, fontFamily: PP }}>Tryout Center</p>
        <p className="text-[20px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Simulasi UTBK</p>
      </div>

      {/* Available Tryout grid */}
      <div>
        <p className="text-[13px] font-bold text-[#0f172a] mb-4" style={{ fontFamily: PP }}>Paket Tryout</p>
        <div className="grid grid-cols-3 gap-3">
          {TRYOUTS.map(t => (
            <div key={t.no}
              className="rounded-2xl p-5 border transition-all"
              style={{
                borderColor: t.status === "available" ? BLUE : t.status === "done" ? "rgba(34,197,94,0.3)" : "rgba(0,0,0,0.07)",
                background: t.status === "available" ? BL : t.status === "done" ? "#f0fdf4" : "#f8faff",
                opacity: t.status === "locked" ? 0.55 : 1,
              }}>
              <div className="flex items-start justify-between mb-3">
                <p className="text-[15px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>TO #{t.no}</p>
                {t.status === "locked" && <Lock size={13} color="#94a3b8" />}
                {t.status === "done"   && <Check size={13} color="#22c55e" />}
              </div>
              <p className="text-[11px] font-semibold mb-4"
                style={{ color: t.status === "available" ? BLUE : t.status === "done" ? "#15803d" : "#94a3b8", fontFamily: PP }}>
                {t.status === "available" ? "Belum Dikerjakan" : t.status === "done" ? "Selesai" : "Terkunci"}
              </p>
              {t.status === "available" && (
                <button onClick={onKerjakan}
                  className="w-full py-2 rounded-xl text-[12px] font-bold text-white hover:opacity-90 transition-all"
                  style={{ background: BLUE, fontFamily: PP, outline: "none" }}>Kerjakan</button>
              )}
              {t.status === "done" && (
                <button onClick={onLihatLaporan}
                  className="w-full py-2 rounded-xl text-[12px] font-bold border transition-all"
                  style={{ borderColor: "rgba(34,197,94,0.4)", color: "#15803d", fontFamily: PP, outline: "none" }}>Lihat Laporan</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TRYOUT WIZARD ────────────────────────────────────────────────────────────
const UNIV_LIST = [
  "Universitas Indonesia", "Institut Teknologi Bandung", "Universitas Gadjah Mada",
  "Institut Teknologi Sepuluh Nopember", "Universitas Airlangga", "Universitas Brawijaya",
  "Universitas Diponegoro", "Universitas Padjadjaran", "Universitas Negeri Yogyakarta",
  "Universitas Sebelas Maret", "Universitas Hasanuddin", "Universitas Sumatera Utara",
  "Universitas Andalas", "Universitas Lampung", "Universitas Negeri Jakarta",
  "Universitas Negeri Malang", "Universitas Negeri Semarang", "Institut Pertanian Bogor",
  "Universitas Jenderal Soedirman", "Universitas Syiah Kuala",
];
const JURUSAN_LIST = [
  "Teknik Informatika", "Sistem Informasi", "Ilmu Komputer", "Informatika",
  "Teknik Elektro", "Teknik Mesin", "Teknik Sipil", "Arsitektur",
  "Kedokteran", "Farmasi", "Keperawatan", "Kesehatan Masyarakat",
  "Hukum", "Manajemen", "Akuntansi", "Ekonomi Pembangunan",
  "Psikologi", "Ilmu Komunikasi", "Hubungan Internasional", "Sosiologi",
  "Pendidikan Matematika", "Pendidikan Bahasa Indonesia", "Pendidikan Bahasa Inggris",
  "Matematika", "Fisika", "Kimia", "Biologi", "Statistika",
  "Teknik Kimia", "Teknik Industri", "Teknik Lingkungan", "Perencanaan Wilayah & Kota",
  "Agribisnis", "Agroteknologi", "Kehutanan", "Ilmu Kelautan",
];
const PASSING_GRADE: Record<string, number> = {
  "Teknik Informatika": 743, "Sistem Informasi": 685, "Ilmu Komputer": 720,
  "Informatika": 731, "Teknik Elektro": 698, "Teknik Mesin": 672,
  "Teknik Sipil": 661, "Arsitektur": 654, "Kedokteran": 780,
  "Farmasi": 718, "Keperawatan": 632, "Kesehatan Masyarakat": 618,
  "Hukum": 704, "Manajemen": 692, "Akuntansi": 688, "Ekonomi Pembangunan": 665,
  "Psikologi": 710, "Ilmu Komunikasi": 695, "Hubungan Internasional": 724,
  "Sosiologi": 648, "Pendidikan Matematika": 621, "Pendidikan Bahasa Indonesia": 602,
  "Pendidikan Bahasa Inggris": 615, "Matematika": 685, "Fisika": 668,
  "Kimia": 652, "Biologi": 644, "Statistika": 678, "Teknik Kimia": 681,
  "Teknik Industri": 674, "Teknik Lingkungan": 641, "Perencanaan Wilayah & Kota": 637,
  "Agribisnis": 598, "Agroteknologi": 587, "Kehutanan": 572, "Ilmu Kelautan": 561,
};

function TryoutWizard({ onBack, onSelesai }: { onBack: () => void; onSelesai: () => void }) {
  const [step, setStep]       = useState(1);
  const [selectedUniv, setSelectedUniv] = useState("");
  const [selectedJurusan, setSelectedJurusan] = useState("");

  const passingGrade = PASSING_GRADE[selectedJurusan] ?? 685;

  const STEPS = ["Target", "Analisis", "Overview", "Kerjakan"];

  return (
    <div className="flex flex-col gap-6">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] font-medium w-fit"
        style={{ color: BLUE, fontFamily: PP, outline: "none" }}>
        <ArrowLeft size={15} /> Kembali
      </button>

      {/* Step indicator */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold border-2"
                style={{ background: step > i+1 ? BLUE : step === i+1 ? BLUE : "white", borderColor: step >= i+1 ? BLUE : "#e5e7eb", color: step >= i+1 ? "white" : "#94a3b8", fontFamily: PP }}>
                {step > i+1 ? <Check size={13} strokeWidth={3} /> : i+1}
              </div>
              <p className="text-[10px] mt-1 font-medium" style={{ color: step >= i+1 ? BLUE : "#94a3b8", fontFamily: PP }}>{s}</p>
            </div>
            {i < STEPS.length-1 && (
              <div className="flex-1 h-px mx-1 mb-5" style={{ background: step > i+1 ? BLUE : "#e5e7eb" }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[18px] font-bold text-[#0f172a] mb-1" style={{ fontFamily: PP }}>Pilih Target PTN</p>
            <p className="text-[13px] text-[#64748b]" style={{ fontFamily: PP }}>Tentukan universitas dan jurusan yang kamu tuju.</p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>Universitas</label>
              <div className="relative">
                <select
                  value={selectedUniv}
                  onChange={e => setSelectedUniv(e.target.value)}
                  className="w-full appearance-none px-4 py-3 rounded-2xl border text-[13px] bg-white pr-10"
                  style={{ borderColor: selectedUniv ? BLUE : "rgba(0,0,0,0.1)", color: selectedUniv ? "#0f172a" : "#94a3b8", fontFamily: PP, outline: "none" }}>
                  <option value="">-- Pilih universitas --</option>
                  {UNIV_LIST.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>Program Studi</label>
              <div className="relative">
                <select
                  value={selectedJurusan}
                  onChange={e => setSelectedJurusan(e.target.value)}
                  className="w-full appearance-none px-4 py-3 rounded-2xl border text-[13px] bg-white pr-10"
                  style={{ borderColor: selectedJurusan ? BLUE : "rgba(0,0,0,0.1)", color: selectedJurusan ? "#0f172a" : "#94a3b8", fontFamily: PP, outline: "none" }}>
                  <option value="">-- Pilih program studi --</option>
                  {JURUSAN_LIST.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
                <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
              </div>
            </div>
          </div>
          {selectedUniv && selectedJurusan && (
            <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: BL, border: `1px solid ${BLUE}25` }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: BLUE }}>
                <Check size={16} color="white" strokeWidth={3} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>{selectedJurusan}</p>
                <p className="text-[11px] text-[#64748b]" style={{ fontFamily: PP }}>{selectedUniv}</p>
              </div>
            </div>
          )}
          <button onClick={() => selectedUniv && selectedJurusan && setStep(2)}
            disabled={!selectedUniv || !selectedJurusan}
            className="w-full py-3.5 rounded-2xl text-[14px] font-bold transition-all"
            style={{ background: selectedUniv && selectedJurusan ? BLUE : "#e5e7eb", color: selectedUniv && selectedJurusan ? "white" : "#94a3b8", fontFamily: PP, outline: "none" }}>
            Lanjut
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[18px] font-bold text-[#0f172a] mb-1" style={{ fontFamily: PP }}>Analisis Skor</p>
            <p className="text-[13px] text-[#64748b]" style={{ fontFamily: PP }}>Informasi skor untuk program studi yang kamu pilih.</p>
          </div>
          <div className="rounded-2xl border border-[rgba(0,0,0,0.07)] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-1 text-[#94a3b8]" style={{ fontFamily: PP }}>Program Studi</p>
            <p className="text-[14px] font-bold text-[#0f172a] mb-0.5" style={{ fontFamily: PP }}>{selectedJurusan}</p>
            <p className="text-[12px] text-[#64748b]" style={{ fontFamily: PP }}>{selectedUniv}</p>
          </div>
          <div className="rounded-2xl border border-[rgba(37,99,235,0.15)] p-6 text-center" style={{ background: BL }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-4 text-[#64748b]" style={{ fontFamily: PP }}>Passing Grade</p>
            <p className="text-[48px] font-bold leading-none mb-2" style={{ color: BLUE, fontFamily: PP }}>{passingGrade}</p>
            <p className="text-[12px] text-[#94a3b8]" style={{ fontFamily: PP }}>Skor minimum UTBK yang diperlukan</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-2xl text-[14px] font-semibold border"
              style={{ borderColor: "rgba(0,0,0,0.1)", color: "#374151", fontFamily: PP, outline: "none" }}>Kembali</button>
            <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-2xl text-[14px] font-bold text-white"
              style={{ background: BLUE, fontFamily: PP, outline: "none" }}>Lanjut</button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[18px] font-bold text-[#0f172a] mb-1" style={{ fontFamily: PP }}>Overview Tryout</p>
            <p className="text-[13px] text-[#64748b]" style={{ fontFamily: PP }}>UTBK Full Simulation — Tryout #1</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[{ label: "Subtes", val: "5" }, { label: "Total Soal", val: "185" }, { label: "Durasi", val: "195 mnt" }].map(c => (
              <div key={c.label} className="bg-[#f8faff] rounded-2xl p-5 text-center border border-[rgba(37,99,235,0.08)]">
                <p className="text-[22px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>{c.val}</p>
                <p className="text-[11px] text-[#94a3b8]" style={{ fontFamily: PP }}>{c.label}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-[rgba(0,0,0,0.07)] p-5">
            <p className="text-[12px] font-bold text-[#0f172a] mb-3" style={{ fontFamily: PP }}>Part 1 — Mulai dari sini</p>
            {[
              { name: "Penalaran Umum",            soal: 30, dur: "40 mnt" },
              { name: "Pengetahuan Kuantitatif",   soal: 20, dur: "20 mnt" },
              { name: "Literasi Bahasa Indonesia", soal: 30, dur: "35 mnt" },
              { name: "Literasi Bahasa Inggris",   soal: 20, dur: "25 mnt" },
              { name: "Penalaran Matematika",      soal: 20, dur: "25 mnt" },
            ].map((s, i) => (
              <div key={i} className={`flex justify-between py-2.5 ${i > 0 ? "border-t border-[rgba(0,0,0,0.05)]" : ""}`}>
                <p className="text-[13px] text-[#374151]" style={{ fontFamily: PP }}>{s.name}</p>
                <p className="text-[12px] text-[#94a3b8]" style={{ fontFamily: PP }}>{s.soal} soal · {s.dur}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-2xl text-[14px] font-semibold border"
              style={{ borderColor: "rgba(0,0,0,0.1)", color: "#374151", fontFamily: PP, outline: "none" }}>Kembali</button>
            <button onClick={() => setStep(4)} className="flex-1 py-3 rounded-2xl text-[14px] font-bold text-white"
              style={{ background: BLUE, fontFamily: PP, outline: "none" }}>Mulai Tryout</button>
          </div>
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <div className="flex flex-col gap-5 items-center text-center py-8">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg,${BLUE},#1d4ed8)` }}>
            <div className="w-6 h-6 border-4 border-white/40 border-t-white rounded-full animate-spin" />
          </div>
          <div>
            <p className="text-[20px] font-bold text-[#0f172a] mb-1" style={{ fontFamily: PP }}>Tryout Sedang Berlangsung</p>
            <p className="text-[13px] text-[#64748b]" style={{ fontFamily: PP }}>Selesaikan seluruh soal sesuai waktu yang tersedia.</p>
          </div>
          <button onClick={onSelesai}
            className="px-10 py-3.5 rounded-2xl text-[14px] font-bold text-white mt-4 hover:opacity-90 transition-all"
            style={{ background: BLUE, fontFamily: PP, outline: "none" }}>
            Selesai Mengerjakan
          </button>
          <button onClick={onBack} className="text-[13px]" style={{ color: "#94a3b8", fontFamily: PP, outline: "none" }}>Batalkan Tryout</button>
        </div>
      )}
    </div>
  );
}

// ─── HASIL TRYOUT — Apple Style ───────────────────────────────────────────────
function HasilTryoutPage({ onBack, onLatihanMateri }: { onBack: () => void; onLatihanMateri: () => void }) {
  const [showActionPlan, setShowActionPlan] = useState(false);

  const projection = [618, 638, 654, 683];
  const timeData = [
    { label: "Cepat & Benar",   count: 15, pct: 45, color: "#22c55e" },
    { label: "Lambat tapi Benar",count: 8,  pct: 24, color: "#3b82f6" },
    { label: "Cepat tapi Salah", count: 6,  pct: 18, color: "#ef4444" },
    { label: "Kosong",           count: 4,  pct: 13, color: "#e2e8f0" },
  ];
  const actionPlan = [
    { hari: "Senin",   task: "20 soal Peluang" },
    { hari: "Selasa",  task: "Review Fungsi" },
    { hari: "Rabu",    task: "Mini Tryout" },
    { hari: "Kamis",   task: "20 soal Statistika" },
    { hari: "Jumat",   task: "Review Literasi Indonesia" },
    { hari: "Sabtu",   task: "Full Latihan PM" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8faff]">
      <div className="shrink-0 bg-white border-b border-[rgba(0,0,0,0.07)] px-8 py-4 flex items-center">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] font-medium hover:opacity-70"
          style={{ color: BLUE, fontFamily: PP, outline: "none" }}>
          <ArrowLeft size={15} /> Kembali ke Tryout
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-5">

          {/* Hero — Congratulations */}
          <div className="rounded-3xl overflow-hidden" style={{ background: `linear-gradient(145deg,${BLUE} 0%,#1d4ed8 50%,#1e1b4b 100%)` }}>
            <div className="px-8 py-10 text-center">
              <p className="text-[13px] font-semibold text-white/70 mb-3" style={{ fontFamily: PP }}>Tryout #1 Selesai</p>
              <p className="text-[16px] font-bold text-white/80 mb-2" style={{ fontFamily: PP }}>Congratulations</p>
              <div className="text-[88px] font-bold text-white leading-none mb-2" style={{ fontFamily: PP }}>618</div>
              <div className="flex items-center justify-center gap-3 mt-4">
                <span className="px-4 py-1.5 rounded-full text-[12px] font-bold" style={{ background: "rgba(255,255,255,0.15)", color: "white", fontFamily: PP }}>
                  Peluang Lolos 62%
                </span>
                <span className="px-4 py-1.5 rounded-full text-[12px] font-bold" style={{ background: "rgba(255,255,255,0.15)", color: "white", fontFamily: PP }}>
                  Top 28% Peserta
                </span>
              </div>
            </div>
          </div>

          {/* Score Projection */}
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.07)] shadow-sm">
            <div className="px-7 py-7">
              <p className="text-[13px] font-bold text-[#0f172a] mb-6" style={{ fontFamily: PP }}>Score Projection</p>
              <div className="flex items-end justify-between gap-3 mb-6">
                {projection.map((score, i) => (
                  <React.Fragment key={i}>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-[13px] font-bold" style={{ color: i === 0 ? BLUE : i === projection.length-1 ? "#22c55e" : "#374151", fontFamily: PP }}>{score}</p>
                      <div className="w-14 rounded-xl" style={{ height: 12 + i * 10, background: i === 0 ? BLUE : i === projection.length-1 ? "#22c55e" : "#e2e8f0" }} />
                      <p className="text-[10px] text-[#94a3b8]" style={{ fontFamily: PP }}>TO {i+1}</p>
                    </div>
                    {i < projection.length-1 && (
                      <ChevronRight size={14} color="#94a3b8" className="mb-4 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="rounded-2xl p-4 border border-[rgba(37,99,235,0.12)]" style={{ background: BL }}>
                <p className="text-[12px] text-[#374151] leading-relaxed" style={{ fontFamily: PP }}>
                  Apabila tren peningkatanmu tetap konsisten, target <span className="font-bold text-[#0f172a]">UI Sistem Informasi</span> diperkirakan tercapai dalam{" "}
                  <span className="font-bold" style={{ color: BLUE }}>3 Tryout lagi.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Gap + Radar */}
          <div className="grid grid-cols-2 gap-4">
            {/* Gap */}
            <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.07)] shadow-sm">
              <div className="px-6 py-6">
                <p className="text-[12px] font-bold text-[#64748b] mb-5" style={{ fontFamily: PP }}>Gap Analysis</p>
                {[{ label: "Target", val: 685, color: "#374151" }, { label: "Current", val: 618, color: BLUE }, { label: "Gap", val: 67, color: "#f97316" }].map(row => (
                  <div key={row.label} className="flex justify-between items-center mb-3 last:mb-0">
                    <p className="text-[12px] text-[#94a3b8]" style={{ fontFamily: PP }}>{row.label}</p>
                    <p className="text-[18px] font-bold" style={{ color: row.color, fontFamily: PP }}>{row.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Radar */}
            <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.07)] shadow-sm">
              <div className="px-4 py-4">
                <p className="text-[12px] font-bold text-[#64748b] mb-1" style={{ fontFamily: PP }}>Performa Subtest</p>
                <ResponsiveContainer width="100%" height={160}>
                  <RadarChart data={RADAR_DATA}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#64748b", fontFamily: PP }} />
                    <Radar dataKey="value" stroke={BLUE} fill={BLUE} fillOpacity={0.15} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

  

          {/* Time Analysis */}
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.07)] shadow-sm">
            <div className="px-7 py-7">
              <p className="text-[13px] font-bold text-[#0f172a] mb-5" style={{ fontFamily: PP }}>Time Analysis</p>
              <div className="flex gap-1 h-10 rounded-xl overflow-hidden mb-5">
                {timeData.map(d => (
                  <div key={d.label} style={{ width: `${d.pct}%`, background: d.color }} title={d.label} />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {timeData.map(d => (
                  <div key={d.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#f8faff" }}>
                    <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ background: d.color }} />
                    <div>
                      <p className="text-[11px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>{d.label}</p>
                      <p className="text-[12px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>{d.count} soal</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weak Topics */}
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.07)] shadow-sm">
            <div className="px-7 py-7">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[13px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Weak Topics</p>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-bold" style={{ background: "#fef3c7", color: "#d97706", fontFamily: PP }}>Prioritas</span>
              </div>
              <p className="text-[12px] text-[#64748b] mb-5" style={{ fontFamily: PP }}>Materi yang paling mempengaruhi skor kamu</p>
              <div className="rounded-2xl border border-[rgba(249,115,22,0.15)] p-5 mb-5" style={{ background: "#fff7ed" }}>
                <p className="text-[12px] font-bold text-[#ea580c] mb-3" style={{ fontFamily: PP }}>Penalaran Matematika</p>
                <div className="flex flex-col gap-2">
                  {["Fungsi", "Peluang", "Statistika"].map(t => (
                    <div key={t} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#f97316" }} />
                      <p className="text-[13px] text-[#374151]" style={{ fontFamily: PP }}>{t}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={onLatihanMateri}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-[13px] font-bold text-white w-full justify-center hover:opacity-90 transition-all"
                style={{ background: "#f97316", fontFamily: PP, outline: "none" }}>
                Latihan Materi Ini <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div className="h-6" />
        </div>
      </div>
    </div>
  );
}

// ─── PERFORMANCE ANALYSIS — standalone full page ──────────────────────────────
function PerformancePage() {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const score  = payload.find((p: any) => p.dataKey === "score")?.value;
    const target = payload[0]?.payload.target;
    const chance = payload[0]?.payload.chance;
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-[rgba(0,0,0,0.08)] p-4" style={{ fontFamily: PP }}>
        <p className="text-[12px] font-bold text-[#0f172a] mb-2">{label}</p>
        <p className="text-[12px] text-[#64748b]">Skor: <span className="font-bold text-[#0f172a]">{score}</span></p>
        <p className="text-[12px] text-[#64748b]">Target: <span className="font-bold">{target}</span></p>
        <p className="text-[12px] text-[#64748b]">Peluang: <span className="font-bold" style={{ color: BLUE }}>{chance}%</span></p>
      </div>
    );
  };

  const subProg = [
    { short: "PU", full: "Penalaran Umum",            pct: 88, prev: 81, trend: "up" },
    { short: "PK", full: "Pengetahuan Kuantitatif",   pct: 74, prev: 77, trend: "down" },
    { short: "LI", full: "Literasi Bahasa Indonesia", pct: 70, prev: 68, trend: "up" },
    { short: "LE", full: "Literasi Bahasa Inggris",   pct: 75, prev: 75, trend: "flat" },
    { short: "PM", full: "Penalaran Matematika",      pct: 91, prev: 84, trend: "up" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Hero */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: BLUE, fontFamily: PP }}>Performance Analysis</p>
        <p className="text-[22px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Learning Progress</p>
        <p className="text-[13px] text-[#64748b] mt-1" style={{ fontFamily: PP }}>Pantau perkembangan kemampuanmu dari waktu ke waktu.</p>
      </div>

      {/* Trend chart + Prediksi Skor side by side */}
      <div className="grid grid-cols-[1fr_auto] gap-5 items-start">
        {/* Trend chart */}
        <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.07)] shadow-sm">
          <div className="px-7 pt-7 pb-5">
            <p className="text-[13px] font-bold text-[#0f172a] mb-1" style={{ fontFamily: PP }}>Trend Skor</p>
            <p className="text-[11px] text-[#94a3b8] mb-6" style={{ fontFamily: PP }}>Hover untuk detail — Target UI SI</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={TREND_DATA}>
                <CartesianGrid stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: PP }} axisLine={false} tickLine={false} />
                <YAxis domain={[500, 720]} tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: PP }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="score"  stroke={BLUE}    strokeWidth={3} dot={{ r: 5, fill: BLUE, strokeWidth: 0 }} activeDot={{ r: 7 }} />
                <Line type="monotone" dataKey="target" stroke="#e5e7eb" strokeWidth={2} strokeDasharray="6 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-5 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-0.5 rounded-full" style={{ background: BLUE }} />
                <p className="text-[11px] text-[#94a3b8]" style={{ fontFamily: PP }}>Skor Kamu</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-0 border-t-2 border-dashed border-[#e5e7eb]" />
                <p className="text-[11px] text-[#94a3b8]" style={{ fontFamily: PP }}>Target 685</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prediksi Skor */}
        <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.07)] shadow-sm w-[200px]">
          <div className="px-5 py-6">
            <p className="text-[13px] font-bold text-[#0f172a] mb-5" style={{ fontFamily: PP }}>Prediksi Skor</p>
            <div className="flex flex-col gap-3">
              {[
                { label: "Target",    val: 685, sub: "UI Sistem Informasi", color: "#374151", bg: "#f8faff" },
                { label: "Estimated", val: 672, sub: "+14 dari sekarang",   color: BLUE,      bg: BL       },
                { label: "Need",      val: 13,  sub: "poin lagi",           color: "#f97316", bg: "#fff7ed" },
              ].map(row => (
                <div key={row.label} className="rounded-2xl p-4 text-center border border-[rgba(0,0,0,0.06)]" style={{ background: row.bg }}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#94a3b8] mb-1" style={{ fontFamily: PP }}>{row.label}</p>
                  <p className="text-[26px] font-bold mb-0.5" style={{ color: row.color, fontFamily: PP }}>{row.val}</p>
                  <p className="text-[10px] text-[#94a3b8]" style={{ fontFamily: PP }}>{row.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Radar + Subtest progress */}
      <div className="grid grid-cols-2 gap-5">
        {/* Radar */}
        <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.07)] shadow-sm">
          <div className="px-5 py-5">
            <p className="text-[13px] font-bold text-[#0f172a] mb-2" style={{ fontFamily: PP }}>Radar Subtest</p>
            <ResponsiveContainer width="100%" height={190}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#64748b", fontFamily: PP }} />
                <Radar dataKey="value" stroke={BLUE} fill={BLUE} fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subtest progress with arrows */}
        <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.07)] shadow-sm">
          <div className="px-5 py-5">
            <p className="text-[13px] font-bold text-[#0f172a] mb-4" style={{ fontFamily: PP }}>Progress Subtest</p>
            <div className="flex flex-col gap-3">
              {subProg.map(s => (
                <div key={s.short} className="flex items-center gap-3">
                  <span className="text-[12px] font-bold w-7 shrink-0" style={{ color: BLUE, fontFamily: PP }}>{s.short}</span>
                  <div className="flex-1 h-2 rounded-full bg-[#f1f5f9] overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, background: s.trend === "up" ? "#22c55e" : s.trend === "down" ? "#f97316" : "#94a3b8" }} />
                  </div>
                  <span className="text-[12px] font-bold shrink-0 w-8 text-right" style={{ color: s.trend === "up" ? "#22c55e" : s.trend === "down" ? "#f97316" : "#94a3b8", fontFamily: PP }}>{s.pct}%</span>
                  {s.trend === "up"   && <TrendingUp   size={14} color="#22c55e" className="shrink-0" />}
                  {s.trend === "down" && <TrendingDown  size={14} color="#f97316" className="shrink-0" />}
                  {s.trend === "flat" && <Minus         size={14} color="#94a3b8" className="shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Strength & Weakness */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-3xl border border-[rgba(34,197,94,0.2)] p-6" style={{ background: "#f0fdf4" }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#15803d] mb-3" style={{ fontFamily: PP }}>Strength</p>
          <p className="text-[17px] font-bold text-[#0f172a] mb-1" style={{ fontFamily: PP }}>Penalaran Matematika</p>
          <p className="text-[12px] text-[#64748b]" style={{ fontFamily: PP }}>91% — di atas rata-rata peserta</p>
        </div>
        <div className="rounded-3xl border border-[rgba(249,115,22,0.2)] p-6" style={{ background: "#fff7ed" }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#ea580c] mb-3" style={{ fontFamily: PP }}>Weakness</p>
          <p className="text-[17px] font-bold text-[#0f172a] mb-1" style={{ fontFamily: PP }}>Literasi Indonesia</p>
          <p className="text-[12px] text-[#64748b]" style={{ fontFamily: PP }}>70% — perlu lebih banyak latihan</p>
        </div>
      </div>

      <div className="h-6" />
    </div>
  );
}

// ─── CARI TAHU PAGE ───────────────────────────────────────────────────────────
function CariTahuPage({
  onBack, onMulaiSNBP, onMulaiSNBT,
}: { onBack: () => void; onMulaiSNBP: () => void; onMulaiSNBT: () => void }) {
  const [jalur, setJalur] = useState<JalurTab>("snbp");

  const KEUNGGULAN = [
    { title: "Kualitas Pendidikan",    desc: "Didukung oleh dosen yang kompeten, kurikulum yang terus diperbarui, serta proses pembelajaran yang berorientasi pada pengembangan kompetensi mahasiswa." },
    { title: "Fasilitas Pembelajaran", desc: "Memiliki laboratorium, perpustakaan, pusat riset, hingga fasilitas pendukung lainnya yang membantu proses belajar menjadi lebih optimal." },
    { title: "Peluang Karier",         desc: "Lulusan PTN memiliki akses yang luas terhadap dunia kerja, riset, maupun studi lanjutan baik di dalam maupun luar negeri." },
  ];
  const PILIHAN = [
    { label: "SNBP cocok untuk siswa yang memiliki nilai rapor konsisten dan aktif membangun portofolio selama sekolah.", tag: "SNBP" },
    { label: "SNBT cocok untuk siswa yang ingin membuktikan kemampuan melalui hasil UTBK dan memiliki waktu untuk mempersiapkan diri menghadapi tes.", tag: "SNBT" },
    { label: "Mandiri menjadi peluang tambahan bagi siswa yang ingin memperluas pilihan universitas atau belum berhasil pada jalur sebelumnya.", tag: "Mandiri" },
  ];
  const UTBK_MATERI = [
    { label: "Penalaran Umum",            desc: "Mengukur kemampuan berpikir logis, analitis, dan pemecahan masalah." },
    { label: "Pengetahuan Kuantitatif",   desc: "Mengukur kemampuan memahami konsep matematika dasar dalam berbagai konteks." },
    { label: "Literasi Bahasa Indonesia", desc: "Mengukur kemampuan memahami informasi dan menganalisis teks berbahasa Indonesia." },
    { label: "Literasi Bahasa Inggris",   desc: "Mengukur kemampuan memahami bacaan akademik berbahasa Inggris." },
    { label: "Penalaran Matematika",      desc: "Mengukur kemampuan bernalar menggunakan konsep matematika." },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="shrink-0 bg-white border-b border-[rgba(0,0,0,0.07)] px-8 py-4 flex items-center gap-3">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] font-medium hover:opacity-70 transition-opacity"
          style={{ color: BLUE, fontFamily: PP, outline: "none" }}>
          <ArrowLeft size={15} /> Kembali ke Siap PTN
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-16">
          <div className="mb-20">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-4" style={{ color: BLUE, fontFamily: PP }}>Panduan Masuk PTN</p>
            <h1 className="text-[42px] font-bold text-[#0f172a] leading-tight mb-5" style={{ fontFamily: PP }}>Mengenal Perguruan<br />Tinggi Negeri</h1>
            <p className="text-[17px] text-[#64748b] leading-relaxed max-w-xl mb-4" style={{ fontFamily: PP }}>
              Memahami sistem seleksi PTN adalah langkah pertama sebelum menyusun strategi belajar yang tepat menuju kampus impianmu.
            </p>
            <p className="text-[15px] text-[#94a3b8] leading-relaxed max-w-xl mb-10" style={{ fontFamily: PP }}>
              Perguruan Tinggi Negeri merupakan institusi pendidikan tinggi yang dikelola pemerintah dan menjadi tujuan banyak siswa karena kualitas pendidikan, fasilitas, serta peluang karier yang ditawarkan.
            </p>
            <div className="flex items-center gap-3">
              <button className="px-7 py-3 rounded-xl text-[14px] font-semibold text-white hover:opacity-90 active:scale-95"
                style={{ background: BLUE, fontFamily: PP, outline: "none" }}
                onClick={() => document.getElementById("jalur-ct")?.scrollIntoView({ behavior: "smooth" })}>
                Mulai Eksplorasi
              </button>
              <button onClick={onBack}
                className="px-7 py-3 rounded-xl text-[14px] font-semibold border hover:bg-[#f8faff]"
                style={{ borderColor: "rgba(0,0,0,0.12)", color: "#374151", fontFamily: PP, outline: "none" }}>
                Kembali ke Siap PTN
              </button>
            </div>
          </div>
          <Divider />
          <div className="mb-20">
            <SectionLabel>Apa itu PTN?</SectionLabel>
            <h2 className="text-[28px] font-bold text-[#0f172a] mb-4" style={{ fontFamily: PP }}>Perguruan Tinggi Negeri</h2>
            <p className="text-[15px] text-[#64748b] leading-relaxed mb-12 max-w-2xl" style={{ fontFamily: PP }}>
              Perguruan Tinggi Negeri (PTN) adalah institusi pendidikan tinggi yang diselenggarakan oleh pemerintah untuk menyediakan pendidikan berkualitas di berbagai bidang ilmu.
            </p>
            <div className="grid grid-cols-3 gap-5">
              {KEUNGGULAN.map((k, i) => (
                <div key={i} className="bg-[#f8faff] rounded-2xl p-6 border border-[rgba(37,99,235,0.1)]">
                  <div className="w-8 h-8 rounded-lg mb-4 flex items-center justify-center" style={{ background: BL }}>
                    <div className="w-3 h-3 rounded-sm" style={{ background: BLUE }} />
                  </div>
                  <p className="text-[15px] font-bold text-[#0f172a] mb-2" style={{ fontFamily: PP }}>{k.title}</p>
                  <p className="text-[13px] text-[#64748b] leading-relaxed" style={{ fontFamily: PP }}>{k.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <Divider />
          <div className="mb-20">
            <SectionLabel>Panduan Memilih Jalur</SectionLabel>
            <h2 className="text-[28px] font-bold text-[#0f172a] mb-4" style={{ fontFamily: PP }}>Apakah Semua Siswa Harus<br />Memilih Jalur yang Sama?</h2>
            <p className="text-[15px] text-[#64748b] leading-relaxed mb-10" style={{ fontFamily: PP }}>
              Tidak. Setiap jalur masuk PTN memiliki karakteristik berbeda dan cocok untuk profil siswa yang berbeda pula.
            </p>
            <div className="flex flex-col gap-4">
              {PILIHAN.map((p, i) => (
                <div key={i} className="flex items-start gap-5 p-6 rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white hover:border-[rgba(37,99,235,0.2)] hover:shadow-sm transition-all">
                  <div className="shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-bold" style={{ background: BL, color: BLUE, fontFamily: PP }}>{p.tag}</div>
                  <p className="text-[14px] text-[#374151] leading-relaxed" style={{ fontFamily: PP }}>{p.label}</p>
                </div>
              ))}
            </div>
          </div>
          <Divider />
          <div id="jalur-ct">
            <SectionLabel>Pilih Jalur Masuk</SectionLabel>
            <h2 className="text-[28px] font-bold text-[#0f172a] mb-8" style={{ fontFamily: PP }}>Jalur Masuk PTN</h2>
            <SegCtrl tabs={[{ key: "snbp", label: "SNBP" }, { key: "snbt", label: "SNBT" }, { key: "mandiri", label: "Mandiri" }]}
              active={jalur} onChange={setJalur} />
            <div className="mt-10">
              {jalur === "snbp" && (
                <div className="flex flex-col gap-8">
                  <div>
                    <h3 className="text-[22px] font-bold text-[#0f172a] mb-3" style={{ fontFamily: PP }}>Apa itu SNBP?</h3>
                    <p className="text-[14px] text-[#64748b] leading-relaxed mb-2" style={{ fontFamily: PP }}>Seleksi Nasional Berdasarkan Prestasi (SNBP) merupakan jalur masuk PTN yang menggunakan prestasi akademik siswa selama bersekolah tanpa melalui ujian tulis nasional.</p>
                    <p className="text-[14px] text-[#64748b] leading-relaxed" style={{ fontFamily: PP }}>SNBP bertujuan memberikan kesempatan kepada siswa yang memiliki prestasi akademik konsisten untuk melanjutkan pendidikan ke PTN.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="bg-[#f8faff] rounded-2xl p-6 border border-[rgba(37,99,235,0.08)]">
                      <p className="text-[13px] font-bold text-[#0f172a] mb-4" style={{ fontFamily: PP }}>Siapa yang Dapat Mengikuti?</p>
                      {["Siswa kelas XII.", "Dinyatakan sebagai siswa eligible oleh sekolah.", "Memenuhi ketentuan yang ditetapkan oleh panitia SNPMB."].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: BLUE }} />
                          <p className="text-[13px] text-[#374151] leading-relaxed" style={{ fontFamily: PP }}>{item}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-[#f8faff] rounded-2xl p-6 border border-[rgba(37,99,235,0.08)]">
                      <p className="text-[13px] font-bold text-[#0f172a] mb-4" style={{ fontFamily: PP }}>Komponen Penilaian</p>
                      {["Nilai rapor setiap semester.", "Prestasi akademik maupun non-akademik yang relevan.", "Portofolio untuk program studi tertentu."].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: BLUE }} />
                          <p className="text-[13px] text-[#374151] leading-relaxed" style={{ fontFamily: PP }}>{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-[#0f172a] mb-6" style={{ fontFamily: PP }}>Timeline Seleksi</p>
                    <Timeline steps={["Penetapan Kuota Sekolah", "Pengumuman Siswa Eligible", "Pendaftaran SNBP", "Proses Seleksi", "Pengumuman Hasil"]} />
                  </div>
                  <button onClick={onMulaiSNBP} className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-[14px] font-semibold text-white hover:opacity-90 active:scale-95"
                    style={{ background: BLUE, fontFamily: PP, outline: "none", width: "fit-content" }}>
                    Mulai Persiapan SNBP <ChevronRight size={16} />
                  </button>
                </div>
              )}
              {jalur === "snbt" && (
                <div className="flex flex-col gap-8">
                  <div>
                    <h3 className="text-[22px] font-bold text-[#0f172a] mb-3" style={{ fontFamily: PP }}>Apa itu SNBT?</h3>
                    <p className="text-[14px] text-[#64748b] leading-relaxed mb-2" style={{ fontFamily: PP }}>Seleksi Nasional Berdasarkan Tes (SNBT) merupakan jalur masuk PTN yang menggunakan hasil Ujian Tulis Berbasis Komputer (UTBK).</p>
                    <p className="text-[14px] text-[#64748b] leading-relaxed" style={{ fontFamily: PP }}>Jalur ini memberikan kesempatan kepada seluruh siswa untuk bersaing melalui kemampuan akademik yang diukur pada saat ujian.</p>
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-[#0f172a] mb-5" style={{ fontFamily: PP }}>Materi UTBK</p>
                    <div className="flex flex-col gap-3">
                      {UTBK_MATERI.map((m, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-[rgba(0,0,0,0.07)] bg-white hover:border-[rgba(37,99,235,0.2)] transition-all">
                          <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-[12px] font-bold text-white"
                            style={{ background: BLUE, fontFamily: PP }}>{i + 1}</div>
                          <div>
                            <p className="text-[14px] font-semibold text-[#0f172a] mb-0.5" style={{ fontFamily: PP }}>{m.label}</p>
                            <p className="text-[12px] text-[#64748b]" style={{ fontFamily: PP }}>{m.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-[#0f172a] mb-6" style={{ fontFamily: PP }}>Timeline Seleksi</p>
                    <Timeline steps={["Registrasi SNBT", "Pelaksanaan UTBK", "Pengumuman Hasil", "Daftar Ulang"]} />
                  </div>
                  <button onClick={onMulaiSNBT} className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-[14px] font-semibold text-white hover:opacity-90 active:scale-95"
                    style={{ background: BLUE, fontFamily: PP, outline: "none", width: "fit-content" }}>
                    Mulai Persiapan SNBT <ChevronRight size={16} />
                  </button>
                </div>
              )}
              {jalur === "mandiri" && (
                <div className="flex flex-col gap-8">
                  <div>
                    <h3 className="text-[22px] font-bold text-[#0f172a] mb-3" style={{ fontFamily: PP }}>Apa itu Seleksi Mandiri?</h3>
                    <p className="text-[14px] text-[#64748b] leading-relaxed" style={{ fontFamily: PP }}>Seleksi Mandiri merupakan jalur penerimaan mahasiswa baru yang diselenggarakan secara langsung oleh masing-masing PTN. Setiap universitas memiliki kebijakan, mekanisme seleksi, serta jadwal yang dapat berbeda.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="bg-[#f8faff] rounded-2xl p-6 border border-[rgba(37,99,235,0.08)]">
                      <p className="text-[13px] font-bold text-[#0f172a] mb-4" style={{ fontFamily: PP }}>Jenis Seleksi Mandiri</p>
                      {["Menggunakan nilai UTBK.", "Tes Mandiri yang diselenggarakan universitas.", "Portofolio atau prestasi.", "Kombinasi beberapa metode seleksi."].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 mb-3">
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: BLUE }} />
                          <p className="text-[13px] text-[#374151] leading-relaxed" style={{ fontFamily: PP }}>{item}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-2xl p-6 border border-[rgba(234,179,8,0.2)] bg-[#fefce8]">
                      <p className="text-[13px] font-bold text-[#854d0e] mb-4" style={{ fontFamily: PP }}>Hal yang Perlu Diperhatikan</p>
                      {["Persyaratan setiap PTN berbeda.", "Jadwal pendaftaran berbeda.", "Biaya seleksi berbeda.", "Selalu periksa informasi resmi dari universitas tujuan."].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 mb-3">
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-[#eab308]" />
                          <p className="text-[13px] text-[#374151] leading-relaxed" style={{ fontFamily: PP }}>{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={onBack} className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-[14px] font-semibold border hover:bg-[#f8faff] active:scale-95"
                    style={{ borderColor: "rgba(0,0,0,0.12)", color: "#374151", fontFamily: PP, outline: "none", width: "fit-content" }}>
                    <ArrowLeft size={15} /> Kembali ke Siap PTN
                  </button>
                </div>
              )}
            </div>
            <div className="h-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
// ─── SNBP PREP PAGE ──────────────────────────────────────────────────────────
function SNBPPrepPage({ onBack, onNavigate }: { onBack: () => void; onNavigate?: (page: string) => void }) {
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [newUniv, setNewUniv]   = useState("");
  const [newJurusan, setNewJurusan] = useState("");
  const [univSearch, setUnivSearch] = useState("");
  const [showUnivDrop, setShowUnivDrop] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast]   = useState(false);
  const [activeTarget, setActiveTarget] = useState({ univ: "Universitas Indonesia", jurusan: "Sistem Informasi" });
  const [checklist, setChecklist] = useState([false, false, false, false]);

  function toggleCheck(i: number) {
    setChecklist(c => c.map((v, idx) => idx === i ? !v : v));
  }
  const doneCount = checklist.filter(Boolean).length;

  const FACTORS = [
    { label: "Akademik",       value: "89,4",      sub: "Baik",               color: "#22c55e", bg: "#f0fdf4" },
    { label: "Prestasi Akademik",     value: "3 Prestasi", sub: "Cukup", color: "#f97316", bg: "#fff7ed" },
    { label: "Prestasi Non-Akademik", value: "Aktif",      sub: "Baik",  color: "#22c55e", bg: "#f0fdf4" },
    { label: "Persiapan TKA",  value: "72%",        sub: "Perlu Ditingkatkan", color: "#f59e0b", bg: "#fffbeb" },
  ];

  const DETAIL_CARDS = [
    {
      title: "Nilai Rapor", statusColor: "#22c55e", statusBg: "#f0fdf4", status: "Baik",
      rows: [
        ["Nilai Rata-rata", "89,4"], ["Trend", "↑ Naik"], ["Semester Terbaik", "Semester 4"],
        ["Mata Pelajaran Terkuat", "Matematika"], ["Perlu Ditingkatkan", "Bahasa Inggris"],
      ],
      btn: "Lihat Nilai", btnColor: BLUE, btnBg: BL, btnText: BLUE,
    },
    {
      title: "Prestasi Akademik", statusColor: "#f97316", statusBg: "#fff7ed", status: "Masih dapat ditingkatkan",
      rows: [
        ["Jumlah Prestasi", "3"], ["Tingkat", "Provinsi"], ["Bidang", "Teknologi"],
      ],
      btn: "Tambah Prestasi", btnColor: "#f97316", btnBg: "#fff7ed", btnText: "#ea580c", btnNav: "profil",
    },
    {
      title: "Prestasi Non-Akademik", statusColor: "#22c55e", statusBg: "#f0fdf4", status: "Aktif",
      rows: [
        ["Jumlah Organisasi", "2"], ["Posisi", "Ketua"], ["Durasi", "2 Tahun"],
      ],
      btn: "Lihat Aktivitas", btnColor: "#22c55e", btnBg: "#f0fdf4", btnText: "#16a34a",
    },
    {
      title: "Persiapan TKA", statusColor: "#f59e0b", statusBg: "#fffbeb", status: "72%",
      rows: [
        ["Progress", "72%"],
      ],
      extra: "Materi Prioritas: Fungsi · Peluang · Statistika",
      btn: "Mulai Latihan TKA", btnColor: BLUE, btnBg: BL, btnText: BLUE, btnNav: "tka",
    },
  ];

  const CHECKLIST_ITEMS = [
    "Naikkan rata-rata Matematika menjadi minimal 90",
    "Tambahkan 1 prestasi tingkat provinsi",
    "Pertahankan konsistensi nilai semester berikutnya",
  ];

  const TIMELINE = [
    { sem: "Semester 3", status: "done",    label: "Selesai" },
    { sem: "Semester 4", status: "active",  label: "Sedang Berjalan" },
    { sem: "Semester 5", status: "pending", label: "Persiapkan Portofolio" },
    { sem: "Semester 6", status: "pending", label: "Menunggu Status Eligible" },
  ];

  const PREDICTION_FACTORS = [
    { label: "Nilai Rapor",  pct: 89 },
    { label: "Konsistensi Nilai",  pct: 82 },
    { label: "Prestasi Akademik",  pct: 55 },
    { label: "Persiapan TKA",      pct: 72 },
  ];

  const circ = 2 * Math.PI * 38;

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: "#f8faff" }}>
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-[rgba(0,0,0,0.07)] px-8 py-4 flex items-center gap-4 sticky top-0 z-30">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#e2e8f0] transition-all" style={{ outline: "none" }}>
          <ArrowLeft size={16} color="#374151" />
        </button>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.13em]" style={{ color: BLUE, fontFamily: PP }}>SNBP</p>
          <p className="text-[15px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Persiapkan SNBP</p>
        </div>
      </div>

      <div className="flex-1 px-8 py-8 flex flex-col gap-8 max-w-5xl mx-auto w-full">

        {/* ── HERO ── */}
        <div className="rounded-3xl overflow-hidden" style={{ background: `linear-gradient(135deg,${BLUE} 0%,#1d4ed8 100%)` }}>
          <div className="px-10 py-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/60 mb-3" style={{ fontFamily: PP }}>Preparation Journey</p>
            <h1 className="text-[28px] font-bold text-white mb-3 leading-tight" style={{ fontFamily: PP }}>
              Persiapkan Dirimu<br />Menuju SNBP
            </h1>
            <p className="text-[14px] text-white/70 leading-relaxed mb-8 max-w-[480px]" style={{ fontFamily: PP }}>
              Bangun kesiapan akademik dan non-akademik sejak sekarang untuk meningkatkan peluang masuk Perguruan Tinggi Negeri melalui jalur SNBP.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button className="px-6 py-3 rounded-2xl text-[14px] font-bold bg-white hover:bg-white/90 transition-all"
                style={{ color: BLUE, fontFamily: PP, outline: "none" }}>
                Mulai Analisis Kesiapan
              </button>
              <button className="px-6 py-3 rounded-2xl text-[14px] font-bold border border-white/30 text-white hover:bg-white/10 transition-all"
                style={{ fontFamily: PP, outline: "none" }}>
                Ubah Target Jurusan
              </button>
            </div>
          </div>
        </div>

        {/* ── SECTION 1: TARGET JURUSAN ── */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] px-8 py-6 flex items-center gap-6"
          style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <div className="flex-1 flex items-center gap-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#94a3b8] mb-1" style={{ fontFamily: PP }}>Target Saat Ini</p>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <p className="text-[11px] text-[#94a3b8] mb-0.5" style={{ fontFamily: PP }}>Universitas</p>
                  <p className="text-[16px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>{activeTarget.univ}</p>
                </div>
                <div className="w-px h-10 bg-[#f1f5f9]" />
                <div>
                  <p className="text-[11px] text-[#94a3b8] mb-0.5" style={{ fontFamily: PP }}>Jurusan</p>
                  <p className="text-[16px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>{activeTarget.jurusan}</p>
                </div>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-full text-[12px] font-bold" style={{ background: BL, color: BLUE, fontFamily: PP }}>Target Aktif</span>
          </div>
          <button onClick={() => setShowTargetModal(true)}
            className="shrink-0 px-5 py-2.5 rounded-xl text-[13px] font-semibold border border-[#E5E7EB] text-[#374151] hover:bg-[#f8fafc] transition-all"
            style={{ fontFamily: PP, outline: "none" }}>
            Ubah Target
          </button>
        </div>

        {/* ── SECTION 2: RINGKASAN & PREDIKSI KESIAPAN (merged) ── */}
        <div>
          <p className="text-[16px] font-bold text-[#0f172a] mb-4" style={{ fontFamily: PP }}>Ringkasan Kesiapan</p>
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 flex gap-8 items-start"
            style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>

            {/* Kiri — ring progress + badge + checklist */}
            <div className="shrink-0 flex flex-col items-center gap-4" style={{ minWidth: 160 }}>
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="38" stroke="#f1f5f9" strokeWidth="7" fill="none" />
                  <circle cx="50" cy="50" r="38" stroke="#22c55e" strokeWidth="7" fill="none"
                    strokeDasharray={`${circ * 0.82} ${circ * 0.18}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[26px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>82%</p>
                  <p className="text-[10px] text-[#94a3b8]" style={{ fontFamily: PP }}>Kesiapan</p>
                </div>
              </div>
              <span className="px-4 py-1.5 rounded-full text-[12px] font-bold" style={{ background: "#f0fdf4", color: "#16a34a", fontFamily: PP }}>Baik</span>
              <p className="text-[11px] text-[#64748b] leading-relaxed text-center" style={{ fontFamily: PP }}>
                Dasar kuat, beberapa aspek perlu ditingkatkan.
              </p>
            </div>

            {/* Kanan — checklist + factor bars */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Checklist status */}
              <div>
                <p className="text-[12px] font-bold text-[#94a3b8] uppercase tracking-wide mb-3" style={{ fontFamily: PP }}>Status Komponen</p>
                <div className="flex flex-col gap-3">
                  {[
                    { text: "Nilai akademik sudah konsisten",      done: true },
                    { text: "Aktivitas organisasi sudah mendukung", done: true },
                    { text: "Prestasi masih dapat ditingkatkan",    done: false },
                    { text: "Persiapan TKA belum optimal",         done: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: item.done ? "#f0fdf4" : "#f8fafc", border: item.done ? "none" : "1.5px solid #d1d5db" }}>
                        {item.done && <Check size={11} color="#16a34a" strokeWidth={3} />}
                      </div>
                      <p className="text-[13px] leading-snug" style={{ color: item.done ? "#374151" : "#94a3b8", fontFamily: PP }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Factor bars */}
              <div>
                <p className="text-[12px] font-bold text-[#94a3b8] uppercase tracking-wide mb-3" style={{ fontFamily: PP }}>Faktor yang mempengaruhi kesiapan</p>
                <div className="flex flex-col gap-3">
                  {PREDICTION_FACTORS.map(f => (
                    <div key={f.label}>
                      <div className="flex justify-between mb-1">
                        <p className="text-[12px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>{f.label}</p>
                        <p className="text-[12px] font-bold" style={{ color: BLUE, fontFamily: PP }}>{f.pct}%</p>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#f1f5f9] overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${f.pct}%`, background: BLUE }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-[#94a3b8] pt-3 border-t border-[#f1f5f9]" style={{ fontFamily: PP }}>
                Terakhir diperbarui · <span className="font-semibold text-[#64748b]">18 Juli 2026</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── SECTION 3: FAKTOR PENILAIAN ── */}
        <div>
          <p className="text-[16px] font-bold text-[#0f172a] mb-4" style={{ fontFamily: PP }}>Faktor Penilaian</p>
          <div className="grid grid-cols-4 gap-4">
            {FACTORS.map(f => (
              <div key={f.label} className="bg-white rounded-2xl border border-[#E5E7EB] px-5 py-5 flex flex-col gap-3"
                style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
                <p className="text-[12px] font-semibold text-[#94a3b8] uppercase tracking-wide" style={{ fontFamily: PP }}>{f.label}</p>
                <p className="text-[22px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>{f.value}</p>
                <span className="self-start px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: f.bg, color: f.color, fontFamily: PP }}>{f.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 4: DETAIL PERSIAPAN ── */}
        <div>
          <p className="text-[16px] font-bold text-[#0f172a] mb-4" style={{ fontFamily: PP }}>Detail Persiapan</p>
          <div className="grid grid-cols-2 gap-5">
            {DETAIL_CARDS.map(card => (
              <div key={card.title} className="bg-white rounded-3xl border border-[#E5E7EB] flex flex-col p-7"
                style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
                <div className="flex items-center justify-between mb-5">
                  <p className="text-[16px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>{card.title}</p>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: card.statusBg, color: card.statusColor, fontFamily: PP }}>{card.status}</span>
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  {card.rows.map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between py-2.5 border-b border-[#f8fafc]">
                      <p className="text-[13px] text-[#94a3b8]" style={{ fontFamily: PP }}>{k}</p>
                      <p className="text-[13px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>{v}</p>
                    </div>
                  ))}
                  {card.extra && (
                    <p className="text-[12px] text-[#64748b] pt-1" style={{ fontFamily: PP }}>{card.extra}</p>
                  )}
                  {card.title === "Persiapan TKA" && (
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <p className="text-[12px] text-[#94a3b8]" style={{ fontFamily: PP }}>Progress</p>
                        <p className="text-[12px] font-bold" style={{ color: BLUE, fontFamily: PP }}>72%</p>
                      </div>
                      <div className="h-2 rounded-full bg-[#f1f5f9] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: "72%", background: BLUE }} />
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={() => (card as any).btnNav && onNavigate?.((card as any).btnNav)}
                  className="mt-6 w-full py-3 rounded-2xl text-[13px] font-bold transition-all hover:opacity-80 border"
                  style={{ background: card.btnBg, color: card.btnText, borderColor: `${card.btnText}22`, fontFamily: PP, outline: "none" }}>
                  {card.btn}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 5: PRIORITAS PERBAIKAN ── */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8"
          style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <p className="text-[16px] font-bold text-[#0f172a] mb-5" style={{ fontFamily: PP }}>Target Untuk Eligible SNBP</p>
              <div className="flex flex-col gap-4">
                {CHECKLIST_ITEMS.map((item, i) => (
                  <label key={i} className="flex items-start gap-4 cursor-pointer group">
                    <button onClick={() => toggleCheck(i)}
                      className="w-5 h-5 rounded-md shrink-0 mt-0.5 flex items-center justify-center transition-all"
                      style={{ background: checklist[i] ? BLUE : "transparent", border: checklist[i] ? "none" : "1.5px solid #d1d5db", outline: "none" }}>
                      {checklist[i] && <Check size={11} color="white" strokeWidth={3} />}
                    </button>
                    <p className="text-[14px] leading-snug transition-all"
                      style={{ color: checklist[i] ? "#94a3b8" : "#374151", textDecoration: checklist[i] ? "line-through" : "none", fontFamily: PP }}>
                      {item}
                    </p>
                  </label>
                ))}
              </div>
            </div>

            {/* Right: progress summary */}
            <div className="shrink-0 w-44 flex flex-col items-center justify-center gap-4 pl-8 border-l border-[#f1f5f9]">
              <div className="text-center">
                <p className="text-[32px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>{doneCount}<span className="text-[18px] text-[#94a3b8]"> / 4</span></p>
                <p className="text-[12px] text-[#94a3b8] mt-0.5" style={{ fontFamily: PP }}>target selesai</p>
              </div>
              <div className="w-full">
                <div className="h-2 rounded-full bg-[#f1f5f9] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(doneCount / 4) * 100}%`, background: BLUE }} />
                </div>
                <p className="text-[12px] font-bold mt-2 text-center" style={{ color: BLUE, fontFamily: PP }}>{Math.round((doneCount / 4) * 100)}%</p>
              </div>
            </div>
          </div>
        </div>


        {/* ── SECTION 8: LANGKAH SELANJUTNYA ── */}
        <div className="rounded-3xl overflow-hidden" style={{ background: `linear-gradient(135deg,#0f172a 0%,#1e293b 100%)` }}>
          <div className="px-10 py-10 flex items-center gap-10">
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/50 mb-3" style={{ fontFamily: PP }}>Langkah Selanjutnya</p>
              <p className="text-[22px] font-bold text-white mb-2" style={{ fontFamily: PP }}>Lanjutkan Persiapanmu</p>
              <p className="text-[14px] text-white/60 leading-relaxed" style={{ fontFamily: PP }}>
                Lengkapi target mingguan agar kesiapan SNBP terus meningkat.
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <button className="px-8 py-3.5 rounded-2xl text-[14px] font-bold text-white hover:opacity-90 transition-all"
                style={{ background: BLUE, fontFamily: PP, outline: "none" }}>
                Masuk ke Action Plan
              </button>
              <button onClick={() => onNavigate?.("tka")}
                className="px-8 py-3.5 rounded-2xl text-[14px] font-bold border border-white/20 text-white hover:bg-white/10 transition-all"
                style={{ fontFamily: PP, outline: "none" }}>
                Mulai Latihan TKA
              </button>
            </div>
          </div>
        </div>

        <div className="h-8" />
      </div>

      {/* ── TARGET MODAL ── */}
      {showTargetModal && (() => {
        const UNIVS = [
          "Universitas Gadjah Mada",
          "Institut Teknologi Bandung",
          "Universitas Airlangga",
          "Universitas Brawijaya",
          "Universitas Diponegoro",
          "Institut Pertanian Bogor",
          "Universitas Padjadjaran",
          "Universitas Hasanuddin",
        ];
        const JURUSANS: Record<string, string[]> = {
          "Universitas Gadjah Mada":   ["Psikologi","Kedokteran","Hukum","Manajemen","Ilmu Komunikasi"],
          "Institut Teknologi Bandung": ["Teknik Informatika","Teknik Elektro","Teknik Industri","Matematika","Fisika"],
          "Universitas Airlangga":     ["Kedokteran","Farmasi","Keperawatan","Psikologi","Ekonomi"],
          default: ["Sistem Informasi","Manajemen","Hukum","Biologi","Sosiologi"],
        };
        const jurusanList = newUniv ? (JURUSANS[newUniv] ?? JURUSANS["default"]) : [];
        const filteredUnivs = UNIVS.filter(u => u.toLowerCase().includes(univSearch.toLowerCase()));

        // change summary shown when jurusan is chosen
        const MAPEL_BEFORE = ["Matematika", "Informatika"];
        const MAPEL_AFTER  = newJurusan === "Psikologi" ? ["Biologi","Psikologi","Bahasa Indonesia"]
                           : newJurusan === "Kedokteran" ? ["Biologi","Kimia","Fisika"]
                           : ["Biologi","Literasi","Matematika Dasar"];
        const TKA_BEFORE   = ["Penalaran Matematika"];
        const TKA_AFTER    = newJurusan === "Psikologi" ? ["Biologi","Literasi"]
                           : newJurusan === "Kedokteran" ? ["Biologi","Kimia"]
                           : ["Biologi","Literasi"];
        const ACTION_BEFORE  = ["Latihan Numerasi"];
        const ACTION_AFTER   = newJurusan === "Psikologi" ? ["Latihan Literasi","Biologi"]
                             : newJurusan === "Kedokteran" ? ["Latihan Sains","Biologi"]
                             : ["Latihan Literasi","Biologi"];
        const PRESTASI_BEFORE = ["Kompetisi IT"];
        const PRESTASI_AFTER  = newJurusan === "Psikologi" ? ["Karya Tulis","Psikologi"]
                              : newJurusan === "Kedokteran" ? ["Olimpiade Sains","Riset"]
                              : ["Karya Tulis","Esai"];

        const showSummary = newUniv !== "" && newJurusan !== "";

        function handleUpdate() {
          setIsUpdating(true);
          setTimeout(() => {
            setActiveTarget({ univ: newUniv, jurusan: newJurusan });
            setIsUpdating(false);
            setShowTargetModal(false);
            setNewUniv(""); setNewJurusan(""); setUnivSearch("");
            setToast(true);
            setTimeout(() => setToast(false), 4000);
          }, 2500);
        }

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isUpdating && setShowTargetModal(false)} />
            <div className="relative bg-white rounded-3xl shadow-2xl w-full overflow-hidden flex flex-col" style={{ maxWidth: 760, maxHeight: "92vh" }}>

              {/* Loading overlay */}
              {isUpdating && (
                <div className="absolute inset-0 z-10 bg-white/95 flex flex-col items-center justify-center gap-5 rounded-3xl">
                  <div className="w-12 h-12 rounded-full border-4 border-[#e2e8f0] border-t-[#2563EB] animate-spin" />
                  <div className="text-center">
                    <p className="text-[16px] font-bold text-[#0f172a] mb-1" style={{ fontFamily: PP }}>Memperbarui target jurusan...</p>
                    <p className="text-[13px] text-[#94a3b8]" style={{ fontFamily: PP }}>ORBITA sedang menyesuaikan rencana persiapanmu.</p>
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="px-8 py-6 border-b border-[#f1f5f9] flex items-start justify-between shrink-0">
                <div>
                  <p className="text-[20px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Ubah Target Jurusan</p>
                  <p className="text-[13px] text-[#94a3b8] mt-1 leading-relaxed" style={{ fontFamily: PP }}>
                    Sesuaikan target perguruan tinggi dan jurusanmu. Perubahan ini akan digunakan sebagai acuan rekomendasi persiapan di ORBITA.
                  </p>
                </div>
                <button onClick={() => setShowTargetModal(false)}
                  className="w-9 h-9 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#e2e8f0] transition-all shrink-0 ml-6 mt-0.5"
                  style={{ outline: "none" }}>
                  <X size={16} color="#64748b" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto flex-1 px-8 py-7 flex flex-col gap-7">

                {/* ─ Section 1: Current → New ─ */}
                <div>
                  {/* Target saat ini */}
                  <div className="rounded-2xl px-5 py-4 flex items-center gap-5" style={{ background: "#f8fafc", border: "1px solid #E5E7EB" }}>
                    <div className="flex-1 flex items-center gap-5">
                      <div>
                        <p className="text-[11px] text-[#94a3b8] mb-0.5" style={{ fontFamily: PP }}>Universitas</p>
                        <p className="text-[15px] font-bold text-[#374151]" style={{ fontFamily: PP }}>{activeTarget.univ}</p>
                      </div>
                      <div className="w-px h-8 bg-[#E5E7EB]" />
                      <div>
                        <p className="text-[11px] text-[#94a3b8] mb-0.5" style={{ fontFamily: PP }}>Jurusan</p>
                        <p className="text-[15px] font-bold text-[#374151]" style={{ fontFamily: PP }}>{activeTarget.jurusan}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-[11px] font-bold px-3 py-1 rounded-full" style={{ background: "#f1f5f9", color: "#64748b", fontFamily: PP }}>Target Saat Ini</span>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center my-3">
                    <div className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                      </svg>
                    </div>
                  </div>

                  {/* Target baru */}
                  <div className="rounded-2xl px-5 py-5 flex flex-col gap-4 border-2" style={{ borderColor: BLUE, background: BL }}>
                    <p className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: BLUE, fontFamily: PP }}>Target Baru</p>
                    {/* Universitas search */}
                    <div className="relative">
                      <p className="text-[13px] font-semibold text-[#374151] mb-1.5" style={{ fontFamily: PP }}>Universitas</p>
                      <div className="relative">
                        <input
                          value={univSearch || newUniv}
                          onChange={e => { setUnivSearch(e.target.value); setNewUniv(""); setNewJurusan(""); setShowUnivDrop(true); }}
                          onFocus={() => setShowUnivDrop(true)}
                          placeholder="Cari universitas..."
                          className="w-full px-4 py-3 pr-10 rounded-xl border bg-white text-[14px] text-[#374151] focus:outline-none"
                          style={{ borderColor: showUnivDrop ? BLUE : "#E5E7EB", fontFamily: PP }}
                        />
                        <svg className="absolute right-3.5 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                      {showUnivDrop && filteredUnivs.length > 0 && (
                        <div className="absolute z-20 top-full mt-1 w-full bg-white rounded-2xl border border-[#E5E7EB] shadow-xl overflow-hidden">
                          {filteredUnivs.map(u => (
                            <button key={u} onClick={() => { setNewUniv(u); setUnivSearch(""); setNewJurusan(""); setShowUnivDrop(false); }}
                              className="w-full text-left px-4 py-3 text-[14px] hover:bg-[#f8fafc] border-b border-[#f1f5f9] last:border-0 transition-all"
                              style={{ color: "#374151", fontFamily: PP, outline: "none" }}>
                              {u}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Jurusan dropdown */}
                    <div>
                      <p className="text-[13px] font-semibold text-[#374151] mb-1.5" style={{ fontFamily: PP }}>Jurusan</p>
                      <div className="relative">
                        <select value={newJurusan} onChange={e => setNewJurusan(e.target.value)} disabled={!newUniv}
                          className="w-full px-4 py-3 rounded-xl border bg-white text-[14px] appearance-none focus:outline-none transition-all"
                          style={{ borderColor: newJurusan ? BLUE : "#E5E7EB", color: newJurusan ? "#0f172a" : "#94a3b8", fontFamily: PP, opacity: newUniv ? 1 : 0.5 }}>
                          <option value="">Pilih jurusan...</option>
                          {jurusanList.map(j => <option key={j} value={j}>{j}</option>)}
                        </select>
                        <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─ Section 2: Ringkasan Perubahan ─ */}
                {showSummary && (
                  <div>
                    <p className="text-[14px] font-bold text-[#0f172a] mb-4" style={{ fontFamily: PP }}>Ringkasan Perubahan</p>

                    {/* Before / After table */}
                    <div className="rounded-2xl overflow-hidden border border-[#E5E7EB]">
                      {/* Table header */}
                      <div className="grid grid-cols-3 bg-[#f8fafc] border-b border-[#E5E7EB]">
                        <div className="px-5 py-3"><p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#94a3b8]" style={{ fontFamily: PP }}>Aspek</p></div>
                        <div className="px-5 py-3 border-l border-[#E5E7EB]"><p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#94a3b8]" style={{ fontFamily: PP }}>Sebelum</p></div>
                        <div className="px-5 py-3 border-l border-[#E5E7EB]"><p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: BLUE, fontFamily: PP }}>Sesudah</p></div>
                      </div>
                      {[
                        { label: "Mata Pelajaran Prioritas", before: MAPEL_BEFORE,    after: MAPEL_AFTER },
                        { label: "Materi TKA",              before: TKA_BEFORE,      after: TKA_AFTER },
                        { label: "Action Plan",             before: ACTION_BEFORE,   after: ACTION_AFTER },
                        { label: "Target Prestasi",         before: PRESTASI_BEFORE, after: PRESTASI_AFTER },
                      ].map((row, i) => (
                        <div key={i} className="grid grid-cols-3 border-t border-[#f1f5f9]">
                          <div className="px-5 py-4">
                            <p className="text-[13px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>{row.label}</p>
                          </div>
                          <div className="px-5 py-4 border-l border-[#f1f5f9]">
                            {row.before.map(v => <p key={v} className="text-[13px] text-[#94a3b8] line-through" style={{ fontFamily: PP }}>{v}</p>)}
                          </div>
                          <div className="px-5 py-4 border-l border-[#f1f5f9]">
                            {row.after.map(v => <p key={v} className="text-[13px] font-semibold" style={{ color: BLUE, fontFamily: PP }}>{v}</p>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─ Section 3: Konfirmasi ─ */}
                <div className="rounded-2xl px-5 py-4" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
                  <p className="text-[13px] text-[#92400e] leading-relaxed" style={{ fontFamily: PP }}>
                    Perubahan target jurusan akan memperbarui rekomendasi belajar, materi TKA, Action Plan, serta analisis SNBP.
                  </p>
                </div>
              </div>

              {/* Footer actions */}
              <div className="px-8 py-5 border-t border-[#f1f5f9] flex gap-3 shrink-0">
                <button onClick={() => { setShowTargetModal(false); setNewUniv(""); setNewJurusan(""); setUnivSearch(""); }}
                  className="flex-1 py-3.5 rounded-2xl text-[14px] font-semibold border border-[#E5E7EB] text-[#374151] hover:bg-[#f8fafc] transition-all"
                  style={{ fontFamily: PP, outline: "none" }}>
                  Batal
                </button>
                <button onClick={handleUpdate} disabled={!showSummary}
                  className="flex-1 py-3.5 rounded-2xl text-[14px] font-bold text-white transition-all"
                  style={{
                    background: showSummary ? BLUE : "#e2e8f0",
                    color: showSummary ? "white" : "#94a3b8",
                    fontFamily: PP, outline: "none",
                    cursor: showSummary ? "pointer" : "not-allowed",
                  }}>
                  Perbarui Target
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── TOAST ── */}
      {toast && (
        <div className="fixed top-6 right-6 z-[60] flex items-start gap-3 bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] px-5 py-4 max-w-[320px]"
          style={{ animation: "slideInRight 0.3s ease" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#f0fdf4" }}>
            <Check size={15} color="#16a34a" strokeWidth={3} />
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Target berhasil diperbarui</p>
            <p className="text-[12px] text-[#64748b] mt-0.5" style={{ fontFamily: PP }}>Seluruh rekomendasi persiapan telah disesuaikan.</p>
          </div>
          <button onClick={() => setToast(false)} className="shrink-0 w-6 h-6 rounded-full bg-[#f1f5f9] flex items-center justify-center" style={{ outline: "none" }}>
            <X size={12} color="#94a3b8" />
          </button>
        </div>
      )}
      <style>{`@keyframes slideInRight{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
    </div>
  );
}

export default function SiapPTNPage({ onNavigate, defaultTab }: { onNavigate?: (page: string) => void; defaultTab?: MainTab }) {
  const [mainTab,        setMainTab]        = useState<MainTab>(defaultTab ?? "snbp");
  const [showCariTahu,   setShowCariTahu]   = useState(false);
  const [eligState,      setEligState]      = useState<"building"|"kelas12-pending"|"eligible"|"not-eligible">("building");
  const [showSNBPPrep,   setShowSNBPPrep]   = useState(false);
  const [showLatihanTKA, setShowLatihanTKA] = useState(false);
  const [showRationalizationFlow, setShowRationalizationFlow] = useState(false);

  // SNBT
  const [snbtTab,        setSnbtTab]        = useState<SNBTTab>("latihan");
  const [latihanView,    setLatihanView]    = useState<LatihanView>("main");
  const [tryoutView,     setTryoutView]     = useState<TryoutView>("list");
  const [showWizard,     setShowWizard]     = useState(false);
  const [selectedMateri, setSelectedMateri] = useState("Penalaran Matematika");
  const [selectedSubmateri, setSelectedSubmateri] = useState("");

  function resetSNBT() {
    setLatihanView("main");
    setTryoutView("list");
    setShowWizard(false);
  }

  // ── Early returns ──────────────────────────────────────────────────────────
  if (showRationalizationFlow) {
    return <SNBPRationalizationFlow onBack={() => setShowRationalizationFlow(false)} />;
  }
  if (showCariTahu) {
    return (
      <CariTahuPage
        onBack={() => setShowCariTahu(false)}
        onMulaiSNBP={() => { setShowCariTahu(false); setMainTab("snbp"); }}
        onMulaiSNBT={() => { setShowCariTahu(false); setMainTab("snbt"); }}
      />
    );
  }
  if (showLatihanTKA) {
    return (
      <LatihanTKAPage
        onBack={() => setShowLatihanTKA(false)}
        breadcrumb="Persiapkan SNBP"
      />
    );
  }
  if (showSNBPPrep) {
    return <SNBPPrepPage onBack={() => setShowSNBPPrep(false)} onNavigate={onNavigate} />;
  }
  if (mainTab === "snbt" && latihanView === "overview") {
    return (
      <OverviewMateriPage
        materi={selectedMateri}
        submateri={selectedSubmateri}
        onBack={() => setLatihanView("main")}
        onMulai={() => setLatihanView("hasil")}
      />
    );
  }
  if (mainTab === "snbt" && latihanView === "hasil") {
    return <HasilLatihanPage onBack={() => setLatihanView("main")} />;
  }
  if (mainTab === "snbt" && tryoutView === "hasil") {
    return (
      <HasilTryoutPage
        onBack={() => setTryoutView("list")}
        onLatihanMateri={() => { setTryoutView("list"); setSnbtTab("latihan"); setSelectedMateri("Penalaran Matematika"); }}
      />
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "#f8faff" }}>
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-[rgba(0,0,0,0.07)] px-8 py-4 flex items-center justify-between">
        <div>
          <p className="text-[17px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Siap PTN</p>
          <p className="text-[12px] text-[#94a3b8] mt-0.5" style={{ fontFamily: PP }}>
            {mainTab === "snbp" ? "Jalur Prestasi · Seleksi Nasional Berdasarkan Prestasi" : "Jalur Tes · Seleksi Nasional Berdasarkan Tes"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowCariTahu(true)}
            className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)", color: BLUE, border: `1.5px solid ${BLUE}30`, fontFamily: PP, outline: "none" }}>
            Panduan PTN <ChevronRight size={13} />
          </button>
          <SegCtrl
            tabs={[{ key: "snbp", label: "SNBP" }, { key: "snbt", label: "SNBT" }]}
            active={mainTab}
            onChange={t => { setMainTab(t); resetSNBT(); }}
            size="sm"
            variant="colored"
          />
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-8 py-8 flex flex-col gap-8">

          {/* ── SNBP tab ── */}
          {mainTab === "snbp" && (() => {
            // eligibility config per state
            const EC: Record<typeof eligState, {
              pct: number; ring: string; badge: string; badgeBg: string; badgeColor: string; text: string;
            }> = {
              "building":       { pct: 34,  ring: BLUE,     badge: "Preparing",    badgeBg: "#eff6ff", badgeColor: BLUE,     text: "Kamu sedang membangun profil akademik menuju SNBP." },
              "kelas12-pending":{ pct: 78,  ring: "#f97316", badge: "Almost There", badgeBg: "#fff7ed", badgeColor: "#ea580c", text: "Pengumuman eligible belum keluar. Terus pertahankan nilai dan prestasimu." },
              "eligible":       { pct: 100, ring: "#22c55e", badge: "Eligible",     badgeBg: "#f0fdf4", badgeColor: "#16a34a", text: "Selamat! Kamu dinyatakan eligible SNBP. Segera lakukan rasionalisasi jurusan." },
              "not-eligible":   { pct: 0,   ring: "#ef4444", badge: "Not Eligible", badgeBg: "#fef2f2", badgeColor: "#dc2626", text: "Kamu belum masuk daftar eligible SNBP. Fokuskan persiapan pada jalur SNBT dan Seleksi Mandiri." },
            };
            const ec = EC[eligState];
            const circ = 2 * Math.PI * 38;
            const dash = circ * (ec.pct / 100);

            const DEMO_PILLS: { key: typeof eligState; label: string }[] = [
              { key: "building",        label: "building" },
              { key: "kelas12-pending", label: "kelas12-pending" },
              { key: "eligible",        label: "eligible" },
              { key: "not-eligible",    label: "not-eligible" },
            ];

            return (
              <>
                {/* ── JOURNEY ORIENTATION CARDS ── */}
                <div>
                  <p className="text-[13px] font-semibold text-[#64748b] mb-3" style={{ fontFamily: PP }}>Ikuti langkah ini secara berurutan</p>
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {[
                      { step: 1, title: "Cek Kelayakan", desc: "Mulai di sini", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: BLUE, bg: BL, active: true, action: () => {} },
                      { step: 2, title: "Persiapkan SNBP", desc: "Setelah cek status", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", color: "#8b5cf6", bg: "#f5f3ff", active: false, action: () => setShowSNBPPrep(true) },
                      { step: 3, title: "Rasionalisasi", desc: "Sebelum daftar SNBP", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", color: "#22c55e", bg: "#f0fdf4", active: false, action: () => setShowRationalizationFlow(true) },
                    ].map(j => (
                      <button key={j.step} onClick={j.action} className="text-left rounded-2xl border p-4 flex flex-col gap-2 transition-all hover:shadow-md active:scale-95 cursor-pointer"
                        style={{ background: j.bg, borderColor: j.active ? j.color + "40" : "rgba(0,0,0,0.07)", boxShadow: j.active ? `0 4px 16px ${j.color}18` : "none", outline: "none" }}>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center"
                            style={{ background: j.color }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d={j.icon} />
                            </svg>
                          </div>
                          <span className="text-[10px] font-bold" style={{ color: j.color, fontFamily: PP }}>LANGKAH {j.step}</span>
                        </div>
                        <p className="text-[13px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>{j.title}</p>
                        <p className="text-[11px]" style={{ color: j.color, fontFamily: PP }}>{j.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── SECTION: MY ELIGIBILITY STATUS ── */}
                <div>
                  {/* Header row */}
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.13em] mb-1" style={{ color: BLUE, fontFamily: PP }}>Langkah 1</p>
                      <p className="text-[18px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Status Kelayakan SNBP</p>
                    </div>
                    {/* Dev: Demo state switcher */}
                    <div className="flex items-center gap-1 p-1 rounded-2xl" style={{ background: "#f1f5f9" }}>
                      {DEMO_PILLS.map(p => (
                        <button key={p.key} onClick={() => setEligState(p.key)}
                          className="px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all"
                          style={{
                            fontFamily: PP, outline: "none",
                            background: eligState === p.key ? "white" : "transparent",
                            color: eligState === p.key ? "#0f172a" : "#94a3b8",
                            boxShadow: eligState === p.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                          }}>
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Two-column layout */}
                  <div className="flex gap-6">
                    {/* LEFT: Status card — 300px fixed */}
                    <div className="shrink-0 w-[300px] bg-white rounded-3xl border border-[#E5E7EB] flex flex-col items-center justify-center gap-6 py-10 px-8"
                      style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)", transition: "all 200ms ease" }}>
                      {/* Ring */}
                      <div className="relative w-36 h-36">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                          <circle cx="50" cy="50" r="38" stroke="#f1f5f9" strokeWidth="7" fill="none" />
                          <circle cx="50" cy="50" r="38" stroke={ec.ring} strokeWidth="7" fill="none"
                            strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
                            style={{ transition: "stroke-dasharray 400ms ease, stroke 200ms ease" }} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-[26px] font-bold text-[#0f172a]" style={{ fontFamily: PP, transition: "all 200ms" }}>{ec.pct}%</p>
                          <p className="text-[11px] text-[#94a3b8]" style={{ fontFamily: PP }}>Progress</p>
                        </div>
                      </div>
                      {/* Badge + text */}
                      <div className="text-center flex flex-col items-center gap-3">
                        <span className="px-4 py-1.5 rounded-full text-[12px] font-bold"
                          style={{ background: ec.badgeBg, color: ec.badgeColor, fontFamily: PP, transition: "all 200ms" }}>
                          {ec.badge}
                        </span>
                        <p className="text-[14px] text-[#64748b] leading-relaxed text-center" style={{ fontFamily: PP, transition: "all 200ms" }}>
                          {ec.text}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT: Eligibility Components */}
                    <div className="flex-1 bg-white rounded-3xl border border-[#E5E7EB] flex flex-col"
                      style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)", padding: "32px" }}>
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <p className="text-[20px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Eligibility Components</p>
                          <p className="text-[14px] text-[#94a3b8] mt-1" style={{ fontFamily: PP }}>Bukan hasil eligible — ini adalah progress menuju eligibility.</p>
                        </div>
                        <button className="px-4 py-2 rounded-xl text-[12px] font-semibold border border-[#E5E7EB] text-[#374151] hover:bg-[#f8fafc] transition-all shrink-0"
                          style={{ fontFamily: PP, outline: "none" }}>
                          Refresh Data
                        </button>
                      </div>

                      <div className="flex flex-col gap-5 mt-8 flex-1">
                        {[
                          { label: "Academic Performance", pct: 75,  color: BLUE },
                          { label: "Achievement",          pct: 55,  color: "#8b5cf6" },
                          { label: "Consistency",          pct: 82,  color: "#22c55e" },
                          { label: "Extracurricular",      pct: 48,  color: "#f97316" },
                        ].map(c => (
                          <div key={c.label}>
                            <div className="flex justify-between mb-2">
                              <p className="text-[15px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>{c.label}</p>
                              <p className="text-[15px] font-bold" style={{ color: c.color, fontFamily: PP }}>{c.pct}%</p>
                            </div>
                            <div className="h-2 rounded-full bg-[#f1f5f9] overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${c.pct}%`, background: c.color }} />
                            </div>
                          </div>
                        ))}
                      </div>

                      <p className="text-[13px] text-[#94a3b8] mt-8 pt-5 border-t border-[#E5E7EB]" style={{ fontFamily: PP }}>
                        Terakhir diperbarui: 18 Juli 2026, 14:30 · Data ditarik dari Nilai Rapor, Prestasi, dan Profil Siswa.
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── SECTION: PREPARATION JOURNEY ── */}
                <div>
                  <div className="mb-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.13em] mb-1" style={{ color: "#8b5cf6", fontFamily: PP }}>Langkah 2</p>
                    <p className="text-[18px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Persiapkan SNBP</p>
                    <p className="text-[14px] text-[#94a3b8] mt-1" style={{ fontFamily: PP }}>Bangun kesiapan akademik, prestasi, dan TKA agar peluang lolos semakin optimal.</p>
                  </div>

                  <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden"
                    style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>

                    {/* Step 1 — Persiapkan SNBP */}
                    <div className="flex gap-6 p-8 border-b border-[#f1f5f9]">
                      {/* Step number + connector */}
                      <div className="flex flex-col items-center shrink-0" style={{ width: 40 }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold text-white shrink-0"
                          style={{ background: BLUE, fontFamily: PP }}>1</div>
                        <div className="w-px flex-1 mt-3" style={{ background: "#e5e7eb", minHeight: 32 }} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <p className="text-[17px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Persiapkan SNBP</p>
                            <p className="text-[13px] text-[#64748b] leading-relaxed mt-1.5" style={{ fontFamily: PP }}>
                              Bangun fondasi akademik, prestasi, organisasi, dan target jurusan agar peluang lolos SNBP semakin optimal.
                            </p>
                          </div>
                          <button onClick={() => setShowSNBPPrep(true)}
                            className="shrink-0 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white hover:opacity-90 transition-all"
                            style={{ background: BLUE, fontFamily: PP, outline: "none" }}>
                            Lanjutkan
                          </button>
                        </div>

                        {/* Status + progress */}
                        <div className="flex items-center gap-6 mt-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: BLUE }} />
                            <span className="text-[12px] font-semibold" style={{ color: BLUE, fontFamily: PP }}>Sedang Berjalan</span>
                          </div>
                          <div className="flex items-center gap-3 flex-1 max-w-[240px]">
                            <div className="flex-1 h-1.5 rounded-full bg-[#f1f5f9] overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: "68%", background: BLUE }} />
                            </div>
                            <span className="text-[12px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>68%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 2 — Persiapan TKA */}
                    <div className="flex gap-6 p-8">
                      {/* Step number */}
                      <div className="flex flex-col items-center shrink-0" style={{ width: 40 }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold shrink-0"
                          style={{ background: "#f1f5f9", color: "#64748b", fontFamily: PP }}>2</div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <p className="text-[17px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Persiapan TKA</p>
                            <p className="text-[13px] text-[#64748b] leading-relaxed mt-1.5" style={{ fontFamily: PP }}>
                              Pelajari materi TKA yang relevan dengan target jurusanmu melalui latihan adaptif dan evaluasi berkala.
                            </p>
                          </div>
                          <button onClick={() => setShowLatihanTKA(true)}
                            className="shrink-0 px-5 py-2.5 rounded-xl text-[13px] font-bold hover:opacity-80 transition-all border"
                            style={{ borderColor: "#E5E7EB", color: "#374151", background: "#f8fafc", fontFamily: PP, outline: "none" }}>
                            Mulai
                          </button>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2 mt-4">
                          <div className="w-2 h-2 rounded-full" style={{ background: "#94a3b8" }} />
                          <span className="text-[12px] font-semibold text-[#94a3b8]" style={{ fontFamily: PP }}>Siap Dimulai</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* ── SECTION: RASIONALISASI SNBP ── */}
                <div style={{ opacity: 1, transition: "opacity 200ms ease" }}>
                  <div className="mb-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.13em] mb-1" style={{ color: "#22c55e", fontFamily: PP }}>Langkah 3</p>
                    <p className="text-[18px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Rasionalisasi SNBP</p>
                    <p className="text-[14px] text-[#94a3b8] mt-1" style={{ fontFamily: PP }}>Bandingkan profilmu dengan program studi dan tentukan strategi pendaftaran terbaikmu.</p>
                  </div>

                  {eligState === "eligible" ? (
                    /* Eligible state — white + green accent */
                    <div className="rounded-3xl border flex flex-col md:flex-row items-center gap-8"
                      style={{ background: "white", borderColor: "#bbf7d0", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", padding: "32px" }}>
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "#f0fdf4" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-[20px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Rasionalisasi SNBP</p>
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: "#f0fdf4", color: "#16a34a", fontFamily: PP }}>Available</span>
                        </div>
                        <p className="text-[14px] text-[#64748b] leading-relaxed" style={{ fontFamily: PP }}>
                          Analisis peluang diterima berdasarkan nilai rapor, prestasi, target jurusan, dan target universitas.
                        </p>
                      </div>
                      <button onClick={() => setShowRationalizationFlow(true)}
                        className="shrink-0 px-8 py-3.5 rounded-2xl text-[14px] font-bold text-white hover:opacity-90 transition-all active:scale-95"
                        style={{ background: "#16a34a", fontFamily: PP, outline: "none" }}>
                        Mulai Rasionalisasi →
                      </button>
                    </div>
                  ) : eligState === "not-eligible" ? (
                    /* Not eligible — light gray + red accent */
                    <div className="rounded-3xl border flex flex-col md:flex-row items-center gap-8"
                      style={{ background: "#fef2f2", borderColor: "#fecaca", boxShadow: "0 8px 24px rgba(0,0,0,0.04)", padding: "32px" }}>
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "#fee2e2" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-[20px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Rasionalisasi SNBP</p>
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: "#fee2e2", color: "#dc2626", fontFamily: PP }}>Unavailable</span>
                        </div>
                        <p className="text-[14px] text-[#64748b] leading-relaxed" style={{ fontFamily: PP }}>
                          Kamu belum memenuhi status eligible SNBP. Fokuskan persiapan melalui jalur SNBT, atau eksplorasi jalur Kedinasan sebagai alternatif yang kompetitif.
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <button onClick={() => setMainTab("snbt")}
                          className="px-7 py-3 rounded-2xl text-[13px] font-bold text-white hover:opacity-90 transition-all"
                          style={{ background: "#dc2626", fontFamily: PP, outline: "none" }}>
                          Persiapkan SNBT
                        </button>
                        <button onClick={() => onNavigate?.("skd")}
                          className="px-7 py-3 rounded-2xl text-[13px] font-bold border border-[#fecaca] hover:bg-[#fee2e2] transition-all"
                          style={{ color: "#dc2626", background: "transparent", fontFamily: PP, outline: "none" }}>
                          Eksplor Kedinasan
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* building / kelas12-pending — locked */
                    <div className="rounded-3xl border flex flex-col md:flex-row items-center gap-8"
                      style={{ background: "#f8fafc", borderColor: "#E5E7EB", boxShadow: "0 8px 24px rgba(0,0,0,0.04)", padding: "32px" }}>
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "#f1f5f9" }}>
                        <Lock size={22} color="#94a3b8" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-[20px] font-bold text-[#94a3b8]" style={{ fontFamily: PP }}>Rasionalisasi SNBP</p>
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: "#e2e8f0", color: "#64748b", fontFamily: PP }}>Locked</span>
                        </div>
                        <p className="text-[14px] text-[#94a3b8] leading-relaxed" style={{ fontFamily: PP }}>
                          Fitur ini akan tersedia setelah pengumuman eligibility sekolah.
                        </p>
                      </div>
                      <button disabled
                        className="shrink-0 px-8 py-3.5 rounded-2xl text-[14px] font-bold cursor-not-allowed"
                        style={{ background: "#e2e8f0", color: "#94a3b8", fontFamily: PP, outline: "none" }}>
                        Menunggu Eligibility
                      </button>
                    </div>
                  )}
                </div>
              </>
            );
          })()}

          {/* ── SNBT tab ── */}
          {mainTab === "snbt" && (
            <>
              {/* Quick-nav row */}
              <div className="grid grid-cols-3 gap-3">
                {([
                  { key: "latihan" as SNBTTab,     icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", label: "Latihan Soal" },
                  { key: "tryout" as SNBTTab,      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", label: "Tryout" },
                  { key: "performance" as SNBTTab, icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", label: "Performance" },
                ] as {key: SNBTTab; icon: string; label: string}[]).map(item => (
                  <button key={item.key} onClick={() => { setSnbtTab(item.key); resetSNBT(); }}
                    className="flex flex-col items-center gap-3 py-5 rounded-2xl border-2 transition-all hover:shadow-md active:scale-95"
                    style={{
                      borderColor: snbtTab === item.key ? BLUE : "rgba(0,0,0,0.08)",
                      background: snbtTab === item.key ? BL : "white",
                      outline: "none",
                    }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: snbtTab === item.key ? BLUE : "#f1f5f9" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={snbtTab === item.key ? "white" : "#64748b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={item.icon} />
                      </svg>
                    </div>
                    <p className="text-[12px] font-bold" style={{ color: snbtTab === item.key ? BLUE : "#374151", fontFamily: PP }}>{item.label}</p>
                  </button>
                ))}
              </div>

              {/* ── Latihan Soal ── */}
              {snbtTab === "latihan" && (
                <PracticeCenterContent
                  onMulaiSubmateri={sub => { setSelectedSubmateri(sub); setLatihanView("overview"); }}
                  onMulaiCustom={() => setLatihanView("hasil")}
                  selectedMateri={selectedMateri}
                  setSelectedMateri={setSelectedMateri}
                />
              )}

              {/* ── Tryout ── */}
              {snbtTab === "tryout" && (
                !showWizard
                  ? <TryoutLandingContent
                      onKerjakan={() => setShowWizard(true)}
                      onLihatLaporan={() => setTryoutView("hasil")}
                    />
                  : <TryoutWizard
                      onBack={() => setShowWizard(false)}
                      onSelesai={() => { setShowWizard(false); setTryoutView("hasil"); }}
                    />
              )}

              {/* ── Performance ── */}
              {snbtTab === "performance" && <PerformancePage />}
            </>
          )}

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}
