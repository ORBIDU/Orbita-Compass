import React, { useState } from "react";
import { ArrowLeft, ChevronRight, X, Check, Lock, TrendingUp, Minus, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const PP   = "Poppins, sans-serif";
const BLUE = "#2563EB";
const BL   = "#eff6ff";

type SKDTab    = "latihan" | "tryout" | "laporan";
type Subtest   = "TWK" | "TIU" | "TKP";
type MatStatus = "done" | "active" | "pending";
type Difficulty = "Dasar" | "Menengah" | "Sulit";

// ─── Data ────────────────────────────────────────────────────────────────────
interface MatItem { name: string; status: MatStatus; progress?: number; difficulty: Difficulty; }

const MATERI_DATA: Record<Subtest, { label: string; desc: string; items: MatItem[] }> = {
  TWK: {
    label: "Tes Wawasan Kebangsaan",
    desc: "Pelajari materi wawasan kebangsaan sesuai kisi-kisi resmi SKD.",
    items: [
      { name: "Pancasila",               status: "done",   progress: 100, difficulty: "Dasar" },
      { name: "UUD 1945",                status: "active", progress: 60,  difficulty: "Menengah" },
      { name: "NKRI",                    status: "pending",               difficulty: "Dasar" },
      { name: "Bhinneka Tunggal Ika",    status: "pending",               difficulty: "Dasar" },
      { name: "Sejarah Nasional",        status: "pending",               difficulty: "Menengah" },
      { name: "Sistem Ketatanegaraan",   status: "pending",               difficulty: "Sulit" },
      { name: "Bela Negara",             status: "pending",               difficulty: "Menengah" },
      { name: "Integritas Nasional",     status: "pending",               difficulty: "Sulit" },
    ],
  },
  TIU: {
    label: "Tes Intelegensi Umum",
    desc: "Pelajari materi intelegensi umum mulai dari penalaran verbal hingga numerik.",
    items: [
      { name: "Penalaran Verbal",   status: "done",   progress: 100, difficulty: "Dasar" },
      { name: "Analogi",            status: "active", progress: 45,  difficulty: "Menengah" },
      { name: "Silogisme",          status: "pending",               difficulty: "Menengah" },
      { name: "Analitis",           status: "pending",               difficulty: "Sulit" },
      { name: "Penalaran Numerik",  status: "pending",               difficulty: "Menengah" },
      { name: "Aritmetika",         status: "pending",               difficulty: "Dasar" },
      { name: "Deret Angka",        status: "pending",               difficulty: "Menengah" },
      { name: "Penalaran Figural",  status: "pending",               difficulty: "Sulit" },
    ],
  },
  TKP: {
    label: "Tes Karakteristik Pribadi",
    desc: "Pelajari materi karakteristik pribadi yang mengukur kesiapan menjadi ASN.",
    items: [
      { name: "Pelayanan Publik",       status: "done",   progress: 100, difficulty: "Dasar" },
      { name: "Profesionalisme",        status: "done",   progress: 100, difficulty: "Dasar" },
      { name: "Jejaring Kerja",         status: "active", progress: 30,  difficulty: "Menengah" },
      { name: "Sosial Budaya",          status: "pending",               difficulty: "Menengah" },
      { name: "Teknologi Informasi",    status: "pending",               difficulty: "Menengah" },
      { name: "Anti Radikalisme",       status: "pending",               difficulty: "Sulit" },
      { name: "Integritas",             status: "pending",               difficulty: "Dasar" },
      { name: "Pengambilan Keputusan",  status: "pending",               difficulty: "Sulit" },
    ],
  },
};

// Schools
const SCHOOLS = [
  { id: "stan", abbr: "PKN STAN", name: "Politeknik Keuangan Negara STAN", desc: "Program studi keuangan negara dan perpajakan.", ministry: "Kementerian Keuangan", about: "Politeknik Keuangan Negara STAN merupakan perguruan tinggi kedinasan di bawah Kementerian Keuangan yang berfokus pada pendidikan di bidang keuangan negara.", prodi: ["D3 Kebendaharaan Negara","D4 Akuntansi Sektor Publik","D4 Manajemen Aset Publik","D4 Pajak"], seleksi: ["Administrasi","SKD","Tes Akademik","Tes Kesehatan","Wawancara"], karier: ["Kementerian Keuangan","Direktorat Jenderal Pajak","Direktorat Jenderal Bea dan Cukai","BPKP"], color: "#2563EB" },
  { id: "ipdn", abbr: "IPDN", name: "Institut Pemerintahan Dalam Negeri", desc: "Mencetak calon aparatur pemerintahan daerah.", ministry: "Kemendagri", about: "IPDN mendidik kader pemerintahan dalam negeri di bawah Kementerian Dalam Negeri.", prodi: ["S1 Ilmu Pemerintahan","D4 Administrasi Pemerintahan Daerah"], seleksi: ["Administrasi","SKD","Tes Kesehatan & Jasmani","Psikologi","Pantukhir"], karier: ["Pemerintah Daerah","Kemendagri","BNPP"], color: "#7c3aed" },
  { id: "poltekim", abbr: "Poltekim", name: "Politeknik Imigrasi", desc: "Bidang keimigrasian.", ministry: "Kemenkumham", about: "Politekim mendidik aparat imigrasi profesional.", prodi: ["D4 Hukum Keimigrasian","D4 Administrasi Keimigrasian"], seleksi: ["Administrasi","SKD","SKB","Tes Kesehatan & Jasmani","Wawancara"], karier: ["Ditjen Imigrasi","Kantor Imigrasi"], color: "#059669" },
  { id: "poltekip", abbr: "Poltekip", name: "Politeknik Ilmu Pemasyarakatan", desc: "Bidang pemasyarakatan.", ministry: "Kemenkumham", about: "Poltekip mendidik petugas pemasyarakatan.", prodi: ["D3 Bimbingan Kemasyarakatan","D4 Manajemen Pemasyarakatan"], seleksi: ["Administrasi","SKD","SKB","Tes Kesehatan & Jasmani","Wawancara"], karier: ["Ditjen PAS","Lembaga Pemasyarakatan"], color: "#d97706" },
  { id: "stmkg", abbr: "STMKG", name: "Sekolah Tinggi Meteorologi Klimatologi dan Geofisika", desc: "Bidang meteorologi dan geofisika.", ministry: "BMKG", about: "STMKG mendidik tenaga ahli meteorologi, klimatologi, dan geofisika.", prodi: ["D4 Meteorologi","D4 Klimatologi","D4 Geofisika"], seleksi: ["Administrasi","SKD","Tes Akademik","Tes Kesehatan & Jasmani","Wawancara"], karier: ["BMKG","Kemenhub"], color: "#0891b2" },
  { id: "stin", abbr: "STIN", name: "Sekolah Tinggi Intelijen Negara", desc: "Bidang intelijen negara.", ministry: "BIN", about: "STIN mendidik agen intelijen profesional.", prodi: ["S1 Intelijen","S1 Teknologi Intelijen"], seleksi: ["Administrasi","SKD","Tes Akademik & Psikologi","Tes Kesehatan & Jasmani","Wawancara Mendalam"], karier: ["Badan Intelijen Negara"], color: "#374151" },
];

// ─── Segmented Control ────────────────────────────────────────────────────────
function SegCtrl<T extends string>({ tabs, value, onChange, size = "md" }: {
  tabs: { key: T; label: string }[]; value: T; onChange: (v: T) => void; size?: "sm" | "md" | "lg";
}) {
  const px = size === "sm" ? "px-4 py-1.5 text-[12px]" : size === "lg" ? "px-8 py-3 text-[14px]" : "px-6 py-2.5 text-[13px]";
  return (
    <div className="inline-flex p-1 rounded-2xl" style={{ background: "#f1f5f9" }}>
      {tabs.map(t => (
        <button key={t.key} onClick={() => onChange(t.key)}
          className={`${px} rounded-xl font-semibold transition-all`}
          style={{ fontFamily: PP, outline: "none", background: value === t.key ? "white" : "transparent", color: value === t.key ? "#0f172a" : "#64748b", boxShadow: value === t.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── Badges ──────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: MatStatus }) {
  const cfg = {
    done:    { label: "Selesai",           bg: "#f0fdf4", color: "#16a34a" },
    active:  { label: "Sedang Dipelajari", bg: BL,        color: BLUE },
    pending: { label: "Belum Dimulai",     bg: "#f8fafc",  color: "#94a3b8" },
  }[status];
  return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: cfg.bg, color: cfg.color, fontFamily: PP }}>{cfg.label}</span>;
}

function DifficultyBadge({ level }: { level: Difficulty }) {
  const cfg = {
    Dasar:    { bg: "#f1f5f9", color: "#64748b" },
    Menengah: { bg: BL,        color: BLUE },
    Sulit:    { bg: "#f5f3ff", color: "#7c3aed" },
  }[level];
  return <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: cfg.bg, color: cfg.color, fontFamily: PP }}>{level}</span>;
}

// ─── CONFIG MODAL ─────────────────────────────────────────────────────────────
function ConfigModal({ materi, onClose }: { materi: MatItem; onClose: () => void }) {
  const [jumlah, setJumlah]   = useState<number | "custom">(20);
  const [custom, setCustom]   = useState("");
  const [timerOn, setTimerOn] = useState(false);
  const [durasi, setDurasi]   = useState("30");
  const [mode, setMode]       = useState<"per"|"selesai">("selesai");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full flex flex-col overflow-hidden" style={{ maxWidth: 680 }}>
        {/* Header */}
        <div className="px-8 py-6 border-b border-[#f1f5f9] flex items-start justify-between">
          <div>
            <p className="text-[20px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>{materi.name}</p>
            <p className="text-[13px] text-[#94a3b8] mt-1" style={{ fontFamily: PP }}>Konfigurasikan sesi latihan sebelum memulai.</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#e2e8f0] transition-all ml-6 shrink-0" style={{ outline: "none" }}>
            <X size={16} color="#64748b" />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-7 flex flex-col gap-7">
          {/* Jumlah soal */}
          <div>
            <p className="text-[14px] font-bold text-[#0f172a] mb-3" style={{ fontFamily: PP }}>Jumlah Soal</p>
            <div className="flex gap-2">
              {([10, 20, 30, "custom"] as const).map(n => (
                <button key={n} onClick={() => setJumlah(n)}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold border-2 transition-all"
                  style={{ fontFamily: PP, outline: "none", borderColor: jumlah === n ? BLUE : "#E5E7EB", background: jumlah === n ? BL : "transparent", color: jumlah === n ? BLUE : "#374151" }}>
                  {n === "custom" ? "Custom" : n}
                </button>
              ))}
            </div>
            {jumlah === "custom" && (
              <input value={custom} onChange={e => setCustom(e.target.value)} type="number" placeholder="Masukkan jumlah soal"
                className="mt-3 w-full px-4 py-3 rounded-xl border text-[14px] focus:outline-none"
                style={{ borderColor: BLUE, fontFamily: PP }} />
            )}
          </div>

          {/* Timer */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[14px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Timer</p>
              <button onClick={() => setTimerOn(v => !v)} className="relative w-12 h-6 rounded-full transition-all" style={{ background: timerOn ? BLUE : "#e2e8f0", outline: "none" }}>
                <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all" style={{ left: timerOn ? "26px" : "2px" }} />
              </button>
            </div>
            {timerOn && (
              <div className="flex items-center gap-2">
                <input value={durasi} onChange={e => setDurasi(e.target.value)} type="number"
                  className="w-20 px-3 py-2.5 rounded-xl border text-[13px] focus:outline-none text-center" style={{ borderColor: BLUE, fontFamily: PP }} />
                <p className="text-[13px] text-[#64748b]" style={{ fontFamily: PP }}>menit</p>
              </div>
            )}
            {!timerOn && <p className="text-[13px] text-[#94a3b8]" style={{ fontFamily: PP }}>Latihan tanpa batas waktu</p>}
          </div>

          {/* Mode pembahasan */}
          <div>
            <p className="text-[14px] font-bold text-[#0f172a] mb-3" style={{ fontFamily: PP }}>Mode Pembahasan</p>
            {(["per","selesai"] as const).map(opt => (
              <label key={opt} className="flex items-start gap-3 mb-3 last:mb-0 cursor-pointer">
                <div onClick={() => setMode(opt)} className="w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer mt-0.5 shrink-0"
                  style={{ borderColor: mode === opt ? BLUE : "#d1d5db" }}>
                  {mode === opt && <div className="w-2 h-2 rounded-full" style={{ background: BLUE }} />}
                </div>
                <p className="text-[14px] text-[#374151]" style={{ fontFamily: PP }}>
                  {opt === "per" ? "Tampilkan pembahasan setiap soal" : "Tampilkan pembahasan setelah latihan selesai"}
                </p>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-[#f1f5f9] flex gap-3">
          <button onClick={onClose} className="flex-1 py-3.5 rounded-2xl text-[14px] font-semibold border border-[#E5E7EB] text-[#374151] hover:bg-[#f8fafc] transition-all" style={{ fontFamily: PP, outline: "none" }}>Batal</button>
          <button className="flex-1 py-3.5 rounded-2xl text-[14px] font-bold text-white hover:opacity-90 transition-all" style={{ background: BLUE, fontFamily: PP, outline: "none" }}>Mulai Latihan</button>
        </div>
      </div>
    </div>
  );
}

// ─── SUBTEST PICKER MODAL ─────────────────────────────────────────────────────
function SubtestPicker({ current, onChange, onClose }: { current: Subtest; onChange: (s: Subtest) => void; onClose: () => void }) {
  const SUBTEST_COLOR: Record<Subtest, string> = { TWK: "#dc2626", TIU: BLUE, TKP: "#059669" };
  const ORDER: Subtest[] = ["TWK", "TIU", "TKP"];
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full flex justify-center pb-6 px-4" style={{ animation: "slideUp 0.28s cubic-bezier(0.16,1,0.3,1)" }}>
        <div className="bg-white rounded-3xl shadow-2xl w-full flex flex-col overflow-hidden" style={{ maxWidth: 640 }}>
          {/* Handle */}
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-10 h-1 rounded-full bg-[#e2e8f0]" />
          </div>
          {/* Header */}
          <div className="px-8 pt-2 pb-5 border-b border-[#f1f5f9] flex items-start justify-between">
            <div>
              <p className="text-[19px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Pilih Subtes SKD</p>
              <p className="text-[13px] text-[#94a3b8] mt-1" style={{ fontFamily: PP }}>Pilih subtes yang ingin dipelajari.</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#e2e8f0] transition-all" style={{ outline: "none" }}>
              <X size={16} color="#64748b" />
            </button>
          </div>
          {/* Cards */}
          <div className="px-8 py-6 flex flex-col gap-3">
            {ORDER.map((s, idx) => {
              const data = MATERI_DATA[s];
              const isActive = s === current;
              const doneCount = data.items.filter(i => i.status === "done").length;
              const pct = Math.round((doneCount / data.items.length) * 100);
              const sc = SUBTEST_COLOR[s];
              return (
                <button key={s} onClick={() => { onChange(s); onClose(); }}
                  className="w-full text-left rounded-2xl border-2 px-6 py-5 transition-all hover:shadow-md"
                  style={{ borderColor: isActive ? BLUE : "#E5E7EB", background: isActive ? BL : "white", outline: "none" }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black text-white shrink-0" style={{ background: sc }}>{s}</div>
                      <div>
                        <p className="text-[15px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>{data.label}</p>
                        <p className="text-[12px] text-[#94a3b8]" style={{ fontFamily: PP }}>{data.items.length} Materi</p>
                      </div>
                    </div>
                    {isActive && <Check size={18} strokeWidth={2.5} color={BLUE} />}
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex-1 h-1.5 rounded-full bg-[#e2e8f0] overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: sc }} />
                    </div>
                    <p className="text-[11px] font-bold shrink-0" style={{ color: sc, fontFamily: PP }}>{pct}%</p>
                  </div>
                  {idx < ORDER.length - 1 && (
                    <div className="flex justify-start mt-3 -mb-1 opacity-40">
                      <ChevronRight size={13} color="#94a3b8" style={{ transform: "rotate(90deg)" }} />
                    </div>
                  )}
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

// ─── GUIDED LEARNING ──────────────────────────────────────────────────────────
function GuidedLearning() {
  const [subtest,     setSubtest]     = useState<Subtest>("TIU");
  const [modalItem,   setModalItem]   = useState<MatItem | null>(null);
  const [showPicker,  setShowPicker]  = useState(false);

  const data      = MATERI_DATA[subtest];
  const doneCount = data.items.filter(i => i.status === "done").length;
  const totalCount = data.items.length;
  const progress  = Math.round((doneCount / totalCount) * 100);
  const SUBTEST_COLOR: Record<Subtest, string> = { TWK: "#dc2626", TIU: BLUE, TKP: "#059669" };
  const sc = SUBTEST_COLOR[subtest];

  function btnLabel(s: MatStatus) { return s === "done" ? "Lihat Materi" : s === "active" ? "Lanjutkan" : "Mulai"; }
  function btnStyle(s: MatStatus) {
    if (s === "done")   return { background: "transparent", color: "#22c55e", border: "1.5px solid #22c55e" };
    if (s === "active") return { background: BLUE, color: "white", border: "none" };
    return { background: "#f8fafc", color: "#94a3b8", border: "1px solid #E5E7EB" };
  }

  return (
    <div className="flex flex-col gap-5">
      {/* ── Learning Card ── */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] px-8 py-7" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.13em] mb-1.5" style={{ color: sc, fontFamily: PP }}>{subtest}</p>
            <p className="text-[22px] font-bold text-[#0f172a] leading-tight" style={{ fontFamily: PP }}>{data.label}</p>
            <p className="text-[14px] text-[#94a3b8] mt-1" style={{ fontFamily: PP }}>{totalCount} Materi</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full bg-[#e2e8f0] overflow-hidden mb-2">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: sc }} />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-[#94a3b8]" style={{ fontFamily: PP }}>Progress Belajar</p>
          <p className="text-[12px] font-bold" style={{ color: sc, fontFamily: PP }}>{progress}%</p>
        </div>

        {/* Ganti Subtes button */}
        <div className="flex justify-end mt-5">
          <button onClick={() => setShowPicker(true)}
            className="px-5 py-2.5 rounded-xl text-[13px] font-bold border-2 transition-all hover:bg-[#f8fafc]"
            style={{ borderColor: "#E5E7EB", color: "#374151", fontFamily: PP, outline: "none" }}>
            Ganti Subtes
          </button>
        </div>
      </div>

      {/* ── Daftar Materi (vertical list) ── */}
      <div className="flex flex-col gap-3">
        {data.items.map((item, idx) => {
          const isDone   = item.status === "done";
          const isActive = item.status === "active";
          const bs = btnStyle(item.status);
          const progColor = isDone ? "#22c55e" : BLUE;
          return (
            <div key={idx} className="bg-white rounded-2xl border px-6 py-5 flex items-center gap-5 transition-all hover:shadow-md"
              style={{ borderColor: isActive ? BLUE : "#E5E7EB", boxShadow: isActive ? `0 0 0 1px ${BLUE}22` : "none" }}>
              {/* Left: index */}
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-[13px] font-bold"
                style={{ background: isActive ? BL : isDone ? "#f0fdf4" : "#f8fafc", color: isActive ? BLUE : isDone ? "#22c55e" : "#94a3b8", fontFamily: PP }}>
                {isDone ? <Check size={15} strokeWidth={3} color="#22c55e" /> : idx + 1}
              </div>

              {/* Middle: name + badges + progress */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                  <p className="text-[15px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>{item.name}</p>
                  <DifficultyBadge level={item.difficulty} />
                  <StatusBadge status={item.status} />
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

      {modalItem   && <ConfigModal materi={modalItem} onClose={() => setModalItem(null)} />}
      {showPicker  && <SubtestPicker current={subtest} onChange={setSubtest} onClose={() => setShowPicker(false)} />}
    </div>
  );
}

// ─── CUSTOM PRACTICE ─────────────────────────────────────────────────────────
function CustomPractice() {
  const [subtest,    setSubtest]    = useState<Subtest>("TIU");
  const [nama,       setNama]       = useState("");
  const [selected,   setSelected]   = useState<string[]>([]);
  const [jumlah,     setJumlah]     = useState<number | "custom">(20);
  const [customN,    setCustomN]    = useState("");
  const [timerOn,    setTimerOn]    = useState(false);
  const [durasi,     setDurasi]     = useState("45");
  const [mode,       setMode]       = useState<"per"|"selesai">("selesai");

  const data     = MATERI_DATA[subtest];
  const allItems = data.items;

  function toggle(name: string) { setSelected(p => p.includes(name) ? p.filter(x => x !== name) : [...p, name]); }
  const canStart = nama.trim() !== "" && selected.length > 0;

  return (
    <div className="grid grid-cols-[1fr_340px] gap-6 items-start">
      {/* Left */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 flex flex-col gap-7" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
        <div>
          <p className="text-[20px] font-bold text-[#0f172a] mb-1" style={{ fontFamily: PP }}>Buat Latihan Sendiri</p>
          <p className="text-[13px] text-[#94a3b8]" style={{ fontFamily: PP }}>Gabungkan beberapa materi dalam satu sesi latihan.</p>
        </div>

        {/* Nama */}
        <div>
          <p className="text-[13px] font-bold text-[#374151] mb-2" style={{ fontFamily: PP }}>Nama Latihan</p>
          <input value={nama} onChange={e => setNama(e.target.value)} placeholder="Contoh: Latihan SKD Intensif"
            className="w-full px-4 py-3 rounded-xl border text-[14px] focus:outline-none transition-all"
            style={{ borderColor: nama ? BLUE : "#E5E7EB", fontFamily: PP }} />
        </div>

        {/* Subtest selector */}
        <div>
          <p className="text-[13px] font-bold text-[#374151] mb-3" style={{ fontFamily: PP }}>Subtest</p>
          <SegCtrl size="sm" tabs={[{key:"TWK",label:"TWK"},{key:"TIU",label:"TIU"},{key:"TKP",label:"TKP"}]} value={subtest} onChange={v => { setSubtest(v); setSelected([]); }} />
        </div>

        {/* Pilih materi — multiple */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] font-bold text-[#374151]" style={{ fontFamily: PP }}>Pilih Materi</p>
            {selected.length > 0 && <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: BL, color: BLUE, fontFamily: PP }}>{selected.length} dipilih</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            {allItems.map(item => {
              const sel = selected.includes(item.name);
              return (
                <label key={item.name} className="flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all"
                  style={{ borderColor: sel ? BLUE : "#E5E7EB", background: sel ? BL : "white" }}>
                  <div onClick={() => toggle(item.name)} className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 cursor-pointer transition-all"
                    style={{ background: sel ? BLUE : "transparent", border: sel ? "none" : "1.5px solid #d1d5db" }}>
                    {sel && <Check size={11} color="white" strokeWidth={3} />}
                  </div>
                  <p className="text-[13px] font-semibold flex-1" style={{ color: sel ? BLUE : "#374151", fontFamily: PP }}>{item.name}</p>
                  <DifficultyBadge level={item.difficulty} />
                  <StatusBadge status={item.status} />
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right config */}
      <div className="flex flex-col gap-5">
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <p className="text-[14px] font-bold text-[#0f172a] mb-4" style={{ fontFamily: PP }}>Jumlah Soal</p>
          <div className="grid grid-cols-3 gap-2">
            {([10,20,30,50,"custom"] as const).map(n => (
              <button key={n} onClick={() => setJumlah(n)} className="py-2.5 rounded-xl text-[13px] font-semibold border-2 transition-all"
                style={{ fontFamily: PP, outline: "none", borderColor: jumlah === n ? BLUE : "#E5E7EB", background: jumlah === n ? BL : "transparent", color: jumlah === n ? BLUE : "#374151" }}>
                {n === "custom" ? "Custom" : n}
              </button>
            ))}
          </div>
          {jumlah === "custom" && (
            <input value={customN} onChange={e => setCustomN(e.target.value)} type="number" placeholder="Jumlah soal"
              className="mt-3 w-full px-4 py-2.5 rounded-xl border text-[13px] focus:outline-none" style={{ borderColor: BLUE, fontFamily: PP }} />
          )}
        </div>

        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[14px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Timer</p>
            <button onClick={() => setTimerOn(v => !v)} className="relative w-12 h-6 rounded-full transition-all" style={{ background: timerOn ? BLUE : "#e2e8f0", outline: "none" }}>
              <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all" style={{ left: timerOn ? "26px" : "2px" }} />
            </button>
          </div>
          {timerOn ? (
            <div className="flex items-center gap-2">
              <input value={durasi} onChange={e => setDurasi(e.target.value)} type="number"
                className="w-20 px-3 py-2 rounded-xl border text-[13px] focus:outline-none text-center" style={{ borderColor: BLUE, fontFamily: PP }} />
              <p className="text-[13px] text-[#64748b]" style={{ fontFamily: PP }}>menit</p>
            </div>
          ) : <p className="text-[12px] text-[#94a3b8]" style={{ fontFamily: PP }}>Tanpa batas waktu</p>}
        </div>

        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <p className="text-[14px] font-bold text-[#0f172a] mb-4" style={{ fontFamily: PP }}>Mode Pembahasan</p>
          {(["per","selesai"] as const).map(opt => (
            <label key={opt} className="flex items-center gap-3 mb-3 last:mb-0 cursor-pointer">
              <div onClick={() => setMode(opt)} className="w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer"
                style={{ borderColor: mode === opt ? BLUE : "#d1d5db" }}>
                {mode === opt && <div className="w-2 h-2 rounded-full" style={{ background: BLUE }} />}
              </div>
              <p className="text-[13px] text-[#374151]" style={{ fontFamily: PP }}>{opt === "per" ? "Per Soal" : "Setelah Selesai"}</p>
            </label>
          ))}
        </div>

        <button disabled={!canStart} className="w-full py-4 rounded-2xl text-[15px] font-bold transition-all hover:opacity-90"
          style={{ background: canStart ? BLUE : "#e2e8f0", color: canStart ? "white" : "#94a3b8", fontFamily: PP, outline: "none", cursor: canStart ? "pointer" : "not-allowed" }}>
          Mulai Latihan
        </button>
        {!canStart && <p className="text-[12px] text-[#94a3b8] text-center -mt-2" style={{ fontFamily: PP }}>{!nama.trim() ? "Masukkan nama latihan terlebih dahulu" : "Pilih minimal satu materi"}</p>}
      </div>
    </div>
  );
}

// ─── LATIHAN TAB ──────────────────────────────────────────────────────────────
function LatihanTab() {
  return (
    <div className="flex flex-col gap-6">
      <GuidedLearning />
    </div>
  );
}

// ─── TRYOUT TAB ───────────────────────────────────────────────────────────────
function TryoutTab() {
  const TRYOUTS = [
    { no: 1, status: "open",   score: null, date: "15 Juli 2026",  peserta: "2.341" },
    { no: 2, status: "locked", score: null, date: "22 Juli 2026",  peserta: "—" },
    { no: 3, status: "done",   score: 402,  date: "8 Juli 2026",   peserta: "1.998" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Hero kecil */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] px-8 py-7" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
        <p className="text-[20px] font-bold text-[#0f172a] mb-1" style={{ fontFamily: PP }}>Tryout SKD</p>
        <p className="text-[14px] text-[#94a3b8] leading-relaxed" style={{ fontFamily: PP }}>
          Ukur kemampuanmu melalui simulasi SKD dengan format dan waktu yang menyerupai ujian sebenarnya.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {TRYOUTS.map(t => {
          const isOpen   = t.status === "open";
          const isLocked = t.status === "locked";
          const isDone   = t.status === "done";
          return (
            <div key={t.no} className="bg-white rounded-2xl border border-[#E5E7EB] px-7 py-6 flex items-center gap-6"
              style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.04)", opacity: isLocked ? 0.6 : 1 }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: isDone ? "#f0fdf4" : isLocked ? "#f8fafc" : BL }}>
                {isLocked
                  ? <Lock size={20} color="#94a3b8" />
                  : isDone
                  ? <Check size={20} color="#16a34a" strokeWidth={2.5} />
                  : <p className="text-[15px] font-bold" style={{ color: BLUE, fontFamily: PP }}>#{t.no}</p>
                }
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2.5 mb-1">
                  <p className="text-[16px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Tryout {t.no}</p>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                    style={{
                      background: isDone ? "#f0fdf4" : isLocked ? "#f8fafc" : BL,
                      color: isDone ? "#16a34a" : isLocked ? "#94a3b8" : BLUE,
                      fontFamily: PP,
                    }}>
                    {isDone ? "Selesai" : isLocked ? "Terkunci" : "Belum Dikerjakan"}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-[13px] text-[#94a3b8]" style={{ fontFamily: PP }}>{t.date}</p>
                  {t.peserta !== "—" && <p className="text-[13px] text-[#94a3b8]" style={{ fontFamily: PP }}>{t.peserta} peserta</p>}
                  {t.score && <p className="text-[13px] font-bold" style={{ color: BLUE, fontFamily: PP }}>Skor: {t.score}</p>}
                </div>
              </div>
              <button disabled={isLocked}
                className="shrink-0 px-7 py-3 rounded-2xl text-[13px] font-bold transition-all"
                style={{
                  background: isLocked ? "#f1f5f9" : isDone ? "transparent" : BLUE,
                  color: isLocked ? "#94a3b8" : isDone ? BLUE : "white",
                  border: isDone ? `1.5px solid ${BLUE}` : "none",
                  fontFamily: PP, outline: "none",
                  cursor: isLocked ? "not-allowed" : "pointer",
                }}>
                {isDone ? "Lihat Laporan" : isLocked ? "Terkunci" : "Kerjakan"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── LAPORAN TAB ─────────────────────────────────────────────────────────────
const SKOR_TREND = [
  { week: "M1", skor: 380 }, { week: "M2", skor: 395 }, { week: "M3", skor: 402 },
  { week: "M4", skor: 415 }, { week: "M5", skor: 428 }, { week: "M6", skor: 445 },
];

function SkorTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return <div className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 shadow-lg"><p className="text-[13px] font-bold" style={{ color: BLUE, fontFamily: PP }}>{payload[0].value}</p></div>;
}

function LaporanTab() {

  const SUBTEST_PROGRESS = [
    { label: "TWK", pct: 82, color: "#dc2626", passing: 65 },
    { label: "TIU", pct: 76, color: BLUE,      passing: 80 },
    { label: "TKP", pct: 88, color: "#059669", passing: 166 / 225 * 100 },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-5">
        {[
          { label: "Rata-rata Skor", value: "482", sub: "dari maks 550", color: BLUE },
          { label: "Tryout Selesai", value: "5",   sub: "sesi",          color: "#374151" },
          { label: "Target Skor",    value: "550",  sub: "ambang batas",  color: "#059669" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-3xl border border-[#E5E7EB] px-6 py-6" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#94a3b8] mb-3" style={{ fontFamily: PP }}>{s.label}</p>
            <p className="text-[34px] font-bold" style={{ color: s.color, fontFamily: PP }}>{s.value}</p>
            <p className="text-[12px] text-[#94a3b8] mt-1" style={{ fontFamily: PP }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-5">
        {/* Line chart */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-7" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <p className="text-[16px] font-bold text-[#0f172a] mb-1" style={{ fontFamily: PP }}>Perkembangan Skor</p>
          <p className="text-[13px] text-[#94a3b8] mb-6" style={{ fontFamily: PP }}>6 minggu terakhir</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={SKOR_TREND}>
              <CartesianGrid stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: PP }} axisLine={false} tickLine={false} />
              <YAxis domain={[350, 500]} tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: PP }} axisLine={false} tickLine={false} />
              <Tooltip content={<SkorTooltip />} />
              <Line type="monotone" dataKey="skor" stroke={BLUE} strokeWidth={3} dot={{ r: 5, fill: BLUE, strokeWidth: 0 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subtest progress */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <p className="text-[16px] font-bold text-[#0f172a] mb-5" style={{ fontFamily: PP }}>Progress Subtest</p>
          <div className="flex flex-col gap-6">
            {SUBTEST_PROGRESS.map(s => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[15px] font-bold text-[#374151]" style={{ fontFamily: PP }}>{s.label}</p>
                  <p className="text-[15px] font-bold" style={{ color: s.color, fontFamily: PP }}>{Math.round(s.pct)}%</p>
                </div>
                <div className="h-2.5 rounded-full bg-[#f1f5f9] overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Materi Prioritas */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-7" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[16px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Materi Prioritas</p>
            <p className="text-[13px] text-[#94a3b8] mt-1" style={{ fontFamily: PP }}>Materi yang perlu ditingkatkan berdasarkan performa latihan.</p>
          </div>
          <button className="px-6 py-2.5 rounded-xl text-[13px] font-bold text-white hover:opacity-90 transition-all"
            style={{ background: BLUE, fontFamily: PP, outline: "none" }}>Lanjutkan Latihan</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: "Silogisme",      sub: "TIU — Penalaran Logis",     pct: 52, color: "#f97316" },
            { name: "Logika Deduktif", sub: "TIU — Penalaran Logis",   pct: 48, color: "#ef4444" },
            { name: "Pancasila",       sub: "TWK — Ideologi dan Dasar", pct: 61, color: "#f59e0b" },
          ].map(m => (
            <div key={m.name} className="rounded-2xl border border-[#E5E7EB] p-5" style={{ background: "#f8fafc" }}>
              <p className="text-[14px] font-bold text-[#0f172a] mb-0.5" style={{ fontFamily: PP }}>{m.name}</p>
              <p className="text-[11px] text-[#94a3b8] mb-4" style={{ fontFamily: PP }}>{m.sub}</p>
              <div className="h-1.5 rounded-full bg-[#e2e8f0] overflow-hidden mb-2">
                <div className="h-full rounded-full" style={{ width: `${m.pct}%`, background: m.color }} />
              </div>
              <p className="text-[12px] font-bold" style={{ color: m.color, fontFamily: PP }}>{m.pct}% akurasi</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CARI TAHU PAGE ───────────────────────────────────────────────────────────
function CariTahuPage({ onBack, onMulaiPersiapan }: { onBack: () => void; onMulaiPersiapan: () => void }) {
  const [selectedSchool, setSelectedSchool] = useState<typeof SCHOOLS[0] | null>(null);
  const TAHAPAN = ["Seleksi Administrasi","Seleksi Kompetensi Dasar (SKD)","Seleksi Kompetensi Bidang (SKB)","Pengumuman Akhir"];
  const ALASAN = [
    { title: "Ikatan Dinas",     desc: "Lulusan berkesempatan bekerja di instansi pemerintah sesuai ketentuan masing-masing sekolah." },
    { title: "Biaya Pendidikan", desc: "Sebagian besar sekolah kedinasan memiliki biaya pendidikan yang ditanggung pemerintah." },
    { title: "Prospek Karier",   desc: "Lulusan dipersiapkan untuk bekerja sesuai bidang keahlian di kementerian atau lembaga terkait." },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: "#f8faff" }}>
      <div className="shrink-0 bg-white border-b border-[rgba(0,0,0,0.07)] px-10 py-5 flex items-center gap-4 sticky top-0 z-30">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#e2e8f0] transition-all" style={{ outline: "none" }}>
          <ArrowLeft size={16} color="#374151" />
        </button>
        <div>
          <div className="flex items-center gap-1.5">
            <button onClick={onBack} className="text-[12px] font-semibold text-[#94a3b8] hover:text-[#64748b] transition-all" style={{ fontFamily: PP, outline: "none" }}>Siap Kedinasan</button>
            <ChevronRight size={12} color="#94a3b8" />
            <p className="text-[12px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>Cari Tahu</p>
          </div>
          <p className="text-[15px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Mengenal Sekolah Kedinasan</p>
        </div>
      </div>

      <div className="flex-1 px-10 py-10 flex flex-col gap-12 max-w-5xl mx-auto w-full">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: BLUE, fontFamily: PP }}>Panduan Kedinasan</p>
          <h1 className="text-[34px] font-bold text-[#0f172a] mb-4 leading-tight" style={{ fontFamily: PP }}>Mengenal Sekolah Kedinasan</h1>
          <p className="text-[15px] text-[#64748b] leading-relaxed max-w-[600px]" style={{ fontFamily: PP }}>
            Memahami sekolah kedinasan adalah langkah awal sebelum menentukan pilihan karier dan mempersiapkan diri menghadapi proses seleksinya.
          </p>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-4" style={{ color: BLUE, fontFamily: PP }}>Section 01</p>
          <h2 className="text-[24px] font-bold text-[#0f172a] mb-5" style={{ fontFamily: PP }}>Apa itu Sekolah Kedinasan?</h2>
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-10" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
            <p className="text-[15px] text-[#374151] leading-[1.8] max-w-[680px]" style={{ fontFamily: PP }}>
              Sekolah Kedinasan merupakan perguruan tinggi yang diselenggarakan oleh kementerian atau lembaga pemerintah untuk mencetak sumber daya manusia sesuai kebutuhan instansi negara. Sebagian besar sekolah kedinasan menawarkan ikatan dinas sehingga lulusannya berkesempatan menjadi Aparatur Sipil Negara (ASN).
            </p>
            <button className="mt-8 flex items-center gap-2 text-[14px] font-bold hover:opacity-80 transition-all" style={{ color: BLUE, fontFamily: PP, outline: "none" }}>Selanjutnya <ChevronRight size={15} /></button>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-4" style={{ color: BLUE, fontFamily: PP }}>Section 02</p>
          <h2 className="text-[24px] font-bold text-[#0f172a] mb-5" style={{ fontFamily: PP }}>Mengapa Memilih Sekolah Kedinasan?</h2>
          <div className="grid grid-cols-3 gap-5">
            {ALASAN.map((a, i) => (
              <div key={i} className="bg-white rounded-3xl border border-[#E5E7EB] p-7 flex flex-col gap-4" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: BL }}>
                  <p className="text-[14px] font-bold" style={{ color: BLUE, fontFamily: PP }}>0{i+1}</p>
                </div>
                <p className="text-[16px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>{a.title}</p>
                <p className="text-[13px] text-[#64748b] leading-relaxed" style={{ fontFamily: PP }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-4" style={{ color: BLUE, fontFamily: PP }}>Section 03</p>
          <h2 className="text-[24px] font-bold text-[#0f172a] mb-5" style={{ fontFamily: PP }}>Tahapan Seleksi</h2>
          <div className="bg-white rounded-3xl border border-[#E5E7EB] px-10 py-8" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center">
              {TAHAPAN.map((t, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                  <div className="w-full flex items-center">
                    <div className={`flex-1 h-px ${i === 0 ? "opacity-0" : ""}`} style={{ background: "#e2e8f0" }} />
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0" style={{ background: BLUE, fontFamily: PP }}>{i+1}</div>
                    <div className={`flex-1 h-px ${i === TAHAPAN.length-1 ? "opacity-0" : ""}`} style={{ background: "#e2e8f0" }} />
                  </div>
                  <p className="text-[12px] font-semibold text-center leading-snug px-2" style={{ color: "#374151", fontFamily: PP }}>{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-4" style={{ color: BLUE, fontFamily: PP }}>Section 04</p>
          <h2 className="text-[24px] font-bold text-[#0f172a] mb-5" style={{ fontFamily: PP }}>Kenali Sekolah Kedinasan</h2>
          <div className="grid grid-cols-3 gap-5">
            {SCHOOLS.map(s => (
              <div key={s.id} className="bg-white rounded-3xl border border-[#E5E7EB] p-7 flex flex-col gap-4" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[11px] font-bold text-white" style={{ background: s.color, fontFamily: PP }}>{s.abbr.split(" ")[0]}</div>
                <div className="flex-1">
                  <p className="text-[16px] font-bold text-[#0f172a] mb-1" style={{ fontFamily: PP }}>{s.abbr}</p>
                  <p className="text-[12px] text-[#94a3b8] mb-2 leading-snug" style={{ fontFamily: PP }}>{s.name}</p>
                  <p className="text-[13px] text-[#64748b] leading-relaxed" style={{ fontFamily: PP }}>{s.desc}</p>
                </div>
                <button onClick={() => setSelectedSchool(s)} className="w-full py-2.5 rounded-2xl text-[13px] font-bold border-2 transition-all hover:opacity-80"
                  style={{ borderColor: s.color, color: s.color, fontFamily: PP, outline: "none" }}>Pelajari</button>
              </div>
            ))}
          </div>
        </div>
        <div className="h-6" />
      </div>

      {/* Side drawer */}
      {selectedSchool && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSelectedSchool(null)} />
          <div className="relative w-full max-w-[480px] h-full bg-white shadow-2xl flex flex-col overflow-hidden" style={{ animation: "slideInRight 0.28s cubic-bezier(0.16,1,0.3,1)" }}>
            <div className="shrink-0 px-8 py-6 border-b border-[#f1f5f9] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[11px] font-bold text-white" style={{ background: selectedSchool.color, fontFamily: PP }}>{selectedSchool.abbr.split(" ")[0]}</div>
                <div>
                  <p className="text-[17px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>{selectedSchool.abbr}</p>
                  <p className="text-[11px] text-[#94a3b8]" style={{ fontFamily: PP }}>{selectedSchool.ministry}</p>
                </div>
              </div>
              <button onClick={() => setSelectedSchool(null)} className="w-9 h-9 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#e2e8f0] transition-all" style={{ outline: "none" }}>
                <X size={16} color="#64748b" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-8 py-7 flex flex-col gap-7">
              <div><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#94a3b8] mb-3" style={{ fontFamily: PP }}>Tentang</p><p className="text-[14px] text-[#374151] leading-[1.75]" style={{ fontFamily: PP }}>{selectedSchool.about}</p></div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#94a3b8] mb-3" style={{ fontFamily: PP }}>Program Studi</p>
                {selectedSchool.prodi.map((p, i) => <div key={i} className="flex items-center gap-3 mb-2"><div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: selectedSchool.color }} /><p className="text-[14px] text-[#374151]" style={{ fontFamily: PP }}>{p}</p></div>)}
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#94a3b8] mb-4" style={{ fontFamily: PP }}>Tahapan Seleksi</p>
                {selectedSchool.seleksi.map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: selectedSchool.color, fontFamily: PP }}>{i+1}</div>
                      {i < selectedSchool.seleksi.length-1 && <div className="w-px flex-1 my-1" style={{ background: "#e2e8f0", minHeight: 20 }} />}
                    </div>
                    <p className="text-[14px] text-[#374151] pb-4 pt-1" style={{ fontFamily: PP }}>{s}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#94a3b8] mb-3" style={{ fontFamily: PP }}>Prospek Karier</p>
                {selectedSchool.karier.map((k, i) => <div key={i} className="flex items-center gap-3 mb-2"><Check size={13} strokeWidth={3} color={selectedSchool.color} /><p className="text-[14px] text-[#374151]" style={{ fontFamily: PP }}>{k}</p></div>)}
              </div>
            </div>
            <div className="shrink-0 px-8 py-5 border-t border-[#f1f5f9]">
              <button onClick={() => { setSelectedSchool(null); onMulaiPersiapan(); }} className="w-full py-4 rounded-2xl text-[14px] font-bold text-white hover:opacity-90 transition-all"
                style={{ background: selectedSchool.color, fontFamily: PP, outline: "none" }}>Mulai Persiapan SKD</button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function SiapSKDPage() {
  const [showCariTahu, setShowCariTahu] = useState(false);
  const [skdTab,       setSkdTab]       = useState<SKDTab>("latihan");

  if (showCariTahu) {
    return <CariTahuPage onBack={() => setShowCariTahu(false)} onMulaiPersiapan={() => setShowCariTahu(false)} />;
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: "#f8faff" }}>
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-[rgba(0,0,0,0.07)] px-10 py-5 sticky top-0 z-30">
        <p className="text-[11px] font-bold uppercase tracking-[0.13em]" style={{ color: BLUE, fontFamily: PP }}>Student Portal</p>
        <p className="text-[15px] font-bold text-[#0f172a]" style={{ fontFamily: PP }}>Siap Kedinasan</p>
      </div>

      <div className="flex-1 px-10 py-10 flex flex-col gap-10 max-w-6xl mx-auto w-full">

        {/* ── HERO ── */}
        <div className="rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#1e3a5f 100%)" }}>
          <div className="px-12 py-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50 mb-4" style={{ fontFamily: PP }}>Seleksi Kedinasan</p>
            <h1 className="text-[38px] font-bold text-white mb-2 leading-tight" style={{ fontFamily: PP }}>Siap Kedinasan</h1>
            <p className="text-[17px] font-bold text-white/70 mb-3" style={{ fontFamily: PP }}>Persiapkan Dirimu Menuju Sekolah Kedinasan Impian</p>
            <p className="text-[14px] text-white/50 leading-relaxed mb-10 max-w-[540px]" style={{ fontFamily: PP }}>
              Mulailah perjalananmu menuju sekolah kedinasan dengan memahami proses seleksi, mengenal tahapan ujian, dan berlatih secara bertahap untuk meningkatkan peluang lolos.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button className="px-8 py-3.5 rounded-2xl text-[14px] font-bold text-white hover:opacity-90 transition-all"
                style={{ background: BLUE, fontFamily: PP, outline: "none" }}>Mulai Persiapan</button>
              <button onClick={() => setShowCariTahu(true)}
                className="px-8 py-3.5 rounded-2xl text-[14px] font-bold border border-white/20 text-white hover:bg-white/10 transition-all"
                style={{ fontFamily: PP, outline: "none" }}>Cari Tahu Tentang Kedinasan</button>
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex flex-col gap-7">
          <SegCtrl
            size="lg"
            tabs={[
              { key: "latihan", label: "Latihan Soal" },
              { key: "tryout",  label: "Tryout" },
              { key: "laporan", label: "Laporan" },
            ]}
            value={skdTab}
            onChange={setSkdTab}
          />

          {skdTab === "latihan" && <LatihanTab />}
          {skdTab === "tryout"  && <TryoutTab />}
          {skdTab === "laporan" && <LaporanTab />}
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}
