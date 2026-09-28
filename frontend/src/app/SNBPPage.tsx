import React, { useState, useEffect } from "react";
import {
  AlertCircle, AlertTriangle, ArrowLeft, BookOpen, Check, CheckCircle2,
  ChevronRight, Download, Sparkles, TrendingUp, Search,
} from "lucide-react";

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

export { SNBPRationalizationFlow };
export default SNBPRationalizationFlow;
