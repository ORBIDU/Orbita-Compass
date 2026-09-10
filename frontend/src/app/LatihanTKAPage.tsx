import React, { useState } from "react";
import { ArrowLeft, Check, ChevronRight, TrendingUp, TrendingDown, Minus, Clock, X } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const PP  = "Poppins, sans-serif";
const BLUE = "#2563EB";
const BL   = "#eff6ff";

type TKATab  = "guided" | "riwayat";
type TKAView = "main" | "hasil";

// ─── TKA DATA ────────────────────────────────────────────────────────────────
type TKASubtest = "PU" | "PK" | "LBI" | "LBE" | "PM" | "MTK" | "FIS" | "KIM" | "BIO" | "EKO" | "GEO" | "SOS";
type TKAMatStatus = "done" | "active" | "pending";
type TKADifficulty = "Dasar" | "Menengah" | "Sulit";
interface TKAMatItem { name: string; status: TKAMatStatus; progress?: number; difficulty: TKADifficulty; }

const TKA_DATA: Record<string, { label: string; group: string; desc: string; color: string; items: TKAMatItem[] }> = {
  MTK: {
    label: "Matematika",
    group: "Mata Pelajaran Wajib",
    desc: "Pemahaman aljabar, kalkulus dasar, geometri, peluang, dan pemecahan masalah kuantitatif.",
    color: "#2563EB",
    items: [
      { name: "Persamaan & Pertidaksamaan", status: "done",    progress: 100, difficulty: "Dasar" },
      { name: "Fungsi & Grafik",            status: "active",  progress: 60,  difficulty: "Menengah" },
      { name: "Peluang & Kombinatorika",    status: "pending",              difficulty: "Sulit" },
      { name: "Statistika Data",           status: "pending",              difficulty: "Menengah" },
      { name: "Limit & Turunan",            status: "pending",              difficulty: "Sulit" },
    ],
  },
  BIN: {
    label: "Bahasa Indonesia",
    group: "Mata Pelajaran Wajib",
    desc: "Kemampuan memahami struktur paragraf, ide pokok, kebahasaan, dan analisis teks.",
    color: "#059669",
    items: [
      { name: "Pemahaman Bacaan & Ide Pokok", status: "done",   progress: 100, difficulty: "Dasar" },
      { name: "Analisis Struktur Teks",        status: "active", progress: 45,  difficulty: "Menengah" },
      { name: "Ejaan & Tata Bahasa (PUEBI)",   status: "pending",             difficulty: "Menengah" },
      { name: "Penalaran Pragmatik",           status: "pending",             difficulty: "Sulit" },
    ],
  },
  BIG: {
    label: "Bahasa Inggris",
    group: "Mata Pelajaran Wajib",
    desc: "Reading comprehension, inference, vocabulary in context, and text organization.",
    color: "#d97706",
    items: [
      { name: "Main Idea & Topic Sentence", status: "done",    progress: 100, difficulty: "Dasar" },
      { name: "Reading Inference & Tone",   status: "active",  progress: 35,  difficulty: "Menengah" },
      { name: "Vocabulary in Context",      status: "pending",               difficulty: "Menengah" },
      { name: "Text Structure & Transition", status: "pending",              difficulty: "Sulit" },
    ],
  },
  FIS: {
    label: "Fisika",
    group: "Kelompok Sains",
    desc: "Konsep mekanika, termodinamika, gelombang, optik, dan fisika modern.",
    color: "#7c3aed",
    items: [
      { name: "Kinematika & Dinamika", status: "done",    progress: 100, difficulty: "Dasar" },
      { name: "Usaha & Energi",        status: "active",  progress: 50,  difficulty: "Menengah" },
      { name: "Fluida & Termodinamika",status: "pending",               difficulty: "Sulit" },
      { name: "Listrik & Magnet",      status: "pending",               difficulty: "Sulit" },
    ],
  },
  KIM: {
    label: "Kimia",
    group: "Kelompok Sains",
    desc: "Struktur atom, ikatan kimia, stoikiometri, termokimia, dan ikatan larutan.",
    color: "#e11d48",
    items: [
      { name: "Stoikiometri & Mol",   status: "done",    progress: 100, difficulty: "Dasar" },
      { name: "Struktur Atom & Tabel", status: "active",  progress: 40,  difficulty: "Menengah" },
      { name: "Termokimia & Laju",    status: "pending",               difficulty: "Sulit" },
      { name: "Larutan Asam Basa",     status: "pending",               difficulty: "Menengah" },
    ],
  },
  BIO: {
    label: "Biologi",
    group: "Kelompok Sains",
    desc: "Keanekaragaman hayati, sel, genetika, metabolisme, dan ekologi.",
    color: "#16a34a",
    items: [
      { name: "Struktur & Fungsi Sel", status: "done",    progress: 100, difficulty: "Dasar" },
      { name: "Metabolisme & Enzim",   status: "active",  progress: 70,  difficulty: "Menengah" },
      { name: "Genetika & Pewarisan",  status: "pending",               difficulty: "Sulit" },
      { name: "Ekologi & Lingkungan",  status: "pending",               difficulty: "Menengah" },
    ],
  },
  EKO: {
    label: "Ekonomi",
    group: "Kelompok Sosial",
    desc: "Mekanisme pasar, akuntansi dasar, kebijakan moneter, dan ekonomi internasional.",
    color: "#0284c7",
    items: [
      { name: "Konsep Dasar & Kelangkaan", status: "done",    progress: 100, difficulty: "Dasar" },
      { name: "Permintaan & Penawaran",    status: "active",  progress: 50,  difficulty: "Menengah" },
      { name: "Akuntansi Dasar",           status: "pending",               difficulty: "Sulit" },
    ],
  },
  GEO: {
    label: "Geografi",
    group: "Kelompok Sosial",
    desc: "Litosfer, atmosfer, hidrosfer, penginderaan jauh, dan dinamika kependudukan.",
    color: "#ca8a04",
    items: [
      { name: "Prinsip & Konsep Geografi", status: "done",    progress: 100, difficulty: "Dasar" },
      { name: "Litosfer & Pedosfer",       status: "active",  progress: 30,  difficulty: "Menengah" },
      { name: "Penginderaan Jauh & SIG",   status: "pending",               difficulty: "Sulit" },
    ],
  },
  SOS: {
    label: "Sosiologi",
    group: "Kelompok Sosial",
    desc: "Interaksi sosial, konflik, diferensiasi, dan perubahan sosial masyarakat.",
    color: "#9333ea",
    items: [
      { name: "Interaksi & Nilai Sosial", status: "done",    progress: 100, difficulty: "Dasar" },
      { name: "Penyimpangan & Konflik",   status: "active",  progress: 60,  difficulty: "Menengah" },
      { name: "Perubahan Sosial",         status: "pending",               difficulty: "Sulit" },
    ],
  },
};

