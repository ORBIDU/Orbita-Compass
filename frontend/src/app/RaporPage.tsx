import React, { useState } from "react";
import {
  Calendar, Check, CheckCircle2, Download, FileText, Target, TrendingDown, TrendingUp,
  ChevronRight, ChevronDown, ChevronUp, Info, Sparkles, Zap, BookOpen,
} from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

const PP = "Poppins, sans-serif";

const MATA_PELAJARAN = [
  { key: "b_indo",     label: "Bhs. Indonesia", color: "#f1ad00" },
  { key: "matematika", label: "Matematika",     color: "#0965fa" },
  { key: "fisika",     label: "Fisika",         color: "#00b2dd" },
  { key: "kimia",      label: "Kimia",          color: "#8b5cf6" },
  { key: "biologi",    label: "Biologi",        color: "#22c55e" },
  { key: "b_ing",      label: "Bhs. Inggris",   color: "#ff7000" },
];

interface MapelGrade {
  key: string; no: number; label: string; kkm: number;
  nilaiP: number; predP: string; deskP: string;
  nilaiK: number; predK: string; deskK: string;
}
interface KelompokData { label: string; mapel: MapelGrade[]; }
interface SemData { label: string; tahun: string; kelas: string; kelompok: KelompokData[]; }

function calcPred(n: number): string {
  return n >= 93 ? "A" : n >= 85 ? "A-" : n >= 77 ? "B+" : n >= 70 ? "B" : n >= 62 ? "B-" : "C+";
}

