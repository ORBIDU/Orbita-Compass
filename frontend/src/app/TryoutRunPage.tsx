import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Flag } from "lucide-react";
import { ROUTES, UJIAN_KEYS } from "@/config/navigation";
import { LOAD_ERROR } from "@/content/common";
import { EXAM_COPY } from "@/content/siapUjian";
import { SESSION, TRYOUT_RUN, joinNames } from "@/content/pengerjaan";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/services/http";
import { finishTryoutSection, openTryout, saveTryoutAnswer } from "@/services/soalService";
import type { ExamId } from "@/types/practice";
import type { TryoutView } from "@/types/soal";
import PageLoader from "@/components/ui/PageLoader";
import { ConfirmDialog, NumberPanel, RunError, RunLayout, RunNotice } from "@/components/pengerjaan/RunShell";
import { FlagChip, NumberGrid, OptionList, QuestionBody, RunHeader, mmss, useNow, type OptionState } from "@/components/pengerjaan/RunParts";

const examOf = (packageId: string): ExamId => {
  const prefix = packageId.split("-")[0] as ExamId;
  return UJIAN_KEYS.includes(prefix) ? prefix : "snbt";
};

/**
 * Pengerjaan tryout (/portal/tryout/:paket), mode Tryout di Portal-Pengerjaan.dc.html.
 * - Timer per subtes dihitung dari deadline yang disimpan "server" (bukan
 *   hitung mundur di memori), jadi refresh atau menutup halaman tidak mereset.
 * - Jawaban dan ragu-ragu tersimpan otomatis setiap berubah.
 * - Paket terkunci ditolak dan diarahkan ke tab Tryout; paket selesai diarahkan ke laporan.
 * - Tidak ada kunci jawaban maupun pembahasan selama tryout.
 */
