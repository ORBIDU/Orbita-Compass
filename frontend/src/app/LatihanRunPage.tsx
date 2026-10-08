import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ROUTES, UJIAN_KEYS } from "@/config/navigation";
import { LATIHAN_RUN, SESSION } from "@/content/pengerjaan";
import { useAuth } from "@/context/AuthContext";
import { formatDayName } from "@/lib/datetime";
import { checkAnswer, finishPractice, openPractice, startFreePractice } from "@/services/soalService";
import type { ExamId } from "@/types/practice";
import { ApiError } from "@/services/http";
import { LOAD_ERROR } from "@/content/common";
import type { CheckedAnswer, PracticeSessionView } from "@/types/soal";
import PageLoader from "@/components/ui/PageLoader";
import { ConfirmDialog, NumberPanel, RunError, RunLayout, RunNotice } from "@/components/pengerjaan/RunShell";
import { Feedback, NumberGrid, OptionList, QuestionBody, RunHeader, mmss, useNow, type OptionState } from "@/components/pengerjaan/RunParts";

/**
 * Pengerjaan latihan (/portal/latihan/:id, atau /portal/latihan/bebas?ujian=&subtes=
 * untuk memulai latihan bebas). Mode Latihan di Portal-Pengerjaan.dc.html:
 * pilih → "Cek jawaban" → benar/salah + pembahasan. Jawaban yang sudah dicek
 * dikunci "server", jadi tidak bisa diubah, termasuk lewat refresh.
 */
