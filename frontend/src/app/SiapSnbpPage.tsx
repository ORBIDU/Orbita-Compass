import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { SNBP_CHECK, SNBP_CHOICES, SNBP_HEADER, SNBP_RESULT, SNBP_REVIEW } from "@/content/siapSnbp";
import { useAuth } from "@/context/AuthContext";
import { formatShortDate } from "@/lib/datetime";
import { formatScore } from "@/lib/rapor";
import { defaultFirstChoice, summarizeRapor } from "@/lib/snbp";
import { useAsync } from "@/lib/useAsync";
import { semesterRange } from "@/mocks/snbpEngine";
import { listAchievements } from "@/services/achievementService";
import { getPlanSettings } from "@/services/actionPlanService";
import { getTarget } from "@/services/compassService";
import { catalogForProdi } from "@/services/jurusanService";
import { getRapor } from "@/services/raporService";
import { getSnbpCampuses, getSnbpDraft, rationalize, saveSnbpDraft, setTargetProdi } from "@/services/snbpService";
import { TKA_REQUIRED } from "@/types/actionPlan";
import { MAX_SNBP_ACHIEVEMENTS, type SnbpChoice, type SnbpDraft, type SnbpInput } from "@/types/snbp";
import PageLoader from "@/components/ui/PageLoader";
import { PanelError, PanelSkeleton } from "@/components/ui/PanelState";
import { EligibleBar, StepIndicator, type SnbpStep } from "@/components/snbp/SnbpShared";
import { AchievementSection, ChoiceSection, RaporSection, TkaSection, parseTka } from "@/components/snbp/SnbpInputSections";
import { CompletenessCard, ResultStep, ReviewStep, type CheckRow } from "@/components/snbp/SnbpSteps";

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Siap SNBP (/portal/persiapan/snbp), sesuai docs/design/portal/Portal-SiapSNBP.dc.html:
 * rasionalisasi 3 langkah (Input data → Review → Hasil). Hasil berupa kategori
 * Aman/Waspada/Berisiko dari simulasi sementara (mocks/snbpEngine.ts).
 */
