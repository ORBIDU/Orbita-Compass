import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ClipboardList, RotateCcw, Search, Users } from "lucide-react";
import { useAsync } from "@/lib/useAsync";
import { getBkStudents } from "@/services/bkService";
import PageLoader from "@/components/ui/PageLoader";
import { PanelError } from "@/components/ui/PanelState";
import EmptyState from "@/components/ui/EmptyState";
import BkStudentTable from "@/components/bk/BkStudentTable";
import type { BkPendampinganLevel } from "@/types/bk";

const VALID_PRIORITAS = new Set<string>(["pendampingan", "dipantau", "normal"]);

export default function BkStudentListPage() {
  const { data: students, loading, error, reload } = useAsync(() => getBkStudents(), []);
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [kelasFilter, setKelasFilter] = useState<string>(searchParams.get("kelas") ?? "");

  const paramPrioritas = searchParams.get("prioritas") ?? "";
  const [prioritasFilter, setPrioritasFilter] = useState<string>(
    VALID_PRIORITAS.has(paramPrioritas) ? paramPrioritas : "",
  );
  const [onlyBelumTes, setOnlyBelumTes] = useState<boolean>(
    searchParams.get("tesMinat") === "belum",
  );

  const kelasOptions = useMemo(() => {
    if (!students) return [];
    const seen = new Set<string>();
    for (const s of students) seen.add(s.kelas);
    return Array.from(seen).sort();
  }, [students]);

  const filtered = useMemo(() => {
    if (!students) return [];
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      const matchSearch =
        !q || s.nama.toLowerCase().includes(q) || s.nisn.toLowerCase().includes(q);
      const matchKelas = !kelasFilter || s.kelas === kelasFilter;
      const matchPrioritas =
        !prioritasFilter || s.prioritasPendampingan === (prioritasFilter as BkPendampinganLevel);
      const matchTes = !onlyBelumTes || !s.tesMinatSelesai;
      return matchSearch && matchKelas && matchPrioritas && matchTes;
    });
  }, [students, search, kelasFilter, prioritasFilter, onlyBelumTes]);

  const hasActiveFilter = Boolean(search || kelasFilter || prioritasFilter || onlyBelumTes);

  const resetFilters = () => {
    setSearch("");
    setKelasFilter("");
    setPrioritasFilter("");
    setOnlyBelumTes(false);
    setSearchParams({}, { replace: true });
  };

  const updatePrioritas = (val: string) => {
    setPrioritasFilter(val);
    const next = new URLSearchParams(searchParams);
    if (val) next.set("prioritas", val);
    else next.delete("prioritas");
    setSearchParams(next, { replace: true });
  };

  const toggleBelumTes = () => {
    const nextVal = !onlyBelumTes;
    setOnlyBelumTes(nextVal);
    const next = new URLSearchParams(searchParams);
    if (nextVal) next.set("tesMinat", "belum");
    else next.delete("tesMinat");
    setSearchParams(next, { replace: true });
  };

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
        {/* Header Title & Pill Total Siswa */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-space-2 sm:text-3xl">
              Pusat Data Siswa
            </h1>
            <p className="mt-1 text-sm text-prose-dim">
              Pantau profil, status akademik, dan prioritas pendampingan konseling siswa seluruh kelas
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-xl border border-orbit-1/20 bg-tint-blue-bg px-4 py-2 text-xs font-bold text-tint-blue-fg sm:self-auto">
            <Users size={16} aria-hidden="true" />
            <span>Total Siswa: {filtered.length}</span>
          </div>
        </div>

        {/* Toolbar Filter Lintas Kelas (Tanpa impor/unduh rapor) */}
        <div className="flex flex-col gap-3 rounded-card border border-rim-soft bg-white p-4 shadow-card lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
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
              className="h-11 w-full rounded-xl border border-rim-soft bg-field-bg pl-10 pr-4 text-xs font-medium text-space-2 placeholder:text-field-hint transition focus:border-orbit-1 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              aria-label="Filter Kelas"
              value={kelasFilter}
              onChange={(e) => setKelasFilter(e.target.value)}
              className="h-11 rounded-xl border border-rim-soft bg-white px-3.5 text-xs font-semibold text-space-2 focus:border-orbit-1 focus:outline-none"
            >
              <option value="">Semua Kelas</option>
              {kelasOptions.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter Prioritas Pendampingan"
              value={prioritasFilter}
              onChange={(e) => updatePrioritas(e.target.value)}
              className="h-11 rounded-xl border border-rim-soft bg-white px-3.5 text-xs font-semibold text-space-2 focus:border-orbit-1 focus:outline-none"
            >
              <option value="">Semua Prioritas</option>
              <option value="pendampingan">Perlu Pendampingan</option>
              <option value="dipantau">Perlu Dipantau</option>
              <option value="normal">Normal</option>
            </select>

            <button
              type="button"
              onClick={toggleBelumTes}
              aria-pressed={onlyBelumTes}
              className={`inline-flex h-11 items-center gap-2 rounded-xl border px-3.5 text-xs font-semibold transition ${
                onlyBelumTes
                  ? "border-tint-orange-rim bg-tint-amber-bg text-tint-amber-fg"
                  : "border-rim-soft bg-white text-space-2 hover:bg-surface-soft"
              }`}
            >
              <ClipboardList size={15} aria-hidden="true" />
              <span>Belum Tes Minat</span>
            </button>

            {hasActiveFilter && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-rim-soft bg-surface-soft px-3 text-xs font-semibold text-prose transition hover:bg-surface-blue hover:text-orbit-1"
              >
                <RotateCcw size={14} aria-hidden="true" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Tabel Siswa */}
        {filtered.length > 0 ? (
          <BkStudentTable students={filtered} totalCount={students.length} />
        ) : (
          <div className="rounded-card border border-rim-soft bg-white p-8 shadow-card">
            <EmptyState
              icon={Users}
              title="Tidak ada siswa yang cocok"
              description="Coba ubah kata kunci pencarian, pilihan kelas, atau filter prioritas."
              action={
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-orbit-1 px-4 text-xs font-semibold text-white hover:brightness-95"
                >
                  <RotateCcw size={14} aria-hidden="true" />
                  Tampilkan Semua Siswa
                </button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
