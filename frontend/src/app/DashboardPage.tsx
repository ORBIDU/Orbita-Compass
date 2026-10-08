import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useStudentStatus } from "@/context/StudentStatusContext";
import { toDisplayUser } from "@/lib/user";
import { useAsync } from "@/lib/useAsync";
import { getSelectionTimeline } from "@/services/dashboardService";
import { getPracticeSummary } from "@/services/practiceService";
import { useSkdRelevant } from "@/lib/useSkdRelevant";
import { getTodayPlan } from "@/services/actionPlanService";
import { getCompassHighlights } from "@/services/jurusanService";
import PageLoader from "@/components/ui/PageLoader";
import DashboardHero from "@/components/dashboard/DashboardHero";
import TodayPlanCard from "@/components/dashboard/TodayPlanCard";
import PerformanceCard from "@/components/dashboard/PerformanceCard";
import CompassCard from "@/components/dashboard/CompassCard";
import TimelineCard from "@/components/dashboard/TimelineCard";
import ExploreCard from "@/components/dashboard/ExploreCard";

/**
 * Dashboard siswa (/portal), sesuai docs/design/portal/Portal-Dashboard*.dc.html
 * dan SPEK bagian 5. Isi kartu mengikuti status siswa:
 * - baru: Rencana, Performa, dan Compass terkunci; satu CTA besar di hero.
 * - sudah_asesmen: Compass terbuka, Rencana dan Performa berupa empty state.
 * - aktif: semua terisi.
 */
export default function DashboardPage() {
  const { user } = useAuth();
  const { status, ready, isLocked } = useStudentStatus();
  // Tanggal dan sapaan diambil saat halaman dibuka.
  const [now] = useState(() => new Date());

  const isStudent = user?.role === "STUDENT";
  const planLocked = isLocked("actionPlan");
  const performaLocked = isLocked("performa");
  const compassLocked = isLocked("compass");
  const canLoad = isStudent && ready && status !== null;

  // `status` ikut jadi deps supaya data dimuat ulang saat status diganti di Mode Demo.
  // Sumber sama dengan halaman Action Plan.
  const plan = useAsync(() => getTodayPlan(user?.id ?? "", user?.profile?.grade ?? 12, now), [status, user?.id], canLoad && !planLocked);
  // Sumber sama dengan Siap SNBT/TKA/SKD.
  const practice = useAsync(() => getPracticeSummary(user?.id ?? "", user?.profile?.grade ?? 12, now), [status, user?.id], canLoad && !performaLocked);
  const showSkd = useSkdRelevant();
  const compass = useAsync(() => getCompassHighlights(3), [status, user?.id], canLoad && !compassLocked);
  const timeline = useAsync(() => getSelectionTimeline(now), []);

  if (!user || (isStudent && !ready)) return <PageLoader />;
  const display = toDisplayUser(user);

  return (
    <div className="flex-1 overflow-y-auto bg-surface-soft">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-4 pb-8 pt-4 sm:px-6 lg:gap-6 lg:px-10 lg:pb-12 lg:pt-8">
        <DashboardHero
          now={now}
          nickname={display.nickname}
          kelas={display.kelas}
          status={status ?? "sudah_asesmen"}
          plan={status ? plan.data : undefined}
        />

        {status && (
          <>
            <div className="grid gap-4 lg:grid-cols-2 lg:gap-6 xl:grid-cols-[488px_minmax(0,1fr)]">
              <TodayPlanCard locked={planLocked} state={plan} />
              <PerformanceCard locked={performaLocked} state={practice} showSkd={showSkd} />
            </div>
            <div className="grid gap-4 lg:grid-cols-2 lg:gap-6 xl:grid-cols-[minmax(0,1fr)_488px]">
              <CompassCard locked={compassLocked} state={compass} />
              <TimelineCard state={timeline} />
            </div>
          </>
        )}
        {!status && <TimelineCard state={timeline} />}

        <ExploreCard />
      </div>
    </div>
  );
}