const RAPOR: Record<number, SemData> = {
  1: { label: "Semester 1", tahun: "2022/2023", kelas: "X MIPA 2", kelompok: [
    { label: "Kelompok A (Umum)", mapel: [
      { key:"agama",  no:1, label:"Pendidikan Agama dan Budi Pekerti", kkm:75, nilaiP:86, predP:calcPred(86), deskP:"Memahami konsep ibadah dengan baik.", nilaiK:85, predK:calcPred(85), deskK:"Mampu menerapkan nilai akhlak dalam keseharian." },
      { key:"ppkn",   no:2, label:"Pendidikan Pancasila dan Kewarganegaraan", kkm:75, nilaiP:82, predP:calcPred(82), deskP:"Memahami sistem ketatanegaraan RI.", nilaiK:80, predK:calcPred(80), deskK:"Aktif dalam diskusi kewarganegaraan." },
      { key:"b_indo", no:3, label:"Bahasa Indonesia", kkm:75, nilaiP:84, predP:calcPred(84), deskP:"Baik dalam memahami teks akademik.", nilaiK:83, predK:calcPred(83), deskK:"Mampu menulis karangan ilmiah sederhana." },
      { key:"matematika",no:4,label:"Matematika", kkm:75, nilaiP:88, predP:calcPred(88), deskP:"Sangat baik dalam aljabar dan fungsi.", nilaiK:87, predK:calcPred(87), deskK:"Terampil menyelesaikan soal bertahap." },
      { key:"sejarah_ind",no:5,label:"Sejarah Indonesia", kkm:75, nilaiP:78, predP:calcPred(78), deskP:"Memahami periodisasi sejarah nasional.", nilaiK:77, predK:calcPred(77), deskK:"Mampu menganalisis peristiwa sejarah." },
      { key:"b_ing",  no:6, label:"Bahasa Inggris", kkm:75, nilaiP:81, predP:calcPred(81), deskP:"Baik dalam pemahaman bacaan.", nilaiK:80, predK:calcPred(80), deskK:"Mampu berkomunikasi dalam konteks formal." },
    ]},
    { label: "Kelompok B (Umum)", mapel: [
      { key:"seni",   no:7, label:"Seni Budaya", kkm:75, nilaiP:80, predP:calcPred(80), deskP:"Memahami unsur seni rupa.", nilaiK:82, predK:calcPred(82), deskK:"Kreatif dalam karya seni." },
      { key:"pjok",   no:8, label:"PJOK", kkm:75, nilaiP:85, predP:calcPred(85), deskP:"Memahami konsep kebugaran jasmani.", nilaiK:86, predK:calcPred(86), deskK:"Aktif dalam kegiatan olahraga." },
      { key:"pkwu",   no:9, label:"Prakarya dan Kewirausahaan", kkm:75, nilaiP:79, predP:calcPred(79), deskP:"Memahami konsep kewirausahaan.", nilaiK:80, predK:calcPred(80), deskK:"Mampu membuat produk sederhana." },
    ]},
    { label: "Kelompok C (Peminatan MIPA)", mapel: [
      { key:"matematika_p",no:10,label:"Matematika Peminatan", kkm:75, nilaiP:89, predP:calcPred(89), deskP:"Sangat baik dalam kalkulus dasar.", nilaiK:88, predK:calcPred(88), deskK:"Terampil dalam pembuktian matematis." },
      { key:"biologi",no:11,label:"Biologi", kkm:75, nilaiP:80, predP:calcPred(80), deskP:"Memahami struktur sel dan jaringan.", nilaiK:79, predK:calcPred(79), deskK:"Terampil dalam pengamatan mikroskopis." },
      { key:"fisika", no:12,label:"Fisika", kkm:75, nilaiP:85, predP:calcPred(85), deskP:"Baik dalam mekanika dasar.", nilaiK:84, predK:calcPred(84), deskK:"Terampil dalam analisis gerak." },
      { key:"kimia",  no:13,label:"Kimia", kkm:75, nilaiP:74, predP:calcPred(74), deskP:"Cukup memahami struktur atom.", nilaiK:73, predK:calcPred(73), deskK:"Cukup terampil dalam stoikiometri." },
    ]},
  ]},
  2: { label: "Semester 2", tahun: "2022/2023", kelas: "X MIPA 2", kelompok: [
    { label: "Kelompok A (Umum)", mapel: [
      { key:"agama",  no:1, label:"Pendidikan Agama dan Budi Pekerti", kkm:75, nilaiP:87, predP:calcPred(87), deskP:"Meningkat dalam pemahaman fiqih.", nilaiK:86, predK:calcPred(86), deskK:"Konsisten menerapkan nilai ibadah." },
      { key:"ppkn",   no:2, label:"Pendidikan Pancasila dan Kewarganegaraan", kkm:75, nilaiP:83, predP:calcPred(83), deskP:"Baik dalam analisis kebijakan publik.", nilaiK:82, predK:calcPred(82), deskK:"Kritis dalam diskusi konstitusi." },
      { key:"b_indo", no:3, label:"Bahasa Indonesia", kkm:75, nilaiP:85, predP:calcPred(85), deskP:"Baik dalam menganalisis teks.", nilaiK:84, predK:calcPred(84), deskK:"Terampil dalam penulisan esai." },
      { key:"matematika",no:4,label:"Matematika", kkm:75, nilaiP:90, predP:calcPred(90), deskP:"Sangat baik dalam trigonometri.", nilaiK:89, predK:calcPred(89), deskK:"Terampil menyelesaikan soal kompleks." },
      { key:"sejarah_ind",no:5,label:"Sejarah Indonesia", kkm:75, nilaiP:79, predP:calcPred(79), deskP:"Baik dalam sejarah kemerdekaan.", nilaiK:78, predK:calcPred(78), deskK:"Mampu membuat analisis kronologis." },
      { key:"b_ing",  no:6, label:"Bahasa Inggris", kkm:75, nilaiP:83, predP:calcPred(83), deskP:"Baik dalam writing dan reading.", nilaiK:82, predK:calcPred(82), deskK:"Mampu presentasi dalam bahasa Inggris." },
    ]},
    { label: "Kelompok B (Umum)", mapel: [
      { key:"seni",   no:7, label:"Seni Budaya", kkm:75, nilaiP:81, predP:calcPred(81), deskP:"Meningkat dalam apresiasi seni.", nilaiK:83, predK:calcPred(83), deskK:"Kreatif dalam desain." },
      { key:"pjok",   no:8, label:"PJOK", kkm:75, nilaiP:86, predP:calcPred(86), deskP:"Baik dalam atletik.", nilaiK:87, predK:calcPred(87), deskK:"Aktif dan berprestasi dalam olahraga." },
      { key:"pkwu",   no:9, label:"Prakarya dan Kewirausahaan", kkm:75, nilaiP:80, predP:calcPred(80), deskP:"Memahami analisis pasar.", nilaiK:81, predK:calcPred(81), deskK:"Mampu menyusun rencana bisnis." },
    ]},
    { label: "Kelompok C (Peminatan MIPA)", mapel: [
      { key:"matematika_p",no:10,label:"Matematika Peminatan", kkm:75, nilaiP:91, predP:calcPred(91), deskP:"Sangat baik dalam vektor.", nilaiK:90, predK:calcPred(90), deskK:"Menguasai metode pembuktian." },
      { key:"biologi",no:11,label:"Biologi", kkm:75, nilaiP:82, predP:calcPred(82), deskP:"Baik dalam sistem organ manusia.", nilaiK:81, predK:calcPred(81), deskK:"Terampil dalam praktikum biologi." },
      { key:"fisika", no:12,label:"Fisika", kkm:75, nilaiP:87, predP:calcPred(87), deskP:"Sangat baik dalam dinamika.", nilaiK:86, predK:calcPred(86), deskK:"Terampil analisis gaya dan momentum." },
      { key:"kimia",  no:13,label:"Kimia", kkm:75, nilaiP:76, predP:calcPred(76), deskP:"Cukup baik dalam ikatan kimia.", nilaiK:75, predK:calcPred(75), deskK:"Mulai terampil dalam perhitungan mol." },
    ]},
  ]},
  3: { label: "Semester 3", tahun: "2023/2024", kelas: "XI MIPA 2", kelompok: [
    { label: "Kelompok A (Umum)", mapel: [
      { key:"agama",  no:1, label:"Pendidikan Agama dan Budi Pekerti", kkm:75, nilaiP:88, predP:calcPred(88), deskP:"Sangat baik dalam akidah.", nilaiK:87, predK:calcPred(87), deskK:"Menerapkan ibadah secara konsisten." },
      { key:"ppkn",   no:2, label:"Pendidikan Pancasila dan Kewarganegaraan", kkm:75, nilaiP:84, predP:calcPred(84), deskP:"Baik dalam hukum internasional.", nilaiK:83, predK:calcPred(83), deskK:"Kritis dan sistematis." },
      { key:"b_indo", no:3, label:"Bahasa Indonesia", kkm:75, nilaiP:87, predP:calcPred(87), deskP:"Sangat baik dalam teks laporan.", nilaiK:86, predK:calcPred(86), deskK:"Terampil menulis karya ilmiah." },
      { key:"matematika",no:4,label:"Matematika", kkm:75, nilaiP:92, predP:calcPred(92), deskP:"Sangat baik dalam limit & turunan.", nilaiK:91, predK:calcPred(91), deskK:"Terampil dalam pemecahan masalah analitik." },
      { key:"sejarah_ind",no:5,label:"Sejarah Indonesia", kkm:75, nilaiP:81, predP:calcPred(81), deskP:"Baik dalam era reformasi.", nilaiK:80, predK:calcPred(80), deskK:"Mampu menganalisis transformasi sosial." },
      { key:"b_ing",  no:6, label:"Bahasa Inggris", kkm:75, nilaiP:85, predP:calcPred(85), deskP:"Sangat baik dalam comprehension.", nilaiK:84, predK:calcPred(84), deskK:"Mampu argumentasi dalam bahasa Inggris." },
    ]},
    { label: "Kelompok B (Umum)", mapel: [
      { key:"seni",   no:7, label:"Seni Budaya", kkm:75, nilaiP:82, predP:calcPred(82), deskP:"Baik dalam kritik seni.", nilaiK:84, predK:calcPred(84), deskK:"Kreatif dan inovatif." },
      { key:"pjok",   no:8, label:"PJOK", kkm:75, nilaiP:87, predP:calcPred(87), deskP:"Baik dalam permainan tim.", nilaiK:88, predK:calcPred(88), deskK:"Aktif dan berjiwa sportif." },
      { key:"pkwu",   no:9, label:"Prakarya dan Kewirausahaan", kkm:75, nilaiP:82, predP:calcPred(82), deskP:"Baik dalam analisis usaha.", nilaiK:83, predK:calcPred(83), deskK:"Mampu mengelola proyek kecil." },
    ]},
    { label: "Kelompok C (Peminatan MIPA)", mapel: [
      { key:"matematika_p",no:10,label:"Matematika Peminatan", kkm:75, nilaiP:93, predP:calcPred(93), deskP:"Sangat baik dalam integral.", nilaiK:92, predK:calcPred(92), deskK:"Terampil dalam transformasi koordinat." },
      { key:"biologi",no:11,label:"Biologi", kkm:75, nilaiP:84, predP:calcPred(84), deskP:"Baik dalam metabolisme sel.", nilaiK:83, predK:calcPred(83), deskK:"Terampil dalam analisis genetika." },
      { key:"fisika", no:12,label:"Fisika", kkm:75, nilaiP:89, predP:calcPred(89), deskP:"Sangat baik dalam termodinamika.", nilaiK:88, predK:calcPred(88), deskK:"Menguasai analisis sistem energi." },
      { key:"kimia",  no:13,label:"Kimia", kkm:75, nilaiP:75, predP:calcPred(75), deskP:"Cukup baik dalam laju reaksi.", nilaiK:74, predK:calcPred(74), deskK:"Cukup terampil dalam titrasi." },
    ]},
  ]},
  4: { label: "Semester 4", tahun: "2023/2024", kelas: "XI MIPA 2", kelompok: [
    { label: "Kelompok A (Umum)", mapel: [
      { key:"agama",  no:1, label:"Pendidikan Agama dan Budi Pekerti", kkm:75, nilaiP:89, predP:calcPred(89), deskP:"Sangat baik dalam muamalah.", nilaiK:88, predK:calcPred(88), deskK:"Berkomitmen tinggi dalam ibadah." },
      { key:"ppkn",   no:2, label:"Pendidikan Pancasila dan Kewarganegaraan", kkm:75, nilaiP:85, predP:calcPred(85), deskP:"Sangat baik dalam demokrasi.", nilaiK:84, predK:calcPred(84), deskK:"Kritis dalam kajian hukum." },
      { key:"b_indo", no:3, label:"Bahasa Indonesia", kkm:75, nilaiP:88, predP:calcPred(88), deskP:"Sangat baik dalam teks eksposisi.", nilaiK:87, predK:calcPred(87), deskK:"Sangat terampil dalam menulis ilmiah." },
      { key:"matematika",no:4,label:"Matematika", kkm:75, nilaiP:94, predP:calcPred(94), deskP:"Sangat baik dalam statistika.", nilaiK:93, predK:calcPred(93), deskK:"Sangat terampil dalam analisis data." },
      { key:"sejarah_ind",no:5,label:"Sejarah Indonesia", kkm:75, nilaiP:82, predP:calcPred(82), deskP:"Baik dalam sejarah kontemporer.", nilaiK:81, predK:calcPred(81), deskK:"Mampu membuat sintesis sejarah." },
      { key:"b_ing",  no:6, label:"Bahasa Inggris", kkm:75, nilaiP:87, predP:calcPred(87), deskP:"Sangat baik dalam writing.", nilaiK:86, predK:calcPred(86), deskK:"Mampu debat dalam bahasa Inggris." },
    ]},
    { label: "Kelompok B (Umum)", mapel: [
      { key:"seni",   no:7, label:"Seni Budaya", kkm:75, nilaiP:83, predP:calcPred(83), deskP:"Baik dalam seni pertunjukan.", nilaiK:85, predK:calcPred(85), deskK:"Sangat kreatif dalam berkarya." },
      { key:"pjok",   no:8, label:"PJOK", kkm:75, nilaiP:88, predP:calcPred(88), deskP:"Sangat baik dalam bola voli.", nilaiK:89, predK:calcPred(89), deskK:"Berprestasi dalam olahraga sekolah." },
      { key:"pkwu",   no:9, label:"Prakarya dan Kewirausahaan", kkm:75, nilaiP:84, predP:calcPred(84), deskP:"Baik dalam strategi pemasaran.", nilaiK:85, predK:calcPred(85), deskK:"Mampu mengembangkan produk kreatif." },
    ]},
    { label: "Kelompok C (Peminatan MIPA)", mapel: [
      { key:"matematika_p",no:10,label:"Matematika Peminatan", kkm:75, nilaiP:95, predP:calcPred(95), deskP:"Sangat baik dalam persamaan diferensial.", nilaiK:94, predK:calcPred(94), deskK:"Sangat terampil dalam pemodelan matematis." },
      { key:"biologi",no:11,label:"Biologi", kkm:75, nilaiP:85, predP:calcPred(85), deskP:"Sangat baik dalam evolusi.", nilaiK:84, predK:calcPred(84), deskK:"Terampil dalam analisis filogenetik." },
      { key:"fisika", no:12,label:"Fisika", kkm:75, nilaiP:91, predP:calcPred(91), deskP:"Sangat baik dalam optika.", nilaiK:90, predK:calcPred(90), deskK:"Terampil dalam analisis gelombang." },
      { key:"kimia",  no:13,label:"Kimia", kkm:75, nilaiP:76, predP:calcPred(76), deskP:"Cukup baik dalam kesetimbangan.", nilaiK:75, predK:calcPred(75), deskK:"Cukup terampil dalam reaksi redoks." },
    ]},
  ]},
  5: { label: "Semester 5", tahun: "2024/2025", kelas: "XII MIPA 2", kelompok: [] },
  6: { label: "Semester 6", tahun: "2024/2025", kelas: "XII MIPA 2", kelompok: [] },
};

