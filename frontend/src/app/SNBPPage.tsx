import React, { useState, useEffect } from "react";
import {
  AlertCircle, AlertTriangle, ArrowLeft, BookOpen, Check, CheckCircle2,
  ChevronRight, Download, Sparkles, TrendingUp, Search,
} from "lucide-react";
import TKAPracticeFlow from "./TKAPracticePage";

const PP = "Poppins, sans-serif";

// ─── SvgRadar (local copy) ───────────────────────────────────────────────────
function SvgRadar({ axes, values, color }: { axes: string[]; values: number[]; color: string }) {
  const N = axes.length; const R = 80; const cx = 100; const cy = 100;
  const angle = (i: number) => (Math.PI * 2 * i) / N - Math.PI / 2;
  const pt = (i: number, r: number) => ({ x: cx + r * Math.cos(angle(i)), y: cy + r * Math.sin(angle(i)) });
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const polyPts = values.map((v, i) => pt(i, (v / 100) * R));
  const polyStr = polyPts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 200 200" width="100%" style={{ display: "block" }}>
      {gridLevels.map(l => {
        const pts = axes.map((_, i) => pt(i, R * l));
        return <polygon key={l} points={pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")} fill="none" stroke="#e5e7eb" strokeWidth={0.8} />;
      })}
      {axes.map((_, i) => { const p = pt(i, R); return <line key={i} x1={cx} y1={cy} x2={p.x.toFixed(1)} y2={p.y.toFixed(1)} stroke="#e5e7eb" strokeWidth={0.8} />; })}
      <polygon points={polyStr} fill={color + "28"} stroke={color} strokeWidth={2} strokeLinejoin="round" />
      {polyPts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={color} stroke="white" strokeWidth={1.5} />)}
      {axes.map((label, i) => {
        const p = pt(i, R + 14);
        return <text key={i} x={p.x.toFixed(1)} y={p.y.toFixed(1)} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill="#6b7280" fontFamily={PP}>{label}</text>;
      })}
    </svg>
  );
}

