import { useMemo, useState } from "react";
import { ChevronDown, FileText, Info } from "lucide-react";
import { RAPOR } from "@/content/analisis";
import { averageScore, formatScore } from "@/lib/rapor";
import type { AsyncState } from "@/lib/useAsync";
import { DESKTOP_QUERY, useMediaQuery } from "@/lib/useMediaQuery";
import type { RaporData, RaporSemester } from "@/types/analisis";
import { PanelError, PanelSkeleton } from "@/components/ui/PanelState";
import RaporTrendChart from "./RaporTrendChart";

const ROMAN: Record<number, string> = { 10: "X", 11: "XI", 12: "XII" };
const longDate = (iso: string) => new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));

/** Mapel yang dipilih pertama kali: Matematika jika ada. */
function defaultSubject(subjects: string[]): string {
  return subjects.find((s) => s === "Matematika") ?? subjects[0];
}

function DetailToggle({ open, onClick, controls }: { open: boolean; onClick: () => void; controls: string }) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={controls}
      onClick={onClick}
      className="flex h-10 shrink-0 items-center gap-1.5 rounded-[10px] border border-rim bg-white px-3 text-[13px] font-semibold text-orbit-1 hover:bg-surface-soft lg:h-9"
    >
      {open ? RAPOR.close : RAPOR.detail}
      <ChevronDown size={14} strokeWidth={2.4} aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
  );
}

function avgText(s: RaporSemester): string {
  const avg = averageScore(s.subjects);
  if (avg !== null) return formatScore(avg);
  return s.ongoing ? RAPOR.notAvailable : RAPOR.notInput;
}

function SemesterDetail({ semester, id }: { semester: RaporSemester; id: string }) {
  return (
    <div id={id} className="flex flex-col border-t border-rim-faint lg:mx-6 lg:mb-5 lg:grid lg:grid-cols-4 lg:gap-2.5 lg:rounded-[14px] lg:border-0 lg:bg-surface-soft lg:p-4">
      {semester.subjects.map((m) => (
        <div
          key={m.subject}
          className="flex min-h-10 items-center justify-between gap-3 border-b border-field-track text-[13px] last:border-b-0 lg:min-h-0 lg:gap-2 lg:rounded-[10px] lg:border-0 lg:bg-white lg:px-3 lg:py-2.5"
        >
          <span className="text-space-1">{m.subject}</span>
          <span className="font-bold tabular-nums text-space-2">{m.score}</span>
        </div>
      ))}
    </div>
  );
}

