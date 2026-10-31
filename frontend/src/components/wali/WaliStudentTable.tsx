import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight, Minus, ChevronRight } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { ROUTES } from "@/config/navigation";
import type { StudentSummary } from "@/types/wali";

interface WaliStudentTableProps {
  students: StudentSummary[];
}

export default function WaliStudentTable({ students }: WaliStudentTableProps) {
  const statusBadge = (status: StudentSummary["statusProfil"]) => {
    switch (status) {
      case "lengkap":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-tint-green-bg px-2.5 py-0.5 text-xs font-semibold text-tint-green-fg">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Lengkap
          </span>
        );
      case "sebagian":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-tint-amber-bg px-2.5 py-0.5 text-xs font-semibold text-tint-amber-fg">
            <span className="h-1.5 w-1.5 rounded-full bg-warning" />
            Sebagian
          </span>
        );
      case "belum":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-alert-bg px-2.5 py-0.5 text-xs font-semibold text-alert-fg">
            <span className="h-1.5 w-1.5 rounded-full bg-danger" />
            Belum
          </span>
        );
    }
  };

  const trendBadge = (tren: StudentSummary["tren"]) => {
    switch (tren) {
      case "naik":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
            <ArrowUpRight size={15} />
            Naik
          </span>
        );
      case "turun":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-danger">
            <ArrowDownRight size={15} />
            Turun
          </span>
        );
      case "stabil":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-orbit-1">
            <Minus size={15} />
            Stabil
          </span>
        );
    }
  };

  return (
    <div className="overflow-hidden rounded-card border border-rim-soft bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-rim-soft bg-surface-soft text-[11px] font-bold uppercase tracking-wider text-prose-dim">
            <tr>
              <th scope="col" className="px-4 py-3.5 text-center w-12">No</th>
              <th scope="col" className="px-4 py-3.5">Nama Siswa</th>
              <th scope="col" className="px-4 py-3.5">NISN</th>
              <th scope="col" className="px-3 py-3.5 text-center">JK</th>
              <th scope="col" className="px-4 py-3.5 text-center">Status Profil</th>
              <th scope="col" className="px-4 py-3.5 text-center">Rerata</th>
              <th scope="col" className="px-4 py-3.5 text-center">Tren</th>
              <th scope="col" className="px-3 py-3.5 text-center">Prestasi</th>
              <th scope="col" className="px-4 py-3.5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rim-soft">
            {students.map((student, idx) => (
              <tr
                key={student.id}
                className="transition hover:bg-surface-soft/60"
              >
                <td className="px-4 py-3 text-center text-xs font-medium text-prose-dim">
                  {idx + 1}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      initials={student.nama.slice(0, 2).toUpperCase()}
                      className={`h-9 w-9 text-xs font-bold text-white ${
                        student.jk === "L" ? "bg-orbit-1" : "bg-sun-1"
                      }`}
                    />
                    <div>
                      <p className="font-semibold text-space-2 leading-tight">
                        {student.nama}
                      </p>
                      <p className="text-[11px] text-prose-dim mt-0.5">
                        {student.kelas}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-prose">
                  {student.nisn}
                </td>
                <td className="px-3 py-3 text-center">
                  <span className="inline-block rounded-md bg-surface-soft px-2 py-0.5 text-xs font-semibold text-space-2">
                    {student.jk}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {statusBadge(student.statusProfil)}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="font-bold text-space-2">
                    {student.avgNilai.toFixed(1).replace(".", ",")}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {trendBadge(student.tren)}
                </td>
                <td className="px-3 py-3 text-center">
                  {student.prestasiCount > 0 ? (
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-tint-blue-bg px-1.5 text-xs font-bold text-orbit-1">
                      {student.prestasiCount}
                    </span>
                  ) : (
                    <span className="text-prose-faint">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <Link
                    to={ROUTES.walikelasDetailSiswa(student.id)}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-rim-soft bg-white px-3 text-xs font-semibold text-space-2 transition hover:border-orbit-1 hover:bg-surface-blue hover:text-orbit-1"
                  >
                    <span>Detail</span>
                    <ChevronRight size={14} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