// ─── Rationalization Flow ──────────────────────────────────────────────────────
function SNBPRationalizationFlow({ onBack }: { onBack: () => void }) {
  type RatState = "form" | "review" | "processing" | "results";
  type TKAPilihanKey = "fis" | "kim" | "bio" | "eko" | "geo" | "sos";

  const [ratState, setRatState] = useState<RatState>("form");
  const [tkaWajib, setTkaWajib] = useState<{ ind: string; mat: string; eng: string }>({ ind: "", mat: "", eng: "" });
  const [tkaPilihanValues, setTkaPilihanValues] = useState<Partial<Record<TKAPilihanKey, string>>>({});
  const [selPilihan, setSelPilihan] = useState<TKAPilihanKey[]>([]);
  const [selAch, setSelAch] = useState<string[]>(["a1", "a2"]);
  const [choice1, setChoice1] = useState({ univ: "Universitas Gadjah Mada", major: "Sistem Informasi" });
  const [choice2, setChoice2] = useState({ univ: "Universitas Sriwijaya", major: "Sistem Informasi" });
  
  const [procDone, setProcDone] = useState<number[]>([]);
  const [procPct, setProcPct] = useState(0);
  const [showDetailRec, setShowDetailRec] = useState(false);

  const STEP_STEPS = ["Input Data", "Review Data", "Analisis", "Hasil"];
  const PROC_STEPS = [
    "Memeriksa nilai rapor",
    "Menyesuaikan prestasi",
    "Membandingkan karakteristik jurusan",
    "Menyusun rekomendasi"
  ];

  useEffect(() => {
    if (ratState !== "processing") return;
    setProcDone([]);
    setProcPct(0);
    const timers = PROC_STEPS.map((_, i) =>
      setTimeout(() => {
        setProcDone(prev => [...prev, i]);
        setProcPct(Math.round(((i + 1) / PROC_STEPS.length) * 100));
      }, (i + 1) * 800)
    );
    const done = setTimeout(() => setRatState("results"), 3600);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, [ratState]);

  const SEMS = [
    { label: "Semester 1", avg: 87.5 },
    { label: "Semester 2", avg: 88.2 },
    { label: "Semester 3", avg: 89.0 },
    { label: "Semester 4", avg: 90.5 },
    { label: "Semester 5", avg: 91.2 },
  ];
  const overallAvg = "89,3";

  const TKA_PILIKAN_MAP: { key: TKAPilihanKey; label: string }[] = [
    { key: "fis", label: "Fisika" },
    { key: "kim", label: "Kimia" },
    { key: "bio", label: "Biologi" },
    { key: "eko", label: "Ekonomi" },
    { key: "geo", label: "Geografi" },
    { key: "sos", label: "Sosiologi" },
  ];

  const AVAIL_ACH = [
    { id: "a1", label: "Olimpiade Matematika Nasional", icon: "🏆" },
    { id: "a2", label: "Programming Competition", icon: "💻" },
    { id: "a3", label: "Ketua OSIS", icon: "🎖️" },
    { id: "a4", label: "Volunteer", icon: "🤝" },
  ];

  const UNI_LIST = [
    "Universitas Indonesia", "Institut Teknologi Bandung", "Universitas Gadjah Mada",
    "Institut Teknologi Sepuluh Nopember", "Universitas Airlangga", "Universitas Brawijaya",
    "Universitas Diponegoro", "Universitas Sriwijaya", "Universitas Padjadjaran", "Universitas Hasanuddin"
  ];
  const MAJOR_LIST = [
    "Sistem Informasi", "Informatika", "Teknik Elektro", "Matematika",
    "Teknik Industri", "Manajemen", "Akuntansi", "Psikologi", "Hukum", "Kedokteran"
  ];

  // ── Stepper Header ────────────────────────────────────────────────────────
  function StepperBar({ current }: { current: number }) {
    return (
      <div className="bg-white rounded-[24px] border border-slate-100 p-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)] mb-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {STEP_STEPS.map((s, i) => {
            const isDone = i < current;
            const isCurr = i === current;
            return (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone ? "bg-emerald-500 text-white" : isCurr ? "bg-[#0965fa] text-white shadow-md shadow-blue-500/20" : "bg-slate-100 text-slate-400"
                  }`}>
                    {isDone ? <Check size={14} /> : i + 1}
                  </div>
                  <span className={`text-xs font-bold ${isCurr ? "text-slate-900" : isDone ? "text-emerald-600" : "text-slate-400"}`} style={{ fontFamily: PP }}>
                    {s}
                  </span>
                </div>
                {i < STEP_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 rounded-full ${i < current ? "bg-emerald-500" : "bg-slate-100"}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Page Header ──────────────────────────────────────────────────────────
  function PageHeader() {
    return (
      <div className="bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors">
            <ArrowLeft size={16} className="text-slate-700" />
          </button>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs text-slate-400 font-medium">Siap PTN</span>
              <ChevronRight size={12} className="text-slate-300" />
              <span className="text-xs font-bold text-[#0965fa]">SNBP Rasionalisasi</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900" style={{ fontFamily: PP }}>Rasionalisasi SNBP</h1>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // STEP 1 — INPUT DATA
  // ═════════════════════════════════════════════════════════════════════════
  if (ratState === "form") {
    return (
      <div className="flex flex-col flex-1 overflow-hidden bg-[#f8fafc]">
        <PageHeader />
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-4xl mx-auto space-y-6">
            
            <StepperBar current={0} />

            {/* HERO */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: PP }}>Rasionalisasi SNBP</h2>
              <p className="text-sm text-slate-600 leading-relaxed max-w-3xl" style={{ fontFamily: PP }}>
                Bandingkan profil akademikmu dengan pilihan program studi untuk membantu menentukan strategi pendaftaran SNBP yang lebih terarah.
              </p>
            </div>

            {/* SECTION A — Data Akademik */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#0965fa] text-xs font-bold flex items-center justify-center">A</span>
                  <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: PP }}>Data Akademik</h3>
                </div>
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  Data otomatis dari Student Profile
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {SEMS.map(s => (
                  <div key={s.label} className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                    <p className="text-xs text-slate-400 font-medium mb-1" style={{ fontFamily: PP }}>{s.label}</p>
                    <p className="text-xl font-extrabold text-slate-900" style={{ fontFamily: PP }}>{s.avg.toString().replace(".", ",")}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between bg-blue-50/60 rounded-2xl p-4 border border-blue-100">
                <span className="text-sm font-bold text-slate-700" style={{ fontFamily: PP }}>Rata-rata Keseluruhan</span>
                <span className="text-2xl font-extrabold text-[#0965fa]" style={{ fontFamily: PP }}>{overallAvg}</span>
              </div>

              <p className="text-[11px] text-slate-400 font-medium" style={{ fontFamily: PP }}>
                * Data diambil otomatis dari Student Profile
              </p>
            </div>

            {/* SECTION B — Nilai TKA */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 text-xs font-bold flex items-center justify-center">B</span>
                <div>
                  <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: PP }}>Nilai TKA</h3>
                  <p className="text-xs text-slate-400 mt-0.5" style={{ fontFamily: PP }}>Input manual</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100" style={{ fontFamily: PP }}>
                Masukkan nilai TKA resmi apabila sudah tersedia. Jika belum memiliki nilai TKA, analisis tetap dapat dilakukan menggunakan data akademik dan prestasi.
              </p>

              {/* Mata Pelajaran Wajib */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400" style={{ fontFamily: PP }}>Mata Pelajaran Wajib</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { key: "ind" as const, label: "Bahasa Indonesia" },
                    { key: "mat" as const, label: "Matematika" },
                    { key: "eng" as const, label: "Bahasa Inggris" },
                  ].map(f => (
                    <div key={f.key} className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700" style={{ fontFamily: PP }}>{f.label}</label>
                      <input 
                        type="number" min={0} max={1000}
                        value={tkaWajib[f.key]}
                        onChange={e => setTkaWajib(prev => ({ ...prev, [f.key]: e.target.value }))}
                        placeholder="Input 0–1000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0965fa]"
                        style={{ fontFamily: PP }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Mata Pelajaran Pilihan */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400" style={{ fontFamily: PP }}>Mata Pelajaran Pilihan</h4>
                  <span className="text-[11px] font-semibold text-slate-400" style={{ fontFamily: PP }}>Pilih maksimal 2</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TKA_PILIKAN_MAP.map(item => {
                    const isSel = selPilihan.includes(item.key);
                    const isMax = !isSel && selPilihan.length >= 2;
                    return (
                      <div 
                        key={item.key}
                        onClick={() => {
                          if (isMax) return;
                          if (isSel) setSelPilihan(prev => prev.filter(k => k !== item.key));
                          else setSelPilihan(prev => [...prev, item.key]);
                        }}
                        className={`p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                          isSel 
                            ? "bg-blue-50/80 border-[#0965fa] text-[#0965fa] font-bold" 
                            : isMax 
                            ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed" 
                            : "bg-slate-50 border-slate-100 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span className="text-xs font-semibold" style={{ fontFamily: PP }}>{item.label}</span>
                        {isSel && <Check size={16} className="text-[#0965fa]" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECTION C — Prestasi */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 text-xs font-bold flex items-center justify-center">C</span>
                  <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: PP }}>Prestasi</h3>
                </div>
                <span className="text-[11px] font-medium text-slate-400" style={{ fontFamily: PP }}>Maksimal 3 dipilih</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AVAIL_ACH.map(ach => {
                  const isChecked = selAch.includes(ach.id);
                  const isMax = !isChecked && selAch.length >= 3;
                  return (
                    <div 
                      key={ach.id}
                      onClick={() => {
                        if (isMax) return;
                        if (isChecked) setSelAch(prev => prev.filter(id => id !== ach.id));
                        else setSelAch(prev => [...prev, ach.id]);
                      }}
                      className={`p-4 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                        isChecked 
                          ? "bg-emerald-50/70 border-emerald-500 text-emerald-900 font-bold" 
                          : isMax 
                          ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed" 
                          : "bg-slate-50 border-slate-100 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs shrink-0 border ${
                        isChecked ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 bg-white"
                      }`}>
                        {isChecked && <Check size={12} />}
                      </div>
                      <span className="text-xs" style={{ fontFamily: PP }}>{ach.icon} {ach.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION D — Target SNBP */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center">D</span>
                <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: PP }}>Target SNBP</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pilihan 1 */}
                <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-900 block" style={{ fontFamily: PP }}>Pilihan 1</span>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-500 font-medium" style={{ fontFamily: PP }}>Universitas Target</label>
                    <select 
                      value={choice1.univ}
                      onChange={e => setChoice1(prev => ({ ...prev, univ: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0965fa]"
                      style={{ fontFamily: PP }}
                    >
                      {UNI_LIST.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-500 font-medium" style={{ fontFamily: PP }}>Program Studi</label>
                    <select 
                      value={choice1.major}
                      onChange={e => setChoice1(prev => ({ ...prev, major: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0965fa]"
                      style={{ fontFamily: PP }}
                    >
                      {MAJOR_LIST.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                {/* Pilihan 2 */}
                <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-900 block" style={{ fontFamily: PP }}>Pilihan 2</span>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-500 font-medium" style={{ fontFamily: PP }}>Universitas Target</label>
                    <select 
                      value={choice2.univ}
                      onChange={e => setChoice2(prev => ({ ...prev, univ: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0965fa]"
                      style={{ fontFamily: PP }}
                    >
                      {UNI_LIST.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-500 font-medium" style={{ fontFamily: PP }}>Program Studi</label>
                    <select 
                      value={choice2.major}
                      onChange={e => setChoice2(prev => ({ ...prev, major: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0965fa]"
                      style={{ fontFamily: PP }}
                    >
                      {MAJOR_LIST.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Lanjutkan */}
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setRatState("review")}
                className="px-8 py-3.5 rounded-xl bg-[#0965fa] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
                style={{ fontFamily: PP }}
              >
                Lanjutkan <ChevronRight size={16} />
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // STEP 2 — REVIEW DATA
  // ═════════════════════════════════════════════════════════════════════════
  if (ratState === "review") {
    return (
      <div className="flex flex-col flex-1 overflow-hidden bg-[#f8fafc]">
        <PageHeader />
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-4xl mx-auto space-y-6">
            
            <StepperBar current={1} />

            <div className="bg-white rounded-[24px] border border-slate-100 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: PP }}>Review Data Input</h2>
              <p className="text-sm text-slate-600 leading-relaxed" style={{ fontFamily: PP }}>
                Periksa kembali data yang telah kamu masukkan sebelum melanjutkan ke proses analisis.
              </p>
            </div>

            {/* Review Card */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6">
              
              {/* Akademik */}
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Data Akademik</span>
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl text-xs font-bold text-slate-800">
                  <span>Rata-rata Rapor (Semester 1–5):</span>
                  <span className="text-base text-[#0965fa]">{overallAvg}</span>
                </div>
              </div>

              {/* TKA */}
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nilai TKA</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl">B. Indonesia: <strong>{tkaWajib.ind || "-"}</strong></div>
                  <div className="bg-slate-50 p-3 rounded-xl">Matematika: <strong>{tkaWajib.mat || "-"}</strong></div>
                  <div className="bg-slate-50 p-3 rounded-xl">B. Inggris: <strong>{tkaWajib.eng || "-"}</strong></div>
                </div>
                {selPilihan.length > 0 && (
                  <p className="text-xs text-slate-500 mt-1">Mapel Pilihan: {selPilihan.map(k => TKA_PILIKAN_MAP.find(m => m.key === k)?.label).join(", ")}</p>
                )}
              </div>

              {/* Prestasi */}
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prestasi Dipilih</span>
                <div className="flex flex-wrap gap-2">
                  {selAch.map(id => {
                    const ach = AVAIL_ACH.find(a => a.id === id);
                    return <span key={id} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold">{ach?.icon} {ach?.label}</span>;
                  })}
                </div>
              </div>

              {/* Target */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Pendaftaran SNBP</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-blue-50/60 border border-blue-100 p-4 rounded-xl space-y-1">
                    <span className="font-bold text-blue-900 block">Pilihan 1</span>
                    <p className="text-slate-800 font-bold">{choice1.univ}</p>
                    <p className="text-slate-500">{choice1.major}</p>
                  </div>
                  <div className="bg-blue-50/60 border border-blue-100 p-4 rounded-xl space-y-1">
                    <span className="font-bold text-blue-900 block">Pilihan 2</span>
                    <p className="text-slate-800 font-bold">{choice2.univ}</p>
                    <p className="text-slate-500">{choice2.major}</p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setRatState("form")}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  style={{ fontFamily: PP }}
                >
                  Edit Data
                </button>

                <button 
                  onClick={() => setRatState("processing")}
                  className="px-8 py-3.5 rounded-xl bg-[#0965fa] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
                  style={{ fontFamily: PP }}
                >
                  Mulai Analisis <Sparkles size={16} />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // STEP 3 — ANALISIS (LOADING ANIMATION 3-4 SECONDS)
  // ═════════════════════════════════════════════════════════════════════════
  if (ratState === "processing") {
    return (
      <div className="flex flex-col flex-1 overflow-hidden bg-[#f8fafc]">
        <PageHeader />
        <div className="flex-1 overflow-y-auto p-6 md:p-10 flex items-center justify-center">
          <div className="bg-white rounded-[24px] border border-slate-100 p-8 md:p-12 max-w-lg w-full shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-8 text-center">
            
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0965fa] flex items-center justify-center mx-auto mb-3">
                <Sparkles size={24} className="animate-spin" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: PP }}>Menganalisis profil akademik...</h2>
              <p className="text-xs text-slate-400">Harap tunggu sebentar, sistem sedang menyusun analisis rasionalisasi.</p>
            </div>

            {/* Checklist items */}
            <div className="space-y-3 text-left bg-slate-50 p-5 rounded-2xl border border-slate-100">
              {PROC_STEPS.map((step, idx) => {
                const isDone = procDone.includes(idx);
                return (
                  <div key={step} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all ${
                      isDone ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"
                    }`}>
                      {isDone ? <Check size={12} /> : null}
                    </div>
                    <span className={`text-xs font-semibold ${isDone ? "text-slate-900" : "text-slate-400"}`} style={{ fontFamily: PP }}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#0965fa] rounded-full transition-all duration-500" style={{ width: `${procPct}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>Memproses data...</span>
                <span>{procPct}%</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // STEP 4 — HASIL (8 SECTIONS)
  // ═════════════════════════════════════════════════════════════════════════
  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-[#f8fafc]">
      
      {/* Results Header */}
      <div className="bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100">
            <ArrowLeft size={16} className="text-slate-700" />
          </button>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs text-slate-400 font-medium">Siap PTN</span>
              <ChevronRight size={12} className="text-slate-300" />
              <span className="text-xs font-bold text-[#0965fa]">Hasil Rasionalisasi</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900" style={{ fontFamily: PP }}>Hasil Rasionalisasi SNBP</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setRatState("form"); setProcDone([]); setProcPct(0); }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            style={{ fontFamily: PP }}
          >
            Analisis Baru
          </button>
          <button 
            className="px-5 py-2.5 rounded-xl bg-[#0965fa] hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center gap-2"
            style={{ fontFamily: PP }}
          >
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-8">

          <StepperBar current={3} />

          {/* HERO */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: PP }}>Hasil Rasionalisasi SNBP</h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl" style={{ fontFamily: PP }}>
              Analisis berdasarkan profil akademik, prestasi, target program studi, dan data pendukung lainnya.
            </p>
          </div>

          {/* SECTION 1 — Ringkasan Target (Card Horizontal) */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: PP }}>Ringkasan Target</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Pilihan 1 */}
              <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider" style={{ fontFamily: PP }}>Pilihan 1</span>
                    <h4 className="text-lg font-extrabold text-slate-900" style={{ fontFamily: PP }}>{choice1.univ}</h4>
                    <p className="text-xs font-semibold text-slate-500" style={{ fontFamily: PP }}>{choice1.major}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-slate-400 block" style={{ fontFamily: PP }}>Tingkat Kesesuaian</span>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 inline-block mt-0.5" style={{ fontFamily: PP }}>Sedang</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500" style={{ fontFamily: PP }}>Tingkat Kesesuaian Profil</span>
                    <span className="text-amber-600" style={{ fontFamily: PP }}>58%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "58%" }} />
                  </div>
                </div>
              </div>

              {/* Pilihan 2 */}
              <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider" style={{ fontFamily: PP }}>Pilihan 2</span>
                    <h4 className="text-lg font-extrabold text-slate-900" style={{ fontFamily: PP }}>{choice2.univ}</h4>
                    <p className="text-xs font-semibold text-slate-500" style={{ fontFamily: PP }}>{choice2.major}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-slate-400 block" style={{ fontFamily: PP }}>Tingkat Kesesuaian</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block mt-0.5" style={{ fontFamily: PP }}>Tinggi</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500" style={{ fontFamily: PP }}>Tingkat Kesesuaian Profil</span>
                    <span className="text-emerald-600" style={{ fontFamily: PP }}>78%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "78%" }} />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 2 — Ringkasan Analisis */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: PP }}>Ringkasan Analisis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-2">
                <span className="text-xs font-semibold text-slate-400 block" style={{ fontFamily: PP }}>Nilai Akademik</span>
                <span className="text-base font-extrabold text-emerald-600 block" style={{ fontFamily: PP }}>Sangat Baik</span>
                <p className="text-xs text-slate-500 leading-relaxed" style={{ fontFamily: PP }}>Rata-rata nilai rapor menunjukkan konsistensi yang baik.</p>
              </div>

              <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-2">
                <span className="text-xs font-semibold text-slate-400 block" style={{ fontFamily: PP }}>Prestasi</span>
                <span className="text-base font-extrabold text-emerald-600 block" style={{ fontFamily: PP }}>Baik</span>
                <p className="text-xs text-slate-500 leading-relaxed" style={{ fontFamily: PP }}>Prestasi nasional memberikan nilai tambah pada profil.</p>
              </div>

              <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-2">
                <span className="text-xs font-semibold text-slate-400 block" style={{ fontFamily: PP }}>Nilai TKA</span>
                <span className="text-base font-extrabold text-amber-600 block" style={{ fontFamily: PP }}>Belum Lengkap</span>
                <p className="text-xs text-slate-500 leading-relaxed" style={{ fontFamily: PP }}>Analisis dilakukan menggunakan data yang tersedia.</p>
              </div>

              <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-2">
                <span className="text-xs font-semibold text-slate-400 block" style={{ fontFamily: PP }}>Kesesuaian Jurusan</span>
                <span className="text-base font-extrabold text-emerald-600 block" style={{ fontFamily: PP }}>Baik</span>
                <p className="text-xs text-slate-500 leading-relaxed" style={{ fontFamily: PP }}>Pilihan jurusan sesuai dengan kecenderungan akademik.</p>
              </div>

            </div>
          </div>

          {/* SECTION 3 — Profil Akademik (Radar Chart Sederhana) */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1" style={{ fontFamily: PP }}>Profil Akademik</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4" style={{ fontFamily: PP }}>
                Visualisasi kekuatan diri berbasis 5 indikator utama tanpa memasukkan indeks sekolah.
              </p>
              
              <div className="space-y-2.5">
                {[
                  { label: "Akademik", val: 90 },
                  { label: "Prestasi", val: 85 },
                  { label: "Konsistensi", val: 88 },
                  { label: "Kepemimpinan", val: 82 },
                  { label: "Kesesuaian Jurusan", val: 94 },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium" style={{ fontFamily: PP }}>{item.label}</span>
                    <span className="font-bold text-[#0965fa]" style={{ fontFamily: PP }}>{item.val}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="max-w-[220px] mx-auto w-full">
              <SvgRadar 
                axes={["Akademik", "Prestasi", "Konsistensi", "Kepemimpinan", "Kesesuaian Jurusan"]} 
                values={[90, 85, 88, 82, 94]} 
                color="#0965fa" 
              />
            </div>
          </div>

          {/* SECTION 4 — Hal yang Perlu Diperhatikan */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: PP }}>Hal yang Perlu Diperhatikan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-2">
                <span className="text-xs font-bold text-amber-600 block" style={{ fontFamily: PP }}>Persaingan Tinggi</span>
                <p className="text-xs text-slate-600 leading-relaxed" style={{ fontFamily: PP }}>
                  Universitas Gadjah Mada memiliki tingkat persaingan yang tinggi sehingga diperlukan strategi pemilihan yang tepat.
                </p>
              </div>

              <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-2">
                <span className="text-xs font-bold text-blue-600 block" style={{ fontFamily: PP }}>Nilai TKA Belum Diisi</span>
                <p className="text-xs text-slate-600 leading-relaxed" style={{ fontFamily: PP }}>
                  Tambahkan nilai TKA apabila sudah tersedia agar hasil analisis menjadi lebih akurat.
                </p>
              </div>

              <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-2">
                <span className="text-xs font-bold text-purple-600 block" style={{ fontFamily: PP }}>Portofolio</span>
                <p className="text-xs text-slate-600 leading-relaxed" style={{ fontFamily: PP }}>
                  Untuk jurusan berbasis teknologi, pengalaman proyek atau kompetisi dapat memperkuat profil.
                </p>
              </div>

            </div>
          </div>

          {/* SECTION 5 — Strategi Pilihan (Card 3 Kolom) */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: PP }}>Strategi Pilihan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Target Ambisius */}
              <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100 inline-block" style={{ fontFamily: PP }}>
                  Target Ambisius
                </span>
                <h4 className="text-base font-extrabold text-slate-900 mt-1" style={{ fontFamily: PP }}>{choice1.univ}</h4>
                <p className="text-xs font-semibold text-slate-500" style={{ fontFamily: PP }}>{choice1.major}</p>
                <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100" style={{ fontFamily: PP }}>
                  Profilmu cukup sesuai, namun persaingan cukup tinggi.
                </p>
              </div>

              {/* Target Seimbang */}
              <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 inline-block" style={{ fontFamily: PP }}>
                  Target Seimbang
                </span>
                <h4 className="text-base font-extrabold text-slate-900 mt-1" style={{ fontFamily: PP }}>{choice2.univ}</h4>
                <p className="text-xs font-semibold text-slate-500" style={{ fontFamily: PP }}>{choice2.major}</p>
                <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100" style={{ fontFamily: PP }}>
                  Pilihan dengan keseimbangan terbaik antara minat dan profil akademik.
                </p>
              </div>

              {/* Target Alternatif */}
              <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100 inline-block" style={{ fontFamily: PP }}>
                  Target Alternatif
                </span>
                <h4 className="text-base font-extrabold text-slate-900 mt-1" style={{ fontFamily: PP }}>Universitas Brawijaya</h4>
                <p className="text-xs font-semibold text-slate-500" style={{ fontFamily: PP }}>Sistem Informasi</p>
                <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100" style={{ fontFamily: PP }}>
                  Dapat dipertimbangkan sebagai pilihan tambahan.
                </p>
              </div>

            </div>
          </div>

          {/* SECTION 6 — Rekomendasi Program Studi */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: PP }}>Rekomendasi Program Studi</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Card 1 */}
              <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900" style={{ fontFamily: PP }}>Universitas Indonesia</h4>
                  <p className="text-xs font-semibold text-slate-500" style={{ fontFamily: PP }}>Sistem Informasi</p>
                  
                  <div className="mt-4 flex items-center justify-between bg-blue-50/70 p-3 rounded-xl border border-blue-100">
                    <span className="text-xs text-slate-600 font-medium" style={{ fontFamily: PP }}>Tingkat Kesesuaian Profil</span>
                    <span className="text-sm font-extrabold text-[#0965fa]" style={{ fontFamily: PP }}>96%</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowDetailRec(!showDetailRec)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 text-center"
                  style={{ fontFamily: PP }}
                >
                  {showDetailRec ? "Sembunyikan Detail" : "Lihat Detail"}
                </button>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900" style={{ fontFamily: PP }}>ITB</h4>
                  <p className="text-xs font-semibold text-slate-500" style={{ fontFamily: PP }}>Sistem dan Teknologi Informasi</p>
                  
                  <div className="mt-4 flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-600 font-medium" style={{ fontFamily: PP }}>Tingkat Kesesuaian Profil</span>
                    <span className="text-sm font-extrabold text-[#0965fa]" style={{ fontFamily: PP }}>92%</span>
                  </div>
                </div>

                <button className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 text-center" style={{ fontFamily: PP }}>
                  Lihat Detail
                </button>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900" style={{ fontFamily: PP }}>Universitas Sriwijaya</h4>
                  <p className="text-xs font-semibold text-slate-500" style={{ fontFamily: PP }}>Sistem Informasi</p>
                  
                  <div className="mt-4 flex items-center justify-between bg-[#f8fafc] p-3 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-600 font-medium" style={{ fontFamily: PP }}>Tingkat Kesesuaian Profil</span>
                    <span className="text-sm font-extrabold text-[#0965fa]" style={{ fontFamily: PP }}>90%</span>
                  </div>
                </div>

                <button className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 text-center" style={{ fontFamily: PP }}>
                  Lihat Detail
                </button>
              </div>

            </div>
          </div>

          {/* SECTION 7 — Ringkasan (Card Besar Kesimpulan) */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-3">
            <h3 className="text-lg font-extrabold text-slate-900" style={{ fontFamily: PP }}>Kesimpulan</h3>
            <p className="text-sm text-slate-600 leading-relaxed" style={{ fontFamily: PP }}>
              Profil akademikmu sudah cukup sesuai dengan pilihan program studi yang dituju. Konsistensi nilai menjadi kekuatan utama, sedangkan peningkatan portofolio dan prestasi yang relevan dapat memperkuat peluangmu dalam seleksi SNBP.
            </p>
          </div>

          {/* SECTION 8 — Konsultasi Guru BK */}
          <div className="bg-slate-900 text-white rounded-[24px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <h3 className="text-lg font-bold" style={{ fontFamily: PP }}>Konsultasi Hasil Bersama Guru BK</h3>
              <p className="text-xs text-slate-400 leading-relaxed" style={{ fontFamily: PP }}>
                Analisis ini disusun berdasarkan data akademik yang tersedia. Untuk mempertimbangkan faktor lain seperti kondisi pribadi atau kebijakan sekolah, diskusikan hasil ini bersama Guru BK.
              </p>
            </div>

            <button className="px-6 py-3 rounded-xl bg-[#0965fa] hover:bg-blue-700 text-white text-xs font-bold transition-all shrink-0" style={{ fontFamily: PP }}>
              Unduh Laporan
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── SNBP Preparation Flow ─────────────────────────────────────────────────────
type PrepState = "form" | "processing" | "dashboard" | "updateSheet" | "updateDialog" | "updating";

type GoalData = {
  matchPct: number;
  subjects: { label: string; why: string }[];
  achievements: string[];
  orgs: string[];
  improvements: { label: string; impact: number }[];
  readiness: number;
  aiNote: string;
  tkaWajib: { label: string; priority: number; readiness: number }[];
  tkaWajibAI: string;
  tkaSupporting: { label: string; priority: number }[];
  tkaSupportAI: string;
  weeklyFocus: string[];
};

const GOAL_DATA: Record<string, GoalData> = {
  "UI_SI": {
    matchPct: 94,
    subjects: [
      { label: "Matematika", why: "Dasar logika komputasi dan analisis data yang dibutuhkan di SI UI." },
      { label: "Bahasa Inggris", why: "Literatur teknologi dan komunikasi internasional sangat dominan di SI UI." },
      { label: "Informatika", why: "Pengenalan konsep pemrograman dan sistem menjadi fondasi kurikulum SI UI." },
    ],
    achievements: ["Kompetisi Programming", "Olimpiade Matematika", "Hackathon / Data Science"],
    orgs: ["Divisi IT / Tech Club", "Ketua Divisi", "OSIS Bidang Akademik"],
    improvements: [
      { label: "Tingkatkan rata-rata Matematika menjadi minimal 90", impact: 6 },
      { label: "Ikuti 1 kompetisi Programming tingkat Provinsi", impact: 5 },
      { label: "Pertahankan tren nilai naik hingga Semester 5", impact: 4 },
      { label: "Ambil peran sebagai Ketua Divisi di IT Club", impact: 3 },
    ],
    readiness: 81,
    aiNote: "Kamu berada pada tahap \"Good Progress\". Dengan mempertahankan performa akademik dan menambah pengalaman kompetisi, peluangmu menjadi siswa kompetitif melalui jalur SNBP akan meningkat.",
    tkaWajib: [
      { label: "Matematika",       priority: 5, readiness: 82 },
      { label: "Bahasa Indonesia", priority: 4, readiness: 78 },
      { label: "Bahasa Inggris",   priority: 4, readiness: 81 },
    ],
    tkaWajibAI: "Ketiga mata pelajaran wajib ini menjadi fondasi kemampuan akademik dan perlu dipersiapkan secara konsisten sejak kelas X.",
    tkaSupporting: [
      { label: "Matematika",   priority: 5 },
      { label: "Informatika",  priority: 5 },
      { label: "Bahasa Inggris", priority: 4 },
      { label: "Ekonomi",      priority: 3 },
    ],
    tkaSupportAI: "Jurusan Sistem Informasi memiliki karakteristik yang kuat pada kemampuan logika, pemecahan masalah, dan literasi teknologi. Oleh karena itu, penguasaan Matematika dan Informatika menjadi prioritas utama.",
    weeklyFocus: ["50 soal Matematika", "30 soal Bahasa Indonesia", "Review Reading Comprehension Bahasa Inggris"],
  },
  "UGM_Psikologi": {
    matchPct: 78,
    subjects: [
      { label: "Biologi", why: "Neuropsikologi dan fisiologi merupakan dasar ilmu psikologi di UGM." },
      { label: "Bahasa Indonesia", why: "Kemampuan analisis teks dan penulisan ilmiah sangat diutamakan di Psikologi." },
      { label: "Bahasa Inggris", why: "Literatur psikologi internasional menggunakan Bahasa Inggris sebagai standar." },
    ],
    achievements: ["Psychology Essay Competition", "Volunteer Sosial", "Social Project / KKN Remaja"],
    orgs: ["PMR / Kesehatan", "Peer Counselor", "Relawan / Komunitas Sosial"],
    improvements: [
      { label: "Ikuti kegiatan volunteer sosial berbasis komunitas", impact: 6 },
      { label: "Tulis esai atau karya ilmiah bidang psikologi", impact: 5 },
      { label: "Perkuat kemampuan komunikasi interpersonal", impact: 4 },
      { label: "Bergabung dengan PMR atau Peer Counselor", impact: 3 },
    ],
    readiness: 73,
    aiNote: "Target baru memiliki karakteristik kompetensi yang berbeda dengan profilmu saat ini. AI menyusun ulang strategi agar persiapanmu tetap relevan dan terarah.",
    tkaWajib: [
      { label: "Bahasa Indonesia", priority: 5, readiness: 75 },
      { label: "Bahasa Inggris",   priority: 4, readiness: 72 },
      { label: "Matematika",       priority: 4, readiness: 70 },
    ],
    tkaWajibAI: "Kemampuan literasi dan komunikasi menjadi fondasi utama untuk jurusan Psikologi. Bahasa Indonesia dan Bahasa Inggris memiliki bobot tinggi dalam penilaian akademik program ini.",
    tkaSupporting: [
      { label: "Biologi",          priority: 5 },
      { label: "Bahasa Indonesia", priority: 5 },
      { label: "Bahasa Inggris",   priority: 4 },
      { label: "Sosiologi",        priority: 3 },
    ],
    tkaSupportAI: "Jurusan Psikologi UGM menekankan pemahaman perilaku manusia, dasar-dasar biologis, dan kemampuan komunikasi. Biologi dan Bahasa Indonesia menjadi kunci utama keberhasilanmu.",
    weeklyFocus: ["40 soal Biologi", "30 soal Bahasa Indonesia", "Review Reading Comprehension Bahasa Inggris"],
  },
};

const PREP_PROC_STEPS = [
  { label: "Analyzing Academic Records...", delay: 500 },
  { label: "Analyzing Achievement Portfolio...", delay: 1200 },
  { label: "Matching Target Major...", delay: 2100 },
  { label: "Building Preparation Strategy...", delay: 2900 },
  { label: "Generating Personalized Recommendations...", delay: 3900 },
];

const PREP_UPD_STEPS = [
  { label: "Updating Your Preparation Strategy...", delay: 400 },
  { label: "Comparing New Admission Requirements...", delay: 1100 },
  { label: "Adjusting Recommendations...", delay: 1900 },
  { label: "Generating Personalized Roadmap...", delay: 2700 },
];

const PREP_UNI_LIST = ["Universitas Indonesia", "Institut Teknologi Bandung", "Universitas Gadjah Mada", "Institut Teknologi Sepuluh Nopember", "Universitas Airlangga", "Universitas Brawijaya", "Universitas Sriwijaya"];
const PREP_MAJOR_LIST = ["Sistem Informasi", "Informatika", "Teknik Elektro", "Matematika", "Psikologi", "Manajemen", "Akuntansi", "Biologi", "Hukum", "Kedokteran"];

const PREP_BREAKDOWN = [
  { label: "Academic",        color: "#0965fa" },
  { label: "Achievement",     color: "#8b5cf6" },
  { label: "Leadership",      color: "#22c55e" },
  { label: "Consistency",     color: "#00b2dd" },
  { label: "Portfolio Match", color: "#f1ad00" },
];

const PREP_UPDATE_LIST = [
  "Mata pelajaran prioritas",
  "Analisis akademik",
  "Rekomendasi prestasi",
  "Organisasi yang relevan",
  "Readiness Score",
  "Improvement Opportunity",
];

function SNBPPreparationFlow({ onBack }: { onBack: () => void }) {
  const [prepState, setPrepState] = useState<PrepState>("form");
  const [targetUniv, setTargetUniv] = useState("Universitas Indonesia");
  const [targetMajor, setTargetMajor] = useState("Sistem Informasi");
  const [pendingUniv, setPendingUniv] = useState("Universitas Indonesia");
  const [pendingMajor, setPendingMajor] = useState("Sistem Informasi");
  const [procDone, setProcDone] = useState<number[]>([]);
  const [procPct, setProcPct] = useState(0);
  const [whichSubject, setWhichSubject] = useState<number | null>(null);
  const [showLocalTKA, setShowLocalTKA] = useState(false);

  const isProcessing = prepState === "processing" || prepState === "updating";
  const steps = prepState === "updating" ? PREP_UPD_STEPS : PREP_PROC_STEPS;

  const getGoalKey = (univ: string) => univ.includes("Gadjah") ? "UGM_Psikologi" : "UI_SI";
  const goal = GOAL_DATA[getGoalKey(targetUniv)] ?? GOAL_DATA["UI_SI"];

  const BREAKDOWN_VALS = prepState === "dashboard" || prepState === "updateSheet" || prepState === "updateDialog"
    ? [goal.readiness + 1, goal.readiness - 11, goal.readiness + 5, goal.readiness + 10, goal.readiness - 5]
    : [82, 70, 86, 91, 76];

  useEffect(() => {
    if (!isProcessing) return;
    setProcDone([]); setProcPct(0);
    const timers = steps.map((s, i) =>
      setTimeout(() => {
        setProcDone(prev => [...prev, i]);
        setProcPct(Math.round(((i + 1) / steps.length) * 100));
      }, s.delay)
    );
    const endDelay = steps[steps.length - 1].delay + 900;
    const done = setTimeout(() => {
      if (prepState === "updating") {
        setTargetUniv(pendingUniv);
        setTargetMajor(pendingMajor);
        setWhichSubject(null);
      }
      setPrepState("dashboard");
    }, endDelay);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, [isProcessing]); // eslint-disable-line react-hooks/exhaustive-deps

  if (showLocalTKA) return <TKAPracticeFlow onBack={() => setShowLocalTKA(false)} />;

  // ── FORM ──────────────────────────────────────────────────────────────────────
  if (prepState === "form") return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="shrink-0" style={{ background: "linear-gradient(135deg,#0a1628,#0f2952,#0a2a4a)" }}>
        <div className="px-8 pt-8 pb-10 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle,#00b2dd,transparent)" }} />
          <button onClick={onBack} className="flex items-center gap-2 mb-6 text-[#60a5fa] hover:text-white transition-colors" style={{ outline: "none" }}>
            <ArrowLeft size={14} />
            <span className="text-[12px] font-semibold" style={{ fontFamily: PP }}>Kembali ke SNBP Planner</span>
          </button>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🌱</span>
            <div>
              <p className="text-[24px] font-black text-white leading-tight" style={{ fontFamily: PP }}>SNBP Preparation</p>
              <p className="text-[13px] text-[#60a5fa]" style={{ fontFamily: PP }}>Bangun strategi terbaikmu sejak kelas X.</p>
            </div>
          </div>
          <p className="text-[13px] text-[#94a3b8] leading-relaxed max-w-lg" style={{ fontFamily: PP }}>
            Bangun strategi terbaikmu untuk menjadi siswa eligible SNBP sejak kelas X.
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-[#f5f6fb]">
        <div className="px-8 py-8 max-w-xl mx-auto flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)]">
              <p className="text-[15px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>🎯 Set Your Target</p>
              <p className="text-[11px] text-[#9ca3af] mt-0.5" style={{ fontFamily: PP }}>Strategi persiapan akan disesuaikan dengan universitas dan jurusan yang kamu pilih.</p>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div>
                <label className="text-[12px] font-bold text-[#374151] block mb-2" style={{ fontFamily: PP }}>Target University</label>
                <select value={pendingUniv} onChange={e => setPendingUniv(e.target.value)}
                  className="w-full px-4 py-3 text-[14px] font-semibold border border-[rgba(0,0,0,0.1)] rounded-xl bg-[#f8f9fc] outline-none text-[#1a1d2e] cursor-pointer"
                  style={{ fontFamily: PP }}>
                  {PREP_UNI_LIST.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[12px] font-bold text-[#374151] block mb-2" style={{ fontFamily: PP }}>Target Major</label>
                <select value={pendingMajor} onChange={e => setPendingMajor(e.target.value)}
                  className="w-full px-4 py-3 text-[14px] font-semibold border border-[rgba(0,0,0,0.1)] rounded-xl bg-[#f8f9fc] outline-none text-[#1a1d2e] cursor-pointer"
                  style={{ fontFamily: PP }}>
                  {PREP_MAJOR_LIST.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>
          <button onClick={() => { setTargetUniv(pendingUniv); setTargetMajor(pendingMajor); setPrepState("processing"); }}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-[15px] font-bold text-white hover:opacity-90 active:scale-95 transition-all shadow-lg"
            style={{ background: "linear-gradient(90deg,#0965fa,#00b2dd)", fontFamily: PP, outline: "none" }}>
            <Sparkles size={17} />
            ✨ Predict My SNBP Readiness
          </button>
        </div>
      </div>
    </div>
  );

  // ── PROCESSING / UPDATING ─────────────────────────────────────────────────────
  if (prepState === "processing" || prepState === "updating") return (
    <div className="flex-1 bg-[#f5f6fb] flex items-center justify-center p-8">
      <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl" style={{ background: "#0a1628" }}>
        <div className="px-8 py-8">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#0965fa,#00b2dd)" }}>
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-[#60a5fa]" style={{ fontFamily: PP }}>ORBITA AI · {prepState === "updating" ? "Updating" : "Analyzing"}</p>
              <p className="text-[11px] text-[#475569]" style={{ fontFamily: PP }}>
                {prepState === "updating" ? `Menyesuaikan strategi untuk ${pendingMajor}…` : "Membangun strategi SNBP personalmu…"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3.5 mb-7">
            {steps.map((s, i) => {
              const done = procDone.includes(i);
              const active = !done && procDone.length === i;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${done ? "bg-[#22c55e]" : active ? "bg-[#0965fa]" : "bg-[#1e293b]"}`}>
                    {done ? <Check size={11} className="text-white" /> : <div className={`w-2 h-2 rounded-full ${active ? "bg-white" : "bg-[#334155]"}`} />}
                  </div>
                  <span className={`text-[12px] flex-1 ${done ? "text-[#22c55e]" : active ? "text-white font-semibold" : "text-[#475569]"}`} style={{ fontFamily: PP }}>{s.label}</span>
                  {done && <Check size={12} className="text-[#22c55e]" />}
                </div>
              );
            })}
          </div>
          <div className="h-2.5 rounded-full bg-[#1e293b] overflow-hidden mb-2">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${procPct}%`, background: "linear-gradient(90deg,#0965fa,#00b2dd)" }} />
          </div>
          <p className="text-[11px] text-[#475569] text-right" style={{ fontFamily: PP }}>{procPct}%</p>
        </div>
      </div>
    </div>
  );

  // ── DASHBOARD (+ overlay states) ──────────────────────────────────────────────
  const SEM_SCORES = [87.5, 88.2, 89.0, 90.5, 91.2];
  const chartH = 60; const barW = 30; const gap = 14;
  const circumference = 2 * Math.PI * 42;

  return (
    <div className="flex flex-col flex-1 overflow-hidden relative">
      {/* Dashboard Header */}
      <div className="shrink-0 bg-white border-b border-[rgba(0,0,0,0.07)]">
        <div className="px-8 py-4 flex items-center gap-4">
          <button onClick={onBack} className="w-9 h-9 rounded-xl bg-[#f5f6fb] flex items-center justify-center hover:bg-[#eef0f8]" style={{ outline: "none" }}>
            <ArrowLeft size={15} className="text-[#374151]" />
          </button>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>SNBP Planner</span>
              <ChevronRight size={11} className="text-[#9ca3af]" />
              <span className="text-[11px] font-medium text-[#0965fa]" style={{ fontFamily: PP }}>Preparation</span>
            </div>
            <p className="text-[18px] font-black text-[#1a1d2e]" style={{ fontFamily: PP }}>🌱 SNBP Preparation</p>
          </div>
        </div>
        {/* Goal bar */}
        <div className="mx-8 mb-5 rounded-2xl border border-[rgba(0,0,0,0.07)] p-4 flex items-center justify-between gap-4" style={{ background: "linear-gradient(90deg,#eff6ff,#f0fdf4)" }}>
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl shrink-0">🎯</div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wide" style={{ fontFamily: PP }}>Your Current Goal</p>
              <p className="text-[15px] font-black text-[#1a1d2e] truncate" style={{ fontFamily: PP }}>{targetUniv}</p>
              <p className="text-[12px] text-[#6b7280]" style={{ fontFamily: PP }}>{targetMajor}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 shrink-0">
            <div className="text-right">
              <p className="text-[10px] text-[#9ca3af]" style={{ fontFamily: PP }}>Profile Match</p>
              <p className="text-[22px] font-black text-[#0965fa]" style={{ fontFamily: PP }}>{goal.matchPct}%</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[#9ca3af]" style={{ fontFamily: PP }}>Last Updated</p>
              <p className="text-[12px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>18 July 2026</p>
            </div>
            <button onClick={() => { setPendingUniv(targetUniv); setPendingMajor(targetMajor); setPrepState("updateSheet"); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold border border-[rgba(0,0,0,0.1)] bg-white text-[#374151] hover:shadow-sm transition-all"
              style={{ fontFamily: PP, outline: "none" }}>
              🔄 Change Goal
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable dashboard body */}
      <div className="flex-1 overflow-y-auto bg-[#f5f6fb]">
        <div className="px-8 py-6 flex flex-col gap-5 max-w-5xl">

          {/* ① Academic Performance */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#0965fa] text-white text-[11px] font-black flex items-center justify-center">①</span>
              <p className="text-[14px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Academic Performance</p>
            </div>
            <div className="px-6 py-5 grid grid-cols-[1fr_250px] gap-6">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-3">
                  {([ ["Status","🟢 Good","#22c55e"], ["Trend","📈 Increasing","#0965fa"], ["Avg Score","89.2","#1a1d2e"] ] as [string,string,string][]).map(([k,v,c]) => (
                    <div key={k} className="bg-[#f8faff] rounded-xl px-4 py-3 border border-[rgba(0,0,0,0.05)]">
                      <p className="text-[10px] text-[#9ca3af] font-medium mb-1" style={{ fontFamily: PP }}>{k}</p>
                      <p className="text-[15px] font-black" style={{ color: c, fontFamily: PP }}>{v}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-4 bg-[#eff6ff] border border-[#bfdbfe]">
                  <p className="text-[11px] font-bold text-[#0965fa] mb-1.5" style={{ fontFamily: PP }}>🤖 AI Insight</p>
                  <p className="text-[12px] text-[#1e40af] leading-relaxed italic" style={{ fontFamily: PP }}>
                    Nilai Matematika dan Bahasa Inggris menunjukkan perkembangan yang konsisten. Pertahankan performa ini karena kedua mata pelajaran memiliki kontribusi besar terhadap kesiapanmu pada jurusan {targetMajor}.
                  </p>
                </div>
              </div>
              {/* Mini bar chart */}
              <div>
                <p className="text-[11px] font-bold text-[#9ca3af] mb-3 text-center" style={{ fontFamily: PP }}>Semester Trend</p>
                <svg width={5 * (barW + gap) - gap} height={chartH + 32} style={{ display: "block", margin: "0 auto" }}>
                  {SEM_SCORES.map((score, i) => {
                    const x = i * (barW + gap);
                    const h = ((score - 80) / 20) * chartH;
                    const y = chartH - h;
                    return (
                      <g key={i}>
                        <rect x={x} y={y} width={barW} height={h} rx={7} fill={i === SEM_SCORES.length - 1 ? "#0965fa" : "#bfdbfe"} />
                        <text x={x + barW / 2} y={chartH + 14} textAnchor="middle" fontSize={9} fill="#9ca3af" fontFamily={PP}>S{i + 1}</text>
                        <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={9} fill={i === SEM_SCORES.length - 1 ? "#0965fa" : "#6b7280"} fontFamily={PP}>{score}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* ② Achievement Portfolio */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#8b5cf6] text-white text-[11px] font-black flex items-center justify-center">②</span>
              <p className="text-[14px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Achievement Portfolio</p>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-[#f5f3ff] rounded-xl px-5 py-3.5 border border-[#ddd6fe] text-center shrink-0">
                  <p className="text-[10px] text-[#9ca3af] font-medium" style={{ fontFamily: PP }}>Current Achievement</p>
                  <p className="text-[32px] font-black text-[#8b5cf6]" style={{ fontFamily: PP }}>3</p>
                  <p className="text-[10px] text-[#9ca3af]" style={{ fontFamily: PP }}>prestasi</p>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-[#374151] mb-2" style={{ fontFamily: PP }}>Relevan untuk {targetMajor}:</p>
                  <div className="flex flex-wrap gap-2">
                    {goal.achievements.map(a => (
                      <span key={a} className="px-3 py-1 rounded-xl text-[11px] font-semibold bg-[#f5f3ff] text-[#6d28d9] border border-[#ddd6fe]" style={{ fontFamily: PP }}>{a}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-xl p-4 bg-[#f5f3ff] border border-[#ddd6fe]">
                <p className="text-[11px] font-bold text-[#7c3aed] mb-1.5" style={{ fontFamily: PP }}>🤖 AI Analysis</p>
                <p className="text-[12px] text-[#5b21b6] leading-relaxed" style={{ fontFamily: PP }}>
                  Prestasi yang telah kamu miliki menunjukkan ketertarikan pada bidang yang relevan. Untuk memperkuat profil SNBP, AI merekomendasikan mengikuti minimal satu kompetisi tingkat provinsi agar portofoliomu semakin kompetitif.
                </p>
              </div>
              <button className="self-start flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold border border-[#8b5cf6] text-[#8b5cf6] hover:bg-[#8b5cf6] hover:text-white transition-all" style={{ fontFamily: PP, outline: "none" }}>
                🏆 Explore Competition
              </button>
            </div>
          </div>

          {/* ③ TKA Preparation */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)]" style={{ background: "linear-gradient(90deg,#fff7ed,#fff)" }}>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-6 h-6 rounded-lg bg-[#f97316] text-white text-[11px] font-black flex items-center justify-center">③</span>
                <p className="text-[14px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>TKA Preparation</p>
              </div>
              <p className="text-[11px] text-[#9ca3af] pl-8" style={{ fontFamily: PP }}>
                Berdasarkan target {targetMajor} — {targetUniv}, berikut mata pelajaran yang perlu kamu prioritaskan.
              </p>
            </div>
            <div className="px-6 py-5 flex flex-col gap-6">

              {/* A. TKA Subjects (Wajib) */}
              <div>
                <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wide mb-3" style={{ fontFamily: PP }}>A. TKA Subjects</p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {goal.tkaWajib.map(subj => {
                    const filledStars = subj.priority;
                    const readPct = subj.readiness;
                    const readColor = readPct >= 80 ? "#22c55e" : readPct >= 70 ? "#f1ad00" : "#ef4444";
                    return (
                      <div key={subj.label} className="rounded-xl border border-[rgba(0,0,0,0.07)] bg-[#f8f9fc] px-4 py-4">
                        <p className="text-[13px] font-black text-[#1a1d2e] mb-2" style={{ fontFamily: PP }}>{subj.label}</p>
                        <div className="flex items-center gap-0.5 mb-2.5">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={`text-[14px] ${i < filledStars ? "opacity-100" : "opacity-20"}`}>⭐</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-[#9ca3af]" style={{ fontFamily: PP }}>Readiness</span>
                          <span className="text-[12px] font-black" style={{ color: readColor, fontFamily: PP }}>{readPct}%</span>
                        </div>
                        <div className="h-1.5 bg-[#f0f2f8] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${readPct}%`, background: readColor }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="rounded-xl p-4 bg-[#fff7ed] border border-[#fed7aa]">
                  <p className="text-[11px] font-bold text-[#c2410c] mb-1.5" style={{ fontFamily: PP }}>🤖 AI berkata</p>
                  <p className="text-[12px] text-[#9a3412] leading-relaxed italic" style={{ fontFamily: PP }}>{goal.tkaWajibAI}</p>
                </div>
              </div>

              {/* B. Supporting Subjects */}
              <div>
                <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wide mb-3" style={{ fontFamily: PP }}>B. Supporting Subjects for Your Major</p>
                <div className="rounded-xl border border-[rgba(0,0,0,0.07)] bg-[#f8f9fc] p-4 mb-3">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base">📍</span>
                    <p className="text-[13px] font-bold text-[#374151]" style={{ fontFamily: PP }}>Untuk target: <span className="text-[#f97316]">{targetMajor}</span></p>
                  </div>
                  <p className="text-[11px] text-[#9ca3af] mb-3" style={{ fontFamily: PP }}>AI merekomendasikan</p>
                  <div className="grid grid-cols-2 gap-3">
                    {goal.tkaSupporting.map(subj => (
                      <div key={subj.label} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-[rgba(0,0,0,0.06)]">
                        <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>{subj.label}</p>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={`text-[11px] ${i < subj.priority ? "opacity-100" : "opacity-20"}`}>⭐</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl p-4 bg-[#fff7ed] border border-[#fed7aa]">
                  <p className="text-[11px] font-bold text-[#c2410c] mb-1.5" style={{ fontFamily: PP }}>🤖 AI Insight</p>
                  <p className="text-[12px] text-[#9a3412] leading-relaxed" style={{ fontFamily: PP }}>{goal.tkaSupportAI}</p>
                </div>
              </div>

              {/* E. Recommended Learning Focus */}
              <div>
                <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wide mb-3" style={{ fontFamily: PP }}>E. Recommended Learning Focus</p>
                <div className="rounded-xl border border-[#fed7aa] bg-[#fff7ed] px-5 py-4 mb-4">
                  <p className="text-[12px] font-black text-[#c2410c] mb-3" style={{ fontFamily: PP }}>📅 This Week Focus</p>
                  <div className="flex flex-col gap-2">
                    {goal.weeklyFocus.map(item => (
                      <div key={item} className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-[#22c55e] flex items-center justify-center shrink-0">
                          <Check size={11} className="text-white" />
                        </div>
                        <span className="text-[13px] font-semibold text-[#1a1d2e]" style={{ fontFamily: PP }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* F. Practice Button */}
                <button onClick={() => setShowLocalTKA(true)}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-[15px] font-bold text-white hover:opacity-90 active:scale-95 transition-all shadow-lg"
                  style={{ background: "linear-gradient(90deg,#f97316,#f1ad00)", fontFamily: PP, outline: "none" }}>
                  <BookOpen size={18} />
                  📖 Start TKA Practice
                </button>
              </div>

            </div>
          </div>

          {/* ④ Organization & Leadership */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#22c55e] text-white text-[11px] font-black flex items-center justify-center">④</span>
              <p className="text-[14px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Organization & Leadership</p>
            </div>
            <div className="px-6 py-5 grid grid-cols-[1fr_1fr] gap-5">
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  {([ ["Leadership Score","84%","#22c55e","#f0fdf4","#bbf7d0"], ["Communication","78%","#00b2dd","#f0faff","#bae6fd"] ] as [string,string,string,string,string][]).map(([k,v,c,bg,bd]) => (
                    <div key={k} className="flex-1 rounded-xl px-4 py-3.5 border" style={{ background: bg, borderColor: bd }}>
                      <p className="text-[10px] text-[#9ca3af] font-medium mb-1" style={{ fontFamily: PP }}>{k}</p>
                      <p className="text-[22px] font-black" style={{ color: c, fontFamily: PP }}>{v}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#374151] mb-2" style={{ fontFamily: PP }}>Relevan untuk {targetMajor}:</p>
                  <div className="flex flex-wrap gap-2">
                    {goal.orgs.map(o => (
                      <span key={o} className="px-3 py-1 rounded-xl text-[11px] font-semibold bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0]" style={{ fontFamily: PP }}>{o}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-xl p-4 bg-[#f0fdf4] border border-[#bbf7d0]">
                <p className="text-[11px] font-bold text-[#15803d] mb-1.5" style={{ fontFamily: PP }}>🤖 AI Insight</p>
                <p className="text-[12px] text-[#166534] leading-relaxed" style={{ fontFamily: PP }}>
                  Pengalaman organisasi telah menunjukkan kemampuan kepemimpinan yang baik. Untuk jurusan {targetMajor}, pengalaman sebagai {goal.orgs[0]} akan memberikan nilai tambah yang signifikan pada profil SNBP-mu.
                </p>
              </div>
            </div>
          </div>

          {/* ⑤ Recommended Academic Focus */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#f1ad00] text-white text-[11px] font-black flex items-center justify-center">⑤</span>
                <p className="text-[14px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Recommended Academic Focus</p>
              </div>
              <span className="text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>Based on {targetUniv.split(" ").slice(-1)} · {targetMajor}</span>
            </div>
            <div className="px-6 py-5">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {goal.subjects.map((s, i) => (
                  <div key={s.label}
                    className={`rounded-xl px-4 py-3.5 border transition-all cursor-pointer ${whichSubject === i ? "border-[#f1ad00] bg-[#fffbeb]" : "border-[rgba(0,0,0,0.06)] bg-[#f8f9fc] hover:border-[#f1ad00]"}`}
                    onClick={() => setWhichSubject(whichSubject === i ? null : i)}>
                    <p className="text-[16px] mb-1">{["🥇","🥈","🥉"][i]}</p>
                    <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>{s.label}</p>
                    <p className="text-[10px] text-[#9ca3af] mt-0.5" style={{ fontFamily: PP }}>Tap untuk penjelasan</p>
                  </div>
                ))}
              </div>
              {whichSubject !== null && (
                <div className="rounded-xl p-4 bg-[#fffbeb] border border-[#fde68a] mb-4">
                  <p className="text-[11px] font-bold text-[#92400e] mb-1.5" style={{ fontFamily: PP }}>Kenapa {goal.subjects[whichSubject].label}?</p>
                  <p className="text-[12px] text-[#78350f] leading-relaxed" style={{ fontFamily: PP }}>{goal.subjects[whichSubject].why}</p>
                </div>
              )}
              <div className="rounded-xl p-4 bg-[#fffbeb] border border-[#fde68a]">
                <p className="text-[11px] font-bold text-[#92400e] mb-1" style={{ fontFamily: PP }}>🤖 AI berkata</p>
                <p className="text-[12px] text-[#78350f] leading-relaxed" style={{ fontFamily: PP }}>
                  Ketiga mata pelajaran tersebut memiliki relevansi tinggi terhadap kompetensi yang dibutuhkan pada program studi yang kamu targetkan.
                </p>
              </div>
            </div>
          </div>

          {/* ⑥ SNBP Readiness Meter */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#00b2dd] text-white text-[11px] font-black flex items-center justify-center">⑥</span>
              <p className="text-[14px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>SNBP Readiness Meter</p>
            </div>
            <div className="px-6 py-5 grid grid-cols-[160px_1fr] gap-8 items-center">
              <div className="flex flex-col items-center">
                <div className="relative w-36 h-36">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#f0f2f8" strokeWidth="9" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="url(#prepRg)" strokeWidth="9" strokeLinecap="round"
                      strokeDasharray={`${(goal.readiness / 100) * circumference} ${circumference}`} />
                    <defs>
                      <linearGradient id="prepRg" x1="0" y1="0" x2="1" y2="0">
                        <stop stopColor="#0965fa" />
                        <stop offset="1" stopColor="#22c55e" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-[28px] font-black text-[#1a1d2e]" style={{ fontFamily: PP }}>{goal.readiness}%</p>
                    <p className="text-[9px] font-bold text-[#9ca3af]" style={{ fontFamily: PP }}>Overall</p>
                  </div>
                </div>
                <span className="mt-2 text-[11px] font-bold px-3 py-1 rounded-full bg-[#eff6ff] text-[#0965fa]" style={{ fontFamily: PP }}>Good Progress</span>
              </div>
              <div className="flex flex-col gap-3">
                {PREP_BREAKDOWN.map((b, i) => (
                  <div key={b.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[12px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>{b.label}</span>
                      <span className="text-[12px] font-black" style={{ color: b.color, fontFamily: PP }}>{BREAKDOWN_VALS[i]}%</span>
                    </div>
                    <div className="h-2 bg-[#f0f2f8] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${BREAKDOWN_VALS[i]}%`, background: b.color }} />
                    </div>
                  </div>
                ))}
                <div className="rounded-xl p-3 bg-[#eff6ff] border border-[#bfdbfe] mt-1">
                  <p className="text-[11px] text-[#1e40af] leading-relaxed italic" style={{ fontFamily: PP }}>{goal.aiNote}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ⑦ Improvement Opportunity */}
          <div className="bg-white rounded-2xl border border-[#fde68a] shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)]" style={{ background: "linear-gradient(90deg,#fffbeb,#fff)" }}>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-6 h-6 rounded-lg bg-[#f59e0b] text-white text-[11px] font-black flex items-center justify-center">⑦</span>
                <p className="text-[14px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Improvement Opportunity ⭐</p>
              </div>
              <p className="text-[11px] text-[#9ca3af] pl-8" style={{ fontFamily: PP }}>Tindakan konkret yang akan meningkatkan peluang eligible-mu.</p>
            </div>
            <div className="px-6 py-5 flex flex-col gap-3">
              {goal.improvements.map((imp, i) => (
                <div key={i} className="flex items-center gap-4 bg-[#fffbeb] border border-[#fde68a] rounded-xl px-5 py-4 hover:shadow-sm transition-all">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center text-[12px] font-black text-white shrink-0" style={{ background: "linear-gradient(135deg,#f59e0b,#f1ad00)" }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-[#92400e]" style={{ fontFamily: PP }}>Priority {i + 1}</p>
                    <p className="text-[13px] font-semibold text-[#1a1d2e] mt-0.5" style={{ fontFamily: PP }}>⬆ {imp.label}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[9px] text-[#9ca3af]" style={{ fontFamily: PP }}>Expected Impact</p>
                    <p className="text-[18px] font-black text-[#22c55e]" style={{ fontFamily: PP }}>+{imp.impact}%</p>
                    <p className="text-[9px] text-[#9ca3af]" style={{ fontFamily: PP }}>Readiness</p>
                  </div>
                </div>
              ))}
              <div className="rounded-xl p-3 bg-[#eff6ff] border border-[#bfdbfe] flex items-start gap-3 mt-1">
                <span className="text-base mt-0.5">💡</span>
                <p className="text-[12px] text-[#1e40af] leading-relaxed" style={{ fontFamily: PP }}>
                  Jika kamu menyelesaikan <strong>semua rekomendasi di atas</strong>, estimasi Readiness Score-mu akan naik menjadi{" "}
                  <strong className="text-[#22c55e]">{goal.readiness + goal.improvements.reduce((a, b) => a + b.impact, 0)}%</strong>.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Change Goal Bottom Sheet */}
      {prepState === "updateSheet" && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={e => { if (e.target === e.currentTarget) setPrepState("dashboard"); }}>
          <div className="bg-white rounded-t-3xl px-6 pt-6 pb-10 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <p className="text-[17px] font-black text-[#1a1d2e]" style={{ fontFamily: PP }}>🔄 Change Goal</p>
              <button onClick={() => setPrepState("dashboard")} className="w-8 h-8 rounded-xl bg-[#f5f6fb] flex items-center justify-center hover:bg-[#eef0f8] text-[#9ca3af] text-[18px]" style={{ outline: "none" }}>×</button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[12px] font-bold text-[#374151] block mb-2" style={{ fontFamily: PP }}>Target University</label>
                <select value={pendingUniv} onChange={e => setPendingUniv(e.target.value)}
                  className="w-full px-4 py-3 text-[14px] font-semibold border border-[rgba(0,0,0,0.1)] rounded-xl bg-[#f8f9fc] outline-none text-[#1a1d2e] cursor-pointer"
                  style={{ fontFamily: PP }}>
                  {PREP_UNI_LIST.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[12px] font-bold text-[#374151] block mb-2" style={{ fontFamily: PP }}>Target Major</label>
                <select value={pendingMajor} onChange={e => setPendingMajor(e.target.value)}
                  className="w-full px-4 py-3 text-[14px] font-semibold border border-[rgba(0,0,0,0.1)] rounded-xl bg-[#f8f9fc] outline-none text-[#1a1d2e] cursor-pointer"
                  style={{ fontFamily: PP }}>
                  {PREP_MAJOR_LIST.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <button onClick={() => setPrepState("updateDialog")}
              className="w-full py-3.5 rounded-2xl text-[14px] font-bold text-white hover:opacity-90 active:scale-95 transition-all"
              style={{ background: "linear-gradient(90deg,#0965fa,#00b2dd)", fontFamily: PP, outline: "none" }}>
              Save Changes →
            </button>
          </div>
        </div>
      )}

      {/* Update Confirmation Dialog */}
      {prepState === "updateDialog" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 pt-6 pb-5 border-b border-[rgba(0,0,0,0.06)]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl" style={{ background: "linear-gradient(135deg,#eff6ff,#e0f2fe)" }}>🔄</div>
                <p className="text-[16px] font-black text-[#1a1d2e]" style={{ fontFamily: PP }}>Update Preparation Strategy</p>
              </div>
              <p className="text-[12px] text-[#6b7280] leading-relaxed" style={{ fontFamily: PP }}>
                Kamu telah mengubah target tujuanmu ke{" "}
                <strong className="text-[#0965fa]">{pendingUniv} — {pendingMajor}</strong>.{" "}
                AI akan menyusun ulang strategi persiapan berdasarkan target baru.
              </p>
            </div>
            <div className="px-6 py-4">
              <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wide mb-3" style={{ fontFamily: PP }}>Yang akan diperbarui</p>
              <div className="flex flex-col gap-2">
                {PREP_UPDATE_LIST.map(item => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 size={14} className="text-[#22c55e] shrink-0" />
                    <span className="text-[12px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setPrepState("dashboard")} className="flex-1 py-3 rounded-2xl text-[13px] font-bold border border-[rgba(0,0,0,0.1)] text-[#374151] hover:bg-[#f5f6fb]" style={{ fontFamily: PP, outline: "none" }}>
                Batal
              </button>
              <button onClick={() => setPrepState("updating")}
                className="flex-1 py-3 rounded-2xl text-[13px] font-bold text-white hover:opacity-90"
                style={{ background: "linear-gradient(90deg,#0965fa,#00b2dd)", fontFamily: PP, outline: "none" }}>
                ✨ Update My Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SNBP Planner Page ─────────────────────────────────────────────────────────
function SNBPPlannerPage() {
  const [showRationale, setShowRationale] = useState(false);
  const [showPreparation, setShowPreparation] = useState(false);
  const [showTKAPractice, setShowTKAPractice] = useState(false);
  const [planStarted, setPlanStarted] = useState(false);
  const [eligibleState, setEligibleState] = useState<"building" | "kelas12-pending" | "eligible" | "not-eligible">("building");
  const [lastRefresh, setLastRefresh] = useState("18 Juli 2026, 14:30");
  const [refreshing, setRefreshing] = useState(false);

  if (showRationale) return <SNBPRationalizationFlow onBack={() => setShowRationale(false)} />;
  if (showPreparation) return <SNBPPreparationFlow onBack={() => setShowPreparation(false)} />;
  if (showTKAPractice) return <TKAPracticeFlow onBack={() => setShowTKAPractice(false)} />;

  function doRefresh() {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); setLastRefresh("18 Juli 2026, " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })); }, 1400);
  }

  const eligCfg = {
    "building":         { pct: 34, label: "Preparing",         color: "#0965fa",  badge: "bg-[#eff6ff] text-[#0965fa]",  sub: "Kamu sedang membangun profil akademik menuju SNBP." },
    "kelas12-pending":  { pct: 78, label: "Almost There",      color: "#f1ad00",  badge: "bg-[#fffbeb] text-[#92400e]",  sub: "Pengumuman eligible belum keluar. Terus pertahankan nilai dan prestasimu." },
    "eligible":         { pct: 100, label: "Eligible ✓",       color: "#22c55e",  badge: "bg-[#f0fdf4] text-[#15803d]",  sub: "Selamat! Kamu dinyatakan eligible SNBP. Segera lakukan rasionalisasi jurusan." },
    "not-eligible":     { pct: 62, label: "Not Eligible",      color: "#ef4444",  badge: "bg-[#fef2f2] text-[#991b1b]",  sub: "Kamu tidak masuk dalam kuota eligible SNBP tahun ini. Yuk persiapkan SNBT atau SKD." },
  };
  const ec = eligCfg[eligibleState];
  const circumference = 2 * Math.PI * 42;

  const TIMELINE = [
    { kelas: "Kelas X",  icon: "🌱", step: "Bangun Fondasi",     active: true },
    { kelas: "Kelas XI", icon: "📈", step: "Tingkatkan Prestasi", active: false },
    { kelas: "Kelas XII",icon: "🎯", step: "Eligible",            active: false },
    { kelas: "",         icon: "🏛", step: "Pendaftaran SNBP",    active: false },
  ];

  const ELIGIBILITY_REQ = [
    "Sekolah memiliki kuota SNBP",
    "Masuk Ranking Eligible di sekolah",
    "Berperilaku Baik (rekomendasi BK/Wali Kelas)",
    "Nilai Rapor memenuhi syarat minimum",
    "Prestasi akademik atau non-akademik relevan",
    "Portofolio (jika diperlukan oleh prodi pilihan)",
  ];

  const COMPONENTS = [
    { label: "Academic Performance", pct: 75, color: "#0965fa" },
    { label: "Achievement",          pct: 55, color: "#8b5cf6" },
    { label: "Consistency",          pct: 82, color: "#22c55e" },
    { label: "Extracurricular",      pct: 48, color: "#ff7000" },
  ];

  const PREP_FEATURES = [
    { icon: "📚", label: "Fondasi Akademik",      desc: "Strategi nilai rapor semester 1–5" },
    { icon: "📝", label: "TKA Preparation",        desc: "Latihan & simulasi ujian TKA" },
    { icon: "🏆", label: "Achievement Planner",    desc: "Rencana prestasi akademik & non-akademik" },
    { icon: "📊", label: "Eligibility Tracker",   desc: "Pantau progress menuju eligible" },
    { icon: "🎯", label: "SNBP Rationalization",   desc: "Khusus Kelas XII — pilih jurusan terbaik" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f5f6fb]">
      {/* ── SECTION 1: Hero ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg,#0a1628 0%,#0f2952 55%,#0a2a4a 100%)" }}>
        {/* Decorative rings */}
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle,#00b2dd,transparent)" }} />
        <div className="absolute right-32 bottom-0 w-64 h-64 rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle,#0965fa,transparent)" }} />

        <div className="relative px-10 py-14">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#0965fa,#00b2dd)" }}>
                <span className="text-white text-[13px]">🎓</span>
              </div>
              <span className="text-[12px] font-semibold text-[#60a5fa] tracking-wide uppercase" style={{ fontFamily: PP }}>ORBITA · SNBP Planner</span>
            </div>
            <h1 className="text-[36px] font-black text-white leading-tight mb-3" style={{ fontFamily: PP }}>
              SNBP Planner
            </h1>
            <p className="text-[17px] font-semibold text-[#93c5fd] mb-2" style={{ fontFamily: PP }}>
              "Persiapkan peluangmu masuk PTN sejak hari pertama SMA."
            </p>
            <p className="text-[14px] text-[#94a3b8] leading-relaxed mb-8 max-w-xl" style={{ fontFamily: PP }}>
              SNBP bukan hanya tentang nilai rapor di kelas XII. Perjalananmu dimulai sejak kelas X. Orbita akan membantu menyusun strategi akademik dan prestasi agar peluangmu semakin besar.
            </p>
            <button
              onClick={() => { setPlanStarted(true); }}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-[14px] font-bold text-white hover:opacity-90 active:scale-95 transition-all shadow-lg"
              style={{ background: "linear-gradient(90deg,#0965fa,#00b2dd)", fontFamily: PP, outline: "none" }}>
              <Sparkles size={16} />
              Start Your Journey
            </button>
          </div>
        </div>

        {/* Breadcrumb bar */}
        <div className="px-10 pb-5 flex items-center gap-1.5">
          <span className="text-[11px] text-[#64748b]" style={{ fontFamily: PP }}>Dashboard</span>
          <ChevronRight size={11} className="text-[#475569]" />
          <span className="text-[11px] font-medium text-[#93c5fd]" style={{ fontFamily: PP }}>SNBP Planner</span>
        </div>
      </div>

      <div className="px-10 py-8 flex flex-col gap-8">

        {/* ── SECTION 2: What is SNBP? ─────────────────────────────────── */}
        <section className="flex flex-col gap-5">
          <p className="text-[18px] font-black text-[#1a1d2e]" style={{ fontFamily: PP }}>Apa itu SNBP?</p>
          <div className="grid grid-cols-[1fr_340px] gap-5 items-start">
            {/* Explanation card */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#eff6ff] flex items-center justify-center text-2xl shrink-0">📋</div>
                <div>
                  <p className="text-[15px] font-bold text-[#1a1d2e] mb-1.5" style={{ fontFamily: PP }}>Seleksi Nasional Berdasarkan Prestasi</p>
                  <p className="text-[13px] text-[#6b7280] leading-relaxed" style={{ fontFamily: PP }}>
                    SNBP adalah jalur seleksi masuk PTN yang mengutamakan <strong className="text-[#374151]">prestasi akademik dan non-akademik</strong> siswa selama di SMA/MA/SMK. Tidak ada ujian tertulis — penilaian dilakukan berdasarkan <strong className="text-[#374151]">nilai rapor, portofolio, dan prestasi</strong> yang dikumpulkan selama sekolah.
                  </p>
                  <p className="text-[13px] text-[#6b7280] leading-relaxed mt-2" style={{ fontFamily: PP }}>
                    Kuota minimal <strong className="text-[#374151]">20%</strong> dari daya tampung setiap prodi PTN harus dipenuhi melalui jalur SNBP.
                  </p>
                </div>
              </div>
              <button className="self-start flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold border border-[#0965fa] text-[#0965fa] hover:bg-[#0965fa] hover:text-white transition-all" style={{ fontFamily: PP, outline: "none" }}>
                <BookOpen size={13} />
                Pelajari Lebih Lanjut
              </button>
            </div>

            {/* Eligibility requirements */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
              <p className="text-[13px] font-bold text-[#1a1d2e] mb-3" style={{ fontFamily: PP }}>Persyaratan Eligibilitas</p>
              <div className="flex flex-col gap-2">
                {ELIGIBILITY_REQ.map(r => (
                  <div key={r} className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-[#22c55e] shrink-0 mt-0.5" />
                    <span className="text-[12px] text-[#374151]" style={{ fontFamily: PP }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Horizontal timeline */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm px-8 py-6">
            <p className="text-[12px] font-bold text-[#9ca3af] uppercase tracking-wide mb-6" style={{ fontFamily: PP }}>Roadmap Menuju SNBP</p>
            <div className="flex items-start">
              {TIMELINE.map((t, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-2 shadow-sm ${t.active ? "text-white" : "bg-[#f5f6fb]"}`}
                      style={t.active ? { background: "linear-gradient(135deg,#0965fa,#00b2dd)" } : {}}>
                      {t.icon}
                    </div>
                    {t.kelas && <p className="text-[11px] font-black text-[#1a1d2e] mb-0.5" style={{ fontFamily: PP }}>{t.kelas}</p>}
                    <p className={`text-[12px] font-semibold text-center ${t.active ? "text-[#0965fa]" : "text-[#9ca3af]"}`} style={{ fontFamily: PP }}>{t.step}</p>
                    {t.active && <span className="mt-1.5 text-[9px] px-2 py-0.5 rounded-full font-bold text-white" style={{ background: "linear-gradient(90deg,#0965fa,#00b2dd)" }}>Kamu di sini</span>}
                  </div>
                  {i < TIMELINE.length - 1 && (
                    <div className="flex-1 flex items-center pt-5 px-2 min-w-0">
                      <div className="h-[2px] w-full rounded-full" style={{ background: i === 0 ? "linear-gradient(90deg,#0965fa,#e5e7eb)" : "#e5e7eb" }} />
                      <ChevronRight size={14} className="text-[#d1d5db] shrink-0 -ml-1" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 2.5: Quick Start TKA ─────────────────────────────── */}
        <section>
          <div className="relative rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg,#0a1628 0%,#0f2952 60%,#1a0a3a 100%)" }}>
            <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full opacity-15" style={{ background: "radial-gradient(circle,#8b5cf6,transparent)" }} />
            <div className="absolute left-1/2 bottom-0 w-48 h-48 rounded-full opacity-10" style={{ background: "radial-gradient(circle,#0965fa,transparent)" }} />
            <div className="relative px-8 py-7 flex items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0" style={{ background: "rgba(139,92,246,0.2)", border: "1.5px solid rgba(139,92,246,0.3)" }}>
                  📝
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[18px] font-black text-white" style={{ fontFamily: PP }}>Latihan TKA</p>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#8b5cf6]/20 text-[#c4b5fd] border border-[#8b5cf6]/30" style={{ fontFamily: PP }}>Quick Start</span>
                  </div>
                  <p className="text-[13px] text-[#94a3b8] leading-relaxed max-w-lg" style={{ fontFamily: PP }}>
                    Latihan soal TKA per mata pelajaran — Wajib (B. Indonesia, Matematika, B. Inggris) dan Pilihan Saintek/Sosial. Lengkap dengan pembahasan dan review hasil.
                  </p>
                  <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                    {[
                      { emoji: "📝", label: "B. Indonesia", color: "#60a5fa" },
                      { emoji: "🔢", label: "Matematika",   color: "#a78bfa" },
                      { emoji: "🌍", label: "B. Inggris",   color: "#6ee7b7" },
                      { emoji: "⚡", label: "Fisika",        color: "#fcd34d" },
                      { emoji: "🧪", label: "Kimia",         color: "#f87171" },
                      { emoji: "🧬", label: "Biologi",       color: "#34d399" },
                    ].map(s => (
                      <span key={s.label} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg" style={{ background: "rgba(255,255,255,0.07)", color: s.color, fontFamily: PP }}>
                        {s.emoji} {s.label}
                      </span>
                    ))}
                    <span className="text-[10px] text-[#64748b]" style={{ fontFamily: PP }}>+3 lainnya</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowTKAPractice(true)}
                className="shrink-0 flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-[13px] font-bold text-white hover:opacity-90 active:scale-95 transition-all shadow-xl"
                style={{ background: "linear-gradient(90deg,#8b5cf6,#0965fa)", fontFamily: PP, outline: "none" }}>
                <BookOpen size={15} />
                Mulai Latihan
              </button>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: My Eligibility Status ─────────────────────────── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-[18px] font-black text-[#1a1d2e]" style={{ fontFamily: PP }}>My Eligibility Status</p>
            {/* Demo switcher */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#9ca3af] font-medium" style={{ fontFamily: PP }}>Demo state:</span>
              {(["building","kelas12-pending","eligible","not-eligible"] as const).map(k => (
                <button key={k} onClick={() => setEligibleState(k)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border font-semibold transition-all ${eligibleState === k ? "bg-[#1a1d2e] text-white border-transparent" : "border-[rgba(0,0,0,0.1)] text-[#9ca3af] hover:bg-[#f5f6fb]"}`}
                  style={{ fontFamily: PP, outline: "none" }}>{k}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[280px_1fr] gap-5 items-start">
            {/* Progress ring card */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6 flex flex-col items-center gap-4">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#f0f2f8" strokeWidth="9" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke={ec.color} strokeWidth="9" strokeLinecap="round"
                    strokeDasharray={`${(ec.pct / 100) * circumference} ${circumference}`}
                    style={{ transition: "stroke-dasharray 0.8s ease" }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[28px] font-black leading-none" style={{ color: ec.color, fontFamily: PP }}>{ec.pct}%</p>
                  <p className="text-[10px] font-bold text-[#9ca3af] mt-0.5" style={{ fontFamily: PP }}>Progress</p>
                </div>
              </div>
              <div className="text-center">
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${ec.badge}`} style={{ fontFamily: PP }}>🎯 {ec.label}</span>
                <p className="text-[12px] text-[#6b7280] mt-2.5 leading-relaxed text-center" style={{ fontFamily: PP }}>{ec.sub}</p>
              </div>
              {eligibleState === "not-eligible" && (
                <div className="flex flex-col gap-2 w-full">
                  <button className="w-full py-2 rounded-xl text-[12px] font-bold text-white" style={{ background: "linear-gradient(90deg,#8b5cf6,#0965fa)", fontFamily: PP, outline: "none" }}>📘 Persiapkan SNBT</button>
                  <button className="w-full py-2 rounded-xl text-[12px] font-bold text-white" style={{ background: "linear-gradient(90deg,#ff7000,#f1ad00)", fontFamily: PP, outline: "none" }}>🏛 Eksplor SKD</button>
                </div>
              )}
            </div>

            {/* Components breakdown */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[14px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Eligibility Components</p>
                  <p className="text-[11px] text-[#9ca3af] mt-0.5" style={{ fontFamily: PP }}>Bukan hasil eligible — ini adalah progress menuju eligible</p>
                </div>
                <button onClick={doRefresh}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold border border-[rgba(0,0,0,0.08)] text-[#6b7280] hover:bg-[#f5f6fb] transition-all ${refreshing ? "opacity-50 pointer-events-none" : ""}`}
                  style={{ fontFamily: PP, outline: "none" }}>
                  <TrendingUp size={12} className={refreshing ? "animate-spin" : ""} />
                  {refreshing ? "Refreshing…" : "Refresh Data"}
                </button>
              </div>
              <div className="flex flex-col gap-5">
                {COMPONENTS.map(c => (
                  <div key={c.label}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[13px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>{c.label}</span>
                      <span className="text-[13px] font-black" style={{ color: c.color, fontFamily: PP }}>{c.pct}%</span>
                    </div>
                    <div className="h-2.5 bg-[#f0f2f8] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${c.pct}%`, background: c.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#9ca3af] mt-4 border-t border-[rgba(0,0,0,0.05)] pt-3" style={{ fontFamily: PP }}>
                Terakhir diperbarui: {lastRefresh} · Data ditarik dari Nilai Rapor, Prestasi, dan Profil Siswa
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: Two Apple-card Features ───────────────────────── */}
        <section className="flex flex-col gap-4">
          <p className="text-[18px] font-black text-[#1a1d2e]" style={{ fontFamily: PP }}>Fitur Utama</p>
          <div className="grid grid-cols-2 gap-5">

            {/* Card 1 — SNBP Preparation */}
            <div className="relative rounded-3xl overflow-hidden" style={{ background: "linear-gradient(145deg,#0a1628,#0f2952,#0a2a4a)", minHeight: 420 }}>
              {/* Glow blobs */}
              <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-20" style={{ background: "radial-gradient(circle,#00b2dd,transparent)" }} />
              <div className="absolute -left-6 bottom-16 w-36 h-36 rounded-full opacity-10" style={{ background: "radial-gradient(circle,#0965fa,transparent)" }} />

              <div className="relative p-7 flex flex-col h-full" style={{ minHeight: 420 }}>
                {/* Badge + icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🌱</span>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 text-[#93c5fd] border border-white/10" style={{ fontFamily: PP }}>Kelas X – XI</span>
                  </div>
                  {planStarted && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#22c55e]/20 text-[#86efac] border border-[#22c55e]/20" style={{ fontFamily: PP }}>● Aktif</span>
                  )}
                </div>

                {/* Title */}
                <p className="text-[22px] font-black text-white mb-1.5" style={{ fontFamily: PP }}>SNBP Preparation</p>
                <p className="text-[13px] text-[#94a3b8] leading-relaxed mb-5" style={{ fontFamily: PP }}>Persiapkan diri sejak awal agar peluang eligible semakin besar.</p>

                {/* Feature tree */}
                <div className="flex flex-col gap-2 mb-6 flex-1">
                  {PREP_FEATURES.map((f, i) => (
                    <div key={f.label} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${i === 0 ? "bg-white/10 border border-white/10" : "hover:bg-white/5"}`}>
                      <span className="text-base shrink-0">{f.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-white" style={{ fontFamily: PP }}>{f.label}</p>
                        <p className="text-[10px] text-[#64748b] truncate" style={{ fontFamily: PP }}>{f.desc}</p>
                      </div>
                      {i === 0 && <div className="w-1.5 h-1.5 rounded-full bg-[#00b2dd] shrink-0" />}
                    </div>
                  ))}
                </div>

                {/* Readiness + CTA */}
                <div className="border-t border-white/10 pt-4">
                  {planStarted ? (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] text-[#94a3b8]" style={{ fontFamily: PP }}>Current Readiness</span>
                        <span className="text-[16px] font-black text-white" style={{ fontFamily: PP }}>72%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 mb-3 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: "72%", background: "linear-gradient(90deg,#0965fa,#00b2dd)" }} />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setShowPreparation(true)} className="flex-1 py-3 rounded-2xl text-[13px] font-bold text-white hover:opacity-90 active:scale-95 transition-all" style={{ background: "linear-gradient(90deg,#0965fa,#00b2dd)", fontFamily: PP, outline: "none" }}>
                          Lanjutkan Planning →
                        </button>
                        <button onClick={doRefresh} className="px-3 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white transition-all" style={{ outline: "none" }}>
                          <TrendingUp size={14} />
                        </button>
                      </div>
                      <p className="text-[10px] text-[#475569] mt-2 text-center" style={{ fontFamily: PP }}>Terakhir diperbarui: {lastRefresh}</p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] text-[#94a3b8]" style={{ fontFamily: PP }}>Current Readiness</span>
                        <span className="text-[14px] font-black text-[#60a5fa]" style={{ fontFamily: PP }}>72%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 mb-3 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: "72%", background: "linear-gradient(90deg,#0965fa60,#00b2dd60)" }} />
                      </div>
                      <button onClick={() => { setPlanStarted(true); setShowPreparation(true); }}
                        className="w-full py-3 rounded-2xl text-[13px] font-bold text-white hover:opacity-90 active:scale-95 transition-all"
                        style={{ background: "linear-gradient(90deg,#0965fa,#00b2dd)", fontFamily: PP, outline: "none" }}>
                        Start Planning →
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Card 2 — SNBP Rationalization */}
            {(() => {
              const isEligible = eligibleState === "eligible";
              const isPending  = eligibleState === "kelas12-pending";
              const isBuilding = eligibleState === "building";
              const isNotElig  = eligibleState === "not-eligible";

              const cardBg = isEligible
                ? "linear-gradient(145deg,#052e16,#14532d,#166534)"
                : isNotElig
                ? "linear-gradient(145deg,#1c0a0a,#450a0a,#7f1d1d)"
                : "linear-gradient(145deg,#1c1917,#292524,#1c1917)";

              return (
                <div className="relative rounded-3xl overflow-hidden" style={{ background: cardBg, minHeight: 420 }}>
                  <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-20"
                    style={{ background: `radial-gradient(circle,${isEligible ? "#22c55e" : isNotElig ? "#ef4444" : "#f1ad00"},transparent)` }} />

                  <div className="relative p-7 flex flex-col h-full" style={{ minHeight: 420 }}>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🎯</span>
                        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 text-white/70 border border-white/10" style={{ fontFamily: PP }}>Kelas XII</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${isEligible ? "bg-[#22c55e]/20 text-[#86efac] border-[#22c55e]/20" : isNotElig ? "bg-[#ef4444]/20 text-[#fca5a5] border-[#ef4444]/20" : "bg-white/10 text-white/50 border-white/10"}`}
                        style={{ fontFamily: PP }}>
                        {isEligible ? "● Eligible" : isNotElig ? "● Not Eligible" : isPending ? "⏳ Menunggu" : "🔒 Belum Aktif"}
                      </span>
                    </div>

                    <p className="text-[22px] font-black text-white mb-1.5" style={{ fontFamily: PP }}>SNBP Rationalization</p>
                    <p className="text-[13px] leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.5)", fontFamily: PP }}>
                      {isEligible ? "Fitur khusus untuk menyusun strategi jurusan dan kampus terbaik berdasarkan profilmu." : isNotElig ? "Sayang sekali, kamu tidak masuk eligible SNBP tahun ini. Tidak apa-apa — masih ada jalur lain." : isPending ? "Pengumuman eligible belum keluar. Fitur ini akan aktif setelah pengumuman resmi dari sekolah." : "Fitur ini diperuntukkan bagi siswa Kelas XII yang telah dinyatakan eligible SNBP."}
                    </p>

                    {/* Eligible preview / locked state */}
                    <div className="flex-1 flex flex-col justify-center">
                      {isEligible ? (
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          {[["Eligible", "YES ✓", "#22c55e"], ["Pilihan Prodi", "2 Prodi", "#60a5fa"], ["AI Match Score", "94%", "#a78bfa"], ["Deadline", "15 Jan 2027", "#f1ad00"]].map(([k, v, c]) => (
                            <div key={k} className="bg-white/10 rounded-2xl px-4 py-3 border border-white/10">
                              <p className="text-[10px] text-white/50 mb-0.5" style={{ fontFamily: PP }}>{k}</p>
                              <p className="text-[15px] font-black" style={{ color: c, fontFamily: PP }}>{v}</p>
                            </div>
                          ))}
                        </div>
                      ) : isNotElig ? (
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-6">
                          <p className="text-[12px] text-white/60 leading-relaxed" style={{ fontFamily: PP }}>
                            Jangan menyerah. Masih ada jalur <strong className="text-white">SNBT</strong> dan <strong className="text-white">SKD (Kedinasan)</strong> yang bisa kamu kejar. Orbita siap membantu persiapanmu.
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-6">
                          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl mb-3">🔒</div>
                          <p className="text-[13px] font-semibold text-white/60 text-center" style={{ fontFamily: PP }}>
                            {isPending ? "Menunggu pengumuman eligible dari sekolah" : "Tersedia mulai Kelas XII"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
                      {isEligible ? (
                        <button onClick={() => setShowRationale(true)} className="w-full py-3 rounded-2xl text-[13px] font-bold text-white hover:opacity-90 active:scale-95 transition-all"
                          style={{ background: "linear-gradient(90deg,#16a34a,#22c55e)", fontFamily: PP, outline: "none" }}>
                          🎯 Check My Chance
                        </button>
                      ) : isNotElig ? (
                        <div className="flex gap-2">
                          <button className="flex-1 py-3 rounded-2xl text-[12px] font-bold text-white hover:opacity-90"
                            style={{ background: "linear-gradient(90deg,#8b5cf6,#0965fa)", fontFamily: PP, outline: "none" }}>📘 Persiapan SNBT</button>
                          <button className="flex-1 py-3 rounded-2xl text-[12px] font-bold text-white hover:opacity-90"
                            style={{ background: "linear-gradient(90deg,#ff7000,#f1ad00)", fontFamily: PP, outline: "none" }}>🏛 Eksplor SKD</button>
                        </div>
                      ) : isPending ? (
                        <div className="flex gap-2">
                          <button className="flex-1 py-3 rounded-2xl text-[12px] font-bold text-white hover:opacity-90 bg-white/10 border border-white/10">🌱 SNBP Planner</button>
                          <button className="flex-1 py-3 rounded-2xl text-[12px] font-bold text-white hover:opacity-90"
                            style={{ background: "linear-gradient(90deg,#8b5cf6,#0965fa)", fontFamily: PP, outline: "none" }}>📘 Persiapan SNBT</button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button className="flex-1 py-3 rounded-2xl text-[12px] font-bold text-white hover:opacity-90 bg-white/10 border border-white/10" style={{ fontFamily: PP, outline: "none" }}>
                            🌱 Persiapkan Dulu
                          </button>
                          <button className="flex-1 py-3 rounded-2xl text-[12px] font-bold text-white hover:opacity-90"
                            style={{ background: "linear-gradient(90deg,#8b5cf6,#0965fa)", fontFamily: PP, outline: "none" }}>📘 Persiapan SNBT</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Demo hint */}
          <p className="text-[11px] text-[#9ca3af] text-center" style={{ fontFamily: PP }}>
            Gunakan tombol demo state di bagian <strong>My Eligibility Status</strong> untuk mencoba tampilan berbagai kondisi siswa.
          </p>
        </section>

      </div>
    </div>
  );
}

export { SNBPRationalizationFlow };
export default SNBPRationalizationFlow;
