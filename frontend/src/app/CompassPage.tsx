import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Info, RefreshCw } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { COMPASS_DISCLAIMER, COMPASS_HEADER, RECOMMENDATIONS, WHY } from "@/content/compass";
import { useAuth } from "@/context/AuthContext";
import { useStudentStatus } from "@/context/StudentStatusContext";
import { buildAspects, buildWhyColumns, whyChips } from "@/lib/compassInsights";
import { useAsync } from "@/lib/useAsync";
import { listAchievements } from "@/services/achievementService";
import { ASESMEN } from "@/services/assessmentService";
import { analyzeCompass, getInputsUpdatedAt, getTarget, setTarget } from "@/services/compassService";
import { catalogEntry, getCompassRecommendations, getEducationPaths } from "@/services/jurusanService";
import { getRapor } from "@/services/raporService";
import { listScholarships } from "@/services/beasiswaService";
import { matchesPath } from "@/lib/beasiswa";
import { useSkdRelevant } from "@/lib/useSkdRelevant";
import type { CompassRecommendation, CompassTarget } from "@/types/compass";
import PageLoader from "@/components/ui/PageLoader";
import { PanelError, PanelSkeleton } from "@/components/ui/PanelState";
import CompassHero from "@/components/compass/CompassHero";
import EducationPaths from "@/components/compass/EducationPaths";
import NextSteps from "@/components/compass/NextSteps";
import RecommendationList, { targetKeyOf } from "@/components/compass/RecommendationList";
import WhySection from "@/components/compass/WhySection";
import ScholarshipSection from "@/components/compass/ScholarshipSection";
import { EmptyCompass, LockedCompass } from "@/components/compass/CompassStates";
import { usePageTitle } from "@/lib/usePageTitle";

const MAX_RECOMMENDATIONS = 5;
const longDate = (iso: string) => new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));

/**
 * ORBIDU Compass (/portal/compass), sesuai docs/design/portal/Portal-Compass.dc.html
 * dan SPEK bagian 7. Status "baru" → terkunci dengan ajakan ke tes.
 */
