import React, { useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  Plus,
  X,
  MessageSquare,
  User,
  BookOpen,
  ChevronDown,
} from "lucide-react";

const PP = "Poppins, sans-serif";
const BLUE = "#0965fa";

export type Booking = {
  id: string;
  hari: string;
  tanggal: string;
  jam: string;
  topik: string;
  status: "selesai" | "menunggu" | "dibatalkan";
  catatanHasil?: string;
  rekomendasiGuru?: string[];
};

const TOPIK_OPTIONS = [
  "Pemilihan Jurusan",
  "Perencanaan Karir",
  "Motivasi Belajar",
  "Strategi SNBP",
  "Strategi SNBT",
  "Persiapan SKD",
  "Evaluasi Nilai Rapor",
  "Lainnya",
];

const SLOT_HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
const SLOT_JAM = [
  "08.00",
  "09.00",
  "10.00",
  "11.00",
  "13.00",
  "14.00",
  "15.00",
];

const GURU_BK = {
  nama: "Ibu Sari Dewi, S.Pd.",
  sekolah: "SMAN 1 Jakarta",
  spesialis: "Konseling Karir & Akademik",
  foto: "SD",
};

function StatusBadge({
  status,
}: {
  status: Booking["status"];
}) {
  const cfg = {
    selesai: {
      bg: "#f0fdf4",
      border: "#bbf7d0",
      text: "#15803d",
      label: "Selesai",
    },
    menunggu: {
      bg: "#eff6ff",
      border: "#bfdbfe",
      text: "#1d4ed8",
      label: "Terjadwal",
    },
    dibatalkan: {
      bg: "#fef2f2",
      border: "#fecaca",
      text: "#dc2626",
      label: "Dibatalkan",
    },
  }[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border"
      style={{
        background: cfg.bg,
        borderColor: cfg.border,
        color: cfg.text,
        fontFamily: PP,
      }}
    >
      {cfg.label}
    </span>
  );
}

