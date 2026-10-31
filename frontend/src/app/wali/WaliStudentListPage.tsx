import { useState, useMemo } from "react";
import { Search, Download, UploadCloud, Users } from "lucide-react";
import { useAsync } from "@/lib/useAsync";
import { getWaliProfile, getWaliStudents } from "@/services/waliService";
import PageLoader from "@/components/ui/PageLoader";
import { PanelError } from "@/components/ui/PanelState";
import EmptyState from "@/components/ui/EmptyState";
import WaliStudentTable from "@/components/wali/WaliStudentTable";
import WaliImportModal from "@/components/wali/WaliImportModal";

export default function WaliStudentListPage() {
  const { data: students, loading, error, reload } = useAsync(() => getWaliStudents(), []);
  const { data: wali } = useAsync(() => getWaliProfile(), []);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isImportOpen, setIsImportOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!students) return [];
    return students.filter((s) => {
      const matchSearch =
        s.nama.toLowerCase().includes(search.toLowerCase()) ||
        s.nisn.includes(search);
      const matchStatus =
        statusFilter === "all" || s.statusProfil === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [students, search, statusFilter]);

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[1240px] px-4 pt-6 sm:px-6 lg:px-8">
        <PanelError onRetry={reload} />
      </div>
    );
  }
  if (loading || !students) return <PageLoader fullscreen />;

  return (
    <div className="flex-1 overflow-y-auto bg-surface-soft">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        {/* Header Title & Subtitle */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-space-2 sm:text-3xl">
              Pusat Data Siswa
            </h1>
            <p className="mt-1 text-sm text-prose-dim">
              Kelola data profil, rapor akademik, dan capaian siswa{wali?.kelas ? ` kelas ${wali.kelas}` : ""}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-space-2 border border-rim-soft shadow-card self-start sm:self-auto">
            <Users size={16} className="text-orbit-1" />
            <span>Total: <strong>{students.length} Siswa</strong></span>
          </div>
        </div>

        {/* Toolbar: Search, Filter, Unduh Template, Impor Rekap */}
        <div className="flex flex-col gap-3 rounded-card border border-rim-soft bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-prose-dim"
              aria-hidden="true"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama siswa atau NISN..."
              className="h-11 w-full rounded-xl border border-rim-soft bg-field-bg pl-10 pr-4 text-xs font-medium text-space-2 placeholder:text-field-hint focus:border-orbit-1 focus:bg-white focus:outline-none transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter Status Profil */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 rounded-xl border border-rim-soft bg-white px-3 text-xs font-semibold text-space-2 focus:border-orbit-1 focus:outline-none"
            >
              <option value="all">Semua Status Profil</option>
              <option value="lengkap">Profil Lengkap</option>
              <option value="sebagian">Profil Sebagian</option>
              <option value="belum">Profil Belum Lengkap</option>
            </select>

            {/* Unduh Template */}
            <button
              type="button"
              onClick={() => alert("Mengunduh template_rapor_kurikulum_merdeka.xlsx")}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-rim-soft bg-white px-4 text-xs font-semibold text-space-2 transition hover:bg-surface-soft hover:text-orbit-1"
            >
              <Download size={15} />
              <span className="hidden sm:inline">Unduh Template</span>
            </button>

            {/* Impor Nilai */}
            <button
              type="button"
              onClick={() => setIsImportOpen(true)}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-sun-x px-4 text-xs font-bold text-space-2 shadow-sun hover:brightness-105 transition"
            >
              <UploadCloud size={16} />
              <span>Impor Rekap Nilai</span>
            </button>
          </div>
        </div>

        {/* Tabel Siswa */}
        {filtered.length > 0 ? (
          <WaliStudentTable students={filtered} />
        ) : (
          <div className="rounded-card border border-rim-soft bg-white p-8">
            <EmptyState
              icon={Users}
              title="Tidak ada siswa yang cocok"
              description={`Tidak ditemukan siswa dengan kata kunci "${search}" atau filter yang dipilih.`}
            />
          </div>
        )}

        {/* Modal Impor */}
        <WaliImportModal
          isOpen={isImportOpen}
          kelas={wali?.kelas}
          onClose={() => setIsImportOpen(false)}
          onSuccess={() => {
            reload();
          }}
        />
      </div>
    </div>
  );
}
