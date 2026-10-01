import React, { useState } from "react";
import { RefreshCw, Plus, Check, ChevronLeft, ChevronRight, Compass, Target, AlertCircle, Bot, User } from "lucide-react";
import { BRAND } from "@/config/brand";

const PP = "Poppins, sans-serif";
const BLUE = "#0965fa";
const CYAN = "#00b2dd";

// ─── Focus Category Colors ─────────────────────────────────────────────────────
type FocusKey = "snbt" | "tka" | "kedinasan";
const FOCUS: Record<FocusKey, { label: string; emoji: string; color: string; bg: string; progress: number }> = {
  snbt:      { label: "SNBT",      emoji: "📝", color: BLUE,     bg: "#eff6ff", progress: 58 },
  tka:       { label: "TKA",       emoji: "🎯", color: "#f1ad00", bg: "#fffbeb", progress: 42 },
  kedinasan: { label: "Kedinasan", emoji: "🏛", color: "#7c3aed", bg: "#f5f3ff", progress: 31 },
};

// ─── Activity Types ────────────────────────────────────────────────────────────
type ActivitySource = "orbita" | "user";
interface Activity {
  id: number;
  focus: FocusKey | "personal";
  title: string;
  meta: string;
  cta: string;
  source: ActivitySource;
  done?: boolean;
}

// ─── Day Schedule Data ─────────────────────────────────────────────────────────
// Aug 2026: today = 24 (Monday). firstDay of month = Saturday (6).
const TODAY_DATE = 24;
const TODAY_LABEL = "Senin, 24 Agustus";
const MONTH_LABEL = "Agustus 2026";
const FIRST_DAY = 6; // Saturday
const DAYS_IN_MONTH = 31;

type DayData = {
  activities: Activity[];
  isFuture?: boolean;
};

const SCHEDULE: Record<number, DayData> = {
  4:  { activities: [
    { id: 1, focus: "snbt", title: "Latihan Penalaran Matematika", meta: "20 soal • ±20 menit", cta: "Mulai →", source: "orbita", done: true },
    { id: 2, focus: "snbt", title: "Review Pembahasan Literasi", meta: "±15 menit", cta: "Review →", source: "orbita", done: true },
    { id: 3, focus: "tka",  title: "Mini Tryout TKA", meta: "15 soal • ±25 menit", cta: "Kerjakan →", source: "orbita", done: true },
  ]},
  5:  { activities: [
    { id: 4, focus: "snbt", title: "Latihan Pengetahuan Kuantitatif", meta: "20 soal • ±20 menit", cta: "Mulai →", source: "orbita", done: true },
    { id: 5, focus: "tka",  title: "Latihan Bahasa Indonesia TKA", meta: "15 soal • ±20 menit", cta: "Mulai →", source: "orbita", done: true },
    { id: 6, focus: "tka",  title: "Review materi TKA kemarin", meta: "±10 menit", cta: "Review →", source: "orbita", done: false },
  ]},
  11: { activities: [
    { id: 7,  focus: "snbt",      title: "Latihan Penalaran Umum", meta: "20 soal • ±20 menit", cta: "Mulai →", source: "orbita", done: true },
    { id: 8,  focus: "kedinasan", title: "Guided Learning TWK", meta: "Materi: Pancasila • ±30 menit", cta: "Mulai →", source: "orbita", done: true },
    { id: 9,  focus: "tka",       title: "Mini Tryout TKA", meta: "15 soal • ±25 menit", cta: "Kerjakan →", source: "orbita", done: true },
    { id: 10, focus: "personal",  title: "Belajar bareng teman", meta: "19.00–20.00", cta: "Catat →", source: "user", done: true },
  ]},
  18: { activities: [
    { id: 11, focus: "snbt", title: "Review Tryout #4", meta: "±20 menit", cta: "Review →", source: "orbita", done: true },
    { id: 12, focus: "tka",  title: "Latihan Fisika TKA", meta: "10 soal • ±20 menit", cta: "Mulai →", source: "orbita", done: true },
  ]},
  24: { activities: [
    { id: 13, focus: "snbt", title: "Latihan Penalaran Matematika", meta: "20 soal • ±20 menit", cta: "Mulai →", source: "orbita", done: true },
    { id: 14, focus: "tka",  title: "Latihan Literasi TKA", meta: "15 soal • ±15 menit", cta: "Mulai →", source: "orbita", done: true },
    { id: 15, focus: "snbt", title: "Review hasil latihan", meta: "±10 menit", cta: "Review →", source: "orbita", done: false },
    { id: 16, focus: "tka",  title: "Mini Tryout TKA", meta: "20 soal • ±20 menit", cta: "Kerjakan →", source: "orbita", done: false },
    { id: 17, focus: "snbt", title: "Review kesalahan", meta: "±15 menit", cta: "Mulai →", source: "orbita", done: false },
  ]},
  25: { isFuture: true, activities: [
    { id: 18, focus: "snbt", title: "Latihan Penalaran Umum", meta: "20 soal • ±20 menit", cta: "Mulai →", source: "orbita" },
    { id: 19, focus: "tka",  title: "Latihan Biologi TKA", meta: "10 soal • ±20 menit", cta: "Mulai →", source: "orbita" },
    { id: 20, focus: "snbt", title: "Review Literasi Indonesia", meta: "±15 menit", cta: "Review →", source: "orbita" },
  ]},
  26: { isFuture: true, activities: [
    { id: 21, focus: "tka",  title: "Mini Tryout TKA", meta: "20 soal • ±25 menit", cta: "Kerjakan →", source: "orbita" },
    { id: 22, focus: "snbt", title: "Latihan Pengetahuan Kuantitatif", meta: "15 soal • ±20 menit", cta: "Mulai →", source: "orbita" },
  ]},
  27: { isFuture: true, activities: [] },
  28: { isFuture: true, activities: [
    { id: 23, focus: "snbt", title: "Tryout SNBT Lengkap", meta: "120 menit", cta: "Kerjakan →", source: "orbita" },
  ]},
};

