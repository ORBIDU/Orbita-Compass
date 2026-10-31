import { useCallback, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { ANALISIS_HEADER, TABS } from "@/content/analisis";
import { useAuth } from "@/context/AuthContext";
import { useStudentStatus } from "@/context/StudentStatusContext";
import { doneSectionCount } from "@/lib/asesmen";
import { computeCompleteness } from "@/lib/kelengkapan";
import { useAsync } from "@/lib/useAsync";
import { ACHIEVEMENT_FULL_SUPPORT, listAchievements } from "@/services/achievementService";
import { ASESMEN, getAssessmentSummary, getDraft } from "@/services/assessmentService";
import { getCompassHighlights } from "@/services/jurusanService";
import { getRapor } from "@/services/raporService";
import PageLoader from "@/components/ui/PageLoader";
import AnalisisTabs, { ANALISIS_TABS, panelId, tabId, type AnalisisTab } from "@/components/analisis/AnalisisTabs";
import CompletenessCard from "@/components/analisis/CompletenessCard";
import TestPanel from "@/components/analisis/test/TestPanel";
import PrestasiPanel from "@/components/analisis/prestasi/PrestasiPanel";
import RaporPanel from "@/components/analisis/rapor/RaporPanel";
import { usePageTitle } from "@/lib/usePageTitle";
import { UI } from "@/content/common";

const isTab = (v: string | null): v is AnalisisTab => ANALISIS_TABS.includes(v as AnalisisTab);

/**
 * Analisis Potensi (/portal/analisis-potensi?tab=minat|prestasi|rapor),
 * sesuai docs/design/portal/Portal-Analisis*.dc.html dan SPEK bagian 6.
 */
export default function AnalisisPotensiPage() {
  usePageTitle(ANALISIS_HEADER.title);
  const { user } = useAuth();
  const { status, ready } = useStudentStatus();
  const [params, setParams] = useSearchParams();
  const rawTab = params.get("tab");
  const tab: AnalisisTab = isTab(rawTab) ? rawTab : "minat";

  const canLoad = Boolean(user) && ready && status !== null;
  const tested = status !== null && status !== "baru";
  const grade = user?.profile?.grade ?? 10;
  const userId = user?.id ?? "";

  const draft = useAsync(() => getDraft(userId), [userId, status], canLoad && !tested);
  const summary = useAsync(() => getAssessmentSummary(user!), [user, status], canLoad && tested);
  const compass = useAsync(() => getCompassHighlights(1), [userId, status], canLoad && tested);
  const achievements = useAsync(listAchievements, [userId], canLoad);
  const rapor = useAsync(() => getRapor(grade), [userId, grade], canLoad);

  // Jumlah bagian selesai dari tes yang sedang diisi (diperbarui langsung saat menjawab).
  // Disimpan bersama statusnya supaya angka lama tidak terpakai setelah status berganti.
  const [live, setLive] = useState<{ status: typeof status; done: number } | null>(null);
  const onProgress = useCallback((done: number) => setLive({ status, done }), [status]);
  const liveDone = live && live.status === status ? live.done : null;

  const total = ASESMEN.sections.length;
  const sectionsDone = tested ? total : (liveDone ?? doneSectionCount(ASESMEN, draft.data?.answers ?? {}));
  const list = useMemo(() => achievements.data ?? [], [achievements.data]);
  const raporSemesters = (rapor.data?.semesters ?? []).filter((s) => s.subjects.length > 0);

  const completeness = useMemo(
    () =>
      computeCompleteness({
        sectionsDone,
        sectionsTotal: total,
        raporAvailable: raporSemesters.length > 0,
        achievementCount: list.length,
        withCertificate: list.filter((a) => a.certificateName).length,
        certificateSupported: ACHIEVEMENT_FULL_SUPPORT,
      }),
    [sectionsDone, total, raporSemesters.length, list],
  );

  const chips: Record<AnalisisTab, string> = {
    minat: sectionsDone >= total ? TABS.chipDone : `${sectionsDone}/${total}`,
    prestasi: String(list.length),
    rapor: raporSemesters.length
      ? TABS.chipRapor(raporSemesters[0].semester, raporSemesters[raporSemesters.length - 1].semester)
      : TABS.chipNoRapor,
  };

  function changeTab(next: AnalisisTab) {
    setParams(next === "minat" ? {} : { tab: next }, { replace: true });
  }

  if (!user || !ready || status === null) return <PageLoader />;

  return (
    <div className="flex-1 overflow-y-auto bg-surface-soft">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-4 pb-8 pt-4 sm:px-6 lg:gap-6 lg:px-10 lg:pb-12 lg:pt-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div className="flex max-w-[640px] flex-col gap-1.5 lg:gap-2">
            <nav aria-label={UI.breadcrumb} className="hidden items-center gap-2 text-[13px] text-prose-dim lg:flex">
              <Link to={ROUTES.portal} className="rounded hover:text-space-2 hover:underline">
                {ANALISIS_HEADER.breadcrumbHome}
              </Link>
              <ChevronRight size={12} strokeWidth={2.4} aria-hidden="true" className="text-prose-faint" />
              <span aria-current="page" className="font-semibold text-space-2">
                {ANALISIS_HEADER.title}
              </span>
            </nav>
            <h1 className="text-2xl font-bold leading-tight text-space-2 lg:text-[30px] lg:tracking-[-0.5px]">{ANALISIS_HEADER.title}</h1>
            <p className="text-sm leading-relaxed text-prose lg:hidden">{ANALISIS_HEADER.descriptionShort}</p>
            <p className="hidden text-[15px] leading-relaxed text-prose lg:block">{ANALISIS_HEADER.description}</p>
          </div>
          <CompletenessCard pct={completeness.pct} items={completeness.items} hint={completeness.hint} />
        </div>

        <AnalisisTabs active={tab} chips={chips} onChange={changeTab} />

        <div role="tabpanel" id={panelId(tab)} aria-labelledby={tabId(tab)} tabIndex={-1} className="focus:outline-none">
          {tab === "minat" && (
            <TestPanel
              doc={ASESMEN}
              userId={userId}
              status={status}
              draft={draft}
              summary={summary}
              latestBidang={compass.data?.bidang ?? null}
              onProgress={onProgress}
            />
          )}
          {tab === "prestasi" && <PrestasiPanel state={achievements} />}
          {tab === "rapor" && <RaporPanel state={rapor} />}
        </div>
      </div>
    </div>
  );
}
