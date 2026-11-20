import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  MessageSquareText,
  Plus,
  Sparkles,
  Trophy,
  User,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BRAND } from "@/config/brand";
import { ROUTES } from "@/config/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAsync } from "@/lib/useAsync";
import { getBkStudentDetail } from "@/services/bkService";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";
import PageLoader from "@/components/ui/PageLoader";
import { PanelError } from "@/components/ui/PanelState";
import BkTryoutSummaryCard from "@/components/bk/BkTryoutSummaryCard";
import BkMinatRekomendasiSection from "@/components/bk/BkMinatRekomendasiSection";
import BkAddNoteModal from "@/components/bk/BkAddNoteModal";
import type { BkNoteItem, BkPriority } from "@/types/bk";

type TabKey = "profil" | "akademik" | "prestasi" | "bk";

const VALID_TABS = new Set<string>(["profil", "akademik", "prestasi", "bk"]);

const PRIORITY_BADGE: Record<BkPriority, { wrap: string; dot: string }> = {
  Tinggi: { wrap: "bg-alert-bg text-alert-fg border-alert-rim", dot: "bg-danger" },
  Sedang: { wrap: "bg-tint-amber-bg text-tint-amber-fg border-warning/40", dot: "bg-warning" },
  Rendah: { wrap: "bg-tint-green-bg text-tint-green-fg border-success/30", dot: "bg-success" },
};

const PENDAMPINGAN_LABEL = {
  pendampingan: { label: "Perlu Pendampingan", wrap: "bg-alert-bg text-alert-fg" },
  dipantau: { label: "Perlu Dipantau", wrap: "bg-tint-amber-bg text-tint-amber-fg" },
  normal: { label: "Normal", wrap: "bg-tint-green-bg text-tint-green-fg" },
} as const;