// Which days have activities (for calendar dot rendering)
function getDayFocuses(day: number): (FocusKey | "personal")[] {
  const d = SCHEDULE[day];
  if (!d) return [];
  const seen = new Set<FocusKey | "personal">();
  d.activities.forEach(a => seen.add(a.focus));
  return Array.from(seen);
}

const FOCUS_COLORS: Record<FocusKey | "personal", string> = {
  snbt: BLUE,
  tka: "#f1ad00",
  kedinasan: "#7c3aed",
  personal: "#22c55e",
};

// ─── Re-plan Modal ─────────────────────────────────────────────────────────────
function ReplanModal({ selectedFocus, onClose, onApply }: {
  selectedFocus: Set<FocusKey>;
  onClose: () => void;
  onApply: (days: string[], freq: number, focus: Set<FocusKey>) => void;
}) {
  const DAYS_OPTIONS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const [freq, setFreq] = useState(4);
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set(["Senin", "Rabu", "Jumat", "Minggu"]));
  const [focus, setFocus] = useState<Set<FocusKey>>(new Set(selectedFocus));

  function toggleDay(d: string) {
    setSelectedDays(prev => {
      const next = new Set(prev);
      if (next.has(d)) { if (next.size > 1) next.delete(d); }
      else next.add(d);
      return next;
    });
  }

  function toggleFocus(f: FocusKey) {
    setFocus(prev => {
      const next = new Set(prev);
      if (next.has(f)) { if (next.size > 1) next.delete(f); }
      else if (next.size < 2) next.add(f);
      return next;
    });
  }

  const dayList = DAYS_OPTIONS.filter(d => selectedDays.has(d));
  const focusList = (Object.keys(FOCUS) as FocusKey[]).filter(f => focus.has(f)).map(f => FOCUS[f].label).join(" + ");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[420px] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-7 pt-7 pb-2">
          <h2 className="text-[20px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>🔄 Atur ulang jadwalmu</h2>
          <p className="text-[13px] text-[#6b7280] mt-0.5" style={{ fontFamily: PP }}>Sesuaikan ritme belajarmu minggu ini</p>
        </div>
        <div className="px-7 py-5 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">
          {/* Frequency */}
          <div>
            <p className="text-[12px] font-bold text-[#374151] uppercase tracking-widest mb-3" style={{ fontFamily: PP }}>Frekuensi Belajar</p>
            <div className="flex items-center gap-4">
              <button onClick={() => setFreq(f => Math.max(1, f - 1))}
                className="w-10 h-10 rounded-xl border-2 border-[rgba(0,0,0,0.1)] flex items-center justify-center text-[18px] font-bold text-[#374151] hover:border-[#0965fa] hover:text-[#0965fa] transition-all"
                style={{ outline: "none" }}>−</button>
              <div className="flex-1 text-center">
                <span className="text-[28px] font-black" style={{ color: BLUE, fontFamily: PP }}>{freq}</span>
                <span className="text-[14px] text-[#9ca3af] ml-2" style={{ fontFamily: PP }}>× seminggu</span>
              </div>
              <button onClick={() => setFreq(f => Math.min(7, f + 1))}
                className="w-10 h-10 rounded-xl border-2 border-[rgba(0,0,0,0.1)] flex items-center justify-center text-[18px] font-bold text-[#374151] hover:border-[#0965fa] hover:text-[#0965fa] transition-all"
                style={{ outline: "none" }}>+</button>
            </div>
          </div>

          {/* Days */}
          <div>
            <p className="text-[12px] font-bold text-[#374151] uppercase tracking-widest mb-3" style={{ fontFamily: PP }}>Pilih Hari Belajar</p>
            <div className="grid grid-cols-4 gap-2">
              {DAYS_OPTIONS.map(d => {
                const on = selectedDays.has(d);
                return (
                  <button key={d} onClick={() => toggleDay(d)}
                    className={`py-2 rounded-xl text-[12px] font-semibold transition-all border-2 ${on ? "text-white border-transparent" : "border-[rgba(0,0,0,0.08)] text-[#374151] hover:border-[#0965fa]/30"}`}
                    style={{ background: on ? `linear-gradient(135deg,${BLUE},${CYAN})` : undefined, fontFamily: PP, outline: "none" }}>
                    {d.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Focus */}
          <div>
            <p className="text-[12px] font-bold text-[#374151] uppercase tracking-widest mb-3" style={{ fontFamily: PP }}>Fokus</p>
            <div className="flex flex-col gap-2">
              {(Object.keys(FOCUS) as FocusKey[]).map(f => {
                const on = focus.has(f);
                const meta = FOCUS[f];
                return (
                  <button key={f} onClick={() => toggleFocus(f)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${on ? "border-transparent" : "border-[rgba(0,0,0,0.08)] hover:border-[#0965fa]/20"}`}
                    style={{ background: on ? meta.color + "18" : undefined, outline: "none" }}>
                    <span className="text-lg">{meta.emoji}</span>
                    <span className="flex-1 text-[13px] font-semibold text-left" style={{ color: on ? meta.color : "#374151", fontFamily: PP }}>{meta.label}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${on ? "border-transparent" : "border-[#d1d5db]"}`}
                      style={{ background: on ? meta.color : undefined }}>
                      {on && <Check size={11} className="text-white" strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-[#f8fafc] rounded-2xl px-4 py-3.5 border border-[rgba(0,0,0,0.06)]">
            <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest mb-1.5" style={{ fontFamily: PP }}>Preview</p>
            <p className="text-[13px] font-semibold text-[#1a1d2e]" style={{ fontFamily: PP }}>
              {freq}× belajar • {dayList.join(", ")}
            </p>
            <p className="text-[12px] text-[#6b7280] mt-0.5" style={{ fontFamily: PP }}>Fokus: {focusList}</p>
          </div>
        </div>

        <div className="px-7 pb-7 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-2xl border text-[13px] font-semibold text-[#6b7280] hover:bg-[#f5f6fb] transition-colors"
            style={{ fontFamily: PP, outline: "none" }}>Batal</button>
          <button onClick={() => { onApply(dayList, freq, focus); onClose(); }}
            className="flex-1 py-3 rounded-2xl text-[13px] font-bold text-white hover:opacity-90 transition-all"
            style={{ background: `linear-gradient(90deg,${BLUE},${CYAN})`, fontFamily: PP, outline: "none" }}>
            Terapkan Jadwal
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Activity Modal ────────────────────────────────────────────────────────
function AddActivityModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("30");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[380px]" onClick={e => e.stopPropagation()}>
        <div className="px-7 pt-7 pb-6">
          <h3 className="text-[18px] font-bold text-[#1a1d2e] mb-1" style={{ fontFamily: PP }}>+ Buat Aktivitas</h3>
          <p className="text-[12px] text-[#9ca3af] mb-5" style={{ fontFamily: PP }}>Tambahkan agenda belajarmu sendiri</p>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[12px] font-semibold text-[#374151] mb-1.5 block" style={{ fontFamily: PP }}>Nama Aktivitas</label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Contoh: Belajar bareng teman..."
                className="w-full bg-[#f5f6fb] border border-[rgba(0,0,0,0.08)] rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0965fa]/30 focus:border-[#0965fa] transition-all"
                style={{ fontFamily: PP }} />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#374151] mb-1.5 block" style={{ fontFamily: PP }}>Waktu / Durasi</label>
              <input value={duration} onChange={e => setDuration(e.target.value)}
                placeholder="Contoh: 19.00–20.00 atau 30 menit"
                className="w-full bg-[#f5f6fb] border border-[rgba(0,0,0,0.08)] rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0965fa]/30 focus:border-[#0965fa] transition-all"
                style={{ fontFamily: PP }} />
            </div>
            <div className="flex gap-3 mt-1">
              <button onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border text-[13px] font-semibold text-[#6b7280] hover:bg-[#f5f6fb] transition-colors"
                style={{ fontFamily: PP, outline: "none" }}>Batal</button>
              <button onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white hover:opacity-90 transition-all"
                style={{ background: `linear-gradient(90deg,${BLUE},${CYAN})`, fontFamily: PP, outline: "none" }}>
                Tambahkan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Monthly Calendar ─────────────────────────────────────────────────────────
function MonthlyCalendar({ selectedDay, onSelect }: {
  selectedDay: number;
  onSelect: (d: number) => void;
}) {
  const cells: (number | null)[] = [
    ...Array(FIRST_DAY).fill(null),
    ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
  ];
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div>
      <div className="grid grid-cols-7 mb-1">
        {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-[#9ca3af] py-1.5" style={{ fontFamily: PP }}>{d}</div>
        ))}
      </div>
      <div>
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((day, di) => {
              if (!day) return <div key={di} className="h-[52px]" />;
              const isToday = day === TODAY_DATE;
              const isSel = day === selectedDay;
              const isPast = day < TODAY_DATE;
              const isFuture = day > TODAY_DATE;
              const focuses = getDayFocuses(day);
              const hasData = focuses.length > 0;

              return (
                <button
                  key={di}
                  onClick={() => onSelect(day)}
                  className={`h-[52px] flex flex-col items-center justify-start pt-1.5 rounded-xl transition-all mx-0.5 mb-0.5
                    ${isSel ? "shadow-sm" : "hover:bg-[#f3f4f6]"}
                    ${isFuture && !hasData ? "opacity-40" : ""}
                  `}
                  style={{
                    background: isSel ? (isToday ? BLUE : "#f0f2f8") : isToday ? "#eff6ff" : undefined,
                    outline: "none",
                  }}
                >
                  <span className={`text-[12px] font-bold leading-none mb-1 ${isSel && isToday ? "text-white" : isToday ? "text-[#0965fa]" : isSel ? "#1a1d2e" : isPast && hasData ? "text-[#374151]" : "text-[#374151]"}`}
                    style={{ fontFamily: PP, color: isSel && isToday ? "white" : isSel ? "#1a1d2e" : undefined }}>
                    {day}
                  </span>
                  {/* Color dots */}
                  <div className="flex gap-0.5 flex-wrap justify-center px-1">
                    {focuses.slice(0, 3).map((f, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: FOCUS_COLORS[f], opacity: isSel && isToday ? 0.7 : 1 }} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Schedule Panel ────────────────────────────────────────────────────────────
function SchedulePanel({ day, dayLabel, data, onAddActivity, selectedFocus, todayDoneCount }: {
  day: number;
  dayLabel: string;
  data: DayData | undefined;
  onAddActivity: () => void;
  selectedFocus: Set<FocusKey>;
  todayDoneCount: number;
}) {
  const [filter, setFilter] = useState<FocusKey | "all">("all");
  const [taskDone, setTaskDone] = useState<Set<number>>(new Set());

  const isToday = day === TODAY_DATE;
  const isFuture = day > TODAY_DATE;

  const activities = data?.activities ?? [];
  const todayMandatoryDone = !isToday || todayDoneCount >= 2; // simplified: ≥2 = can start future

  const filtered = filter === "all" ? activities : activities.filter(a => a.focus === filter);

  // Separate ORBITA vs user activities
  const orbitaActs = filtered.filter(a => a.source === "orbita");
  const userActs = filtered.filter(a => a.source === "user");

  const allDone = activities.length > 0 && activities.every(a => a.done || taskDone.has(a.id));
  const completedCount = activities.filter(a => a.done || taskDone.has(a.id)).length;
  const pct = activities.length > 0 ? Math.round((completedCount / activities.length) * 100) : 0;

  function toggleDone(id: number) {
    if (isFuture) return;
    setTaskDone(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function getDayLabel() {
    if (isToday) return `📅 ${dayLabel} (Hari Ini)`;
    if (isFuture) return `📅 ${day} Agustus 2026`;
    return `📅 ${day} Agustus 2026`;
  }

  const FOCUS_DAYS: Record<number, string> = {
    4: "Selasa, 4 Agustus", 5: "Rabu, 5 Agustus", 11: "Selasa, 11 Agustus",
    18: "Selasa, 18 Agustus", 24: "Senin, 24 Agustus",
    25: "Selasa, 25 Agustus", 26: "Rabu, 26 Agustus", 27: "Kamis, 27 Agustus",
    28: "Jumat, 28 Agustus",
  };

  const displayLabel = isToday ? `${dayLabel} (Hari Ini)` : (FOCUS_DAYS[day] ?? `${day} Agustus 2026`);

  return (
    <div className="flex flex-col gap-4">
      {/* Date header */}
      <div>
        <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest mb-0.5" style={{ fontFamily: PP }}>
          {isToday ? "Hari ini" : isFuture ? "Rencana" : "Riwayat"}
        </p>
        <h3 className="text-[17px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>{displayLabel}</h3>
      </div>

      {/* Unfinished alert (today only) */}
      {isToday && activities.filter(a => !a.done).some(a => a.id === 6) && (
        <div className="flex items-start gap-3 bg-[#fffbeb] border border-[#fde68a] rounded-2xl px-4 py-3">
          <AlertCircle size={15} className="text-[#d97706] shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-[12px] font-bold text-[#92400e]" style={{ fontFamily: PP }}>Masih ada yang belum selesai 👀</p>
            <p className="text-[11px] text-[#a16207] mt-0.5" style={{ fontFamily: PP }}>Review materi TKA kemarin belum selesai</p>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button className="text-[10px] font-bold px-2 py-1 rounded-lg border border-[#fde68a] text-[#92400e] hover:bg-[#fef3c7] transition-colors" style={{ outline: "none" }}>Lewati</button>
            <button className="text-[10px] font-bold px-2 py-1 rounded-lg text-white" style={{ background: "#d97706", outline: "none" }}>Lanjutkan</button>
          </div>
        </div>
      )}

      {/* Progress (today or past with data) */}
      {activities.length > 0 && (
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>
                {isFuture ? "Rencana Aktivitas" : "Target Hari Ini 🎯"}
              </p>
              <p className="text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>
                {isFuture ? `${activities.length} aktivitas direncanakan` : `${completedCount} / ${activities.length} selesai`}
              </p>
            </div>
            {!isFuture && (
              <svg width="42" height="42" viewBox="0 0 42 42">
                <circle cx="21" cy="21" r="16" fill="none" stroke="#f1f5f9" strokeWidth="4.5" />
                <circle cx="21" cy="21" r="16" fill="none" stroke={BLUE} strokeWidth="4.5"
                  strokeDasharray={`${(pct / 100) * 2 * Math.PI * 16} ${2 * Math.PI * 16}`}
                  strokeLinecap="round" transform="rotate(-90 21 21)" style={{ transition: "stroke-dasharray 0.5s" }} />
                <text x="21" y="25" textAnchor="middle" fontSize="9" fontWeight="700" fill={BLUE} fontFamily={PP}>{pct}%</text>
              </svg>
            )}
          </div>
          {!isFuture && (
            <div className="h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: `linear-gradient(90deg,${BLUE},${CYAN})` }} />
            </div>
          )}
        </div>
      )}

      {/* Filter chips */}
      {activities.length > 0 && (
        <div className="flex gap-1.5">
          {(["all", ...Array.from(selectedFocus)] as (FocusKey | "all")[]).map(f => {
            const on = filter === f;
            const meta = f !== "all" ? FOCUS[f] : null;
            return (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all border ${on ? "border-transparent text-white" : "border-[rgba(0,0,0,0.08)] text-[#374151] hover:border-[#0965fa]/20"}`}
                style={{ background: on ? (meta ? meta.color : BLUE) : undefined, fontFamily: PP, outline: "none" }}>
                {f === "all" ? "Semua" : FOCUS[f].label}
              </button>
            );
          })}
        </div>
      )}

      {/* Activity list */}
      {activities.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
          <div className="text-3xl mb-2">😌</div>
          <p className="text-[13px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>Tidak ada aktivitas</p>
          <p className="text-[12px] text-[#9ca3af] mt-0.5" style={{ fontFamily: PP }}>Hari istirahat — atau tambahkan aktivitasmu sendiri</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* ORBITA recommendations */}
          {orbitaActs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Bot size={12} className="text-[#9ca3af]" />
                <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest" style={{ fontFamily: PP }}>{BRAND.name} Recommendation</p>
              </div>
              <div className="flex flex-col gap-2">
                {orbitaActs.map(act => {
                  const fcolor = FOCUS_COLORS[act.focus];
                  const isDone = act.done || taskDone.has(act.id);
                  return (
                    <div key={act.id}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${isDone ? "opacity-60" : ""}`}
                      style={{ background: fcolor + "08", borderColor: fcolor + "20" }}>
                      {!isFuture && (
                        <button onClick={() => toggleDone(act.id)}
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${isDone ? "border-transparent" : "border-[#d1d5db]"}`}
                          style={{ background: isDone ? fcolor : undefined, outline: "none" }}>
                          {isDone && <Check size={10} className="text-white" strokeWidth={3} />}
                        </button>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: fcolor }} />
                          <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: fcolor, fontFamily: PP }}>
                            {act.focus === "personal" ? "Personal" : FOCUS[act.focus as FocusKey]?.label}
                          </span>
                        </div>
                        <p className={`text-[12px] font-semibold leading-tight ${isDone ? "line-through text-[#9ca3af]" : "text-[#1a1d2e]"}`} style={{ fontFamily: PP }}>{act.title}</p>
                        <p className="text-[10px] text-[#9ca3af] mt-0.5" style={{ fontFamily: PP }}>{act.meta}</p>
                      </div>
                      {!isFuture && !isDone && (
                        <button className="shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-xl text-white hover:opacity-90 transition-all"
                          style={{ background: fcolor, fontFamily: PP, outline: "none" }}>
                          {act.cta}
                        </button>
                      )}
                      {isFuture && (
                        <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                          <span className="text-[#9ca3af] text-[14px]">🔒</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* User activities */}
          {userActs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 mt-1">
                <User size={12} className="text-[#9ca3af]" />
                <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest" style={{ fontFamily: PP }}>My Activity</p>
              </div>
              <div className="flex flex-col gap-2">
                {userActs.map(act => {
                  const isDone = act.done || taskDone.has(act.id);
                  return (
                    <div key={act.id}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border border-[#bbf7d0] transition-all ${isDone ? "opacity-60" : ""}`}
                      style={{ background: "#f0fdf4" }}>
                      {!isFuture && (
                        <button onClick={() => toggleDone(act.id)}
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${isDone ? "border-transparent bg-[#22c55e]" : "border-[#d1d5db]"}`}
                          style={{ outline: "none" }}>
                          {isDone && <Check size={10} className="text-white" strokeWidth={3} />}
                        </button>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <div className="w-2 h-2 rounded-full bg-[#22c55e] shrink-0" />
                          <span className="text-[9px] font-bold uppercase tracking-wide text-[#16a34a]" style={{ fontFamily: PP }}>Personal</span>
                        </div>
                        <p className={`text-[12px] font-semibold ${isDone ? "line-through text-[#9ca3af]" : "text-[#1a1d2e]"}`} style={{ fontFamily: PP }}>{act.title}</p>
                        <p className="text-[10px] text-[#9ca3af] mt-0.5" style={{ fontFamily: PP }}>{act.meta}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* All done celebration */}
      {!isFuture && allDone && activities.length > 0 && (
        <div className="bg-gradient-to-r from-[#f0fdf4] to-[#dcfce7] rounded-2xl border border-[#bbf7d0] px-4 py-3 text-center">
          <p className="text-[14px] font-bold text-[#15803d]" style={{ fontFamily: PP }}>🔥 Nice! Hari ini beres.</p>
          <p className="text-[11px] text-[#16a34a] mt-0.5" style={{ fontFamily: PP }}>✓ {activities.length}/{activities.length} aktivitas selesai</p>
        </div>
      )}

      {/* Add activity button */}
      <button onClick={onAddActivity}
        className="flex items-center justify-center gap-2 py-2.5 rounded-2xl border-2 border-dashed border-[rgba(0,0,0,0.1)] text-[12px] font-semibold text-[#9ca3af] hover:border-[#0965fa]/30 hover:text-[#0965fa] hover:bg-[#eff6ff]/30 transition-all"
        style={{ fontFamily: PP, outline: "none" }}>
        <Plus size={13} /> Buat Aktivitas
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ActionPlanPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [selectedFocus, setSelectedFocus] = useState<Set<FocusKey>>(new Set(["snbt", "tka"]));
  const [selectedDay, setSelectedDay] = useState<number>(TODAY_DATE);
  const [showReplan, setShowReplan] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [todayDoneCount] = useState(2); // mock: 2 of today's tasks done

  function toggleFocus(f: FocusKey) {
    setSelectedFocus(prev => {
      const next = new Set(prev);
      if (next.has(f)) { if (next.size > 1) next.delete(f); }
      else if (next.size < 2) next.add(f);
      return next;
    });
  }

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "#f5f6fb", fontFamily: PP }}>
      {showReplan && (
        <ReplanModal selectedFocus={selectedFocus} onClose={() => setShowReplan(false)} onApply={(_, __, focus) => setSelectedFocus(focus)} />
      )}
      {showAddActivity && <AddActivityModal onClose={() => setShowAddActivity(false)} />}

      {/* Page header */}
      <div className="bg-white border-b border-slate-100 px-8 py-5 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[12px] text-slate-400">Dashboard</span>
              <span className="text-[12px] text-slate-400">/</span>
              <span className="text-[12px] font-medium" style={{ color: BLUE }}>Action Plan</span>
            </div>
            <h1 className="text-[22px] font-bold text-[#1a1d2e]">Action Plan</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">Atur langkahmu, kejar targetmu. 🚀</p>
          </div>
          {/* Orbita Compass nudge */}
          <button
            onClick={() => onNavigate?.("compass")}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl border border-[rgba(9,101,250,0.2)] text-[12px] font-semibold hover:bg-[#eff6ff] transition-colors"
            style={{ color: BLUE, outline: "none" }}
          >
            <Compass size={14} /> Cek {BRAND.compassName}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col gap-5">

        {/* Focus Section */}
        <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Target size={16} style={{ color: BLUE }} />
                <h2 className="text-[15px] font-bold text-[#1a1d2e]">Fokus Minggu Ini</h2>
              </div>
              <p className="text-[12px] text-[#9ca3af]">Mau fokus ke mana minggu ini? 👀 Pilih maksimal 2 biar belajarnya lebih terarah.</p>
            </div>
            <button onClick={() => setShowReplan(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold border border-[rgba(9,101,250,0.2)] hover:bg-[#eff6ff] transition-colors shrink-0 ml-3"
              style={{ color: BLUE, outline: "none" }}>
              <RefreshCw size={12} /> Re-plan
            </button>
          </div>

          {/* Focus chips */}
          <div className="flex gap-3 mb-4">
            {(Object.keys(FOCUS) as FocusKey[]).map(f => {
              const on = selectedFocus.has(f);
              const meta = FOCUS[f];
              return (
                <button key={f} onClick={() => toggleFocus(f)}
                  className={`flex flex-col items-start px-4 py-3 rounded-2xl border-2 transition-all min-w-[100px] ${on ? "border-transparent shadow-sm" : "border-[rgba(0,0,0,0.08)] hover:border-[#0965fa]/30"}`}
                  style={{ background: on ? meta.color + "14" : undefined, outline: "none" }}>
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-[14px]">{meta.emoji}</span>
                    <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all ${on ? "border-transparent" : "border-[#d1d5db]"}`}
                      style={{ background: on ? meta.color : undefined, width: 18, height: 18 }}>
                      {on && <Check size={10} className="text-white" strokeWidth={3} />}
                    </div>
                  </div>
                  <p className="text-[12px] font-bold" style={{ color: on ? meta.color : "#374151", fontFamily: PP }}>{meta.label}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: on ? meta.color + "aa" : "#9ca3af", fontFamily: PP }}>Progress {meta.progress}%</p>
                  <div className="w-full h-1 rounded-full mt-1.5" style={{ background: "rgba(0,0,0,0.08)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${meta.progress}%`, background: meta.color }} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Weekly progress strip */}
          <div className="bg-[#f8fafc] rounded-2xl px-4 py-3 flex items-center gap-6 border border-[rgba(0,0,0,0.05)]">
            <div className="text-center">
              <p className="text-[16px] font-black text-[#1a1d2e]">4<span className="text-[11px] font-normal text-[#9ca3af]">/5</span></p>
              <p className="text-[10px] text-[#9ca3af]">hari belajar</p>
            </div>
            <div className="w-px h-8 bg-[rgba(0,0,0,0.06)]" />
            <div className="text-center">
              <p className="text-[16px] font-black text-[#1a1d2e]">12</p>
              <p className="text-[10px] text-[#9ca3af]">aktivitas</p>
            </div>
            <div className="w-px h-8 bg-[rgba(0,0,0,0.06)]" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] text-[#9ca3af]">Minggu ini</p>
                <p className="text-[11px] font-bold" style={{ color: BLUE }}>78% selesai</p>
              </div>
              <div className="h-1.5 bg-[rgba(0,0,0,0.08)] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: "78%", background: `linear-gradient(90deg,${BLUE},${CYAN})` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Calendar + Schedule */}
        <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 320px" }}>

          {/* Left: Calendar */}
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-3">
                <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" style={{ outline: "none" }}>
                  <ChevronLeft size={15} className="text-slate-400" />
                </button>
                <span className="flex-1 text-center text-[15px] font-bold text-[#1a1d2e]">{MONTH_LABEL}</span>
                <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" style={{ outline: "none" }}>
                  <ChevronRight size={15} className="text-slate-400" />
                </button>
              </div>
              {/* Legend */}
              <div className="flex items-center gap-4 mt-3">
                {(Object.keys(FOCUS) as FocusKey[]).map(f => (
                  <div key={f} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: FOCUS_COLORS[f] }} />
                    <span className="text-[10px] text-[#9ca3af]">{FOCUS[f].label}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
                  <span className="text-[10px] text-[#9ca3af]">Personal</span>
                </div>
              </div>
            </div>
            <div className="px-3 py-3">
              <MonthlyCalendar selectedDay={selectedDay} onSelect={setSelectedDay} />
            </div>
          </div>

          {/* Right: Schedule */}
          <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5 overflow-y-auto" style={{ maxHeight: 560 }}>
            <SchedulePanel
              day={selectedDay}
              dayLabel={TODAY_LABEL}
              data={SCHEDULE[selectedDay]}
              onAddActivity={() => setShowAddActivity(true)}
              selectedFocus={selectedFocus}
              todayDoneCount={todayDoneCount}
            />
          </div>
        </div>

        {/* Monthly Target */}
        <div>
          <h2 className="text-[14px] font-bold text-[#1a1d2e] mb-3">Target Bulan Ini</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Tryout Lengkap", cur: 2, max: 4, color: BLUE },
              { label: "Latihan Soal", cur: 18, max: 30, color: "#7c3aed" },
              { label: "Guided Learning", cur: 12, max: 20, color: "#0d9488" },
              { label: "Review Materi", cur: 8, max: 12, color: "#ff7000" },
            ].map((m, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm p-4">
                <p className="text-[11px] text-slate-500 mb-1.5">{m.label}</p>
                <p className="text-[18px] font-bold text-[#1a1d2e] mb-2">{m.cur}<span className="text-[12px] text-slate-400 font-normal">/{m.max}</span></p>
                <div className="h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.round((m.cur / m.max) * 100)}%`, background: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
