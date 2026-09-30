import React from "react";
import { TrendingUp, Calendar } from "lucide-react";
import { BRAND } from "@/config/brand";

const PP = "Poppins, sans-serif";
const BLUE = "#0965fa";
const CYAN = "#00b2dd";

function MiniRadar({ axes, values, color, size = 160 }: { axes: string[]; values: number[]; color: string; size?: number }) {
  const N = axes.length;
  const CX = size / 2;
  const CY = size / 2;
  const R = size * 0.33;
  const pt = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / N - Math.PI / 2;
    return { x: CX + R * (v / 100) * Math.cos(a), y: CY + R * (v / 100) * Math.sin(a) };
  };
  const ptR = (i: number) => {
    const a = (Math.PI * 2 * i) / N - Math.PI / 2;
    return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
  };
  const poly = values.map((v, i) => pt(i, v));
  const web = Array.from({ length: N }, (_, i) => ptR(i));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[0.33, 0.67, 1].map(r => (
        <polygon key={r} points={web.map(p => `${CX + (p.x - CX) * r},${CY + (p.y - CY) * r}`).join(" ")} fill="none" stroke="#f1f5f9" strokeWidth={1} />
      ))}
      {web.map((p, i) => <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="#f1f5f9" strokeWidth={1} />)}
      <polygon points={poly.map(p => `${p.x},${p.y}`).join(" ")} fill={color + "22"} stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      {poly.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={3} fill={color} />)}
      {web.map((p, i) => {
        const lx = CX + (p.x - CX) * 1.32;
        const ly = CY + (p.y - CY) * 1.32;
        return <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill="#94a3b8" fontFamily={PP} fontWeight={600}>{axes[i]}</text>;
      })}
    </svg>
  );
}

type Props = { onNavigate?: (page: string) => void; onBookingCreated?: (b: any) => void; currentUser?: any };

