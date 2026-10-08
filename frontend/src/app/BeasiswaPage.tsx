import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronRight, Info, Search, SearchX, SlidersHorizontal } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { BEASISWA_HEADER, ELIGIBILITY_NOTE, EMPTY, FILTERS } from "@/content/beasiswa";
import { useAuth } from "@/context/AuthContext";
import { useStudentStatus } from "@/context/StudentStatusContext";
import { activeFilterCount, applyFilters, EMPTY_FILTERS, filtersFromParams, filtersToParams, matchesPath, optionCounts } from "@/lib/beasiswa";
import { useAsync } from "@/lib/useAsync";
import { listScholarships, SCHOLARSHIPS_ARE_SAMPLES } from "@/services/beasiswaService";
import { getStudentPathKeys } from "@/services/jurusanService";
import type { ScholarshipFilters } from "@/types/beasiswa";
import BottomSheet from "@/components/ui/BottomSheet";
import PageLoader from "@/components/ui/PageLoader";
import { PanelError, PanelSkeleton } from "@/components/ui/PanelState";
import FilterPanel from "@/components/beasiswa/FilterPanel";
import ScholarshipCard from "@/components/beasiswa/ScholarshipCard";
import ScholarshipDialog from "@/components/beasiswa/ScholarshipDialog";
import { useSavedScholarships } from "@/components/beasiswa/useSavedScholarships";

/**
 * Explore Beasiswa (/portal/beasiswa), sesuai docs/design/portal/Portal-Beasiswa.dc.html
 * dan SPEK bagian 8. Filter tersimpan di URL; data masih contoh.
 */