export default function LatihanRunPage() {
  const { id = "" } = useParams();
  const [params] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id ?? "";
  const grade = user?.profile?.grade ?? 12;

  const [view, setView] = useState<PracticeSessionView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, CheckedAnswer>>({});
  const [index, setIndex] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<"exit" | "finish" | null>(null);
  const [finishing, setFinishing] = useState(false);
  const now = useNow();

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      try {
        if (id === "bebas") {
          const ujian = params.get("ujian") as ExamId | null;
          const subtes = params.get("subtes");
          if (!ujian || !UJIAN_KEYS.includes(ujian) || !subtes) throw new Error();
          const started = await startFreePractice(userId, ujian, subtes);
          // URL sesi yang baru, supaya refresh melanjutkan sesi yang sama.
          if (active) navigate(ROUTES.latihan(started.id), { replace: true });
          return;
        }
        const v = await openPractice(userId, grade, id);
        if (!active) return;
        if (v.finished) {
          navigate(ROUTES.latihanHasil(v.id), { replace: true });
          return;
        }
        setView(v);
        setAnswers(v.answers);
        const firstOpen = v.questions.findIndex((q) => !v.answers[q.id]);
        setIndex(firstOpen < 0 ? v.questions.length - 1 : firstOpen);
      } catch (err) {
        if (active) setError(err instanceof ApiError ? err.message : LOAD_ERROR);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userId]);

  if (error) {
    const ujian = params.get("ujian") as ExamId | null;
    return <RunError message={error} backTo={ujian && UJIAN_KEYS.includes(ujian) ? ROUTES.persiapanUjian(ujian) : ROUTES.actionPlan} />;
  }
  if (!view) return <PageLoader fullscreen label={SESSION.loading} />;

  const v = view;
  const q = v.questions[index];
  const done = answers[q.id] ?? null;
  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.values(answers).filter((a) => a.correct).length;
  const isLast = index === v.questions.length - 1;
  const elapsed = (now - new Date(v.startedAt).getTime()) / 1000;
  const backTo = v.planDate ? ROUTES.actionPlan : ROUTES.persiapanUjian(v.exam);

  function go(i: number) {
    setIndex(i);
    setPick(null);
    setCheckError(null);
  }

  async function check() {
    if (pick === null || checking) return;
    setChecking(true);
    setCheckError(null);
    try {
      const res = await checkAnswer(userId, v.id, q.id, pick);
      setAnswers((a) => ({ ...a, [q.id]: res }));
      setPick(null);
    } catch {
      setCheckError(LATIHAN_RUN.error);
    } finally {
      setChecking(false);
    }
  }

  async function finish() {
    setFinishing(true);
    try {
      await finishPractice(userId, v.id);
      navigate(ROUTES.latihanHasil(v.id), { replace: true });
    } catch {
      setFinishing(false);
      setDialog(null);
      setCheckError(LATIHAN_RUN.error);
    }
  }

  const states: OptionState[] = q.options.map((_, i) => {
    if (!done) return i === pick ? "picked" : "idle";
    if (i === done.answer) return "correct";
    if (i === done.choice) return "wrong";
    return "dim";
  });
  const marks = done ? q.options.map((_, i) => (i === done.answer ? LATIHAN_RUN.markCorrect : i === done.choice ? LATIHAN_RUN.markYours : null)) : undefined;

  const grid = (close: () => void) => (
    <NumberGrid
      items={v.questions.map((qq) => {
        const a = answers[qq.id];
        const tone = !a ? "empty" : a.correct ? "correct" : "wrong";
        return { tone, flagged: false, aria: LATIHAN_RUN.navAria(v.questions.indexOf(qq) + 1, LATIHAN_RUN.state[tone === "empty" ? "empty" : tone]) };
      })}
      current={index}
      onPick={(i) => {
        go(i);
        close();
      }}
      summary={LATIHAN_RUN.summary(answeredCount, correctCount)}
      legend={[
        { label: LATIHAN_RUN.legend.correct, tone: "correct" },
        { label: LATIHAN_RUN.legend.wrong, tone: "wrong" },
        { label: LATIHAN_RUN.legend.empty, tone: "empty" },
        { label: LATIHAN_RUN.legend.current, tone: "current" },
      ]}
    />
  );

  return (
    <RunLayout
      header={
        <RunHeader
          title={v.title}
          sub={v.planDate ? LATIHAN_RUN.fromPlan(formatDayName(v.planDate)) : LATIHAN_RUN.free}
          timer={{ label: LATIHAN_RUN.timerLabel, text: mmss(elapsed), aria: LATIHAN_RUN.timerAria(Math.floor(elapsed / 60), Math.floor(elapsed % 60)), warn: false }}
          finishLabel={LATIHAN_RUN.finish}
          onExit={() => setDialog("exit")}
          onFinish={() => setDialog("finish")}
          busy={finishing}
        />
      }
      aside={<NumberPanel title={SESSION.nav}>{grid}</NumberPanel>}
      notice={checkError && <RunNotice tone="error">{checkError}</RunNotice>}
    >
      <section aria-labelledby="pg-soal" className="flex flex-col gap-5 rounded-card border border-rim-soft bg-white p-4 sm:p-7">
        <QuestionBody question={q} headingId="pg-soal" heading={SESSION.questionOf(index + 1, v.questions.length)} />
        <OptionList question={q} labelledBy="pg-soal" selected={done ? done.choice : pick} states={states} marks={marks} disabled={Boolean(done) || checking} onPick={setPick} />
        {done && (
          <Feedback
            correct={done.correct}
            title={done.correct ? LATIHAN_RUN.correct : LATIHAN_RUN.wrong(SESSION.letters[done.answer])}
            extra={done.points !== undefined ? LATIHAN_RUN.tkpPoints(done.points) : undefined}
            body={done.explanation}
          />
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            className="flex h-[46px] items-center gap-2 rounded-xl border-[1.5px] border-rim px-4 text-sm font-semibold text-space-1 hover:bg-surface-soft disabled:opacity-40"
          >
            <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" />
            {SESSION.prev}
          </button>
          {!done ? (
            <button
              type="button"
              onClick={check}
              disabled={pick === null || checking}
              aria-busy={checking}
              className="h-[46px] rounded-xl bg-orbit-1 px-5 text-sm font-semibold text-white hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {checking ? LATIHAN_RUN.checking : LATIHAN_RUN.check}
            </button>
          ) : isLast ? (
            <button type="button" onClick={() => setDialog("finish")} className="h-[46px] rounded-xl bg-orbit-1 px-5 text-sm font-semibold text-white hover:brightness-95">
              {LATIHAN_RUN.finishLast}
            </button>
          ) : (
            <button type="button" onClick={() => go(index + 1)} className="flex h-[46px] items-center gap-2 rounded-xl bg-orbit-1 px-5 text-sm font-semibold text-white hover:brightness-95">
              {SESSION.next}
              <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
            </button>
          )}
        </div>
      </section>

      {dialog === "exit" && (
        <ConfirmDialog
          kind="exit"
          title={LATIHAN_RUN.exitTitle}
          body={LATIHAN_RUN.exitBody}
          ok={LATIHAN_RUN.exitOk}
          cancel={LATIHAN_RUN.exitCancel}
          onOk={() => navigate(backTo)}
          onCancel={() => setDialog(null)}
        />
      )}
      {dialog === "finish" && (
        <ConfirmDialog
          kind="finish"
          title={LATIHAN_RUN.finishTitle}
          body={LATIHAN_RUN.finishBody(v.questions.length - answeredCount)}
          ok={LATIHAN_RUN.finishOk}
          cancel={LATIHAN_RUN.finishCancel}
          busy={finishing}
          onOk={finish}
          onCancel={() => setDialog(null)}
        />
      )}
    </RunLayout>
  );
}