function BookingCard({
  booking,
  onExpand,
  expanded,
}: {
  booking: Booking;
  onExpand: () => void;
  expanded: boolean;
}) {
  const date = new Date(booking.tanggal);
  const dateStr = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="bg-white border rounded-2xl overflow-hidden transition-all"
      style={{
        borderColor: expanded
          ? BLUE + "40"
          : "rgba(0,0,0,0.07)",
        boxShadow: expanded
          ? "0 0 0 3px " + BLUE + "10"
          : "0 1px 6px rgba(0,0,0,0.04)",
      }}
    >
      <button
        onClick={onExpand}
        className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-[#fafbff] transition-colors"
        style={{ outline: "none" }}
      >
        {/* Date icon */}
        <div
          className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 text-white"
          style={{
            background:
              booking.status === "selesai"
                ? "linear-gradient(135deg,#22c55e,#16a34a)"
                : "linear-gradient(135deg,#0965fa,#00b2dd)",
          }}
        >
          <span className="text-[10px] font-bold leading-none opacity-80">
            {booking.hari.slice(0, 3).toUpperCase()}
          </span>
          <span className="text-[18px] font-black leading-tight">
            {date.getDate()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-[14px] font-bold text-[#1a1d2e] leading-tight"
            style={{ fontFamily: PP }}
          >
            {booking.topik}
          </p>
          <div className="flex items-center gap-3 mt-1">
            <span
              className="flex items-center gap-1 text-[11px] text-[#9ca3af]"
              style={{ fontFamily: PP }}
            >
              <Calendar size={11} /> {dateStr}
            </span>
            <span
              className="flex items-center gap-1 text-[11px] text-[#9ca3af]"
              style={{ fontFamily: PP }}
            >
              <User size={11} /> {GURU_BK.nama}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <StatusBadge status={booking.status} />
          <ChevronDown
            size={15}
            className={`text-[#9ca3af] transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {expanded && booking.status === "selesai" && (
        <div className="px-5 pb-5 border-t border-[rgba(0,0,0,0.05)] bg-[#fafbff] flex flex-col gap-4 pt-4">
          {booking.catatanHasil && (
            <div>
              <p
                className="text-[12px] font-bold text-[#1a1d2e] mb-2 flex items-center gap-2"
                style={{ fontFamily: PP }}
              >
                <MessageSquare
                  size={13}
                  className="text-[#0965fa]"
                />{" "}
                Catatan Hasil Konsultasi
              </p>
              <p
                className="text-[12px] text-[#6b7280] leading-relaxed bg-white border border-[rgba(0,0,0,0.06)] rounded-xl px-4 py-3"
                style={{ fontFamily: PP }}
              >
                {booking.catatanHasil}
              </p>
            </div>
          )}
          {booking.rekomendasiGuru &&
            booking.rekomendasiGuru.length > 0 && (
              <div>
                <p
                  className="text-[12px] font-bold text-[#1a1d2e] mb-2 flex items-center gap-2"
                  style={{ fontFamily: PP }}
                >
                  <BookOpen
                    size={13}
                    className="text-[#22c55e]"
                  />{" "}
                  Rekomendasi Guru BK
                </p>
                <div className="flex flex-col gap-2">
                  {booking.rekomendasiGuru.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 bg-white border border-[rgba(0,0,0,0.06)] rounded-xl px-4 py-3"
                    >
                      <CheckCircle2
                        size={13}
                        className="text-[#22c55e] shrink-0 mt-0.5"
                      />
                      <p
                        className="text-[12px] text-[#374151] leading-relaxed"
                        style={{ fontFamily: PP }}
                      >
                        {r}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}

      {expanded && booking.status === "menunggu" && (
        <div className="px-5 pb-5 border-t border-[rgba(0,0,0,0.05)] bg-[#fafbff] pt-4">
          <div
            className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
            }}
          >
            <Clock
              size={14}
              className="text-[#1d4ed8] shrink-0"
            />
            <p
              className="text-[12px] text-[#1d4ed8] font-medium"
              style={{ fontFamily: PP }}
            >
              Sesi konsultasi dijadwalkan pada {booking.hari},{" "}
              {dateStr} pukul {booking.jam} WIB. Harap hadir
              tepat waktu.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function NewBookingModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (b: Booking) => void;
}) {
  const [hari, setHari] = useState(SLOT_HARI[0]);
  const [jam, setJam] = useState(SLOT_JAM[0]);
  const [topik, setTopik] = useState(TOPIK_OPTIONS[0]);

  function handleSave() {
    const today = new Date();
    const dayOffset =
      SLOT_HARI.indexOf(hari) - today.getDay() + 1;
    const target = new Date(today);
    target.setDate(
      today.getDate() + ((dayOffset + 7) % 7 || 7),
    );
    const tanggal = target.toISOString().slice(0, 10);
    onSave({
      id: Date.now().toString(),
      hari,
      tanggal,
      jam,
      topik,
      status: "menunggu",
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-7 pt-6 pb-5 border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between">
          <div>
            <p
              className="text-[17px] font-bold text-[#1a1d2e]"
              style={{ fontFamily: PP }}
            >
              Jadwalkan Konsultasi
            </p>
            <p
              className="text-[12px] text-[#9ca3af] mt-0.5"
              style={{ fontFamily: PP }}
            >
              Bersama {GURU_BK.nama}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#f5f6fb] flex items-center justify-center hover:bg-[#e5e7eb] transition-colors"
            style={{ outline: "none" }}
          >
            <X size={15} className="text-[#6b7280]" />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6 flex flex-col gap-5">
          {/* Topik */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[13px] font-semibold text-[#374151]"
              style={{ fontFamily: PP }}
            >
              Topik Konsultasi
            </label>
            <div className="relative">
              <select
                value={topik}
                onChange={(e) => setTopik(e.target.value)}
                className="w-full bg-[#f5f6fb] border border-[rgba(0,0,0,0.08)] rounded-xl px-4 py-2.5 text-[13px] text-[#1a1d2e] appearance-none focus:outline-none focus:ring-2 focus:border-[#0965fa] transition-all"
                style={{
                  fontFamily: PP,
                  focusRingColor: BLUE + "4d",
                }}
              >
                {TOPIK_OPTIONS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none"
              />
            </div>
          </div>

          {/* Hari */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[13px] font-semibold text-[#374151]"
              style={{ fontFamily: PP }}
            >
              Hari
            </label>
            <div className="flex gap-2">
              {SLOT_HARI.map((h) => (
                <button
                  key={h}
                  onClick={() => setHari(h)}
                  className={`flex-1 py-2 rounded-xl text-[12px] font-semibold border transition-all ${hari === h ? "text-white border-transparent" : "bg-[#f5f6fb] text-[#6b7280] border-[rgba(0,0,0,0.08)] hover:border-[#0965fa]/30"}`}
                  style={{
                    background:
                      hari === h
                        ? "linear-gradient(135deg,#0965fa,#00b2dd)"
                        : undefined,
                    fontFamily: PP,
                    outline: "none",
                  }}
                >
                  {h.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Jam */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[13px] font-semibold text-[#374151]"
              style={{ fontFamily: PP }}
            >
              Waktu
            </label>
            <div className="grid grid-cols-4 gap-2">
              {SLOT_JAM.map((j) => (
                <button
                  key={j}
                  onClick={() => setJam(j)}
                  className={`py-2 rounded-xl text-[12px] font-semibold border transition-all ${jam === j ? "text-white border-transparent" : "bg-[#f5f6fb] text-[#6b7280] border-[rgba(0,0,0,0.08)] hover:border-[#0965fa]/30"}`}
                  style={{
                    background:
                      jam === j
                        ? "linear-gradient(135deg,#0965fa,#00b2dd)"
                        : undefined,
                    fontFamily: PP,
                    outline: "none",
                  }}
                >
                  {j}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl text-[13px] font-semibold text-[#6b7280] border border-[rgba(0,0,0,0.1)] hover:bg-[#f5f6fb] transition-all"
            style={{ fontFamily: PP, outline: "none" }}
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-2xl text-[13px] font-bold text-white hover:opacity-90 transition-all"
            style={{
              background:
                "linear-gradient(135deg,#0965fa,#00b2dd)",
              fontFamily: PP,
              outline: "none",
            }}
          >
            Jadwalkan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function KonsulasiPage({
  bookings,
  onBookingCreated,
}: {
  bookings: Booking[];
  onBookingCreated: (b: Booking) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(
    null,
  );

  const past = bookings.filter((b) => b.status === "selesai");

  return (
    <div className="flex-1 overflow-y-auto bg-[#f5f6fb]">
      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Page header */}
        <div>
          <h1
            className="text-[22px] font-bold text-[#1a1d2e]"
            style={{ fontFamily: PP }}
          >
            Konsultasi Guru BK
          </h1>
          <p
            className="text-[13px] text-[#9ca3af] mt-1 leading-relaxed max-w-md"
            style={{ fontFamily: PP }}
          >
            Jadwalkan sesi bimbingan konseling untuk membantu
            perencanaan karir dan strategi masuk PTN.
          </p>
        </div>

        {/* Past */}
        {past.length > 0 && (
          <section className="flex flex-col gap-3">
            <p
              className="text-[12px] font-bold uppercase tracking-widest text-[#9ca3af]"
              style={{ fontFamily: PP }}
            ></p>
            {past.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                expanded={expandedId === b.id}
                onExpand={() =>
                  setExpandedId(
                    expandedId === b.id ? null : b.id,
                  )
                }
              />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}