export default function DashboardPage({ onNavigate, currentUser }: Props) {
  function nav(page: string) { onNavigate?.(page); }

  const studentName = currentUser?.name?.split(" ")[0] || "Siswa";

  const missions = [
    { title: "20 soal penalaran matematika", status: "progress", cur: 12, max: 20 },
    { title: "Review try out #4", status: "pending" },
  ];

  const radarAxes = ["PU", "PK", "LBI", "LBE", "PM", "PPU", "PI"];
  const radarValues = [88, 74, 71, 80, 91, 68, 76];

  const timelines = [
    {
      label: "SNBT", sub: "Pengumuman: 28 Jul 2026",
      count: "9", unit: "hari lagi",
      color: "#ff7f00", bg: "rgba(255,247,237,0.6)", border: "#ffedd5", iconBg: "#ff7f00",
    },
    {
      label: "SKD kedinasan", sub: "Pelaksanaan: 15 Agt 2026",
      count: "27", unit: "hari lagi",
      color: "#007aff", bg: "rgba(240,249,255,0.6)", border: "#bae6fd", iconBg: "#007aff",
    },
    {
      label: "SNBP", sub: "Telah Selesai",
      count: "", unit: "",
      color: "#6b7280", bg: "rgba(249,250,251,0.6)", border: "#f3f4f6", iconBg: "#9ca3af",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "#f5f6fb" }}>
      <div className="max-w-[1280px] mx-auto px-6 py-6 flex flex-col gap-5">

        {/* ① HERO BANNER */}
        <div className="relative rounded-3xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${BLUE} 0%, ${CYAN} 100%)` }}>
          <div className="absolute bottom-[-96px] right-[-96px] w-96 h-96 rounded-full opacity-50" style={{ background: "#00b4ff", filter: "blur(32px)" }} />
          <div className="relative grid grid-cols-12 gap-6 p-6">

            {/* Left: greeting + ringkasan */}
            <div className="col-span-12 md:col-span-5 flex flex-col justify-center py-4">
              <p className="text-[13px] font-semibold text-white/70 mb-1" style={{ fontFamily: PP }}>Sabtu, 19 Juli 2026</p>
              <h1 className="text-[28px] font-bold text-white leading-tight mb-1.5" style={{ fontFamily: PP }}>Selamat pagi, {studentName}!</h1>
              <p className="text-[13px] text-white/80 mb-6" style={{ fontFamily: PP }}>Mari mulai perjalanan target kampusmu bersama {BRAND.name}!</p>
              <p className="text-[11px] font-semibold text-white/60 uppercase tracking-widest mb-3" style={{ fontFamily: PP }}>RINGKASAN HARIAN</p>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2.5">
                  <svg width="16" height="15" viewBox="0 0 16.5 15.75" fill="none">
                    <path d="M14.6667 1.5L6 10.1667L2.33333 6.5L1 7.83333L6 12.8333L16 2.83333L14.6667 1.5Z" fill="white" />
                  </svg>
                  <p className="text-[13px] font-medium text-white" style={{ fontFamily: PP }}>3 dari 5 Action Plan Selesai</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <svg width="15" height="9" viewBox="0 0 15 9" fill="none">
                    <path d="M14.25 0.75L7.5 7.5L4.5 4.5L0.75 8.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.5 0.75H14.25V4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-[13px] font-medium text-white" style={{ fontFamily: PP }}>Prioritas Baru: Literasi Bahasa</p>
                </div>
              </div>
            </div>

            {/* Right: Today's Action Plan card */}
            <div className="col-span-12 md:col-span-7">
              <div className="bg-white rounded-[20px] p-6 h-full" style={{ minHeight: 237 }}>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[17px] font-bold text-slate-800" style={{ fontFamily: PP }}>Today's action plan</h2>
                  <span className="px-3 py-1 rounded-full text-[13px] font-semibold text-[#0052ff] bg-[#eff6ff]" style={{ fontFamily: PP }}>2 Pending</span>
                </div>

                <div className="flex gap-5 items-center">
                  {/* Circular donut: 60% */}
                  <div className="shrink-0">
                    <svg width="130" height="130" viewBox="0 0 130 130">
                      <circle cx="65" cy="65" r="52" fill="none" stroke="#dbeafe" strokeWidth="14" />
                      <circle cx="65" cy="65" r="52" fill="none" stroke="#ff7000" strokeWidth="14"
                        strokeDasharray="326.73" strokeDashoffset="130.69" strokeLinecap="round"
                        style={{ transform: "rotate(-90deg)", transformOrigin: "center" }} />
                      <text x="65" y="65" textAnchor="middle" dominantBaseline="middle"
                        fontSize="22" fontWeight="700" fill="#111827" fontFamily={PP}>60%</text>
                    </svg>
                  </div>

                  {/* Task list */}
                  <div className="flex flex-col gap-4 flex-1">
                    {missions.map((m, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full shrink-0 ${m.status === "progress" ? "bg-[#dbeafe]" : "bg-[#fffbeb] border border-[#fef3c7]"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-slate-800 leading-snug" style={{ fontFamily: PP }}>{m.title}</p>
                          {m.status === "progress" && m.cur !== undefined && m.max !== undefined && (
                            <div className="mt-1.5 h-1.5 rounded-full w-28" style={{ background: "#f1f5f9" }}>
                              <div className="h-full rounded-full bg-[#0085ff]" style={{ width: `${(m.cur / m.max) * 100}%` }} />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => nav("action")}
                          className="shrink-0 rounded-full text-[12px] font-bold transition-all"
                          style={{
                            padding: "5px 16px",
                            background: m.status === "progress" ? "#0085ff" : "white",
                            color: m.status === "progress" ? "white" : "#64748b",
                            border: m.status !== "progress" ? "1px solid #e2e8f0" : "none",
                            fontFamily: PP,
                            outline: "none",
                          }}
                        >
                          {m.status === "progress" ? "Lanjut" : "Mulai"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ② MIDDLE: Performa + Timeline Seleksi */}
        <div className="grid grid-cols-12 gap-5">

          {/* Left 60%: Performa with radar */}
          <div className="col-span-12 md:col-span-7 bg-white rounded-3xl p-6 border border-slate-100" style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)" }}>
            <h2 className="text-[17px] font-bold text-slate-800 mb-5" style={{ fontFamily: PP }}>Performa</h2>
            <div className="flex items-center justify-center gap-8">
              <div className="shrink-0">
                <MiniRadar axes={radarAxes} values={radarValues} color={BLUE} size={220} />
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-[11px] text-slate-400 mb-0.5" style={{ fontFamily: PP }}>Rata-rata skor tryout</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[36px] font-black text-[#0085ff] leading-none" style={{ fontFamily: PP }}>624</span>
                    <span className="text-[14px] font-bold text-emerald-500" style={{ fontFamily: PP }}>+18 pts</span>
                  </div>
                </div>
                <button
                  onClick={() => nav("snbp")}
                  className="px-4 py-2 rounded-xl border text-[13px] font-bold hover:bg-blue-50 transition-all text-center"
                  style={{ borderColor: "#0085ff", color: "#0085ff", fontFamily: PP, outline: "none", width: 160 }}
                >
                  Lihat performa
                </button>
              </div>
            </div>
            <p className="text-center text-[8px] text-slate-300 mt-3 leading-relaxed" style={{ fontFamily: PP }}>
              PU: Penalaran Umum · PK: Pengetahuan Kuantitatif · LBI: Literasi Bahasa Indonesia · LBE: Literasi Bahasa Inggris · PM: Penalaran Matematika · PPU: Pengetahuan & Pemahaman Umum · PI: Penalaran Induktif
            </p>
          </div>

          {/* Right 40%: Timeline Seleksi */}
          <div className="col-span-12 md:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 self-start" style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)" }}>
            <h2 className="text-[17px] font-bold text-slate-800 mb-4" style={{ fontFamily: PP }}>Timeline seleksi</h2>
            <div className="flex flex-col gap-3">
              {timelines.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl px-4 py-4"
                  style={{ background: t.bg, border: `1px solid ${t.border}` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: t.iconBg }}>
                      <Calendar size={13} color="white" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold" style={{ color: t.color, fontFamily: PP }}>{t.label}</p>
                      <p className="text-[10px] text-slate-500" style={{ fontFamily: PP }}>{t.sub}</p>
                    </div>
                  </div>
                  {t.count ? (
                    <div className="text-right shrink-0 ml-2">
                      <p className="text-[22px] font-black leading-none" style={{ color: t.color, fontFamily: PP }}>{t.count}</p>
                      <p className="text-[10px] font-bold" style={{ color: t.color, fontFamily: PP }}>{t.unit}</p>
                    </div>
                  ) : (
                    <div className="shrink-0 w-8 h-8 flex items-center justify-center">
                      <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
                        <path d="M9 0L0 4V10C0 15.55 3.84 20.74 9 22C14.16 20.74 18 15.55 18 10V4L9 0ZM9 11H7V7H11V11H9Z" fill="#CBD5E1" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ③ BOTTOM: Orbita Kompas + Eksplor Jurusan */}
        <div className="grid grid-cols-12 gap-5">

          {/* Orbita Kompas */}
          <div className="col-span-12 md:col-span-7 bg-white rounded-3xl p-6 border border-slate-100" style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)" }}>
            <h2 className="text-[17px] font-bold text-slate-800" style={{ fontFamily: PP }}>{BRAND.compassName}</h2>
            <p className="text-[13px] text-slate-400 mb-4" style={{ fontFamily: PP }}>Jurusan yang sangat direkomendasikan</p>

            {/* #1 Match card */}
            <div className="px-4 py-3 rounded-2xl mb-3" style={{ background: "#eff6ff", border: "1.5px solid #dbeafe" }}>
              <p className="text-[11px] font-bold text-[#ff7f00] mb-1" style={{ fontFamily: PP }}>#1 match</p>
              <div className="flex items-center justify-between">
                <p className="text-[19px] font-bold text-slate-800" style={{ fontFamily: PP }}>Sistem informasi</p>
                <div className="flex items-center gap-1">
                  <TrendingUp size={14} className="text-[#0085ff]" />
                  <span className="text-[22px] font-black text-[#0085ff]" style={{ fontFamily: PP }}>96%</span>
                </div>
              </div>
            </div>

            {/* 2 other recs */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {[{ label: "Teknik informatika", pct: 91 }, { label: "Ilmu komputer", pct: 87 }].map(j => (
                <div key={j.label} className="px-3 py-2.5 rounded-xl" style={{ background: "#f8faff" }}>
                  <p className="text-[12px] font-semibold text-slate-700 mb-1.5" style={{ fontFamily: PP }}>{j.label}</p>
                  <div className="h-1.5 rounded-full mb-1" style={{ background: "#e2e8f0" }}>
                    <div className="h-full rounded-full bg-[#0085ff]" style={{ width: `${j.pct}%` }} />
                  </div>
                  <p className="text-[11px] font-black text-[#0085ff]" style={{ fontFamily: PP }}>{j.pct}%</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => nav("compass")}
              className="w-full py-3 rounded-2xl text-[13px] font-bold text-white hover:opacity-90 transition-all"
              style={{ background: `linear-gradient(90deg, ${BLUE}, ${CYAN})`, fontFamily: PP, outline: "none" }}
            >
              Lihat Semua Rekomendasi
            </button>
          </div>

          {/* Eksplor Jurusan */}
          <div className="col-span-12 md:col-span-5">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 h-full flex flex-col" style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)", background: "#fffbeb" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-xl" style={{ background: "#fef3c7" }}>🎯</div>
              <h3 className="text-[17px] font-bold text-slate-800" style={{ fontFamily: PP }}>Eksplor Jurusan</h3>
              <p className="text-[13px] text-slate-500 mt-1 leading-relaxed mb-6" style={{ fontFamily: PP }}>
                Yuk eksplor pilihan jurusan dan universitas impianmu.
              </p>
              <div className="flex-1" />
              <button
                onClick={() => nav("kampus")}
                className="w-full py-3.5 rounded-2xl text-[14px] font-bold text-white hover:opacity-90 transition-all"
                style={{ background: "#ff7000", fontFamily: PP, outline: "none" }}
              >
                Eksplor jurusan
              </button>
            </div>
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