/** Tab Nilai Rapor: hanya baca, diinput sekolah (Kurikulum Merdeka). */
export default function RaporPanel({ state }: { state: AsyncState<RaporData> }) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const data = state.data;
  const semesters = useMemo(() => data?.semesters ?? [], [data]);
  const subjects = useMemo(() => {
    const seen: string[] = [];
    for (const s of semesters) for (const m of s.subjects) if (!seen.includes(m.subject)) seen.push(m.subject);
    return seen;
  }, [semesters]);
  const [picked, setPicked] = useState<string | null>(null);
  const subject = picked && subjects.includes(picked) ? picked : defaultSubject(subjects);
  const withScores = semesters.filter((s) => s.subjects.length > 0);
  const [open, setOpen] = useState<number | null>(() => null);
  const openSemester = open ?? withScores[withScores.length - 1]?.semester ?? null;

  if (state.loading && !data) return <PanelSkeleton />;
  if (state.error || !data) return <PanelError onRetry={state.reload} />;

  const ongoing = semesters.find((s) => s.ongoing);
  const toggle = (sem: number) => setOpen(openSemester === sem ? -1 : sem);

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <div className="flex gap-2.5 rounded-[14px] bg-surface-blue px-3.5 py-3 text-[13px] leading-normal text-space-1 lg:items-center lg:px-4 lg:text-sm">
        <Info size={18} aria-hidden="true" className="mt-px shrink-0 text-orbit-1 lg:mt-0" />
        <span className="flex-1">{RAPOR.info}</span>
        {data.updatedAt && <span className="hidden shrink-0 text-xs text-prose lg:inline">{RAPOR.source(longDate(data.updatedAt))}</span>}
      </div>
      {data.updatedAt && <span className="-mt-2 text-xs text-prose lg:hidden">{RAPOR.source(longDate(data.updatedAt))}</span>}

      {withScores.length === 0 ? (
        <section className="flex flex-col items-center gap-3 rounded-card border border-rim-soft bg-white px-5 py-12 text-center lg:px-12 lg:py-14">
          <span className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-rim-faint text-prose">
            <FileText size={30} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <h2 className="text-lg font-bold text-space-2 lg:text-xl">{RAPOR.empty.title}</h2>
          <p className="max-w-[540px] text-sm leading-relaxed text-prose lg:text-[15px]">{RAPOR.empty.body}</p>
        </section>
      ) : (
        <>
          <section aria-labelledby="rapor-tren" className="flex flex-col gap-3 rounded-[18px] border border-rim-soft bg-white p-4 lg:gap-4 lg:rounded-card lg:p-6">
            {/* Mapel bisa belasan, jadi chip ditaruh di bawah judul (desain contoh hanya 5 chip). */}
            <div className="flex flex-col gap-3">
              <h2 id="rapor-tren" className="text-[17px] font-bold text-space-2 lg:text-lg">
                {RAPOR.trendTitle}
              </h2>
              <div role="group" aria-label={RAPOR.subjectGroup} className="flex flex-wrap gap-1.5">
                {subjects.map((m) => {
                  const on = m === subject;
                  return (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setPicked(m)}
                      className={`h-9 rounded-[10px] border-[1.5px] px-3 text-[13px] font-semibold transition-colors ${
                        on ? "border-orbit-1 bg-orbit-1 text-white" : "border-field-rim bg-white text-space-1 hover:border-orbit-1"
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
            <RaporTrendChart semesters={semesters} subject={subject} compact={!isDesktop} />
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-prose lg:text-[13px]">
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="h-[3px] w-[22px] rounded-sm bg-orbit-1" />
                {subject}
              </span>
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="w-[22px] border-t-2 border-dashed border-rim-box" />
                {RAPOR.average}
              </span>
              {ongoing && !isDesktop && <span>{RAPOR.ongoingShort(ongoing.semester)}</span>}
            </div>
          </section>

          <section aria-labelledby="rapor-tabel" className="flex flex-col gap-3 lg:gap-0 lg:overflow-hidden lg:rounded-card lg:border lg:border-rim-soft lg:bg-white">
            <h2 id="rapor-tabel" className="mt-1 text-[17px] font-bold text-space-2 lg:mt-0 lg:border-b lg:border-rim-soft lg:px-6 lg:py-5 lg:text-lg">
              {RAPOR.tableTitle}
            </h2>

            {/* Kepala tabel (desktop) */}
            <div
              aria-hidden="true"
              className="hidden grid-cols-[1.2fr_0.8fr_1fr_0.8fr_1.2fr_0.9fr] border-b border-rim-soft bg-field-bg px-6 py-3 text-xs font-semibold text-prose-dim lg:grid"
            >
              <span>{RAPOR.columns.semester}</span>
              <span>{RAPOR.columns.kelas}</span>
              <span>{RAPOR.columns.year}</span>
              <span>{RAPOR.columns.count}</span>
              <span>{RAPOR.columns.avg}</span>
              <span />
            </div>

            <ul className="flex flex-col gap-3 lg:gap-0">
              {semesters.map((s) => {
                const has = s.subjects.length > 0;
                const isOpen = has && openSemester === s.semester;
                const detailId = `rapor-sem-${s.semester}`;
                const kelas = ROMAN[s.grade] ?? String(s.grade);
                return (
                  <li key={s.semester} className="flex flex-col gap-2.5 rounded-[18px] border border-rim-soft bg-white p-4 lg:gap-0 lg:rounded-none lg:border-0 lg:border-b lg:border-rim-faint lg:p-0">
                    {/* HP: kartu */}
                    <div className="flex items-start justify-between gap-3 lg:hidden">
                      <div className="flex flex-col">
                        <span className="text-[15px] font-bold text-space-2">
                          {RAPOR.semester(s.semester)}, {s.term}
                        </span>
                        <span className="text-xs text-prose-dim">{RAPOR.kelasYear(`Kelas ${kelas}`, s.schoolYear)}</span>
                      </div>
                      <span className={`shrink-0 text-right font-bold tabular-nums ${has ? "text-xl text-space-2" : "text-sm text-field-hint"}`}>{avgText(s)}</span>
                    </div>
                    {has && (
                      <div className="flex items-center justify-between gap-3 lg:hidden">
                        <span className="text-xs tabular-nums text-prose">{RAPOR.countAvg(s.subjects.length)}</span>
                        <DetailToggle open={isOpen} onClick={() => toggle(s.semester)} controls={detailId} />
                      </div>
                    )}

                    {/* Desktop: baris tabel */}
                    <div className="hidden min-h-[60px] grid-cols-[1.2fr_0.8fr_1fr_0.8fr_1.2fr_0.9fr] items-center px-6 text-sm text-space-2 lg:grid">
                      <span className="flex flex-col">
                        <span className="font-semibold">{RAPOR.semester(s.semester)}</span>
                        <span className="text-xs text-prose-dim">{s.term}</span>
                      </span>
                      <span>{kelas}</span>
                      <span>{s.schoolYear}</span>
                      <span className="tabular-nums">{has ? s.subjects.length : "–"}</span>
                      <span className={`font-bold tabular-nums ${has ? "" : "text-field-hint"}`}>{avgText(s)}</span>
                      <span className="flex justify-end">{has && <DetailToggle open={isOpen} onClick={() => toggle(s.semester)} controls={detailId} />}</span>
                    </div>

                    {isOpen && <SemesterDetail semester={s} id={detailId} />}
                  </li>
                );
              })}
            </ul>
            <p className="text-[13px] text-prose-dim lg:px-6 lg:py-3.5">{RAPOR.footnote}</p>
          </section>
        </>
      )}
    </div>
  );
}