export default function SiapSnbpPage() {
  const { user, refreshUser } = useAuth();
  const userId = user?.id ?? "";
  const grade = user?.profile?.grade ?? 12;
  const [now] = useState(() => new Date());

  const rapor = useAsync(() => getRapor(grade, now), [userId, grade]);
  const achievements = useAsync(listAchievements, [userId]);
  const campuses = useAsync(getSnbpCampuses, []);
  const plan = useAsync(() => getPlanSettings(userId), [userId]);
  const compassTarget = useAsync(() => getTarget(userId), [userId]);
  const saved = useAsync(() => getSnbpDraft(userId), [userId]);
  const sources = [rapor, achievements, campuses, plan, compassTarget, saved];
  const loading = sources.some((s) => s.loading && s.data === undefined);
  const failed = sources.find((s) => s.error);

  const [draft, setDraft] = useState<SnbpDraft | null>(null);
  const [step, setStep] = useState<SnbpStep>(0);
  const [busy, setBusy] = useState(false);
  const [calcError, setCalcError] = useState<string | null>(null);
  const [savingTarget, setSavingTarget] = useState<string | null>(null);
  const [targetError, setTargetError] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const profileTarget = { universityId: user?.profile?.targetPtnId ?? null, majorId: user?.profile?.targetMajorId ?? null };
  const firstDefault = useMemo(
    () => (campuses.data ? defaultFirstChoice(campuses.data, profileTarget, compassTarget.data ?? null) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [campuses.data, compassTarget.data, profileTarget.universityId, profileTarget.majorId],
  );

  // Isi awal: isian tersimpan, atau kosong dengan pilihan 1 dari target.
  const ready = !loading && !failed;
  useEffect(() => {
    if (!ready || draft) return;
    const initial: SnbpDraft = saved.data ?? {
      eligible: "menunggu",
      tkaEnabled: false,
      tkaScores: {},
      achievementIds: [],
      choices: [firstDefault?.choice ?? null, null],
      result: null,
      updatedAt: new Date().toISOString(),
    };
    setDraft(initial);
    setStep(initial.result ? 2 : 0);
  }, [ready, draft, saved.data, firstDefault]);

  // Simpan otomatis (sedikit ditunda supaya tidak menyimpan di setiap ketikan).
  const firstSave = useRef(true);
  useEffect(() => {
    if (!draft) return;
    if (firstSave.current) {
      firstSave.current = false;
      return;
    }
    const t = setTimeout(() => void saveSnbpDraft(userId, draft).catch(() => undefined), 400);
    return () => clearTimeout(t);
  }, [draft, userId]);

  const summary = useMemo(() => summarizeRapor(rapor.data ?? null), [rapor.data]);

  if (!user) return <PageLoader />;

  /** Ubah isian; bentuk fungsi membaca isian terbaru (aman untuk klik beruntun). */
  function update(change: Partial<SnbpDraft> | ((d: SnbpDraft) => Partial<SnbpDraft>)) {
    setDraft((d) => (d ? { ...d, ...(typeof change === "function" ? change(d) : change), updatedAt: new Date().toISOString() } : d));
  }

  function goTo(next: SnbpStep) {
    setStep(next);
    setCalcError(null);
    topRef.current?.scrollIntoView({ block: "start" });
  }

  let body;
  if (failed) {
    body = <PanelError onRetry={() => sources.filter((s) => s.error).forEach((s) => s.reload())} />;
  } else if (loading || !draft) {
    body = <PanelSkeleton />;
  } else {
    const campusList = campuses.data ?? [];
    const achievementList = achievements.data ?? [];
    const electives = plan.data?.focus.includes("TKA") ? plan.data.tkaElectives : null;
    const tkaSubjects = [...TKA_REQUIRED, ...(electives ?? [])];
    const tkaParsed = tkaSubjects.map((s) => [s, parseTka(draft.tkaScores[s])] as const);
    const tkaInvalid = draft.tkaEnabled && tkaParsed.some(([, v]) => Number.isNaN(v));
    const tkaValues = draft.tkaEnabled ? tkaParsed.filter((e): e is readonly [string, number] => e[1] !== null && !Number.isNaN(e[1])) : [];
    const selectedAchievements = achievementList.filter((a) => draft.achievementIds.includes(a.id));
    const completeChoices = draft.choices.filter((c): c is SnbpChoice => Boolean(c?.majorId));
    const duplicate = completeChoices.length === 2 && completeChoices[0].majorId === completeChoices[1].majorId;
    const describe = (c: SnbpChoice) => {
      const campus = campusList.find((x) => x.id === c.universityId);
      return { universityName: campus?.name ?? "", majorName: campus?.majors.find((m) => m.id === c.majorId)?.name ?? "" };
    };
    const usedSems = semesterRange(summary.available.map((s) => s.semester));

    const blocker =
      summary.average === null
        ? SNBP_CHECK.needRapor
        : tkaInvalid
          ? SNBP_CHECK.needValidTka
          : completeChoices.length === 0
            ? SNBP_CHECK.needChoice
            : duplicate
              ? SNBP_CHOICES.same
              : null;

    const firstSource =
      firstDefault && draft.choices[0]?.majorId === firstDefault.choice.majorId && draft.choices[0]?.universityId === firstDefault.choice.universityId
        ? firstDefault.source
        : null;

    async function calculate() {
      if (!draft) return;
      setBusy(true);
      setCalcError(null);
      const input: SnbpInput = {
        semesters: summary.available,
        missingSemesters: summary.missing,
        subjects: summary.subjects,
        tka: tkaValues.length ? Object.fromEntries(tkaValues) : null,
        achievements: selectedAchievements.map((a) => ({ title: a.title, level: a.level, hasCertificate: Boolean(a.certificateName) })),
        choices: completeChoices.map((c) => {
          const names = describe(c);
          return { ...c, ...names, supportingSubjects: catalogForProdi(names.majorName)?.supportingSubjects ?? [] };
        }),
      };
      try {
        const result = await rationalize(input);
        update({ result });
        goTo(2);
      } catch {
        setCalcError(SNBP_REVIEW.error);
      } finally {
        setBusy(false);
      }
    }

    async function makeTarget(choice: SnbpChoice) {
      setSavingTarget(choice.majorId);
      setTargetError(null);
      try {
        await setTargetProdi(choice);
        await refreshUser();
      } catch {
        setTargetError(SNBP_RESULT.targetError);
      } finally {
        setSavingTarget(null);
      }
    }

    if (step === 0) {
      const checks: CheckRow[] = [
        summary.average === null
          ? { label: SNBP_CHECK.rapor, note: SNBP_CHECK.raporMissing, state: "missing" }
          : { label: SNBP_CHECK.rapor, note: SNBP_CHECK.raporOk(usedSems.replace("semester ", "").replace(" sampai ", "–")), state: "done" },
        tkaValues.length
          ? { label: SNBP_CHECK.tka, note: SNBP_CHECK.tkaOk, state: "done" }
          : { label: SNBP_CHECK.tka, note: SNBP_CHECK.optional, state: "optional" },
        selectedAchievements.length
          ? { label: SNBP_CHECK.achievements, note: SNBP_CHECK.achievementsOk(selectedAchievements.length), state: "done" }
          : { label: SNBP_CHECK.achievements, note: SNBP_CHECK.achievementsNone, state: "optional" },
        completeChoices.length
          ? { label: SNBP_CHECK.choices, note: SNBP_CHECK.choicesOk(completeChoices.length), state: "done" }
          : { label: SNBP_CHECK.choices, note: SNBP_CHECK.choicesNone, state: "missing" },
      ];
      body = (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-4 lg:gap-5">
            <RaporSection summary={summary} />
            <TkaSection
              enabled={draft.tkaEnabled}
              onToggle={() => update((d) => ({ tkaEnabled: !d.tkaEnabled }))}
              scores={draft.tkaScores}
              onChange={(s, v) => update((d) => ({ tkaScores: { ...d.tkaScores, [s]: v } }))}
              electives={electives}
            />
            <AchievementSection
              items={achievementList}
              selected={draft.achievementIds.filter((id) => achievementList.some((a) => a.id === id))}
              onToggle={(id) =>
                update(({ achievementIds: ids }) => ({
                  achievementIds: ids.includes(id) ? ids.filter((x) => x !== id) : ids.length < MAX_SNBP_ACHIEVEMENTS ? [...ids, id] : ids,
                }))
              }
            />
            <ChoiceSection
              campuses={campusList}
              choices={draft.choices}
              onChange={(i, c) =>
                update((d) => {
                  const choices: SnbpDraft["choices"] = [...d.choices];
                  choices[i] = c;
                  return { choices };
                })
              }
              firstSource={firstSource}
              duplicate={duplicate}
            />
          </div>
          <CompletenessCard rows={checks} blocker={blocker} onNext={() => goTo(1)} />
        </div>
      );
    } else if (step === 1) {
      const rows = [
        { label: SNBP_REVIEW.rows.rapor, value: SNBP_REVIEW.rapor(formatScore(summary.average ?? 0), usedSems) },
        {
          label: SNBP_REVIEW.rows.tka,
          value: tkaValues.length ? tkaValues.map(([s, v]) => `${s} ${v.toLocaleString("id-ID")}`).join(", ") : SNBP_REVIEW.tkaNone,
        },
        { label: SNBP_REVIEW.rows.achievements, value: selectedAchievements.map((a) => a.title).join(", ") || SNBP_REVIEW.none },
        {
          label: SNBP_REVIEW.rows.choices,
          value: completeChoices
            .map((c, i) => {
              const n = describe(c);
              return SNBP_REVIEW.choice(i + 1, n.majorName, n.universityName);
            })
            .join(" "),
        },
      ];
      const notes: { tone: "warn" | "info"; text: string }[] = [];
      if (summary.missing.length) notes.push({ tone: "warn", text: SNBP_REVIEW.missingSem(capitalize(semesterRange(summary.missing)), usedSems) });
      if (!tkaValues.length) notes.push({ tone: "info", text: SNBP_REVIEW.noTka });
      if (!selectedAchievements.length) notes.push({ tone: "info", text: SNBP_REVIEW.noAchievement });
      body = <ReviewStep rows={rows} notes={notes} busy={busy} error={calcError} onEdit={() => goTo(0)} onCalculate={calculate} />;
    } else if (draft.result) {
      body = (
        <ResultStep
          result={draft.result}
          targetMajorId={profileTarget.majorId}
          savingMajorId={savingTarget}
          targetError={targetError}
          onSetTarget={makeTarget}
          onRecalc={() => goTo(0)}
          computedAt={formatShortDate(draft.result.computedAt)}
        />
      );
    }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-surface-soft">
      <div ref={topRef} className="mx-auto flex w-full max-w-[1200px] scroll-mt-4 flex-col gap-4 px-4 pb-8 pt-4 sm:px-6 lg:gap-[22px] lg:px-10 lg:pb-12 lg:pt-7">
        <div className="flex max-w-[760px] flex-col gap-1.5 lg:gap-2">
          <nav aria-label="Breadcrumb" className="hidden items-center gap-2 text-[13px] text-prose-dim lg:flex">
            <Link to={ROUTES.portal} className="rounded hover:text-space-2 hover:underline">
              {SNBP_HEADER.breadcrumbHome}
            </Link>
            <ChevronRight size={12} strokeWidth={2.4} aria-hidden="true" className="text-prose-faint" />
            <span>{SNBP_HEADER.breadcrumbSection}</span>
            <ChevronRight size={12} strokeWidth={2.4} aria-hidden="true" className="text-prose-faint" />
            <span aria-current="page" className="font-semibold text-space-2">
              {SNBP_HEADER.title}
            </span>
          </nav>
          <h1 className="text-2xl font-bold leading-tight text-space-2 lg:text-[30px] lg:tracking-[-0.5px]">{SNBP_HEADER.title}</h1>
          <p className="text-sm leading-relaxed text-prose lg:text-[15px]">{SNBP_HEADER.description}</p>
        </div>

        {draft && <EligibleBar value={draft.eligible} onChange={(eligible) => update({ eligible })} />}
        {draft && <StepIndicator step={step} />}
        {body}
      </div>
    </div>
  );
}
