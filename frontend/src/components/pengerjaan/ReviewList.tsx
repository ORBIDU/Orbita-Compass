import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { LAPORAN, SESSION } from "@/content/pengerjaan";
import type { ReviewItem } from "@/types/soal";

type Filter = "salah" | "ragu" | "kosong" | "semua";

const statusOf = (it: ReviewItem) => (it.choice === null ? "kosong" : it.correct ? "benar" : "salah");
const STATUS_TONE = {
  benar: "bg-tint-green-bg text-tint-green-fg",
  salah: "bg-alert-bg text-alert-fg",
  kosong: "bg-rim-faint text-prose",
};

/**
 * Pembahasan soal dengan saringan Salah / Ragu-ragu / Tidak dijawab / Semua
 * (Portal-Laporan.dc.html). Dipakai laporan tryout dan hasil latihan.
 */
export default function ReviewList({
  items,
  subjects,
  withFlags,
}: {
  items: (ReviewItem & { subject?: string })[];
  /** Pilihan subtes (laporan tryout). Kosong = tanpa pilihan subtes. */
  subjects?: { subject: string; name: string }[];
  /** false untuk latihan (tidak ada ragu-ragu). */
  withFlags: boolean;
}) {
  const wrongCount = items.filter((i) => statusOf(i) === "salah").length;
  const [filter, setFilter] = useState<Filter>(wrongCount > 0 ? "salah" : "semua");
  const [subject, setSubject] = useState<string>("");
  const [open, setOpen] = useState<number[]>([]);

  const inSubject = items.filter((i) => !subject || i.subject === subject);
  const pass = (i: ReviewItem) =>
    filter === "semua" || (filter === "salah" && statusOf(i) === "salah") || (filter === "ragu" && i.flagged) || (filter === "kosong" && statusOf(i) === "kosong");
  const counts: Record<Filter, number> = {
    salah: inSubject.filter((i) => statusOf(i) === "salah").length,
    ragu: inSubject.filter((i) => i.flagged).length,
    kosong: inSubject.filter((i) => statusOf(i) === "kosong").length,
    semua: inSubject.length,
  };
  const filters: Filter[] = withFlags ? ["salah", "ragu", "kosong", "semua"] : ["salah", "kosong", "semua"];
  const shown = inSubject.filter(pass);
  const letter = (i: number) => SESSION.letters[i];

  return (
    <section aria-labelledby="lp-bahas" className="flex flex-col gap-4 rounded-card border border-rim-soft bg-white p-4 sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2 id="lp-bahas" className="text-[17px] font-bold text-space-2">
          {LAPORAN.reviewTitle}
        </h2>
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          {subjects && subjects.length > 1 && (
            <label className="flex items-center gap-2 text-[13px] font-semibold text-prose">
              {LAPORAN.subjectFilter}
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-10 min-w-0 flex-1 rounded-[10px] border-[1.5px] border-field-rim bg-white px-2.5 text-[13px] text-space-2"
              >
                <option value="">{LAPORAN.allSubjects}</option>
                {subjects.map((s) => (
                  <option key={s.subject} value={s.subject}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="-mx-1 overflow-x-auto px-1">
            <div role="group" aria-label={LAPORAN.filterLabel} className="flex min-w-max rounded-xl bg-rim-faint p-1">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  className={`h-[34px] whitespace-nowrap rounded-[9px] px-3 text-[13px] font-semibold ${filter === f ? "bg-white text-space-2 shadow-toggle" : "text-prose"}`}
                >
                  {LAPORAN.filters[f]} <span className="font-medium tabular-nums">({counts[f]})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {shown.length === 0 && <p className="rounded-xl bg-surface-soft p-4 text-sm text-prose">{LAPORAN.emptyFilter}</p>}
      {shown.map((it) => {
        const st = statusOf(it);
        const isOpen = open.includes(it.no);
        const yours = it.choice === null ? LAPORAN.none : `${letter(it.choice)}. ${it.question.options[it.choice]}`;
        return (
          <article key={it.no} className="flex flex-col gap-3 rounded-2xl border border-rim-soft p-4 sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-bold tabular-nums text-orbit-1">{LAPORAN.questionNo(it.no)}</span>
              <span className="flex flex-wrap gap-1.5">
                {it.flagged && <span className="rounded-full bg-tint-orange-bg px-2.5 py-[3px] text-xs font-semibold text-tint-orange-fg">{LAPORAN.filters.ragu}</span>}
                <span className={`rounded-full px-2.5 py-[3px] text-xs font-bold ${STATUS_TONE[st]}`}>{LAPORAN.status[st]}</span>
              </span>
            </div>
            {it.question.passage && <p className="whitespace-pre-line rounded-xl bg-surface-soft p-3 text-sm leading-relaxed text-space-1">{it.question.passage}</p>}
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-space-2">{it.question.text}</p>
            <div className="flex flex-wrap gap-2.5 text-sm">
              <span className={`rounded-[10px] px-3 py-1.5 ${STATUS_TONE[st]}`}>
                {LAPORAN.yours} <strong>{yours}</strong>
                {it.points && it.choice !== null && ` (${LAPORAN.tkpPoints(it.points[it.choice])})`}
              </span>
              <span className="rounded-[10px] bg-tint-green-bg px-3 py-1.5 text-tint-green-fg">
                {LAPORAN.key} <strong>{`${letter(it.answer)}. ${it.question.options[it.answer]}`}</strong>
              </span>
            </div>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`bahas-${it.no}`}
              onClick={() => setOpen((o) => (isOpen ? o.filter((x) => x !== it.no) : [...o, it.no]))}
              className="flex min-h-9 items-center gap-1.5 self-start text-sm font-semibold text-orbit-1"
            >
              {isOpen ? LAPORAN.hideExplanation : LAPORAN.showExplanation}
              <ChevronDown size={14} strokeWidth={2.4} aria-hidden="true" className={isOpen ? "rotate-180" : ""} />
            </button>
            {isOpen && (
              <p id={`bahas-${it.no}`} className="rounded-xl bg-surface-soft px-4 py-3.5 text-sm leading-relaxed text-space-1">
                {it.explanation}
              </p>
            )}
          </article>
        );
      })}
    </section>
  );
}
