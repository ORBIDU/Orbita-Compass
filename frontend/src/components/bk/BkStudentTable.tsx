import { Link } from "react-router-dom";
import { ChevronRight, Trophy } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { ROUTES } from "@/config/navigation";
import type { BkPendampinganLevel, BkRekapStatus, BkStudentSummary } from "@/types/bk";

interface BkStudentTableProps {
  students: BkStudentSummary[];
  totalCount: number;
}

const PROFIL_BADGE: Record<
  BkStudentSummary["statusProfil"],
  { label: string; wrap: string; dot: string }
> = {
  lengkap: { label: "Lengkap", wrap: "bg-tint-green-bg text-tint-green-fg", dot: "bg-success" },
  sebagian: { label: "Sebagian", wrap: "bg-tint-amber-bg text-tint-amber-fg", dot: "bg-warning" },
  belum: { label: "Belum Lengkap", wrap: "bg-alert-bg text-alert-fg", dot: "bg-danger" },
};

const REKAP_BADGE: Record<BkRekapStatus, { label: string; wrap: string; dot: string }> = {
  lengkap: { label: "Lengkap", wrap: "bg-tint-green-bg text-tint-green-fg", dot: "bg-success" },
  belum_lengkap: { label: "Belum Lengkap", wrap: "bg-alert-bg text-alert-fg", dot: "bg-danger" },
  belum_diunggah: { label: "Belum Diunggah", wrap: "bg-surface-soft text-prose-dim", dot: "bg-prose-faint" },
};

const PRIORITAS_BADGE: Record<
  BkPendampinganLevel,
  { label: string; wrap: string; dot: string }
> = {
  pendampingan: { label: "Perlu Pendampingan", wrap: "bg-alert-bg text-alert-fg", dot: "bg-danger" },
  dipantau: { label: "Perlu Dipantau", wrap: "bg-tint-amber-bg text-tint-amber-fg", dot: "bg-warning" },
  normal: { label: "Normal", wrap: "bg-tint-green-bg text-tint-green-fg", dot: "bg-success" },
};

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function BkStudentTable({ students, totalCount }: BkStudentTableProps) {
  return (
    <div className="overflow-hidden rounded-card border border-rim-soft bg-white shadow-card">
      <div className="border-b border-rim-soft px-5 py-4">
        <h2 className="text-base font-bold text-space-2">Daftar Siswa</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-rim-soft bg-surface-soft text-[11px] font-bold uppercase tracking-wider text-prose-dim">
            <tr>
              <th scope="col" className="px-5 py-3.5">Nama</th>
              <th scope="col" className="px-4 py-3.5">Profil</th>
              <th scope="col" className="px-4 py-3.5">Rekap Nilai</th>
              <th scope="col" className="px-4 py-3.5 text-center">Prestasi</th>
              <th scope="col" className="px-4 py-3.5">Prioritas Pendampingan</th>
              <th scope="col" className="px-5 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rim-soft">
            {students.map((student) => {
              const profil = PROFIL_BADGE[student.statusProfil];
              const rekap = REKAP_BADGE[student.rekapStatus];
              const prioritas = PRIORITAS_BADGE[student.prioritasPendampingan];

              return (
                <tr key={student.id} className="transition hover:bg-surface-soft/60">
                  {/* Nama & Kelas */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={null}
                        initials={getInitials(student.nama)}
                        className={`h-9 w-9 text-xs font-bold text-white ${
                          student.jk === "L" ? "bg-gradient-orbit" : "bg-gradient-sun"
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold leading-tight text-space-2">{student.nama}</p>
                          <span className="rounded-md bg-tint-blue-bg px-2 py-0.5 text-[10px] font-bold text-tint-blue-fg">
                            {student.kelas}
                          </span>
                        </div>
                        <p className="mt-0.5 font-mono text-[11px] text-prose-dim">
                          NISN {student.nisn}
                          {!student.tesMinatSelesai && (
                            <span className="ml-2 font-sans font-semibold text-sun-1">
                              · Belum Tes Minat
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Profil */}
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${profil.wrap}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${profil.dot}`} />
                      {profil.label}
                    </span>
                  </td>

                  {/* Rekap Nilai */}
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-xs font-medium text-space-2">
                        {student.rekapSemester}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${rekap.wrap}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${rekap.dot}`} />
                        {rekap.label}
                      </span>
                    </div>
                  </td>

                  {/* Prestasi */}
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold ${
                        student.prestasiCount > 0 ? "text-sun-1" : "text-prose-faint"
                      }`}
                    >
                      <Trophy size={14} aria-hidden="true" />
                      {student.prestasiCount}
                    </span>
                  </td>

                  {/* Prioritas Pendampingan */}
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${prioritas.wrap}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${prioritas.dot}`} />
                      {prioritas.label}
                    </span>
                  </td>

                  {/* Aksi */}
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      to={ROUTES.bkDetailSiswa(student.id)}
                      className="inline-flex h-8 items-center gap-1 rounded-lg bg-orbit-1 px-3.5 text-xs font-semibold text-white shadow-sm transition hover:brightness-95"
                    >
                      <span>Detail</span>
                      <ChevronRight size={14} aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-rim-soft px-5 py-3 text-xs text-prose-dim">
        Menampilkan <strong className="text-space-2">{students.length}</strong> dari{" "}
        <strong className="text-space-2">{totalCount}</strong> siswa
      </div>
    </div>
  );
}
