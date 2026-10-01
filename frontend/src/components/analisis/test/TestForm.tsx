import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CircleCheck, ChevronDown, Sparkles } from "lucide-react";
import { TEST } from "@/content/analisis";
import { answeredCount, isSectionDone, questionNumbers, withDefaultRankings } from "@/lib/asesmen";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { saveDraft } from "@/services/assessmentService";
import type { AsesmenAnswer, AsesmenAnswers, AsesmenDoc, AsesmenDraft } from "@/types/analisis";
import QuestionInput from "./QuestionInput";
import SectionNav from "./SectionNav";

type SaveState = { status: "idle" | "saving" | "saved" | "error"; savedAt: string | null };

interface TestFormProps {
  doc: AsesmenDoc;
  userId: string;
  initialDraft: AsesmenDraft | null;
  /** Jumlah bagian selesai berubah (untuk kartu kelengkapan dan chip tab). */
  onProgress: (sectionsDone: number) => void;
  onAnalyze: (answers: AsesmenAnswers) => void;
}

const AUTOSAVE_MS = 600;

function timeOf(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

/**
 * Tes Gambaran Minat Bakat per bagian. Jawaban tersimpan otomatis setiap
 * berubah; "Simpan & Analisis" aktif setelah semua bagian lengkap.
 */
export default function TestForm({ doc, userId, initialDraft, onProgress, onAnalyze }: TestFormProps) {
  const total = doc.sections.length;
  const [index, setIndex] = useState(() => Math.min(initialDraft?.sectionIndex ?? 0, total - 1));
  const [answers, setAnswers] = useState<AsesmenAnswers>(() =>
    withDefaultRankings(doc.sections[Math.min(initialDraft?.sectionIndex ?? 0, total - 1)], initialDraft?.answers ?? {}),
  );
  const [save, setSave] = useState<SaveState>({ status: initialDraft?.savedAt ? "saved" : "idle", savedAt: initialDraft?.savedAt ?? null });
  const [manualSaved, setManualSaved] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const section = doc.sections[index];
  const numbers = useMemo(() => questionNumbers(doc), [doc]);
  const doneFlags = doc.sections.map((s) => isSectionDone(s, answers));
  const doneCount = doneFlags.filter(Boolean).length;
  const isLast = index === total - 1;
  const thisDone = doneFlags[index];
  const allDone = doneCount === total;
  const answered = answeredCount(section, answers);

  useEffect(() => onProgress(doneCount), [doneCount, onProgress]);

  const persist = useCallback(
    async (next: AsesmenAnswers, sectionIndex: number) => {
      setSave((s) => ({ ...s, status: "saving" }));
      try {
        const draft = await saveDraft(userId, next, sectionIndex);
        setSave({ status: "saved", savedAt: draft.savedAt });
        return true;
      } catch {
        setSave((s) => ({ ...s, status: "error" }));
        return false;
      }
    },
    [userId],
  );

  // Simpan otomatis sebentar setelah jawaban atau bagian berubah.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = window.setTimeout(() => void persist(answers, index), AUTOSAVE_MS);
    return () => window.clearTimeout(t);
  }, [answers, index, persist]);

  function setAnswer(questionId: string, value: AsesmenAnswer) {
    setManualSaved(false);
    setAnswers((a) => ({ ...a, [questionId]: value }));
  }

  function goTo(next: number) {
    if (next < 0 || next >= total || next === index) return;
    setIndex(next);
    setListOpen(false);
    // Soal urutan langsung punya jawaban awal (urutan bawaan), sesuai desain.
    setAnswers((a) => withDefaultRankings(doc.sections[next], a));
    requestAnimationFrame(() => {
      rootRef.current?.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
      const heading = [...(rootRef.current?.querySelectorAll<HTMLElement>("[data-section-heading]") ?? [])].find((el) => el.offsetParent !== null);
      heading?.focus({ preventScroll: true });
    });
  }

  async function saveNow() {
    const ok = await persist(answers, index);
    setManualSaved(ok);
  }

  const incompleteOthers = doc.sections
    .map((_, i) => (!doneFlags[i] && i !== index ? TEST.sectionShort(i + 1) : null))
    .filter(Boolean)
    .join(", ");
  const analyzeHint = !isLast || allDone ? null : !thisDone ? TEST.hintThisSection : TEST.hintOtherSections(incompleteOthers);

  const saveText =
    save.status === "saving"
      ? TEST.saving
      : save.status === "error"
        ? TEST.saveError
        : save.savedAt
          ? TEST.savedAt(timeOf(save.savedAt))
          : TEST.notSaved;

  const headingId = `asesmen-${section.id}`;
  const progressBar = (
    <div className="h-2 rounded-full bg-surface-track">
      <div className="h-full rounded-full bg-gradient-orbit-x transition-[width]" style={{ width: `${(doneCount / total) * 100}%` }} />
    </div>
  );

  return (
    <div ref={rootRef} className="flex scroll-mt-4 flex-col gap-4 lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:gap-6">
      {/* Panel kiri (desktop) */}
      <aside className="hidden flex-col gap-3.5 rounded-card border border-rim-soft bg-white p-5 lg:flex">
        <div className="flex flex-col gap-2">
          <span className="text-[15px] font-bold text-space-2">{TEST.sectionsTitle}</span>
          {progressBar}
          <span className="text-[13px] text-prose">{TEST.sectionsDone(doneCount, total)}</span>
        </div>
        <SectionNav sections={doc.sections} doneFlags={doneFlags} current={index} onPick={goTo} variant="aside" />
      </aside>

      {/* Kartu progres (HP) */}
      <section className="flex flex-col gap-2.5 rounded-[18px] border border-rim-soft bg-white p-4 lg:hidden">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[13px] font-semibold text-orbit-1">{TEST.sectionOf(index + 1, total)}</span>
          <span className="text-xs tabular-nums text-prose">{TEST.sectionsDoneShort(doneCount, total)}</span>
        </div>
        {progressBar}
        <h2 id={`${headingId}-m`} data-section-heading tabIndex={-1} className="mt-1 text-[19px] font-bold text-space-2 focus:outline-none">
          {section.title}
        </h2>
        <p className="text-[13px] leading-relaxed text-prose">{section.description}</p>
        <button
          type="button"
          aria-expanded={listOpen}
          onClick={() => setListOpen((v) => !v)}
          className="flex min-h-10 items-center gap-1.5 self-start rounded text-sm font-semibold text-orbit-1"
        >
          {listOpen ? TEST.hideList : TEST.showList}
          <ChevronDown size={14} strokeWidth={2.4} aria-hidden="true" className={`transition-transform ${listOpen ? "rotate-180" : ""}`} />
        </button>
        {listOpen && <SectionNav sections={doc.sections} doneFlags={doneFlags} current={index} onPick={goTo} variant="compact" />}
      </section>

      {/* Soal bagian ini */}
      <section aria-labelledby={headingId} className="flex flex-col gap-4 lg:gap-0 lg:overflow-hidden lg:rounded-card lg:border lg:border-rim-soft lg:bg-white">
        <div className="hidden items-end justify-between gap-6 border-b border-rim-soft px-7 pb-5 pt-6 lg:flex">
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-orbit-1">{TEST.sectionOf(index + 1, total)}</span>
            <h2 id={headingId} data-section-heading tabIndex={-1} className="text-[22px] font-bold text-space-2 focus:outline-none">
              {section.title}
            </h2>
            <p className="text-sm leading-relaxed text-prose">{section.description}</p>
          </div>
          <span className="shrink-0 rounded-full bg-field-track px-3 py-1.5 text-[13px] font-semibold tabular-nums text-space-1">
            {TEST.answered(answered, section.questions.length)}
          </span>
        </div>

        <div className="flex flex-col gap-4 lg:gap-0 lg:px-7 lg:py-2">
          {section.questions.map((q) => (
            <QuestionInput key={q.id} question={q} number={numbers[q.id]} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />
          ))}
        </div>

        {/* Bilah bawah: status simpan + tombol */}
        <div className="flex flex-col gap-2.5 rounded-[18px] border border-rim-soft bg-white px-4 py-3.5 lg:gap-2 lg:rounded-none lg:border-0 lg:border-t lg:bg-field-bg lg:px-7 lg:py-4">
          <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
            <span
              role="status"
              className={`flex items-center gap-2 text-xs lg:text-[13px] ${save.status === "error" ? "text-alert-fg" : save.savedAt ? "text-tint-green-fg" : "text-prose"}`}
            >
              {save.status !== "error" && save.savedAt && <CircleCheck size={16} aria-hidden="true" className="shrink-0" />}
              {saveText}
            </span>

            <div className="grid grid-cols-[52px_minmax(0,1fr)] gap-2.5 lg:flex">
              {index > 0 ? (
                <button
                  type="button"
                  onClick={() => goTo(index - 1)}
                  aria-label={TEST.prev}
                  className="flex h-[50px] items-center justify-center rounded-xl border-[1.5px] border-rim bg-white text-sm font-semibold text-space-1 hover:bg-surface-soft lg:h-[46px] lg:px-[18px]"
                >
                  <ArrowLeft size={18} strokeWidth={2.2} aria-hidden="true" className="lg:hidden" />
                  <span className="hidden lg:inline">{TEST.prev}</span>
                </button>
              ) : (
                <span className="lg:hidden" />
              )}

              {!isLast ? (
                <button
                  type="button"
                  onClick={() => goTo(index + 1)}
                  className="flex h-[50px] items-center justify-center gap-2 rounded-xl bg-orbit-1 px-5 text-[15px] font-semibold text-white hover:brightness-95 lg:h-[46px] lg:text-sm"
                >
                  {TEST.next(index + 2)}
                  <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!allDone}
                  onClick={() => onAnalyze(answers)}
                  aria-describedby={analyzeHint ? "asesmen-analyze-hint" : undefined}
                  className="flex h-[50px] items-center justify-center gap-2 rounded-xl bg-gradient-sun-x px-5 text-[15px] font-semibold text-space-2 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45 lg:order-last lg:h-[46px] lg:text-sm"
                >
                  <Sparkles size={16} aria-hidden="true" />
                  {TEST.analyze}
                </button>
              )}

              {isLast && (
                <button
                  type="button"
                  onClick={saveNow}
                  disabled={save.status === "saving"}
                  className="col-span-2 h-[46px] rounded-xl border-[1.5px] border-rim bg-white px-[18px] text-sm font-semibold text-space-1 hover:bg-surface-soft disabled:opacity-60"
                >
                  {manualSaved ? TEST.saved : TEST.save}
                </button>
              )}
            </div>
          </div>
          {analyzeHint && (
            <span id="asesmen-analyze-hint" className="text-xs text-tint-orange-fg lg:self-end">
              {analyzeHint}
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
