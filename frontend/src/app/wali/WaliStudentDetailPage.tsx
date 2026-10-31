import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  GraduationCap,
  Trophy,
  MessageSquareText,
  Briefcase,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAsync } from "@/lib/useAsync";
import { getWaliStudentDetail } from "@/services/waliService";
import PageLoader from "@/components/ui/PageLoader";
import { PanelError } from "@/components/ui/PanelState";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";
import { ROUTES } from "@/config/navigation";

type TabKey = "profil" | "akademik" | "prestasi" | "bk";

export default function WaliStudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const studentId = Number(id) || 1;
  const { data: student, loading, error, reload } = useAsync(() => getWaliStudentDetail(studentId), [studentId]);

  const [activeTab, setActiveTab] = useState<TabKey>("profil");
  const [selectedSemester, setSelectedSemester] = useState<number>(5);

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[1240px] px-4 pt-6 sm:px-6 lg:px-8">
        <PanelError onRetry={reload} />
      </div>
    );
  }
  if (loading || !student) return <PageLoader fullscreen />;

  // Kalkulasi rata-rata semester terpilih
  const currentSemesterScores = student.raporMapel.map((m) => m.scores[selectedSemester] ?? 0);
  const currentSemesterAvg =
    currentSemesterScores.length > 0
      ? (
          currentSemesterScores.reduce((a, b) => a + b, 0) /
          currentSemesterScores.length
        ).toFixed(1)
      : "0";

  // Data tren semester siswa untuk grafik
  const studentTrendData = [1, 2, 3, 4, 5, 6].map((sem) => {
    const scores = student.raporMapel.map((m) => m.scores[sem] ?? 0);
    const avg =
      scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : 0;
    return {
      sem: `Sem ${sem}`,
      avg: Number(avg.toFixed(1)),
    };
  });

  const attendancePct = Math.round(
    (student.absensi.hadir / student.absensi.total) * 100
  );

  return (
    <div className="flex-1 overflow-y-auto bg-surface-soft">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        {/* Tombol Kembali */}
        <div>
          <Link
            to={ROUTES.walikelasSiswa}
            className="inline-flex items-center gap-2 text-xs font-semibold text-prose transition hover:text-orbit-1"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Pusat Data Siswa</span>
          </Link>
        </div>

        {/* Header Profil Siswa */}
        <div className="rounded-card border border-rim-soft bg-white p-6 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar
                src={null}
                initials={student.nama.slice(0, 2).toUpperCase()}
                className={`h-16 w-16 text-lg font-bold text-white shadow-card ${
                  student.jk === "L" ? "bg-orbit-1" : "bg-sun-1"
                }`}
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-space-2 sm:text-2xl">
                    {student.nama}
                  </h1>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      student.statusProfil === "lengkap"
                        ? "bg-tint-green-bg text-tint-green-fg"
                        : "bg-tint-amber-bg text-tint-amber-fg"
                    }`}
                  >
                    Profil {student.statusProfil === "lengkap" ? "Lengkap" : "Sebagian"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-prose-dim">
                  NISN: <span className="font-mono font-semibold text-space-2">{student.nisn}</span> · Kelas {student.kelas} · {student.jk === "L" ? "Laki-laki" : "Perempuan"}
                </p>
              </div>
            </div>

            {/* Metrik Siswa */}
            <div className="flex items-center gap-4 border-t border-rim-soft pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
              <div className="text-right">
                <span className="text-xs text-prose-dim block">Rata-rata Kumulatif</span>
                <span className="text-2xl font-bold text-orbit-1">
                  {student.avgNilai.toFixed(1).replace(".", ",")}
                </span>
              </div>
            </div>
          </div>

          {/* Navigasi Tab */}
          <div className="mt-6 flex flex-wrap gap-2 border-t border-rim-soft pt-4">
            {[
              { id: "profil", label: "Profil & Absensi", icon: User },
              { id: "akademik", label: "Nilai Rapor", icon: GraduationCap },
              { id: "prestasi", label: `Prestasi (${student.achievements.length})`, icon: Trophy },
              { id: "bk", label: `Bimbingan BK (${student.bkNotes.length})`, icon: MessageSquareText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabKey)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-orbit-1 text-white shadow-cta"
                      : "bg-surface-soft text-space-2 hover:bg-surface-blue hover:text-orbit-1"
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Profil & Absensi */}
        {activeTab === "profil" && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Data Diri & Keluarga */}
            <div className="rounded-card border border-rim-soft bg-white p-6 shadow-card space-y-5">
              <div>
                <h3 className="text-base font-bold text-space-2">Informasi Pribadi & Kontak</h3>
                <p className="text-xs text-prose-dim">Biodata siswa dan data wali murid</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-prose-dim block">Tempat, Tanggal Lahir</span>
                  <span className="font-semibold text-space-2 mt-0.5 block">{student.tempatTanggalLahir}</span>
                </div>
                <div>
                  <span className="text-prose-dim block">Agama</span>
                  <span className="font-semibold text-space-2 mt-0.5 block">{student.agama}</span>
                </div>
                <div>
                  <span className="text-prose-dim block">Email Siswa</span>
                  <span className="font-semibold text-space-2 mt-0.5 block">{student.email}</span>
                </div>
                <div>
                  <span className="text-prose-dim block">No. HP Orang Tua</span>
                  <span className="font-semibold text-space-2 mt-0.5 block">{student.keluarga.noHpOrtu}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-prose-dim block">Alamat Domisili</span>
                  <span className="font-semibold text-space-2 mt-0.5 block">{student.keluarga.alamat}</span>
                </div>
              </div>

              <div className="border-t border-rim-soft pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-prose-dim mb-3">
                  Data Orang Tua / Wali
                </h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-prose-dim block">Nama Ayah</span>
                    <span className="font-semibold text-space-2 mt-0.5 block">{student.keluarga.namaAyah} ({student.keluarga.pekerjaanAyah})</span>
                  </div>
                  <div>
                    <span className="text-prose-dim block">Nama Ibu</span>
                    <span className="font-semibold text-space-2 mt-0.5 block">{student.keluarga.namaIbu} ({student.keluarga.pekerjaanIbu})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Minat Belajar & Rekap Absensi */}
            <div className="space-y-6">
              {/* Absensi */}
              <div className="rounded-card border border-rim-soft bg-white p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-space-2">Rekapitulasi Kehadiran</h3>
                    <p className="text-xs text-prose-dim">Persentase presensi semester berjalan</p>
                  </div>
                  <span className="text-lg font-bold text-success">{attendancePct}%</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="rounded-xl bg-surface-soft p-3">
                    <span className="text-xs text-prose-dim block">Hadir</span>
                    <span className="text-lg font-bold text-success">{student.absensi.hadir}</span>
                  </div>
                  <div className="rounded-xl bg-surface-soft p-3">
                    <span className="text-xs text-prose-dim block">Izin</span>
                    <span className="text-lg font-bold text-orbit-1">{student.absensi.izin}</span>
                  </div>
                  <div className="rounded-xl bg-surface-soft p-3">
                    <span className="text-xs text-prose-dim block">Sakit</span>
                    <span className="text-lg font-bold text-warning">{student.absensi.sakit}</span>
                  </div>
                  <div className="rounded-xl bg-surface-soft p-3">
                    <span className="text-xs text-prose-dim block">Alpa</span>
                    <span className="text-lg font-bold text-danger">{student.absensi.alpa}</span>
                  </div>
                </div>
              </div>

              {/* Gaya Belajar & Minat */}
              <div className="rounded-card border border-rim-soft bg-white p-6 shadow-card">
                <h3 className="text-base font-bold text-space-2 mb-1">Gaya Belajar & Minat Karier</h3>
                <p className="text-xs text-prose-dim mb-4">Hasil pemetaan asesmen awal</p>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <GraduationCap size={16} className="text-orbit-1 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-prose-dim block">Gaya Belajar Dominan:</span>
                      <strong className="text-space-2">{student.belajar.gayaBelajar}</strong>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Briefcase size={16} className="text-sun-1 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-prose-dim block">Rencana Cita-cita / Prodi Target:</span>
                      <strong className="text-space-2">{student.belajar.citaCita}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Nilai Rapor Akademik */}
        {activeTab === "akademik" && (
          <div className="space-y-6">
            {/* Toolbar Semester & Grafik Tren */}
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              {/* Tabel Nilai Mapel */}
              <div className="rounded-card border border-rim-soft bg-white p-6 shadow-card">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-rim-soft pb-4 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-space-2">
                      Rekap Nilai Mata Pelajaran
                    </h3>
                    <p className="text-xs text-prose-dim">
                      Kurikulum Merdeka · Semester {selectedSemester}
                    </p>
                  </div>

                  {/* Switcher Semester */}
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
                        <th className="py-2.5 px-3">Mata Pelajaran</th>
                        <th className="py-2.5 px-3">Kategori</th>
                        <th className="py-2.5 px-3 text-center">KKM</th>
                        <th className="py-2.5 px-3 text-center">Nilai</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rim-soft">
                      {student.raporMapel.map((mapel) => {
                        const score = mapel.scores[selectedSemester] ?? 0;
                        const isTuntas = score >= mapel.kkm;
                        return (
                          <tr key={mapel.key} className="hover:bg-surface-soft/40">
                            <td className="py-3 px-3 font-semibold text-space-2">
                              {mapel.name}
                            </td>
                            <td className="py-3 px-3 text-prose-dim">
                              {mapel.category}
                            </td>
                            <td className="py-3 px-3 text-center font-mono text-prose-dim">
                              {mapel.kkm}
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-space-2">
                              {score}
                            </td>
                            <td className="py-3 px-3 text-center">
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

              {/* Grafik Tren Siswa */}
              <div className="rounded-card border border-rim-soft bg-white p-6 shadow-card flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-space-2">Tren Rerata Semester</h3>
                  <p className="text-xs text-prose-dim">Perjalanan nilai siswa (Sem 1 s/d 6)</p>
                </div>

                <div className="h-48 w-full my-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={studentTrendData} margin={{ top: 8, right: 8, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
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
                          color: "white",
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

                <div className="text-xs text-prose-dim border-t border-rim-soft pt-3">
                  Nilai rapor diverifikasi untuk keperluan SNBP dan seleksi masuk perguruan tinggi.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Prestasi Siswa */}
        {activeTab === "prestasi" && (
          <div className="rounded-card border border-rim-soft bg-white p-6 shadow-card">
            <h3 className="text-base font-bold text-space-2 mb-1">
              Daftar Prestasi & Piagam Siswa
            </h3>
            <p className="text-xs text-prose-dim mb-6">
              Sertifikat kejuaraan akademik dan non-akademik yang terverifikasi
            </p>

            {student.achievements.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {student.achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="flex items-start gap-3.5 rounded-xl border border-rim-soft bg-surface-soft p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tint-amber-bg text-sun-1 font-bold">
                      🏆
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-space-2 leading-snug">
                        {ach.title}
                      </h4>
                      <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                        <span className="rounded-md bg-white px-2 py-0.5 font-semibold text-orbit-1 border border-rim-soft">
                          Tingkat {ach.level}
                        </span>
                        <span className="rounded-md bg-white px-2 py-0.5 font-medium text-prose border border-rim-soft">
                          Tahun {ach.year}
                        </span>
                        <span className="rounded-md bg-white px-2 py-0.5 font-medium text-prose border border-rim-soft">
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

        {/* Tab 4: Bimbingan BK */}
        {activeTab === "bk" && (
          <div className="rounded-card border border-rim-soft bg-white p-6 shadow-card space-y-6">
            <div className="flex items-center justify-between border-b border-rim-soft pb-4">
              <div>
                <h3 className="text-base font-bold text-space-2">
                  Riwayat Bimbingan Konseling (Guru BK)
                </h3>
                <p className="text-xs text-prose-dim">
                  Catatan konsultasi, rekomendasi tindak lanjut, dan observasi perilaku
                </p>
              </div>
            </div>

            {student.bkNotes.length > 0 ? (
              <div className="space-y-4">
                {student.bkNotes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-2xl border border-rim-soft bg-surface-soft p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            note.prioritas === "Tinggi"
                              ? "bg-alert-bg text-alert-fg"
                              : "bg-tint-green-bg text-tint-green-fg"
                          }`}
                        >
                          Prioritas {note.prioritas}
                        </span>
                        <h4 className="text-sm font-bold text-space-2">
                          {note.topik}
                        </h4>
                      </div>
                      <span className="text-xs text-prose-faint">{note.tanggal}</span>
                    </div>

                    <p className="text-xs text-prose leading-relaxed">
                      <strong>Catatan Konselor:</strong> {note.catatan}
                    </p>

                    <div className="rounded-xl bg-white p-3.5 border border-rim-soft text-xs space-y-1.5">
                      <p className="text-prose">
                        <strong className="text-orbit-1">Rekomendasi:</strong> {note.rekomendasi}
                      </p>
                      <p className="text-prose">
                        <strong className="text-success">Tindak Lanjut:</strong> {note.tindakLanjut}
                      </p>
                    </div>

                    <p className="text-[11px] text-prose-dim italic">
                      Konselor: {note.konselor}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={MessageSquareText}
                title="Belum Ada Catatan Konseling"
                description="Siswa ini belum memiliki riwayat bimbingan atau catatan khusus dari Guru BK."
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