export default function BkStudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const studentId = Number(id) || 1;

  const { data: student, loading, error, reload } = useAsync(
    () => getBkStudentDetail(studentId),
    [studentId],
  );

  const tabParam = searchParams.get("tab") ?? "";
  const [activeTab, setActiveTab] = useState<TabKey>(
    VALID_TABS.has(tabParam) ? (tabParam as TabKey) : "profil",
  );
  const [selectedSemester, setSelectedSemester] = useState<number>(5);
  const [notes, setNotes] = useState<BkNoteItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (student) setNotes(student.bkNotes);
  }, [student]);

  useEffect(() => {
    if (VALID_TABS.has(tabParam)) setActiveTab(tabParam as TabKey);
  }, [tabParam]);

  const changeTab = (next: TabKey) => {
    setActiveTab(next);
    const updated = new URLSearchParams(searchParams);
    updated.set("tab", next);
    setSearchParams(updated, { replace: true });
  };

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[1240px] px-4 pt-6 sm:px-6 lg:px-8">
        <PanelError onRetry={reload} />
      </div>
    );
  }
  if (loading || !student) return <PageLoader fullscreen />;

  const attendancePct = Math.round((student.absensi.hadir / student.absensi.total) * 100);
  const pendampinganStyle = PENDAMPINGAN_LABEL[student.prioritasPendampingan];

  const topPriority: BkPriority = notes.some((n) => n.prioritas === "Tinggi")
    ? "Tinggi"
    : notes.some((n) => n.prioritas === "Sedang")
    ? "Sedang"
    : "Rendah";

  const currentSemesterScores = student.raporMapel.map((m) => m.scores[selectedSemester] ?? 0);
  const currentSemesterAvg =
    currentSemesterScores.length > 0
      ? (
          currentSemesterScores.reduce((a, b) => a + b, 0) / currentSemesterScores.length
        ).toFixed(1)
      : "0";

  const studentTrendData = [1, 2, 3, 4, 5, 6].map((sem) => {
    const scores = student.raporMapel.map((m) => m.scores[sem] ?? 0);
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    return { sem: `Sem ${sem}`, avg: Number(avg.toFixed(1)) };
  });

  const initials = student.nama
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex-1 overflow-y-auto bg-surface-soft">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        {/* Tombol Kembali */}
        <div>
          <Link
            to={ROUTES.bkSiswa}
            className="inline-flex items-center gap-2 text-xs font-semibold text-prose transition hover:text-orbit-1"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Kembali ke Pusat Data Siswa</span>
          </Link>
        </div>

        {/* Kartu Header & Quick Stats Siswa */}
        <div className="rounded-card border border-rim-soft bg-white p-6 shadow-card">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Avatar
                src={null}
                initials={initials}
                className={`h-16 w-16 text-lg font-bold text-white shadow-card ${
                  student.jk === "L" ? "bg-gradient-orbit" : "bg-gradient-sun"
                }`}
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-space-2 sm:text-2xl">{student.nama}</h1>
                  <span className="rounded-full bg-tint-blue-bg px-2.5 py-0.5 text-xs font-bold text-tint-blue-fg">
                    {student.kelas}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${pendampinganStyle.wrap}`}
                  >
                    {pendampinganStyle.label}
                  </span>
                </div>
                <p className="mt-1 text-xs text-prose-dim">
                  NISN:{" "}
                  <span className="font-mono font-semibold text-space-2">{student.nisn}</span> ·{" "}
                  {student.jk === "L" ? "Laki-laki" : "Perempuan"} · Profil{" "}
                  {student.statusProfil === "lengkap" ? "Lengkap" : "Belum Lengkap"}
                </p>
              </div>
            </div>

            {/* 4 Quick Stats */}
            <div className="grid grid-cols-2 divide-x divide-y divide-rim-soft overflow-hidden rounded-xl border border-rim-soft bg-surface-soft sm:grid-cols-4 sm:divide-y-0">
              <div className="px-4 py-2.5 text-center">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-prose-dim">
                  Rerata Rapor
                </span>
                <span className="text-lg font-bold text-orbit-1">
                  {student.avgNilai.toFixed(1).replace(".", ",")}
                </span>
              </div>
              <div className="px-4 py-2.5 text-center">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-prose-dim">
                  Skor SNBT
                </span>
                <span className="text-lg font-bold text-sun-1">{student.nilaiToTerakhir}</span>
              </div>
              <div className="px-4 py-2.5 text-center">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-prose-dim">
                  Kehadiran
                </span>
                <span
                  className={`text-lg font-bold ${
                    attendancePct >= 90
                      ? "text-success"
                      : attendancePct >= 80
                      ? "text-sun-1"
                      : "text-danger"
                  }`}
                >
                  {attendancePct}%
                </span>
              </div>
              <div className="px-4 py-2.5 text-center">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-prose-dim">
                  Prestasi
                </span>
                <span className="text-lg font-bold text-space-2">{student.achievements.length}</span>
              </div>
            </div>
          </div>

          {/* 4 Tab Navigasi */}
          <div
            role="tablist"
            aria-label="Detail informasi siswa"
            className="mt-6 flex flex-wrap gap-2 border-t border-rim-soft pt-4"
          >
            {[
              { id: "profil", label: "Profil Siswa", icon: User },
              { id: "akademik", label: "Akademik & Potensi", icon: GraduationCap },
              { id: "prestasi", label: `Prestasi (${student.achievements.length})`, icon: Trophy },
              { id: "bk", label: `Bimbingan BK (${notes.length})`, icon: MessageSquareText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => changeTab(tab.id as TabKey)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-orbit-1 text-white shadow-cta"
                      : "bg-surface-soft text-space-2 hover:bg-surface-blue hover:text-orbit-1"
                  }`}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ═══════════════════════════ TAB 1: PROFIL & ABSENSI ═══════════════════════════ */}
        {activeTab === "profil" && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Informasi Pribadi & Orang Tua */}
            <div className="space-y-5 rounded-card border border-rim-soft bg-white p-6 shadow-card">
              <div>
                <h2 className="text-base font-bold text-space-2">Informasi Pribadi & Kontak</h2>
                <p className="text-xs text-prose-dim">Biodata siswa dan kontak wali murid</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="block text-prose-dim">Tempat, Tanggal Lahir</span>
                  <span className="mt-0.5 block font-semibold text-space-2">
                    {student.tempatTanggalLahir}
                  </span>
                </div>
                <div>
                  <span className="block text-prose-dim">Agama</span>
                  <span className="mt-0.5 block font-semibold text-space-2">{student.agama}</span>
                </div>
                <div>
                  <span className="block text-prose-dim">Email Siswa</span>
                  <span className="mt-0.5 block break-all font-semibold text-space-2">
                    {student.email}
                  </span>
                </div>
                <div>
                  <span className="block text-prose-dim">No. HP Orang Tua</span>
                  <span className="mt-0.5 block font-semibold text-space-2">
                    {student.keluarga.noHpOrtu}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="block text-prose-dim">Alamat Domisili</span>
                  <span className="mt-0.5 block font-semibold text-space-2">
                    {student.keluarga.alamat}
                  </span>
                </div>
              </div>

              <div className="border-t border-rim-soft pt-4">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-prose-dim">
                  Data Orang Tua / Wali
                </h3>
                <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
                  <div>
                    <span className="block text-prose-dim">Nama Ayah</span>
                    <span className="mt-0.5 block font-semibold text-space-2">
                      {student.keluarga.namaAyah} ({student.keluarga.pekerjaanAyah})
                    </span>
                  </div>
                  <div>
                    <span className="block text-prose-dim">Nama Ibu</span>
                    <span className="mt-0.5 block font-semibold text-space-2">
                      {student.keluarga.namaIbu} ({student.keluarga.pekerjaanIbu})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Absensi & Gaya Belajar */}
            <div className="space-y-6">
              <div className="rounded-card border border-rim-soft bg-white p-6 shadow-card">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-space-2">Rekapitulasi Kehadiran</h2>
                    <p className="text-xs text-prose-dim">Persentase presensi semester berjalan</p>
                  </div>
                  <span
                    className={`text-lg font-bold ${
                      attendancePct >= 90 ? "text-success" : "text-sun-1"
                    }`}
                  >
                    {attendancePct}%
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="rounded-xl bg-surface-soft p-3">
                    <span className="block text-xs text-prose-dim">Hadir</span>
                    <span className="text-lg font-bold text-success">{student.absensi.hadir}</span>
                  </div>
                  <div className="rounded-xl bg-surface-soft p-3">
                    <span className="block text-xs text-prose-dim">Izin</span>
                    <span className="text-lg font-bold text-orbit-1">{student.absensi.izin}</span>
                  </div>
                  <div className="rounded-xl bg-surface-soft p-3">
                    <span className="block text-xs text-prose-dim">Sakit</span>
                    <span className="text-lg font-bold text-warning">{student.absensi.sakit}</span>
                  </div>
                  <div className="rounded-xl bg-surface-soft p-3">
                    <span className="block text-xs text-prose-dim">Alpa</span>
                    <span className="text-lg font-bold text-danger">{student.absensi.alpa}</span>
                  </div>
                </div>

                {student.absensi.alpa > 0 && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-alert-rim/40 bg-alert-bg p-3 text-xs text-alert-fg">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                    <span>
                      Siswa memiliki <strong>{student.absensi.alpa} hari alpa</strong> tanpa
                      keterangan. Disarankan konfirmasi dengan wali kelas dan orang tua.
                    </span>
                  </div>
                )}
              </div>

              <div className="rounded-card border border-rim-soft bg-white p-6 shadow-card">
                <h2 className="mb-1 text-base font-bold text-space-2">Gaya Belajar & Minat Karier</h2>
                <p className="mb-4 text-xs text-prose-dim">Ringkasan pemetaan asesmen siswa</p>
                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <GraduationCap size={16} className="mt-0.5 shrink-0 text-orbit-1" aria-hidden="true" />
                    <div>
                      <span className="block text-prose-dim">Gaya Belajar Dominan</span>
                      <strong className="text-space-2">{student.belajar.gayaBelajar}</strong>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Briefcase size={16} className="mt-0.5 shrink-0 text-sun-1" aria-hidden="true" />
                    <div>
                      <span className="block text-prose-dim">Rencana Karier & Target Prodi</span>
                      <strong className="text-space-2">{student.belajar.citaCita}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════ TAB 2: AKADEMIK & POTENSI ═══════════════════════════ */}
        {activeTab === "akademik" && (
          <div className="space-y-6">
            {/* Ringkasan AI Akademik */}
            <section className="rounded-card border border-orbit-1/25 bg-gradient-to-br from-surface-blue via-white to-surface-soft p-5 shadow-card sm:p-6">
              <div className="flex items-center gap-2 text-sm font-bold text-space-2">
                <Sparkles size={18} className="text-orbit-1" aria-hidden="true" />
                <span>{BRAND.name} AI — Ringkasan Akademik</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-prose">{student.aiAkademik.ringkasan}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-success/25 bg-tint-green-bg/50 p-3.5">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-tint-green-fg">
                    Kekuatan
                  </p>
                  <ul className="space-y-1.5 text-xs text-space-2">
                    {student.aiAkademik.kekuatan.map((item) => (
                      <li key={item} className="flex items-start gap-1.5">
                        <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-success" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-tint-orange-rim/40 bg-tint-amber-bg/50 p-3.5">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-tint-amber-fg">
                    Perlu Perhatian
                  </p>
                  <ul className="space-y-1.5 text-xs text-space-2">
                    {student.aiAkademik.perluPerhatian.map((item) => (
                      <li key={item} className="flex items-start gap-1.5">
                        <AlertTriangle size={13} className="mt-0.5 shrink-0 text-sun-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-orbit-1/25 bg-tint-blue-bg/50 p-3.5">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-tint-blue-fg">
                    Rekomendasi
                  </p>
                  <ul className="space-y-1.5 text-xs text-space-2">
                    {student.aiAkademik.rekomendasi.map((item) => (
                      <li key={item} className="flex items-start gap-1.5">
                        <Lightbulb size={13} className="mt-0.5 shrink-0 text-orbit-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Rapor & Grafik Tren Semester */}
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="rounded-card border border-rim-soft bg-white p-6 shadow-card">
                <div className="mb-4 flex flex-col gap-3 border-b border-rim-soft pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-bold text-space-2">Rekap Nilai Mata Pelajaran</h3>
                    <p className="text-xs text-prose-dim">
                      Kurikulum Merdeka · Semester {selectedSemester}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                    {[1, 2, 3, 4, 5, 6].map((sem) => (
                      <button
                        key={sem}
                        type="button"
                        onClick={() => setSelectedSemester(sem)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                          selectedSemester === sem
                            ? "bg-orbit-1 text-white"
                            : "bg-surface-soft text-prose hover:bg-surface-blue"
                        }`}
                      >
                        Sem {sem}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-rim-soft bg-surface-soft text-prose-dim">
                      <tr>
                        <th className="px-3 py-2.5">Mata Pelajaran</th>
                        <th className="px-3 py-2.5">Kategori</th>
                        <th className="px-3 py-2.5 text-center">KKM</th>
                        <th className="px-3 py-2.5 text-center">Nilai</th>
                        <th className="px-3 py-2.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rim-soft">
                      {student.raporMapel.map((mapel) => {
                        const score = mapel.scores[selectedSemester] ?? 0;
                        const isTuntas = score >= mapel.kkm;
                        return (
                          <tr key={mapel.key} className="hover:bg-surface-soft/40">
                            <td className="px-3 py-3 font-semibold text-space-2">{mapel.name}</td>
                            <td className="px-3 py-3 text-prose-dim">{mapel.category}</td>
                            <td className="px-3 py-3 text-center font-mono text-prose-dim">
                              {mapel.kkm}
                            </td>
                            <td className="px-3 py-3 text-center font-bold text-space-2">
                              {score}
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                  isTuntas
                                    ? "bg-tint-green-bg text-tint-green-fg"
                                    : "bg-alert-bg text-alert-fg"
                                }`}
                              >
                                {isTuntas ? "Tuntas" : "Perlu Bimbingan"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-rim-soft pt-3 text-xs">
                  <span className="text-prose-dim">Rata-rata Semester {selectedSemester}:</span>
                  <span className="text-base font-bold text-orbit-1">{currentSemesterAvg}</span>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-card border border-rim-soft bg-white p-6 shadow-card">
                <div>
                  <h3 className="text-base font-bold text-space-2">Tren Rerata Rapor</h3>
                  <p className="text-xs text-prose-dim">Perjalanan nilai siswa (Sem 1 s/d 6)</p>
                </div>

                <div className="my-4 h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={studentTrendData} margin={{ top: 8, right: 8, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F8" vertical={false} />
                      <XAxis
                        dataKey="sem"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#5F6B8A", fontFamily: "Poppins" }}
                      />
                      <YAxis
                        domain={[60, 100]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#5F6B8A", fontFamily: "Poppins" }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#101A33",
                          border: "none",
                          borderRadius: "10px",
                          color: "#FFFFFF",
                          fontSize: "11px",
                          fontFamily: "Poppins",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="avg"
                        stroke="#0965FA"
                        strokeWidth={2.5}
                        dot={{ fill: "#0965FA", r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="border-t border-rim-soft pt-3 text-xs text-prose-dim">
                  Data rapor terhubung dengan analisis kelayakan SNBP dan pemetaan jurusan.
                </div>
              </div>
            </div>

            {/* Ringkasan Tryout TKA / SNBT / SKD */}
            <BkTryoutSummaryCard tryout={student.tryout} />

            {/* Minat & Bakat + Target & Rekomendasi Pendidikan */}
            <BkMinatRekomendasiSection
              minatList={student.minatList}
              bakatList={student.bakatList}
              rekomendasiPendidikan={student.rekomendasiPendidikan}
            />
          </div>
        )}

        {/* ═══════════════════════════ TAB 3: PRESTASI ═══════════════════════════ */}
        {activeTab === "prestasi" && (
          <div className="rounded-card border border-rim-soft bg-white p-6 shadow-card">
            <h2 className="mb-1 text-base font-bold text-space-2">Daftar Prestasi & Piagam Siswa</h2>
            <p className="mb-6 text-xs text-prose-dim">
              Sertifikat kejuaraan akademik dan non-akademik yang terdata
            </p>

            {student.achievements.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {student.achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="flex items-start gap-3.5 rounded-xl border border-rim-soft bg-surface-soft p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tint-amber-bg text-sun-1">
                      <Trophy size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold leading-snug text-space-2">{ach.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                        <span className="rounded-md border border-rim-soft bg-white px-2 py-0.5 font-semibold text-orbit-1">
                          Tingkat {ach.level}
                        </span>
                        <span className="rounded-md border border-rim-soft bg-white px-2 py-0.5 font-medium text-prose">
                          Tahun {ach.year}
                        </span>
                        <span className="rounded-md border border-rim-soft bg-white px-2 py-0.5 font-medium text-prose">
                          {ach.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Trophy}
                title="Belum Ada Data Prestasi"
                description="Siswa belum menambahkan piagam atau sertifikat perlombaan."
              />
            )}
          </div>
        )}

        {/* ═══════════════════════════ TAB 4: BIMBINGAN BK ═══════════════════════════ */}
        {activeTab === "bk" && (
          <div className="space-y-5">
            {/* Ringkasan Konseling AI */}
            <section className="relative rounded-card border border-orbit-1/25 bg-gradient-to-br from-surface-blue via-white to-surface-soft p-5 shadow-card sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-bold text-space-2">
                  <Sparkles size={18} className="text-orbit-1" aria-hidden="true" />
                  <span>{BRAND.name} AI — Ringkasan Konseling</span>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${PRIORITY_BADGE[topPriority].wrap}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_BADGE[topPriority].dot}`} />
                  Prioritas {topPriority}
                </span>
              </div>
              <p className="mt-1 text-xs text-prose-dim">
                Ringkasan otomatis berdasarkan seluruh riwayat konseling siswa.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-prose">
                {notes.length > 0
                  ? `Berdasarkan riwayat konseling terbaru pada topik "${notes[0].topik}", ${notes[0].rekomendasi} Tindak lanjut yang disarankan: ${notes[0].tindakLanjut}`
                  : "Siswa dalam kondisi baik dan belum memiliki catatan intervensi konseling khusus."}
              </p>
            </section>

            {/* Timeline Riwayat Konseling + Tombol Tambah Catatan */}
            <section className="rounded-card border border-rim-soft bg-white p-5 shadow-card sm:p-6">
              <div className="flex flex-col gap-3 border-b border-rim-soft pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-bold text-space-2">Riwayat Konseling</h2>
                  <p className="text-xs italic text-sun-1">Diurutkan dari catatan terbaru</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex h-10 items-center gap-2 self-start rounded-xl bg-orbit-1 px-4 text-xs font-bold text-white shadow-cta transition hover:brightness-95 sm:self-auto"
                >
                  <Plus size={16} aria-hidden="true" />
                  <span>Tambah Catatan</span>
                </button>
              </div>

              {notes.length === 0 ? (
                <EmptyState
                  icon={MessageSquareText}
                  title="Belum Ada Catatan Konseling"
                  description="Tambahkan catatan konseling pertama untuk mendokumentasikan sesi bimbingan dan koordinasi dengan wali kelas."
                />
              ) : (
                <div className="relative mt-6 space-y-5 pl-7">
                  <div
                    aria-hidden="true"
                    className="absolute bottom-2 left-2.5 top-2 w-0.5 rounded-full bg-gradient-to-b from-orbit-1 to-orbit-1/10"
                  />

                  {notes.map((note) => {
                    const pStyle = PRIORITY_BADGE[note.prioritas];
                    return (
                      <div key={note.id} className="relative">
                        <span
                          aria-hidden="true"
                          className={`absolute -left-[22px] top-5 h-3 w-3 rounded-full border-2 border-white shadow-sm ${pStyle.dot}`}
                        />

                        <div className="space-y-4 rounded-2xl border border-rim-soft bg-surface-soft/50 p-4 sm:p-5">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h3 className="text-sm font-bold text-space-2">{note.topik}</h3>
                              <p className="mt-0.5 text-xs text-prose-dim">
                                {note.konselor} · {note.tanggal}
                              </p>
                            </div>
                            <span
                              className={`inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border px-3 py-1 text-[11px] font-bold ${pStyle.wrap}`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${pStyle.dot}`} />
                              Prioritas {note.prioritas}
                            </span>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-prose-dim">
                                Catatan Konselor
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-prose">{note.catatan}</p>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-prose-dim">
                                  Rekomendasi
                                </p>
                                <p className="mt-1 flex items-start gap-1.5 text-xs leading-relaxed text-space-2">
                                  <Lightbulb
                                    size={14}
                                    className="mt-0.5 shrink-0 text-sun-1"
                                    aria-hidden="true"
                                  />
                                  <span>{note.rekomendasi}</span>
                                </p>
                              </div>

                              <div className="rounded-xl border border-rim-soft bg-white p-3">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-orbit-1">
                                  Tindak Lanjut untuk Wali Kelas
                                </p>
                                <p className="mt-1 text-xs font-semibold leading-relaxed text-space-2">
                                  → {note.tindakLanjut}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Modal Tambah Catatan BK */}
            <BkAddNoteModal
              isOpen={showAddModal}
              studentId={student.id}
              studentName={student.nama}
              studentKelas={student.kelas}
              defaultKonselor={user?.name ?? "Hendra Raharjo, S.Psi."}
              onClose={() => setShowAddModal(false)}
              onSaved={(created) => setNotes((prev) => [created, ...prev])}
            />
          </div>
        )}
      </div>
    </div>
  );
}
