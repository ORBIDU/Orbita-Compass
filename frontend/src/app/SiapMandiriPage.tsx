import React, { useState } from "react";
import { ChevronRight, BookOpen, Clock, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";

const PP = "Poppins, sans-serif";
const BLUE = "#0965fa";
const CYAN = "#00b2dd";

const KAMPUS_LIST = [
  { name: "Universitas Indonesia", program: "Sistem Informasi", status: "Terdaftar", deadline: "15 Sep 2026", fee: "Rp 500.000" },
  { name: "ITB", program: "Teknik Informatika", status: "Daftar", deadline: "20 Sep 2026", fee: "Rp 350.000" },
  { name: "UGM", program: "Ilmu Komputer", status: "Daftar", deadline: "25 Sep 2026", fee: "Rp 250.000" },
];

const MATERI_LIST = [
  { code: "TPA", label: "Tes Potensi Akademik", desc: "Logika, verbal, kuantitatif", pct: 65, color: "#0965fa" },
  { code: "IPA", label: "Sains & Teknologi", desc: "Fisika, Kimia, Biologi, Matematika", pct: 52, color: "#7c3aed" },
  { code: "WW", label: "Wawasan Kebangsaan", desc: "Kewarganegaraan, sejarah, budaya", pct: 78, color: "#0d9488" },
];

type Props = { onNavigate?: (page: string) => void };

export default function SiapMandiriPage({ onNavigate }: Props) {
  const [activeKampus, setActiveKampus] = useState(0);

  function nav(p: string) { onNavigate?.(p); }

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "#f5f6fb" }}>
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-8 py-5 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[12px] text-slate-400" style={{ fontFamily: PP }}>Tryout</span>
            <span className="text-[12px] text-slate-400">/</span>
            <span className="text-[12px] font-medium text-[#0965fa]" style={{ fontFamily: PP }}>Siap Mandiri</span>
          </div>
          <h1 className="text-[22px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>🚀 Siap Mandiri</h1>
          <p className="text-[13px] text-slate-500 mt-0.5" style={{ fontFamily: PP }}>Persiapan ujian mandiri kampus impianmu</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 flex flex-col gap-5">

        {/* Summary banner */}
        <div className="rounded-3xl p-6 text-white" style={{ background: `linear-gradient(135deg, ${BLUE}, ${CYAN})` }}>
          <p className="text-[12px] font-semibold text-white/70 uppercase tracking-widest mb-3" style={{ fontFamily: PP }}>STATUS PERSIAPAN</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { val: "1", label: "Kampus Terdaftar" },
              { val: "52%", label: "Rata-rata Kesiapan" },
              { val: "38", label: "Hari Tersisa" },
            ].map((s, i) => (
              <div key={i} className="text-center px-3 py-2 rounded-2xl" style={{ background: "rgba(255,255,255,0.15)" }}>
                <p className="text-[22px] font-black text-white leading-none" style={{ fontFamily: PP }}>{s.val}</p>
                <p className="text-[10px] text-white/70 mt-1" style={{ fontFamily: PP }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Kampus targets */}
        <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-slate-50">
            <h2 className="text-[15px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Target Kampus Mandiri</h2>
            <p className="text-[12px] text-slate-400 mt-0.5" style={{ fontFamily: PP }}>Pantau ujian mandiri kampus pilihanmu</p>
          </div>
          <div className="divide-y divide-slate-50">
            {KAMPUS_LIST.map((k, i) => (
              <div
                key={i}
                className={`px-6 py-4 flex items-center gap-4 cursor-pointer transition-colors ${activeKampus === i ? "bg-blue-50" : "hover:bg-slate-50"}`}
                onClick={() => setActiveKampus(i)}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-[13px] font-black text-white" style={{ background: `linear-gradient(135deg,${BLUE},${CYAN})` }}>
                  {k.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#1a1d2e] truncate" style={{ fontFamily: PP }}>{k.name}</p>
                  <p className="text-[11px] text-slate-400" style={{ fontFamily: PP }}>{k.program}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${k.status === "Terdaftar" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-[#0965fa]"}`} style={{ fontFamily: PP }}>
                    {k.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5" style={{ fontFamily: PP }}>Deadline: {k.deadline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Materi latihan */}
        <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
          <h2 className="text-[15px] font-bold text-[#1a1d2e] mb-1" style={{ fontFamily: PP }}>Latihan Materi</h2>
          <p className="text-[12px] text-slate-400 mb-5" style={{ fontFamily: PP }}>Latihan soal ujian mandiri berdasarkan pola soal kampus tujuan</p>
          <div className="flex flex-col gap-3">
            {MATERI_LIST.map((m, i) => (
              <div key={i} className="rounded-2xl border p-4" style={{ borderColor: `${m.color}25`, background: `${m.color}08` }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold text-white mb-1.5" style={{ background: m.color, fontFamily: PP }}>{m.code}</span>
                    <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>{m.label}</p>
                    <p className="text-[11px] text-slate-500" style={{ fontFamily: PP }}>{m.desc}</p>
                  </div>
                  <span className="text-[18px] font-black" style={{ color: m.color, fontFamily: PP }}>{m.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full mb-3" style={{ background: "rgba(0,0,0,0.06)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${m.pct}%`, background: m.color }} />
                </div>
                <button
                  className="w-full py-2 rounded-xl text-[12px] font-bold text-white hover:opacity-90 transition-all"
                  style={{ background: m.color, fontFamily: PP, outline: "none" }}
                >
                  Mulai Latihan →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tips section */}
        <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-6">
          <h2 className="text-[15px] font-bold text-[#1a1d2e] mb-4" style={{ fontFamily: PP }}>💡 Tips Ujian Mandiri</h2>
          <div className="flex flex-col gap-3">
            {[
              "Pelajari pola soal ujian mandiri tiap kampus — setiap kampus punya karakteristik tersendiri.",
              "Fokus pada TPA (Tes Potensi Akademik) karena biasanya bobot penilaiannya paling tinggi.",
              "Cek syarat nilai rapor dan administrasi pendaftaran masing-masing kampus.",
              "Daftarkan diri lebih awal untuk mendapat nomor peserta dan mempersiapkan tempat ujian.",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 size={15} className="text-[#0965fa] shrink-0 mt-0.5" />
                <p className="text-[12px] text-[#374151] leading-relaxed" style={{ fontFamily: PP }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