const TKA_KEYS = Object.keys(TKA_DATA);

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
function TKAConfigModal({ materi, subtestColor, onClose, onStart }: { materi: TKAMatItem; subtestColor: string; onClose: () => void; onStart: () => void }) {
  const [jumlah, setJumlah]   = useState<number | "custom">(20);
  const [custom, setCustom]   = useState("");
  const [timerOn, setTimerOn] = useState(false);
  const [durasi, setDurasi]   = useState("30");
  const [mode, setMode]       = useState<"per" | "selesai">("selesai");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full flex flex-col overflow-hidden" style={{ maxWidth: 600 }}>
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
          <button onClick={onStart} className="flex-1 py-3.5 rounded-2xl text-[14px] font-bold text-white hover:opacity-90 transition-all" style={{ background: subtestColor, fontFamily: PP, outline: "none" }}>Mulai Latihan</button>
        </div>
      </div>
    </div>
  );
}

// ─── TKA SUBTEST PICKER (bottom sheet) ───────────────────────────────────────
function TKASubtestPicker({ currentKey, onChange, onClose }: { currentKey: string; onChange: (k: string) => void; onClose: () => void }) {
  const groups = [
    { label: "Mata Pelajaran Wajib", keys: ["MTK", "BIN", "BIG"] },
    { label: "Kelompok Sains",       keys: ["FIS", "KIM", "BIO"] },
    { label: "Kelompok Sosial",      keys: ["EKO", "GEO", "SOS"] },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full flex justify-center pb-6 px-4" style={{ animation: "slideUp 0.28s cubic-bezier(0.16,1,0.3,1)" }}>
        <div className="bg-white rounded-3xl shadow-2xl w-full flex flex-col overflow-hidden max-h-[85vh]" style={{ maxWidth: 640 }}>
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-10 h-1 rounded-full bg-[#e2e8f0]" />
          </div>
          <div className="px-8 pt-2 pb-5 border-b border-[#f1f5f9] flex items-start justify-between">
            <div>
              <p className="text-[19px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Pilih Mata Pelajaran TKA</p>
              <p className="text-[13px] text-[#94a3b8] mt-1" style={{ fontFamily: PP }}>Pilih mata pelajaran yang ingin kamu latih.</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#e2e8f0] transition-all" style={{ outline: "none" }}>
              <X size={16} color="#64748b" />
            </button>
          </div>
          <div className="px-8 py-6 flex flex-col gap-6 overflow-y-auto">
            {groups.map(g => (
              <div key={g.label}>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#94a3b8] mb-3" style={{ fontFamily: PP }}>{g.label}</p>
                <div className="flex flex-col gap-2.5">
                  {g.keys.map(k => {
                    const data = TKA_DATA[k];
                    if (!data) return null;
                    const isActive = k === currentKey;
                    const doneCount = data.items.filter(i => i.status === "done").length;
                    const pct = Math.round((doneCount / data.items.length) * 100);
                    return (
                      <button key={k} onClick={() => { onChange(k); onClose(); }}
                        className="w-full text-left rounded-2xl border-2 px-5 py-4 transition-all hover:shadow-md"
                        style={{ borderColor: isActive ? data.color : "#E5E7EB", background: isActive ? `${data.color}0d` : "white", outline: "none" }}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black text-white shrink-0" style={{ background: data.color }}>{k}</div>
                            <div>
                              <p className="text-[15px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>{data.label}</p>
                              <p className="text-[11px] text-[#94a3b8]" style={{ fontFamily: PP }}>{data.items.length} Materi</p>
                            </div>
                          </div>
                          {isActive && <Check size={18} strokeWidth={2.5} color={data.color} />}
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1 h-1.5 rounded-full bg-[#e2e8f0] overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: data.color }} />
                          </div>
                          <p className="text-[11px] font-bold shrink-0" style={{ color: data.color, fontFamily: PP }}>{pct}%</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="h-2" />
        </div>
      </div>
      <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
    </div>
  );
}

// ─── Segmented Control ────────────────────────────────────────────────────────
function SegCtrl<T extends string>({
  tabs, value, onChange,
}: { tabs: { key: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex p-1 rounded-2xl" style={{ background: "#f1f5f9" }}>
      {tabs.map(t => (
        <button key={t.key} onClick={() => onChange(t.key)}
          className="px-5 py-2 rounded-xl text-[13px] font-semibold transition-all"
          style={{
            fontFamily: PP, outline: "none",
            background: value === t.key ? "white" : "transparent",
            color:      value === t.key ? "#0f172a" : "#64748b",
            boxShadow:  value === t.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
          }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── Subject Card ─────────────────────────────────────────────────────────────
function SubjectCard({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="px-4 py-3 rounded-2xl text-[13px] font-semibold border-2 transition-all text-left"
      style={{
        fontFamily: PP, outline: "none",
        borderColor: selected ? BLUE : "#E5E7EB",
        background:  selected ? BL   : "white",
        color:       selected ? BLUE : "#374151",
      }}>
      {selected && <Check size={11} style={{ display: "inline", marginRight: 6 }} strokeWidth={3} />}
      {label}
    </button>
  );
}

// ─── HASIL LATIHAN PAGE ───────────────────────────────────────────────────────
function HasilLatihanTKAPage({ onBack, onUlangi }: { onBack: () => void; onUlangi: () => void }) {
  const MATERI = [
    { name: "Fungsi",      pct: 92, color: "#22c55e" },
    { name: "Peluang",     pct: 68, color: "#f97316" },
    { name: "Statistika",  pct: 74, color: "#f59e0b" },
    { name: "Limit",       pct: 81, color: BLUE },
  ];

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "#f8faff" }}>
      <div className="max-w-4xl mx-auto px-8 py-10 flex flex-col gap-8">

        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-2 text-[13px] font-semibold text-[#64748b] hover:text-[#374151] transition-all self-start" style={{ fontFamily: PP, outline: "none" }}>
          <ArrowLeft size={15} /> Kembali ke Latihan TKA
        </button>

        {/* Hero */}
        <div className="rounded-3xl overflow-hidden" style={{ background: `linear-gradient(135deg,${BLUE} 0%,#1d4ed8 100%)` }}>
          <div className="px-10 py-10">
            <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-white/60 mb-2" style={{ fontFamily: PP }}>Latihan Selesai</p>
            <div className="flex items-end gap-3 mb-8">
              <p className="text-[56px] font-bold text-white leading-none" style={{ fontFamily: PP }}>84</p>
              <p className="text-[28px] font-bold text-white/50 mb-1" style={{ fontFamily: PP }}>/100</p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: "Akurasi",  value: "84%"     },
                { label: "Durasi",   value: "36 Menit" },
                { label: "Selesai",  value: "50 Soal"  },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-[12px] text-white/50 mb-1" style={{ fontFamily: PP }}>{s.label}</p>
                  <p className="text-[20px] font-bold text-white" style={{ fontFamily: PP }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ringkasan Jawaban */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <p className="text-[16px] font-bold text-[#0f172a] mb-6" style={{ fontFamily: PP }}>Ringkasan Jawaban</p>
          <div className="grid grid-cols-3 gap-5">
            {[
              { label: "Benar",  value: 42, color: "#22c55e", bg: "#f0fdf4" },
              { label: "Salah",  value: 8,  color: "#ef4444", bg: "#fef2f2" },
              { label: "Kosong", value: 0,  color: "#94a3b8", bg: "#f8fafc" },
            ].map(s => (
              <div key={s.label} className="rounded-2xl flex flex-col items-center justify-center py-6 gap-2"
                style={{ background: s.bg }}>
                <p className="text-[36px] font-bold" style={{ color: s.color, fontFamily: PP }}>{s.value}</p>
                <p className="text-[13px] font-semibold text-[#64748b]" style={{ fontFamily: PP }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Performa per Materi */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <p className="text-[16px] font-bold text-[#0f172a] mb-6" style={{ fontFamily: PP }}>Performa per Materi</p>
          <div className="flex flex-col gap-5">
            {MATERI.map(m => (
              <div key={m.name}>
                <div className="flex justify-between mb-2">
                  <p className="text-[14px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>{m.name}</p>
                  <p className="text-[14px] font-bold" style={{ color: m.color, fontFamily: PP }}>{m.pct}%</p>
                </div>
                <div className="h-2 rounded-full bg-[#f1f5f9] overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${m.pct}%`, background: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Materi Prioritas */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <p className="text-[16px] font-bold text-[#0f172a] mb-2" style={{ fontFamily: PP }}>Fokus Belajar Berikutnya</p>
          <p className="text-[13px] text-[#94a3b8] mb-6" style={{ fontFamily: PP }}>Materi yang masih perlu ditingkatkan berdasarkan hasil latihan.</p>
          <div className="flex flex-col gap-2.5 mb-6">
            {["Peluang", "Statistika"].map(m => (
              <div key={m} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: "#f97316" }} />
                <p className="text-[14px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>{m}</p>
              </div>
            ))}
          </div>
          <button className="px-6 py-3 rounded-2xl text-[13px] font-bold text-white hover:opacity-90 transition-all"
            style={{ background: "#f97316", fontFamily: PP, outline: "none" }}>
            Latih Materi Ini
          </button>
        </div>

        {/* Rekomendasi Selanjutnya */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <p className="text-[16px] font-bold text-[#0f172a] mb-6" style={{ fontFamily: PP }}>Rekomendasi Selanjutnya</p>
          <div className="flex flex-col gap-3.5 mb-8">
            {[
              "Review pembahasan soal yang salah",
              "Kerjakan kembali materi Peluang",
              "Latihan Statistika",
              "Ikuti Tryout TKA",
            ].map(item => (
              <div key={item} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#f0fdf4" }}>
                  <Check size={10} color="#16a34a" strokeWidth={3} />
                </div>
                <p className="text-[14px] text-[#374151]" style={{ fontFamily: PP }}>{item}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button className="flex-1 py-3.5 rounded-2xl text-[14px] font-bold text-white hover:opacity-90 transition-all"
              style={{ background: BLUE, fontFamily: PP, outline: "none" }}>
              Review Pembahasan
            </button>
            <button onClick={onUlangi}
              className="flex-1 py-3.5 rounded-2xl text-[14px] font-bold border border-[#E5E7EB] text-[#374151] hover:bg-[#f8fafc] transition-all"
              style={{ fontFamily: PP, outline: "none" }}>
              Kerjakan Lagi
            </button>
          </div>
        </div>

        <div className="h-6" />
      </div>
    </div>
  );
}

// ─── GUIDED PRACTICE TAB ─────────────────────────────────────────────────────
function GuidedTab({ onMulai }: { onMulai: () => void }) {
  const [subtestKey, setSubtestKey] = useState<string>("MTK");
  const [modalItem, setModalItem]   = useState<TKAMatItem | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const data       = TKA_DATA[subtestKey] || TKA_DATA["MTK"];
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
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black text-white shrink-0" style={{ background: data.color }}>{subtestKey}</div>
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1 inline-block" style={{ background: `${data.color}15`, color: data.color, fontFamily: PP }}>{data.group}</span>
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

      {modalItem  && <TKAConfigModal materi={modalItem} subtestColor={data.color} onClose={() => setModalItem(null)} onStart={() => { setModalItem(null); onMulai(); }} />}
      {showPicker && <TKASubtestPicker currentKey={subtestKey} onChange={setSubtestKey} onClose={() => setShowPicker(false)} />}
    </div>
  );
}

// ─── CUSTOM PRACTICE TAB ──────────────────────────────────────────────────────
function CustomTab({ onMulai }: { onMulai: () => void }) {
  const [nama, setNama]         = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [jumlah, setJumlah]     = useState<number | "custom">(30);
  const [customSoal, setCustomSoal] = useState("25");
  const [timerOn, setTimerOn]   = useState(false);
  const [durasi, setDurasi]     = useState("60");
  const [pembahasan, setPembahasan] = useState<"per" | "selesai">("selesai");

  const ALL_MAPEL = ["Matematika","Bahasa Indonesia","Bahasa Inggris","Fisika","Kimia","Biologi","Ekonomi","Geografi","Sosiologi"];
  const JUMLAH_OPTS = [10, 20, 30, 40, 50, "custom"] as const;

  function toggle(s: string) {
    setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  const canStart = nama.trim() !== "" && selected.length > 0;

  return (
    <div className="grid grid-cols-[1fr_360px] gap-6 items-start">
      {/* Left */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 flex flex-col gap-7"
        style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
        <div>
          <p className="text-[18px] font-bold text-[#0f172a] mb-1" style={{ fontFamily: PP }}>Buat Latihan Sendiri</p>
          <p className="text-[13px] text-[#94a3b8]" style={{ fontFamily: PP }}>Pilih beberapa mata pelajaran untuk membuat sesi latihan sesuai kebutuhanmu.</p>
        </div>

        {/* Nama latihan */}
        <div>
          <p className="text-[13px] font-bold text-[#374151] mb-2" style={{ fontFamily: PP }}>Nama Latihan</p>
          <input value={nama} onChange={e => setNama(e.target.value)}
            placeholder="Contoh: Review TKA Mingguan"
            className="w-full px-4 py-3 rounded-xl border text-[14px] focus:outline-none transition-all"
            style={{ borderColor: nama ? BLUE : "#E5E7EB", fontFamily: PP }} />
        </div>

        {/* Pilih mapel — multiple */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-bold text-[#374151]" style={{ fontFamily: PP }}>Pilih Mata Pelajaran</p>
            {selected.length > 0 && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: BL, color: BLUE, fontFamily: PP }}>
                {selected.length} dipilih
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {ALL_MAPEL.map(m => (
              <SubjectCard key={m} label={m} selected={selected.includes(m)} onClick={() => toggle(m)} />
            ))}
          </div>
        </div>
      </div>

      {/* Right: config */}
      <div className="flex flex-col gap-5">
        {/* Jumlah Soal */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <p className="text-[14px] font-bold text-[#0f172a] mb-4" style={{ fontFamily: PP }}>Jumlah Soal</p>
          <div className="grid grid-cols-3 gap-2">
            {JUMLAH_OPTS.map(n => (
              <button key={n} onClick={() => setJumlah(n)}
                className="py-2.5 rounded-xl text-[13px] font-semibold border-2 transition-all"
                style={{
                  fontFamily: PP, outline: "none",
                  borderColor: jumlah === n ? BLUE : "#E5E7EB",
                  background:  jumlah === n ? BL   : "transparent",
                  color:       jumlah === n ? BLUE : "#374151",
                }}>
                {n === "custom" ? "Custom" : n}
              </button>
            ))}
          </div>
          {jumlah === "custom" && (
            <input value={customSoal} onChange={e => setCustomSoal(e.target.value)}
              type="number" placeholder="Jumlah soal"
              className="mt-3 w-full px-4 py-2.5 rounded-xl border text-[13px] focus:outline-none"
              style={{ borderColor: BLUE, fontFamily: PP }} />
          )}
        </div>

        {/* Timer */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[14px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Timer</p>
            <button onClick={() => setTimerOn(v => !v)}
              className="relative w-12 h-6 rounded-full transition-all"
              style={{ background: timerOn ? BLUE : "#e2e8f0", outline: "none" }}>
              <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                style={{ left: timerOn ? "26px" : "2px" }} />
            </button>
          </div>
          {timerOn ? (
            <div className="flex items-center gap-2">
              <input value={durasi} onChange={e => setDurasi(e.target.value)}
                type="number" className="w-20 px-3 py-2 rounded-xl border text-[13px] focus:outline-none text-center"
                style={{ borderColor: BLUE, fontFamily: PP }} />
              <p className="text-[13px] text-[#64748b]" style={{ fontFamily: PP }}>menit</p>
            </div>
          ) : (
            <p className="text-[12px] text-[#94a3b8]" style={{ fontFamily: PP }}>Latihan tanpa batas waktu</p>
          )}
        </div>

        {/* Mode Pembahasan */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <p className="text-[14px] font-bold text-[#0f172a] mb-4" style={{ fontFamily: PP }}>Mode Pembahasan</p>
          <div className="flex flex-col gap-3">
            {([
              { key: "per",     label: "Per Soal" },
              { key: "selesai", label: "Setelah Selesai" },
            ] as const).map(opt => (
              <label key={opt.key} className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setPembahasan(opt.key)}
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer"
                  style={{ borderColor: pembahasan === opt.key ? BLUE : "#d1d5db" }}>
                  {pembahasan === opt.key && <div className="w-2 h-2 rounded-full" style={{ background: BLUE }} />}
                </div>
                <p className="text-[13px] text-[#374151]" style={{ fontFamily: PP }}>{opt.label}</p>
              </label>
            ))}
          </div>
        </div>

        <button onClick={() => { if (canStart) onMulai(); }}
          className="w-full py-4 rounded-2xl text-[15px] font-bold transition-all hover:opacity-90 active:scale-[0.98]"
          style={{
            background: canStart ? BLUE : "#e2e8f0",
            color: canStart ? "white" : "#94a3b8",
            fontFamily: PP, outline: "none",
            cursor: canStart ? "pointer" : "not-allowed",
          }}>
          Mulai Latihan
        </button>
        {!canStart && (
          <p className="text-[12px] text-[#94a3b8] text-center -mt-2" style={{ fontFamily: PP }}>
            {!nama.trim() ? "Masukkan nama latihan" : "Pilih setidaknya satu mata pelajaran"}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── RIWAYAT TAB ─────────────────────────────────────────────────────────────
const TREND_DATA = [
  { week: "M1", pct: 72 },
  { week: "M2", pct: 74 },
  { week: "M3", pct: 76 },
  { week: "M4", pct: 75 },
  { week: "M5", pct: 78 },
  { week: "M6", pct: 81 },
];

const PERFORMA = [
  { mapel: "Matematika",       akurasi: 84, trend: "up"   },
  { mapel: "Bahasa Indonesia", akurasi: 78, trend: "flat" },
  { mapel: "Bahasa Inggris",   akurasi: 79, trend: "down" },
  { mapel: "Fisika",           akurasi: 82, trend: "up"   },
  { mapel: "Kimia",            akurasi: 75, trend: "flat" },
];

const RIWAYAT = [
  { mapel: "Matematika",     hari: "Hari ini",  mode: "Guided Practice",  durasi: "36 mnt", akurasi: 84, soal: 50, benar: 42, salah: 8 },
  { mapel: "Latihan Campuran", hari: "Kemarin",  mode: "Custom Practice",  durasi: "51 mnt", akurasi: 79, soal: 40, benar: 32, salah: 8 },
  { mapel: "Bahasa Inggris", hari: "Senin",     mode: "Guided Practice",  durasi: "28 mnt", akurasi: 82, soal: 30, benar: 25, salah: 5 },
  { mapel: "Sains Campuran", hari: "Minggu",    mode: "Custom Practice",  durasi: "44 mnt", akurasi: 71, soal: 45, benar: 32, salah: 13 },
];

function RiwayatTab() {
  const TrendIcon = ({ t }: { t: string }) => {
    if (t === "up")   return <TrendingUp size={14} color="#22c55e" />;
    if (t === "down") return <TrendingDown size={14} color="#ef4444" />;
    return <Minus size={14} color="#94a3b8" />;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 shadow-lg">
        <p className="text-[13px] font-bold" style={{ color: BLUE, fontFamily: PP }}>{payload[0].value}%</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-5">
        {[
          { label: "Latihan Bulan Ini", value: "18",    sub: "sesi"  },
          { label: "Rata-rata Akurasi", value: "81%",   sub: "akurasi keseluruhan" },
          { label: "Total Soal",        value: "1.240", sub: "soal dikerjakan" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-3xl border border-[#E5E7EB] px-6 py-6"
            style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
            <p className="text-[12px] font-semibold text-[#94a3b8] uppercase tracking-wide mb-3" style={{ fontFamily: PP }}>{s.label}</p>
            <p className="text-[32px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>{s.value}</p>
            <p className="text-[12px] text-[#94a3b8] mt-1" style={{ fontFamily: PP }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-5">
        {/* Line chart */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-7" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[16px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Perkembangan Belajar</p>
              <p className="text-[13px] text-[#94a3b8] mt-1" style={{ fontFamily: PP }}>6 minggu terakhir</p>
            </div>
            <div className="text-right">
              <span className="text-[12px] font-bold px-3 py-1.5 rounded-full" style={{ background: "#f0fdf4", color: "#16a34a", fontFamily: PP }}>+9% Kenaikan</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={TREND_DATA}>
              <CartesianGrid stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: PP }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 90]} tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: PP }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="pct" stroke={BLUE} strokeWidth={3} dot={{ r: 5, fill: BLUE, strokeWidth: 0 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-between mt-4 pt-4 border-t border-[#f1f5f9]">
            <div className="text-center">
              <p className="text-[12px] text-[#94a3b8] mb-1" style={{ fontFamily: PP }}>Awal</p>
              <p className="text-[18px] font-bold text-[#94a3b8]" style={{ fontFamily: PP }}>72%</p>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-px bg-[#e2e8f0]" />
              <ChevronRight size={14} color="#94a3b8" />
            </div>
            <div className="text-center">
              <p className="text-[12px] text-[#94a3b8] mb-1" style={{ fontFamily: PP }}>Sekarang</p>
              <p className="text-[18px] font-bold" style={{ color: BLUE, fontFamily: PP }}>81%</p>
            </div>
          </div>
        </div>

        {/* Performa per mapel */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <p className="text-[16px] font-bold text-[#0f172a] mb-5" style={{ fontFamily: PP }}>Performa Mata Pelajaran</p>
          <div className="flex flex-col gap-1">
            {/* Header */}
            <div className="grid grid-cols-[1fr_52px_80px] pb-2 border-b border-[#f1f5f9] mb-1">
              {["Mata Pelajaran","Akurasi","Status"].map(h => (
                <p key={h} className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]" style={{ fontFamily: PP }}>{h}</p>
              ))}
            </div>
            {PERFORMA.map(p => (
              <div key={p.mapel} className="grid grid-cols-[1fr_52px_80px] items-center py-3 border-b border-[#f8fafc] last:border-0">
                <p className="text-[13px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>{p.mapel}</p>
                <p className="text-[13px] font-bold" style={{ color: BLUE, fontFamily: PP }}>{p.akurasi}%</p>
                <div className="flex items-center gap-1.5">
                  <TrendIcon t={p.trend} />
                  <p className="text-[11px] font-semibold"
                    style={{ color: p.trend === "up" ? "#16a34a" : p.trend === "down" ? "#dc2626" : "#94a3b8", fontFamily: PP }}>
                    {p.trend === "up" ? "Meningkat" : p.trend === "down" ? "Menurun" : "Stabil"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Riwayat list */}
      <div>
        <p className="text-[16px] font-bold text-[#0f172a] mb-4" style={{ fontFamily: PP }}>Riwayat Latihan</p>
        <div className="flex flex-col gap-3">
          {RIWAYAT.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] px-6 py-5 flex items-center gap-6"
              style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
              {/* Akurasi circle */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: r.akurasi >= 80 ? "#f0fdf4" : r.akurasi >= 70 ? "#fffbeb" : "#fef2f2" }}>
                <p className="text-[15px] font-bold"
                  style={{ color: r.akurasi >= 80 ? "#16a34a" : r.akurasi >= 70 ? "#d97706" : "#dc2626", fontFamily: PP }}>
                  {r.akurasi}%
                </p>
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[15px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>{r.mapel}</p>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                    style={{ background: r.mode === "Guided Practice" ? BL : "#f5f3ff", color: r.mode === "Guided Practice" ? BLUE : "#7c3aed", fontFamily: PP }}>
                    {r.mode}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[12px] text-[#94a3b8]" style={{ fontFamily: PP }}>{r.hari}</span>
                  <span className="flex items-center gap-1 text-[12px] text-[#94a3b8]" style={{ fontFamily: PP }}>
                    <Clock size={11} /> {r.durasi}
                  </span>
                  <span className="text-[12px] text-[#94a3b8]" style={{ fontFamily: PP }}>{r.soal} Soal</span>
                </div>
                {r.benar !== undefined && (
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[11px] font-semibold" style={{ color: "#16a34a", fontFamily: PP }}>{r.benar} Benar</span>
                    <span className="text-[11px] font-semibold" style={{ color: "#dc2626", fontFamily: PP }}>{r.salah} Salah</span>
                  </div>
                )}
              </div>
              <button className="shrink-0 px-5 py-2.5 rounded-xl text-[12px] font-bold border border-[#E5E7EB] text-[#374151] hover:bg-[#f8fafc] transition-all"
                style={{ fontFamily: PP, outline: "none" }}>
                Lihat Detail
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function LatihanTKAPage({ onBack, breadcrumb }: { onBack?: () => void; breadcrumb?: string }) {
  const [tab,  setTab]  = useState<TKATab>("guided");
  const [view, setView] = useState<TKAView>("main");

  if (view === "hasil") {
    return (
      <div className="flex flex-col h-full" style={{ background: "#f8faff" }}>
        <HasilLatihanTKAPage onBack={() => setView("main")} onUlangi={() => setView("main")} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: "#f8faff" }}>
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-[rgba(0,0,0,0.07)] px-10 py-5 flex items-center gap-4 sticky top-0 z-30">
        {onBack && (
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#e2e8f0] transition-all shrink-0" style={{ outline: "none" }}>
            <ArrowLeft size={16} color="#374151" />
          </button>
        )}
        <div>
          {breadcrumb ? (
            <div className="flex items-center gap-1.5">
              <button onClick={onBack} className="text-[12px] font-semibold text-[#94a3b8] hover:text-[#64748b] transition-all" style={{ fontFamily: PP, outline: "none" }}>{breadcrumb}</button>
              <ChevronRight size={12} color="#94a3b8" />
              <p className="text-[12px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>Latihan TKA</p>
            </div>
          ) : (
            <p className="text-[11px] font-bold uppercase tracking-[0.13em]" style={{ color: BLUE, fontFamily: PP }}>SNBP</p>
          )}
          <p className="text-[15px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Latihan TKA</p>
        </div>
      </div>

      <div className="flex-1 px-10 py-8 flex flex-col gap-8 max-w-6xl mx-auto w-full">

        {/* Hero */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: BLUE, fontFamily: PP }}>Tes Kemampuan Akademik</p>
          <h1 className="text-[36px] font-bold text-[#0f172a] mb-3 leading-tight" style={{ fontFamily: PP }}>Latihan TKA</h1>
          <p className="text-[15px] text-[#64748b] leading-relaxed max-w-[560px]" style={{ fontFamily: PP }}>
            Tingkatkan penguasaan materi Tes Kemampuan Akademik melalui latihan yang dapat disesuaikan dengan kebutuhan belajarmu.
          </p>
        </div>

        {/* Segmented tab */}
        <SegCtrl
          tabs={[
            { key: "guided",  label: "Guided Practice" },
            { key: "riwayat", label: "Riwayat Latihan" },
          ]}
          value={tab}
          onChange={setTab}
        />

        {/* Tab content */}
        {tab === "guided"  && <GuidedTab  onMulai={() => setView("hasil")} />}
        {tab === "riwayat" && <RiwayatTab />}

        <div className="h-8" />
      </div>
    </div>
  );
}