export default function BeasiswaPage() {
  const { user } = useAuth();
  const { status, ready } = useStudentStatus();
  const userId = user?.id ?? "";
  const tested = status !== null && status !== "baru";
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => filtersFromParams(params), [params]);

  const scholarships = useAsync(listScholarships, []);
  const paths = useAsync(getStudentPathKeys, [userId, status], ready && tested);
  const saved = useSavedScholarships(userId, ready);
  const [openId, setOpenId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const studentPaths = tested ? (paths.data ?? null) : null;
  const matchUnavailable = !tested ? FILTERS.matchUnavailable.baru : !paths.loading && !paths.data ? FILTERS.matchUnavailable.noCompass : null;
  // Selama "Cocok dengan jalurku" belum bisa dipakai, filternya diabaikan.
  const effective: ScholarshipFilters = matchUnavailable ? { ...filters, matchOnly: false } : filters;

  const all = useMemo(() => scholarships.data ?? [], [scholarships.data]);
  const results = useMemo(() => applyFilters(all, effective, studentPaths, saved.ids), [all, effective, studentPaths, saved.ids]);
  const counts = useMemo(() => optionCounts(all, effective, studentPaths, saved.ids), [all, effective, studentPaths, saved.ids]);
  const open = openId ? all.find((s) => s.id === openId) ?? null : null;
  const active = activeFilterCount(effective);

  function update(next: ScholarshipFilters) {
    setParams(filtersToParams(next), { replace: true });
  }

  if (!user || !ready) return <PageLoader />;

  const panel = (
    <FilterPanel filters={effective} counts={counts} savedCount={saved.ids.length} matchUnavailable={matchUnavailable} onChange={update} />
  );

  return (
    <div className="flex-1 overflow-y-auto bg-surface-soft">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-4 pb-8 pt-4 sm:px-6 lg:gap-6 lg:px-10 lg:pb-12 lg:pt-7">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex max-w-[720px] flex-col gap-1.5 lg:gap-2">
            <nav aria-label="Breadcrumb" className="hidden items-center gap-2 text-[13px] text-prose-dim lg:flex">
              <Link to={ROUTES.portal} className="rounded hover:text-space-2 hover:underline">
                {BEASISWA_HEADER.breadcrumbHome}
              </Link>
              <ChevronRight size={12} strokeWidth={2.4} aria-hidden="true" className="text-prose-faint" />
              <Link to={ROUTES.compass} className="rounded hover:text-space-2 hover:underline">
                {BEASISWA_HEADER.breadcrumbCompass}
              </Link>
              <ChevronRight size={12} strokeWidth={2.4} aria-hidden="true" className="text-prose-faint" />
              <span aria-current="page" className="font-semibold text-space-2">
                {BEASISWA_HEADER.title}
              </span>
            </nav>
            <h1 className="text-2xl font-bold leading-tight text-space-2 lg:text-[30px] lg:tracking-[-0.5px]">{BEASISWA_HEADER.title}</h1>
            <p className="text-sm leading-relaxed text-prose lg:text-[15px]">{BEASISWA_HEADER.description}</p>
          </div>
          {SCHOLARSHIPS_ARE_SAMPLES && (
            <span className="flex items-center gap-2 self-start rounded-full bg-tint-orange-bg px-3.5 py-2 text-[13px] font-semibold text-tint-orange-fg lg:shrink-0 lg:self-auto">
              <Info size={16} aria-hidden="true" className="shrink-0" />
              {BEASISWA_HEADER.sample}
            </span>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-6">
          {/* Filter desktop */}
          <aside aria-label={FILTERS.title} className="hidden flex-col gap-5 rounded-card border border-rim-soft bg-white p-5 lg:flex">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-space-2">{FILTERS.title}</span>
              <button type="button" onClick={() => update({ ...EMPTY_FILTERS, q: filters.q })} className="min-h-9 rounded px-1 text-[13px] font-semibold text-orbit-1 hover:underline">
                {FILTERS.reset}
              </button>
            </div>
            {panel}
          </aside>

          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap lg:gap-4">
              <label className="relative block min-w-0 flex-1 basis-full sm:basis-0">
                <span className="sr-only">{FILTERS.search}</span>
                <Search size={18} aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-prose" />
                <input
                  type="search"
                  value={filters.q}
                  onChange={(e) => update({ ...filters, q: e.target.value })}
                  placeholder={FILTERS.searchPlaceholder}
                  className="h-12 w-full rounded-xl border-[1.5px] border-field-rim bg-white pl-11 pr-4 text-base text-space-2 placeholder:text-field-hint focus:border-orbit-1 focus:outline-none lg:text-[15px]"
                />
              </label>
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                aria-haspopup="dialog"
                className={`flex h-12 items-center gap-2 rounded-xl border-[1.5px] px-4 text-sm font-semibold lg:hidden ${
                  active ? "border-orbit-1 bg-surface-blue text-orbit-1" : "border-field-rim bg-white text-space-1"
                }`}
              >
                <SlidersHorizontal size={18} aria-hidden="true" />
                {active ? FILTERS.openWithCount(active) : FILTERS.open}
              </button>
              <span aria-live="polite" className="ml-auto shrink-0 text-sm tabular-nums text-prose lg:ml-0">
                <strong className="text-space-2">{results.length}</strong> {FILTERS.countUnit}
              </span>
            </div>

            {saved.error && (
              <p role="alert" className="rounded-xl bg-alert-bg px-4 py-2.5 text-sm text-alert-fg">
                {saved.error}
              </p>
            )}

            {scholarships.loading && !scholarships.data ? (
              <PanelSkeleton />
            ) : scholarships.error ? (
              <PanelError onRetry={scholarships.reload} />
            ) : results.length === 0 ? (
              <section className="flex flex-col items-center gap-2.5 rounded-card border border-rim-soft bg-white px-5 py-12 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rim-faint text-prose">
                  <SearchX size={26} aria-hidden="true" />
                </span>
                <h2 className="text-lg font-bold text-space-2">{EMPTY.title}</h2>
                <p className="text-sm text-prose">{EMPTY.body}</p>
                <button
                  type="button"
                  onClick={() => update(EMPTY_FILTERS)}
                  className="mt-1.5 h-11 rounded-xl border-[1.5px] border-rim bg-white px-[18px] text-sm font-semibold text-orbit-1 hover:bg-surface-sky"
                >
                  {EMPTY.cta}
                </button>
              </section>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:gap-4">
                {results.map((s) => (
                  <ScholarshipCard
                    key={s.id}
                    s={s}
                    match={matchesPath(s, studentPaths)}
                    saved={saved.ids.includes(s.id)}
                    busy={saved.busyId === s.id}
                    onToggleSave={() => void saved.toggle(s.id)}
                    onOpen={() => setOpenId(s.id)}
                  />
                ))}
              </div>
            )}

            <div className="flex items-start gap-2.5 rounded-[14px] bg-surface-blue px-4 py-3.5 text-[13px] leading-relaxed text-space-1">
              <Info size={18} aria-hidden="true" className="mt-px shrink-0 text-orbit-1" />
              <span>{ELIGIBILITY_NOTE}</span>
            </div>
          </div>
        </div>
      </div>

      {sheetOpen && (
        <BottomSheet
          title={FILTERS.title}
          onClose={() => setSheetOpen(false)}
          footer={
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => update({ ...EMPTY_FILTERS, q: filters.q })}
                className="h-12 rounded-xl border-[1.5px] border-rim bg-white px-4 text-sm font-semibold text-space-1"
              >
                {FILTERS.reset}
              </button>
              <button type="button" onClick={() => setSheetOpen(false)} className="h-12 flex-1 rounded-xl bg-orbit-1 px-4 text-sm font-semibold text-white">
                {FILTERS.apply(results.length)}
              </button>
            </div>
          }
        >
          <div className="px-3 pt-2">{panel}</div>
        </BottomSheet>
      )}

      {open && (
        <ScholarshipDialog
          s={open}
          match={matchesPath(open, studentPaths)}
          saved={saved.ids.includes(open.id)}
          busy={saved.busyId === open.id}
          onToggleSave={() => void saved.toggle(open.id)}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}
