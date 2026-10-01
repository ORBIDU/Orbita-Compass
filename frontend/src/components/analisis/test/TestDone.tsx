import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CircleCheck } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { BIDANG } from "@/config/bidang";
import { TEST_DONE } from "@/content/analisis";
import { formatAnswer, questionNumbers } from "@/lib/asesmen";
import { formatKelas } from "@/lib/user";
import type { AsesmenDoc, AssessmentSummary } from "@/types/analisis";
import type { BidangKey } from "@/types/jurusan";
import Dialog from "@/components/ui/Dialog";

const longDate = (iso: string) => new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));

interface TestDoneProps {
  doc: AsesmenDoc;
  summary: AssessmentSummary;
  /** Bidang paling selaras dari Compass saat ini (untuk baris "Terbaru"). */
  latestBidang: BidangKey | null;
}

function HistoryRow({ kelas, date, bidang, latest }: { kelas: string; date: string; bidang: BidangKey | null; latest: boolean }) {
  return (
    <li className="flex items-start justify-between gap-3 border-b border-rim-faint py-3.5 last:border-b-0">
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-space-2">{kelas}</span>
        <span className="text-xs text-prose-dim">{longDate(date)}</span>
        {bidang && <span className="text-[13px] text-space-1">{TEST_DONE.topField(BIDANG[bidang].label)}</span>}
      </span>
      {latest && <span className="shrink-0 rounded-full bg-tint-blue-bg px-2.5 py-[3px] text-xs font-semibold text-tint-blue-fg">{TEST_DONE.latest}</span>}
    </li>
  );
}

/** Tes sudah selesai: ringkasan, tombol ke Compass, jawaban terbaru, dan riwayat per kelas. */
export default function TestDone({ doc, summary, latestBidang }: TestDoneProps) {
  const [showAnswers, setShowAnswers] = useState(false);
  const numbers = useMemo(() => questionNumbers(doc), [doc]);
  const kelas = formatKelas(summary.grade);

  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:gap-6">
      <section className="flex flex-col gap-4 rounded-card border border-rim-soft bg-white p-5 lg:p-8">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-tint-green-bg text-tint-green-fg">
          <CircleCheck size={28} aria-hidden="true" />
        </span>
        <h2 className="text-xl font-bold text-space-2 lg:text-2xl">{TEST_DONE.title}</h2>
        <p className="text-sm leading-relaxed text-prose lg:text-[15px]">{TEST_DONE.body(longDate(summary.completedAt), kelas)}</p>
        <div className="mt-1 flex flex-col gap-2.5 sm:flex-row">
          <Link
            to={ROUTES.compass}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-orbit-1 px-5 text-[15px] font-semibold text-white hover:brightness-95"
          >
            {TEST_DONE.toCompass}
            <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
          </Link>
          {summary.answers && (
            <button
              type="button"
              onClick={() => setShowAnswers(true)}
              className="h-12 rounded-xl border-[1.5px] border-rim bg-white px-[18px] text-[15px] font-semibold text-space-1 hover:bg-surface-soft"
            >
              {TEST_DONE.myAnswers}
            </button>
          )}
        </div>
      </section>

      <section aria-labelledby="riwayat-kelas" className="flex flex-col gap-3 rounded-card border border-rim-soft bg-white p-5 lg:p-6">
        <h3 id="riwayat-kelas" className="text-base font-bold text-space-2">
          {TEST_DONE.historyTitle}
        </h3>
        <ul>
          <HistoryRow kelas={kelas} date={summary.completedAt} bidang={latestBidang} latest />
          {summary.previous.map((h) => (
            <HistoryRow key={h.grade} kelas={formatKelas(h.grade)} date={h.completedAt} bidang={h.topBidang} latest={false} />
          ))}
        </ul>
        <p className="text-[13px] leading-normal text-prose-dim">{TEST_DONE.historyNote}</p>
      </section>

      {showAnswers && summary.answers && (
        <Dialog title={TEST_DONE.answersTitle} onClose={() => setShowAnswers(false)} widthClass="max-w-[720px]">
          <p className="-mt-2 text-sm text-prose">{TEST_DONE.answersNote}</p>
          <div className="flex flex-col gap-5">
            {doc.sections.map((s) => (
              <section key={s.id} className="flex flex-col gap-2">
                <h3 className="text-[15px] font-bold text-space-2">{s.title}</h3>
                <dl className="flex flex-col divide-y divide-rim-faint rounded-xl border border-rim-soft">
                  {s.questions.map((q) => (
                    <div key={q.id} className="flex flex-col gap-1 px-3.5 py-2.5">
                      <dt className="text-[13px] text-prose">
                        <span className="mr-1.5 font-semibold tabular-nums">{numbers[q.id]}.</span>
                        {q.text}
                      </dt>
                      <dd className="text-sm font-medium text-space-2">{formatAnswer(q, summary.answers![q.id])}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </Dialog>
      )}
    </div>
  );
}