export default function CompassPage() {
  usePageTitle(COMPASS_HEADER.title);
  const { user } = useAuth();
  const { status, ready } = useStudentStatus();
  const userId = user?.id ?? "";
  const grade = user?.profile?.grade ?? 10;
  const tested = status !== null && status !== "baru";

  const result = useAsync(getCompassRecommendations, [userId, status], tested);
  const inputsAt = useAsync(getInputsUpdatedAt, [userId, status], tested);
  const savedTarget = useAsync(() => getTarget(userId), [userId], tested);
  const achievements = useAsync(listAchievements, [userId], tested);
  const rapor = useAsync(() => getRapor(grade), [userId, grade], tested);
  const recommendations = result.data?.recommendations;
  const paths = useAsync(() => getEducationPaths(recommendations ?? []), [recommendations], tested && Boolean(recommendations?.length));
  const scholarships = useAsync(listScholarships, [], tested);
  // Aturan sama dengan menu Persiapan dan kartu Performa (lib/persiapan.ts).
  const skdRelevant = useSkdRelevant();

  // Target yang baru dipilih (menimpa hasil muat awal tanpa memuat ulang).
  const [targetOverride, setTargetOverride] = useState<{ value: CompassTarget | null } | null>(null);
  const target = targetOverride ? targetOverride.value : (savedTarget.data ?? null);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [targetError, setTargetError] = useState<string | null>(null);

  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  const assessment = user?.profile?.assessment ?? null;
  const analysis = result.data?.analysis ?? null;
  const recs = useMemo(() => (recommendations ?? []).slice(0, MAX_RECOMMENDATIONS), [recommendations]);
  const top = recs.find((r) => r.bidang) ?? null;
  const achievementList = useMemo(() => achievements.data ?? [], [achievements.data]);
  const raporData = rapor.data ?? null;

  const rows = useMemo(
    () =>
      recs.map((rec) => ({
        rec,
        why: whyChips(rec, rec.slug ? (catalogEntry(rec.slug)?.supportingSubjects ?? []) : [], assessment, raporData, achievementList),
      })),
    [recs, assessment, raporData, achievementList],
  );

  async function runAnalysis() {
    if (refreshing) return;
    setRefreshing(true);
    setRefreshError(null);
    try {
      await analyzeCompass();
      result.reload();
      inputsAt.reload();
    } catch {
      setRefreshError(COMPASS_HEADER.refreshError);
    } finally {
      setRefreshing(false);
    }
  }

  async function toggleTarget(rec: CompassRecommendation) {
    const key = targetKeyOf(rec);
    const isTarget = target !== null && targetKeyOf(target) === key;
    setSavingKey(key);
    setTargetError(null);
    try {
      const next = await setTarget(userId, isTarget ? null : { slug: rec.slug, name: rec.name });
      setTargetOverride({ value: next });
    } catch {
      setTargetError(RECOMMENDATIONS.targetError);
    } finally {
      setSavingKey(null);
    }
  }

  if (!user || !ready || status === null) return <PageLoader />;

  // Perbarui analisis hanya jika ada data baru (setiap analisis AI memakai kuota).
  const hasNewData = Boolean(analysis && inputsAt.data && inputsAt.data > analysis.analyzedAt);
  const placeholderQuestions = ASESMEN.status === "placeholder";

  let body;
  if (!tested) body = <LockedCompass />;
  else if (result.loading && !result.data) body = <PanelSkeleton />;
  else if (result.error) body = <PanelError onRetry={result.reload} />;
  else if (!analysis) body = <EmptyCompass onAnalyze={runAnalysis} busy={refreshing} error={refreshError} />;
  else {
    const aspects = buildAspects(analysis, top?.bidang ?? null, raporData, achievementList);
    const columns = buildWhyColumns(assessment, raporData, achievementList);
    const [first, second] = recs;
    const note =
      first?.bidang && second?.bidang && first.bidang === second.bidang ? WHY.noteCompare(first.name, second.name) : WHY.noteGeneric;
    body = (
      <>
        <div className="flex gap-2.5 rounded-[14px] bg-surface-blue px-3.5 py-3 text-[13px] leading-normal text-space-1 lg:items-center lg:px-4 lg:text-sm">
          <Info size={18} aria-hidden="true" className="mt-px shrink-0 text-orbit-1 lg:mt-0" />
          {COMPASS_DISCLAIMER}
        </div>
        <CompassHero bidang={top?.bidang ?? null} fit={top?.fit ?? null} summary={analysis.aiSummary} aspects={aspects} assessment={assessment} />
        <RecommendationList rows={rows} target={target} savingKey={savingKey} error={targetError} onToggleTarget={toggleTarget} />
        {paths.loading && !paths.data ? (
          <PanelSkeleton />
        ) : paths.error ? (
          <PanelError onRetry={paths.reload} />
        ) : (
          <EducationPaths groups={paths.data?.groups ?? []} hidden={paths.data?.hidden ?? []} sample={USE_MOCK} />
        )}
        <WhySection columns={columns} note={note} />
        {/* Beasiswa: maksimal 3 yang cocok dengan jalur dari Compass (aturan sama dengan /portal/beasiswa). */}
        {paths.data && scholarships.data && (
          <ScholarshipSection
            items={scholarships.data.filter((s) => matchesPath(s, paths.data!.groups.map((g) => g.key))).slice(0, 3)}
          />
        )}
        <NextSteps showSkd={skdRelevant} />
      </>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-surface-soft">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-4 pb-8 pt-4 sm:px-6 lg:gap-6 lg:px-10 lg:pb-12 lg:pt-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex max-w-[680px] flex-col gap-1.5 lg:gap-2">
            <nav aria-label="Breadcrumb" className="hidden items-center gap-2 text-[13px] text-prose-dim lg:flex">
              <Link to={ROUTES.portal} className="rounded hover:text-space-2 hover:underline">
                {COMPASS_HEADER.breadcrumbHome}
              </Link>
              <ChevronRight size={12} strokeWidth={2.4} aria-hidden="true" className="text-prose-faint" />
              <span aria-current="page" className="font-semibold text-space-2">
                {COMPASS_HEADER.title}
              </span>
            </nav>
            <h1 className="text-2xl font-bold leading-tight text-space-2 lg:text-[30px] lg:tracking-[-0.5px]">{COMPASS_HEADER.title}</h1>
            <p className="text-sm leading-relaxed text-prose lg:text-[15px]">{COMPASS_HEADER.description}</p>
          </div>

          {analysis && (
            <div className="flex flex-col gap-2 rounded-2xl border border-rim-soft bg-white p-3.5 lg:min-w-[300px] lg:px-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] text-prose">{COMPASS_HEADER.analyzedAt(longDate(analysis.analyzedAt))}</span>
                  {placeholderQuestions && (
                    <span title={COMPASS_HEADER.trialQuestionsHint} className="self-start rounded-full bg-tint-orange-bg px-2 py-0.5 text-[11px] font-semibold text-tint-orange-fg">
                      {COMPASS_HEADER.trialQuestions}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={runAnalysis}
                  disabled={!hasNewData || refreshing}
                  aria-busy={refreshing}
                  aria-describedby="compass-refresh-hint"
                  className="flex h-[42px] items-center gap-2 rounded-xl border-[1.5px] border-rim bg-white px-3.5 text-sm font-semibold text-orbit-1 hover:bg-surface-sky disabled:cursor-not-allowed disabled:text-field-hint disabled:hover:bg-white aria-busy:cursor-wait"
                >
                  <RefreshCw size={16} strokeWidth={2.2} aria-hidden="true" className={refreshing ? "motion-safe:animate-spin" : ""} />
                  {refreshing ? COMPASS_HEADER.refreshing : COMPASS_HEADER.refresh}
                </button>
              </div>
              <span id="compass-refresh-hint" className={`text-xs ${hasNewData ? "text-tint-orange-fg" : "text-prose-dim"}`}>
                {inputsAt.loading ? "" : hasNewData ? COMPASS_HEADER.hasNewData : COMPASS_HEADER.upToDate}
              </span>
              {refreshError && (
                <span role="alert" className="text-xs text-alert-fg">
                  {refreshError}
                </span>
              )}
              {placeholderQuestions && <span className="sr-only">{COMPASS_HEADER.trialQuestionsHint}</span>}
            </div>
          )}
        </div>

        {body}
      </div>
    </div>
  );
}