// Flatten all mapel per sem for trend chart
const TREND_DATA = [1, 2, 3, 4].map(sem => {
  const row: Record<string, string | number> = { sem: `Sem ${sem}` };
  RAPOR[sem].kelompok.forEach(kg => kg.mapel.forEach(m => { row[m.key] = m.nilaiP; }));
  return row;
});

const PRED_COLOR: Record<string, string> = {
  "A": "#22c55e", "A-": "#16a34a", "B+": "#0965fa", "B": "#00b2dd", "B-": "#64748b", "C+": "#f1ad00",
};

function PredBadge({ pred }: { pred: string }) {
  const color = PRED_COLOR[pred] ?? "#9ca3af";
  return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold" style={{ background: color + "18", color, fontFamily: PP }}>{pred}</span>;
}

// e-Rapor table in Kemendikbudristek format
function ERaporTable({ sem, onDownload }: { sem: number; onDownload: () => void }) {
  const data = RAPOR[sem];
  const isEmpty = data.kelompok.length === 0;

  if (isEmpty) return (
    <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm flex flex-col items-center justify-center py-20 gap-3">
      <span className="text-5xl">📋</span>
      <p className="text-[15px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>Rapor belum tersedia</p>
      <p className="text-[13px] text-[#9ca3af]" style={{ fontFamily: PP }}>Nilai {data.label} belum diinput oleh sekolah.</p>
    </div>
  );

  const allMapel = data.kelompok.flatMap(k => k.mapel);
  const avgP = allMapel.reduce((s, m) => s + m.nilaiP, 0) / allMapel.length;
  const avgK = allMapel.reduce((s, m) => s + m.nilaiK, 0) / allMapel.length;

  return (
    <div className="flex flex-col gap-4">
      {/* Summary stat cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Rata-rata Pengetahuan", value: avgP.toFixed(1), color: "#0965fa" },
          { label: "Rata-rata Keterampilan", value: avgK.toFixed(1), color: "#00b2dd" },
          { label: "Kelas", value: data.kelas, color: "#8b5cf6" },
          { label: "Tahun Pelajaran", value: data.tahun, color: "#f1ad00" },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-[rgba(0,0,0,0.06)] px-4 py-3">
            <p className="text-[10px] text-[#9ca3af] font-medium mb-1" style={{ fontFamily: PP }}>{c.label}</p>
            <p className="text-[18px] font-bold leading-none" style={{ color: c.color, fontFamily: PP }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* e-Rapor card */}
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
        {/* Rapor header */}
        <div className="border-b-2 border-[#1a1d2e] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0965fa]/10 flex items-center justify-center text-2xl">🏫</div>
              <div>
                <p className="text-[15px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>SMA NEGERI 1 JAKARTA</p>
                <p className="text-[11px] text-[#6b7280]" style={{ fontFamily: PP }}>Jl. Budi Utomo No.7, Jakarta Pusat · NPSN: 20100001</p>
              </div>
            </div>
            <button onClick={onDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold text-white hover:opacity-90 transition-all shadow-sm"
              style={{ background: "linear-gradient(90deg,#0965fa,#00b2dd)", fontFamily: PP, outline: "none" }}>
              <Download size={13} />Unduh PDF
            </button>
          </div>
          <div className="mt-3 text-center">
            <p className="text-[13px] font-bold text-[#1a1d2e] uppercase tracking-wide" style={{ fontFamily: PP }}>Laporan Hasil Belajar Peserta Didik</p>
            <p className="text-[12px] text-[#6b7280]" style={{ fontFamily: PP }}>{data.label} — Tahun Pelajaran {data.tahun}</p>
          </div>
          {/* Student info row */}
          <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-1 text-[12px]" style={{ fontFamily: PP }}>
            {[
              ["Nama", "Rizky Pratama Putra"], ["NISN", "0051234567"],
              ["Kelas", data.kelas], ["Program", "MIPA"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <span className="text-[#9ca3af] w-24 shrink-0">{k}</span>
                <span className="font-semibold text-[#1a1d2e]">: {v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]" style={{ fontFamily: PP, borderCollapse: "collapse" }}>
            <thead>
              <tr className="bg-[#f5f6fb]">
                <th className="border border-[rgba(0,0,0,0.1)] px-2 py-2.5 text-center text-[11px] font-bold text-[#374151] w-8">No</th>
                <th className="border border-[rgba(0,0,0,0.1)] px-3 py-2.5 text-left text-[11px] font-bold text-[#374151]">Mata Pelajaran</th>
                <th className="border border-[rgba(0,0,0,0.1)] px-2 py-2.5 text-center text-[11px] font-bold text-[#374151] w-12">KKM</th>
                <th className="border border-[rgba(0,0,0,0.1)] px-2 py-2.5 text-center text-[11px] font-bold text-[#0965fa]" colSpan={2}>Pengetahuan</th>
                <th className="border border-[rgba(0,0,0,0.1)] px-2 py-2.5 text-center text-[11px] font-bold text-[#00b2dd]" colSpan={2}>Keterampilan</th>
                <th className="border border-[rgba(0,0,0,0.1)] px-3 py-2.5 text-center text-[11px] font-bold text-[#374151]">Deskripsi</th>
              </tr>
              <tr className="bg-[#f5f6fb]">
                <th className="border border-[rgba(0,0,0,0.1)] py-1" />
                <th className="border border-[rgba(0,0,0,0.1)] py-1" />
                <th className="border border-[rgba(0,0,0,0.1)] py-1" />
                <th className="border border-[rgba(0,0,0,0.1)] px-2 py-1 text-center text-[10px] font-semibold text-[#9ca3af]">Angka</th>
                <th className="border border-[rgba(0,0,0,0.1)] px-2 py-1 text-center text-[10px] font-semibold text-[#9ca3af]">Pred.</th>
                <th className="border border-[rgba(0,0,0,0.1)] px-2 py-1 text-center text-[10px] font-semibold text-[#9ca3af]">Angka</th>
                <th className="border border-[rgba(0,0,0,0.1)] px-2 py-1 text-center text-[10px] font-semibold text-[#9ca3af]">Pred.</th>
                <th className="border border-[rgba(0,0,0,0.1)] py-1" />
              </tr>
            </thead>
            <tbody>
              {data.kelompok.map(kg => (
                <React.Fragment key={kg.label}>
                  <tr className="bg-[#eff6ff]">
                    <td colSpan={8} className="border border-[rgba(0,0,0,0.1)] px-3 py-2 font-bold text-[#0965fa] text-[11px] uppercase tracking-wide">{kg.label}</td>
                  </tr>
                  {kg.mapel.map(m => {
                    const colP = m.nilaiP >= 90 ? "#22c55e" : m.nilaiP >= 80 ? "#0965fa" : m.nilaiP >= 75 ? "#f1ad00" : "#ef4444";
                    const colK = m.nilaiK >= 90 ? "#22c55e" : m.nilaiK >= 80 ? "#0965fa" : m.nilaiK >= 75 ? "#f1ad00" : "#ef4444";
                    return (
                      <tr key={m.key} className="hover:bg-[#fafbff] transition-colors">
                        <td className="border border-[rgba(0,0,0,0.07)] px-2 py-2.5 text-center text-[#9ca3af]">{m.no}</td>
                        <td className="border border-[rgba(0,0,0,0.07)] px-3 py-2.5 font-semibold text-[#1a1d2e]">{m.label}</td>
                        <td className="border border-[rgba(0,0,0,0.07)] px-2 py-2.5 text-center text-[#9ca3af]">{m.kkm}</td>
                        <td className="border border-[rgba(0,0,0,0.07)] px-2 py-2.5 text-center font-bold" style={{ color: colP }}>{m.nilaiP}</td>
                        <td className="border border-[rgba(0,0,0,0.07)] px-2 py-2.5 text-center"><PredBadge pred={m.predP} /></td>
                        <td className="border border-[rgba(0,0,0,0.07)] px-2 py-2.5 text-center font-bold" style={{ color: colK }}>{m.nilaiK}</td>
                        <td className="border border-[rgba(0,0,0,0.07)] px-2 py-2.5 text-center"><PredBadge pred={m.predK} /></td>
                        <td className="border border-[rgba(0,0,0,0.07)] px-3 py-2.5 text-[11px] text-[#6b7280] leading-relaxed max-w-[220px]">{m.deskP}</td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
            {/* Average footer */}
            <tfoot>
              <tr className="bg-[#f5f6fb] font-bold">
                <td colSpan={3} className="border border-[rgba(0,0,0,0.1)] px-3 py-2.5 text-right text-[12px] text-[#374151]">Rata-rata</td>
                <td className="border border-[rgba(0,0,0,0.1)] px-2 py-2.5 text-center text-[13px] font-bold text-[#0965fa]">{avgP.toFixed(1)}</td>
                <td className="border border-[rgba(0,0,0,0.1)] px-2 py-2.5 text-center"><PredBadge pred={calcPred(avgP)} /></td>
                <td className="border border-[rgba(0,0,0,0.1)] px-2 py-2.5 text-center text-[13px] font-bold text-[#00b2dd]">{avgK.toFixed(1)}</td>
                <td className="border border-[rgba(0,0,0,0.1)] px-2 py-2.5 text-center"><PredBadge pred={calcPred(avgK)} /></td>
                <td className="border border-[rgba(0,0,0,0.1)]" />
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Signature footer */}
        <div className="px-6 py-5 border-t border-[rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-end">
            <div className="text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>
              <p>Mengetahui,</p>
              <p className="font-semibold text-[#374151] mt-1">Orang Tua / Wali</p>
              <div className="mt-8 border-t border-[#d1d5db] pt-1 w-36">
                <p className="text-[#374151]">(.........................)</p>
              </div>
            </div>
            <div className="text-[11px] text-[#9ca3af] text-center" style={{ fontFamily: PP }}>
              <p>Jakarta, {data.tahun.split("/")[0]} </p>
              <p className="font-semibold text-[#374151] mt-1">Wali Kelas</p>
              <div className="mt-8 border-t border-[#d1d5db] pt-1 w-40">
                <p className="font-semibold text-[#374151]">Dra. Siti Rahayu, M.Pd.</p>
                <p>NIP. 196504121990032001</p>
              </div>
            </div>
            <div className="text-[11px] text-[#9ca3af] text-right" style={{ fontFamily: PP }}>
              <p>Mengesahkan,</p>
              <p className="font-semibold text-[#374151] mt-1">Kepala Sekolah</p>
              <div className="mt-8 border-t border-[#d1d5db] pt-1 w-44">
                <p className="font-semibold text-[#374151]">Dr. H. Ahmad Fauzi, M.M.</p>
                <p>NIP. 196203071985031007</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom SVG line chart — avoids recharts internal key bug
function SvgLineChart({ data, series }: {
  data: Record<string, string | number>[];
  series: { key: string; label: string; color: string; visible: boolean }[];
}) {
  const W = 640; const H = 220;
  const PAD = { top: 12, right: 16, bottom: 28, left: 36 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const MIN = 60; const MAX = 100;
  const sems = data.map(d => d.sem as string);
  const xScale = (i: number) => PAD.left + (i / (sems.length - 1)) * chartW;
  const yScale = (v: number) => PAD.top + chartH - ((v - MIN) / (MAX - MIN)) * chartH;
  const yTicks = [60, 70, 80, 90, 100];

  const [tooltip, setTooltip] = useState<{ x: number; y: number; sem: string; vals: { label: string; value: number; color: string }[] } | null>(null);

  function pointsOf(key: string) {
    return data.map((d, i) => ({ x: xScale(i), y: yScale(d[key] as number) }));
  }

  function pathD(pts: { x: number; y: number }[]) {
    return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  }

  return (
    <div className="relative" style={{ fontFamily: PP }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", overflow: "visible" }}>
        {/* Y gridlines + labels */}
        {yTicks.map(t => (
          <g key={`y-${t}`}>
            <line x1={PAD.left} x2={W - PAD.right} y1={yScale(t)} y2={yScale(t)} stroke="#f0f2f8" strokeWidth={1} />
            <text x={PAD.left - 6} y={yScale(t) + 4} textAnchor="end" fontSize={10} fill="#c4c9d4">{t}</text>
          </g>
        ))}
        {/* X labels */}
        {sems.map((s, i) => (
          <text key={`x-${i}`} x={xScale(i)} y={H - 6} textAnchor="middle" fontSize={11} fill="#9ca3af">{s}</text>
        ))}
        {/* Lines + dots */}
        {series.filter(s => s.visible).map(s => {
          const pts = pointsOf(s.key);
          return (
            <g key={s.key}>
              <path d={pathD(pts)} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
              {pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={4} fill={s.color} stroke="white" strokeWidth={2} />
              ))}
            </g>
          );
        })}
        {/* Hover zones */}
        {sems.map((sem, i) => (
          <rect key={`hz-${i}`} x={xScale(i) - 24} y={PAD.top} width={48} height={chartH}
            fill="transparent"
            onMouseEnter={e => {
              const vals = series.filter(s => s.visible).map(s => ({ label: s.label, value: data[i][s.key] as number, color: s.color }));
              setTooltip({ x: xScale(i), y: PAD.top, sem, vals });
            }}
            onMouseLeave={() => setTooltip(null)} />
        ))}
        {/* Tooltip vertical line */}
        {tooltip && <line x1={tooltip.x} x2={tooltip.x} y1={PAD.top} y2={H - PAD.bottom} stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4 2" />}
      </svg>
      {/* Tooltip box */}
      {tooltip && (
        <div className="absolute z-10 pointer-events-none bg-white rounded-xl shadow-xl border border-[rgba(0,0,0,0.08)] px-3 py-2.5 min-w-[140px]"
          style={{ left: `calc(${(tooltip.x / W) * 100}% + 8px)`, top: 8, transform: tooltip.x > W * 0.7 ? "translateX(calc(-100% - 16px))" : undefined }}>
          <p className="text-[11px] font-bold text-[#9ca3af] mb-1.5" style={{ fontFamily: PP }}>{tooltip.sem}</p>
          {tooltip.vals.map(v => (
            <div key={v.label} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: v.color }} />
                <span className="text-[11px] text-[#6b7280]" style={{ fontFamily: PP }}>{v.label}</span>
              </div>
              <span className="text-[12px] font-bold" style={{ color: v.color, fontFamily: PP }}>{v.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TrenNilai() {
  const [activeKeys, setActiveKeys] = useState<string[]>(["matematika", "fisika", "kimia"]);

  function toggle(key: string) {
    setActiveKeys(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  }

  const series = MATA_PELAJARAN.map(m => ({ ...m, visible: activeKeys.includes(m.key) }));

  return (
    <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
      <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.05)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-lg">📈</span>
              <p className="text-[15px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Tren Nilai per Semester</p>
            </div>
            <p className="text-[12px] text-[#9ca3af]" style={{ fontFamily: PP }}>Sem 1 – Sem 4 · Data tersedia</p>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {MATA_PELAJARAN.map(m => (
              <button key={m.key} onClick={() => toggle(m.key)}
                className="px-3 py-1 rounded-full text-[11px] font-semibold transition-all border"
                style={{
                  fontFamily: PP, outline: "none",
                  background: activeKeys.includes(m.key) ? m.color + "18" : "transparent",
                  color: activeKeys.includes(m.key) ? m.color : "#9ca3af",
                  borderColor: activeKeys.includes(m.key) ? m.color + "40" : "rgba(0,0,0,0.08)",
                }}>
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="px-4 py-4">
        <SvgLineChart data={TREND_DATA} series={series} />
      </div>
    </div>
  );
}

function AIRaporRecommendation() {
  return (
    <div className="rounded-2xl overflow-hidden border border-[#bfdbfe]" style={{ background: "linear-gradient(135deg,#eff6ff 0%,#e0f2fe 100%)" }}>
      <div className="px-6 pt-5 pb-2 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl shrink-0">🤖</div>
        <div>
          <p className="text-[13px] font-bold text-[#0965fa]" style={{ fontFamily: PP }}>AI Smart Recommendation</p>
          <p className="text-[11px] text-[#93c5fd]" style={{ fontFamily: PP }}>Berdasarkan analisis tren Sem 1–4</p>
        </div>
        <div className="ml-auto px-3 py-1 rounded-full text-[10px] font-bold bg-[#0965fa] text-white" style={{ fontFamily: PP }}>ORBITA AI</div>
      </div>
      <div className="px-6 py-4">
        <p className="text-[13px] text-[#1e40af] leading-relaxed" style={{ fontFamily: PP }}>
          "Berdasarkan analisis tren hingga Semester 4, kamu memiliki kekuatan besar di bidang analisis angka <strong>(Matematika & Fisika)</strong>. Peluang lolos SNBP kamu di <strong>Teknik Sipil</strong> saat ini berada di zona aman, namun kamu perlu <strong>menaikkan nilai Kimia minimal 5 poin</strong> di Semester 5 nanti."
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: "Matematika", value: "+6 poin", trend: "up", color: "#22c55e" },
            { label: "Fisika", value: "+6 poin", trend: "up", color: "#22c55e" },
            { label: "Kimia", value: "Perlu naik", trend: "down", color: "#ef4444" },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-xl px-4 py-3 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>{item.label}</p>
                <p className="text-[13px] font-bold" style={{ color: item.color, fontFamily: PP }}>{item.value}</p>
              </div>
              {item.trend === "up"
                ? <TrendingUp size={18} className="text-[#22c55e]" />
                : <TrendingDown size={18} className="text-[#ef4444]" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const ACTION_NODES = [
  { emoji: "📚", title: "Jadwal Belajar Kimia", desc: "Tambah 3 sesi belajar Kimia/minggu mulai Semester 5", tag: "Prioritas Tinggi", tagColor: "#ef4444", cta: "Buat Jadwal" },
  { emoji: "🎯", title: "Target Nilai Semester 5", desc: "Tetapkan target Kimia ≥ 82 dan Matematika ≥ 95", tag: "Target Aktif", tagColor: "#0965fa", cta: "Set Target" },
  { emoji: "🔁", title: "Review Materi Lemah", desc: "Identifikasi topik Kimia yang perlu diperkuat", tag: "Segera", tagColor: "#f1ad00", cta: "Mulai Review" },
  { emoji: "📝", title: "Simulasi SNBP", desc: "Cek peluang lolos Teknik Sipil dengan nilai saat ini", tag: "Cek Peluang", tagColor: "#22c55e", cta: "Cek Sekarang" },
];

function StudentActionNodes() {
  const [done, setDone] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base" style={{ background: "linear-gradient(135deg,#0965fa,#00b2dd)" }}>
          <Target size={16} className="text-white" />
        </div>
        <div>
          <p className="text-[15px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Rencana Aksi Mandiri Siswa</p>
          <p className="text-[12px] text-[#9ca3af]" style={{ fontFamily: PP }}>Student Action Node · Tindakan nyata berdasarkan evaluasi nilaimu</p>
        </div>
        <span className="ml-auto text-[12px] font-semibold text-[#0965fa]" style={{ fontFamily: PP }}>{done.length}/{ACTION_NODES.length} selesai</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {ACTION_NODES.map(node => {
          const isDone = done.includes(node.title);
          return (
            <div key={node.title}
              className={`bg-white rounded-2xl border p-5 flex flex-col gap-3 transition-all ${isDone ? "border-[#22c55e]/30 bg-[#f0fdf4]" : "border-[rgba(0,0,0,0.07)] hover:border-[#0965fa]/20"}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className={`text-2xl transition-all ${isDone ? "grayscale opacity-50" : ""}`}>{node.emoji}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: node.tagColor + "18", color: node.tagColor, fontFamily: PP }}>{node.tag}</span>
                </div>
                <button onClick={() => setDone(p => isDone ? p.filter(d => d !== node.title) : [...p, node.title])}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${isDone ? "bg-[#22c55e] border-[#22c55e]" : "border-[#d1d5db] hover:border-[#22c55e]"}`}
                  style={{ outline: "none" }}>
                  {isDone && <Check size={12} className="text-white" />}
                </button>
              </div>
              <div>
                <p className={`text-[13px] font-bold mb-1 ${isDone ? "line-through text-[#9ca3af]" : "text-[#1a1d2e]"}`} style={{ fontFamily: PP }}>{node.title}</p>
                <p className="text-[12px] text-[#9ca3af] leading-relaxed" style={{ fontFamily: PP }}>{node.desc}</p>
              </div>
              {!isDone && (
                <button onClick={() => setDone(p => [...p, node.title])}
                  className="mt-auto py-2 rounded-xl text-[12px] font-semibold text-[#0965fa] border border-[#0965fa]/20 hover:bg-[#eff6ff] transition-all"
                  style={{ fontFamily: PP, outline: "none" }}>
                  {node.cta} →
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* BK CTA */}
      <div className="rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ background: "linear-gradient(135deg,#eff6ff,#e0f2fe)" }}>📅</div>
        <div className="flex-1">
          <p className="text-[14px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Diskusi Hasil Analisis Ini dengan Guru BK</p>
          <p className="text-[12px] text-[#9ca3af] mt-0.5" style={{ fontFamily: PP }}>Jadwalkan sesi konseling otomatis untuk membahas hasil evaluasi nilai secara tatap muka.</p>
        </div>
        <button className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white hover:opacity-90 active:scale-95 transition-all shadow-md"
          style={{ background: "linear-gradient(90deg,#0965fa,#00b2dd)", fontFamily: PP, outline: "none" }}>
          <Calendar size={14} />Jadwalkan Sesi
        </button>
      </div>
    </div>
  );
}

function SemesterRaporCard({ sem, expanded, onToggle, onDownload }: {
  sem: number; expanded: boolean; onToggle: () => void; onDownload: () => void;
}) {
  const data = RAPOR[sem];
  const hasData = data.kelompok.length > 0;
  const allMapel = data.kelompok.flatMap(k => k.mapel);
  const avgP = hasData ? allMapel.reduce((s, m) => s + m.nilaiP, 0) / allMapel.length : 0;
  const avgK = hasData ? allMapel.reduce((s, m) => s + m.nilaiK, 0) / allMapel.length : 0;
  const jmlMapel = allMapel.length;
  const semType = sem % 2 === 1 ? "Ganjil" : "Genap";

  return (
    <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
      {/* Header row — always visible */}
      <div className="grid text-[12px] font-bold text-[#374151] border-b border-[rgba(0,0,0,0.07)]"
        style={{ gridTemplateColumns: "1.8fr 1fr 1fr 1fr 1fr 1.4fr" }}>
        {["Semester", "Tahun Pelajaran", "Mata Pelajaran", "Rata-rata Pengetahuan", "Rata-rata Keterampilan", "Aksi"].map(h => (
          <div key={h} className="px-4 py-3 bg-[#f8f9fc] border-r last:border-r-0 border-[rgba(0,0,0,0.06)] text-[11px] font-bold text-[#9ca3af] uppercase tracking-wide" style={{ fontFamily: PP }}>{h}</div>
        ))}
      </div>

      {/* Data row */}
      <div className="grid items-center" style={{ gridTemplateColumns: "1.8fr 1fr 1fr 1fr 1fr 1.4fr" }}>
        {/* Semester label + status */}
        <div className="px-4 py-4 border-r border-[rgba(0,0,0,0.06)] flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>{data.label} · {semType}</span>
            <span className="text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>{data.kelas}</span>
          </div>
          {hasData
            ? <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#dcfce7] text-[#16a34a]" style={{ fontFamily: PP }}>Aktif</span>
            : <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f5f6fb] text-[#9ca3af]" style={{ fontFamily: PP }}>Belum Ada</span>}
        </div>

        {/* Tahun pelajaran */}
        <div className="px-4 py-4 border-r border-[rgba(0,0,0,0.06)] text-center">
          <span className="text-[13px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>{data.tahun}</span>
        </div>

        {/* Jumlah mapel */}
        <div className="px-4 py-4 border-r border-[rgba(0,0,0,0.06)] text-center">
          {hasData
            ? <span className="text-[15px] font-bold text-[#0965fa]" style={{ fontFamily: PP }}>{jmlMapel}</span>
            : <span className="text-[#c4c9d4]">—</span>}
        </div>

        {/* Rata-rata Pengetahuan */}
        <div className="px-4 py-4 border-r border-[rgba(0,0,0,0.06)] text-center">
          {hasData ? (
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[15px] font-bold" style={{ color: avgP >= 85 ? "#22c55e" : avgP >= 75 ? "#0965fa" : "#f1ad00", fontFamily: PP }}>{avgP.toFixed(1)}</span>
              <PredBadge pred={calcPred(avgP)} />
            </div>
          ) : <span className="text-[#c4c9d4]">—</span>}
        </div>

        {/* Rata-rata Keterampilan */}
        <div className="px-4 py-4 border-r border-[rgba(0,0,0,0.06)] text-center">
          {hasData ? (
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[15px] font-bold" style={{ color: avgK >= 85 ? "#22c55e" : avgK >= 75 ? "#00b2dd" : "#f1ad00", fontFamily: PP }}>{avgK.toFixed(1)}</span>
              <PredBadge pred={calcPred(avgK)} />
            </div>
          ) : <span className="text-[#c4c9d4]">—</span>}
        </div>

        {/* Action */}
        <div className="px-4 py-4 flex items-center justify-center gap-2">
          {hasData ? (
            <button onClick={onToggle}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold text-white transition-all hover:opacity-90 active:scale-95 shadow-sm"
              style={{ background: expanded ? "linear-gradient(90deg,#374151,#6b7280)" : "linear-gradient(90deg,#0965fa,#00b2dd)", fontFamily: PP, outline: "none" }}>
              <FileText size={13} />
              {expanded ? "Tutup" : "Lihat Rapor"}
            </button>
          ) : (
            <span className="text-[12px] text-[#c4c9d4]" style={{ fontFamily: PP }}>Belum tersedia</span>
          )}
        </div>
      </div>

      {/* Expanded e-Rapor detail */}
      {expanded && hasData && (
        <div className="border-t border-[rgba(0,0,0,0.07)]">
          <ERaporTable sem={sem} onDownload={onDownload} />
        </div>
      )}
    </div>
  );
}

function NilaiRaporPage() {
  const [expandedSem, setExpandedSem] = useState<number | null>(null);
  const [showDownloadToast, setShowDownloadToast] = useState(false);
  const [downloadLabel, setDownloadLabel] = useState("");

  function handleDownload(sem: number) {
    setDownloadLabel(RAPOR[sem].label);
    setShowDownloadToast(true);
    setTimeout(() => setShowDownloadToast(false), 2800);
  }

  function toggleSem(sem: number) {
    setExpandedSem(prev => prev === sem ? null : sem);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Tren Nilai */}
      <TrenNilai />

      {/* 2. Semester list — KHS-style cards */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">📋</span>
          <p className="text-[15px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Riwayat Rapor per Semester</p>
          <span className="text-[12px] text-[#9ca3af]" style={{ fontFamily: PP }}>· Klik "Lihat Rapor" untuk detail e-Rapor Kemendikbudristek</span>
        </div>
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5, 6].map(sem => (
            <SemesterRaporCard
              key={sem}
              sem={sem}
              expanded={expandedSem === sem}
              onToggle={() => toggleSem(sem)}
              onDownload={() => handleDownload(sem)}
            />
          ))}
        </div>
      </div>

      {/* Download toast */}
      {showDownloadToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#1a1d2e] text-white px-5 py-3 rounded-2xl shadow-2xl text-[13px] font-semibold" style={{ fontFamily: PP }}>
          <CheckCircle2 size={16} className="text-[#22c55e]" />
          Rapor {downloadLabel} berhasil diunduh!
        </div>
      )}

      {/* 3. AI Recommendation */}
      <AIRaporRecommendation />

      {/* 4. Student Action Nodes */}
      <StudentActionNodes />
    </div>
  );
}

export default NilaiRaporPage;