export default function TryoutRunPage() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id ?? "";
  const exam = examOf(id);

  const [view, setView] = useState<TryoutView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flags, setFlags] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [saveError, setSaveError] = useState(false);
  const [dialog, setDialog] = useState<"exit" | "finish" | null>(null);
  const [busy, setBusy] = useState(false);
  /** Selisih jam "server" − jam perangkat. */
  const offset = useRef(0);
  const autoFinishing = useRef(false);
  const now = useNow(500);

  const load = useCallback(async () => {
    try {
      const v = await openTryout(userId, id);
      if (!v.current) {
        navigate(ROUTES.laporan(id), { replace: true });
        return;
      }
      offset.current = new Date(v.serverNow).getTime() - Date.now();
      setView(v);
      setAnswers(v.answers);
      setFlags(v.flags);
      setIndex(0);
      if (v.expired.length) setNotice(TRYOUT_RUN.expired(joinNames(v.expired)));
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) navigate(ROUTES.laporan(id), { replace: true });
      else if (err instanceof ApiError && err.status === 403)
        navigate(`${ROUTES.persiapanUjian(exam)}?tab=tryout`, { replace: true, state: { notice: err.message } });
      else setError(err instanceof ApiError ? err.message : LOAD_ERROR);
    }
  }, [userId, id, exam, navigate]);

  useEffect(() => {
    if (user) void load();
  }, [user, load]);

  const finishSection = useCallback(
    async (auto: boolean) => {
      if (!view?.current) return;
      setBusy(true);
      try {
        const done = await finishTryoutSection(userId, id);
        setDialog(null);
        if (done) {
          navigate(ROUTES.laporan(id), { replace: true });
          return;
        }
        setNotice(auto ? TRYOUT_RUN.timeUp(view.current.name) : null);
        await load();
      } catch (err) {
        setError(err instanceof ApiError ? err.message : LOAD_ERROR);
      } finally {
        setBusy(false);
        autoFinishing.current = false;
      }
    },
    [view, userId, id, navigate, load],
  );

  const remaining = view?.current ? (new Date(view.current.deadline).getTime() - (now + offset.current)) / 1000 : 0;

  // Waktu habis di layar → subtes dikumpulkan otomatis dengan jawaban yang tersimpan.
  useEffect(() => {
    if (view?.current && remaining <= 0 && !autoFinishing.current) {
      autoFinishing.current = true;
      void finishSection(true);
    }
  }, [remaining, view, finishSection]);

  if (error) return <RunError message={error} backTo={`${ROUTES.persiapanUjian(exam)}?tab=tryout`} />;
  if (!view?.current) return <PageLoader fullscreen label={busy ? TRYOUT_RUN.grading : SESSION.loading} />;

  const cur = view.current;
  const q = cur.questions[index];
  const chosen = answers[q.id] ?? null;
  const flagged = flags.includes(q.id);
  const answeredHere = cur.questions.filter((x) => answers[x.id] !== undefined).length;
  const flaggedHere = cur.questions.filter((x) => flags.includes(x.id)).length;
  const emptyHere = cur.questions.length - answeredHere;
  const isLastSection = cur.index === view.sections.length - 1;

  function persist(qid: string, choice: number | null, flag: boolean) {
    setSaveError(false);
    saveTryoutAnswer(userId, id, qid, choice, flag).catch(() => setSaveError(true));
  }
  function pickOption(i: number) {
    setAnswers((a) => ({ ...a, [q.id]: i }));
    persist(q.id, i, flagged);
  }
  function toggleFlag() {
    const next = !flagged;
    setFlags((f) => (next ? [...f, q.id] : f.filter((x) => x !== q.id)));
    persist(q.id, chosen, next);
  }

  const states: OptionState[] = q.options.map((_, i) => (i === chosen ? "picked" : "idle"));
  const grid = (close: () => void) => (
    <NumberGrid
      items={cur.questions.map((qq, i) => {
        const a = answers[qq.id] !== undefined;
        const f = flags.includes(qq.id);
        return { tone: a ? "answered" : "empty", flagged: f, aria: TRYOUT_RUN.navAria(i + 1, a, f) };
      })}
      current={index}
      onPick={(i) => {
        setIndex(i);
        close();
      }}
      summary={TRYOUT_RUN.summary(answeredHere, flaggedHere, emptyHere)}
      legend={[
        { label: TRYOUT_RUN.legend.answered, tone: "answered" },
        { label: TRYOUT_RUN.legend.empty, tone: "empty" },
        { label: TRYOUT_RUN.legend.flagged, tone: "empty", flagged: true },
        { label: TRYOUT_RUN.legend.current, tone: "current" },
      ]}
    />
  );

  return (
    <RunLayout
      header={
        <RunHeader
          title={`${view.name} ${EXAM_COPY[view.exam].short}`}
          sub={TRYOUT_RUN.sub(cur.index + 1, view.sections.length, cur.name)}
          timer={{
            label: TRYOUT_RUN.timerLabel,
            text: mmss(remaining),
            aria: TRYOUT_RUN.timerAria(Math.floor(Math.max(0, remaining) / 60), Math.floor(Math.max(0, remaining) % 60)),
            warn: true,
          }}
          finishLabel={TRYOUT_RUN.finishSection}
          onExit={() => setDialog("exit")}
          onFinish={() => setDialog("finish")}
          busy={busy}
        />
      }
      aside={<NumberPanel title={SESSION.nav}>{grid}</NumberPanel>}
      notice={
        <>
          {notice && <RunNotice>{notice}</RunNotice>}
          {saveError && <RunNotice tone="error">{TRYOUT_RUN.saveError}</RunNotice>}
        </>
      }
    >
      <section aria-labelledby="pg-soal" className="flex flex-col gap-5 rounded-card border border-rim-soft bg-white p-4 sm:p-7">
        <QuestionBody
          question={q}
          headingId="pg-soal"
          heading={SESSION.questionOf(index + 1, cur.questions.length)}
          chip={flagged ? <FlagChip label={TRYOUT_RUN.flagged} /> : undefined}
        />
        <OptionList question={q} labelledBy="pg-soal" selected={chosen} states={states} disabled={busy} onPick={pickOption} />
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={() => setIndex(index - 1)}
            disabled={index === 0}
            className="flex h-[46px] items-center gap-2 rounded-xl border-[1.5px] border-rim px-4 text-sm font-semibold text-space-1 hover:bg-surface-soft disabled:opacity-40"
          >
            <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" />
            {SESSION.prev}
          </button>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              aria-pressed={flagged}
              onClick={toggleFlag}
              className={`flex h-[46px] items-center gap-2 rounded-xl border-[1.5px] px-4 text-sm font-semibold text-tint-orange-fg ${
                flagged ? "border-sun-1 bg-tint-orange-bg" : "border-tint-orange-line bg-white hover:bg-surface-peach"
              }`}
            >
              <Flag size={16} aria-hidden="true" className={flagged ? "fill-sun-1" : ""} />
              {TRYOUT_RUN.flag}
            </button>
            {index < cur.questions.length - 1 ? (
              <button type="button" onClick={() => setIndex(index + 1)} className="flex h-[46px] items-center gap-2 rounded-xl bg-orbit-1 px-5 text-sm font-semibold text-white hover:brightness-95">
                {SESSION.next}
                <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </button>
            ) : (
              <button type="button" onClick={() => setDialog("finish")} className="h-[46px] rounded-xl bg-orbit-1 px-5 text-sm font-semibold text-white hover:brightness-95">
                {TRYOUT_RUN.finishSection}
              </button>
            )}
          </div>
        </div>
      </section>

      {dialog === "exit" && (
        <ConfirmDialog
          kind="exit"
          title={TRYOUT_RUN.exitTitle}
          body={TRYOUT_RUN.exitBody}
          ok={TRYOUT_RUN.exitOk}
          cancel={TRYOUT_RUN.exitCancel}
          onOk={() => navigate(`${ROUTES.persiapanUjian(exam)}?tab=tryout`)}
          onCancel={() => setDialog(null)}
        />
      )}
      {dialog === "finish" && (
        <ConfirmDialog
          kind="finish"
          title={TRYOUT_RUN.finishTitle(cur.name)}
          body={TRYOUT_RUN.finishBody(emptyHere, flaggedHere, isLastSection)}
          ok={TRYOUT_RUN.finishOk}
          cancel={TRYOUT_RUN.finishCancel}
          busy={busy}
          onOk={() => finishSection(false)}
          onCancel={() => setDialog(null)}
        />
      )}
    </RunLayout>
  );
}
