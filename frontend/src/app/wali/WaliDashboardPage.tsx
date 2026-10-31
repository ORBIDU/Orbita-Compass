import { useAsync } from "@/lib/useAsync";
import { useAuth } from "@/context/AuthContext";
import { getWaliDashboard } from "@/services/waliService";
import PageLoader from "@/components/ui/PageLoader";
import { PanelError } from "@/components/ui/PanelState";
import WaliHero from "@/components/wali/WaliHero";
import WaliKpiCards from "@/components/wali/WaliKpiCards";
import WaliDistribusiChart from "@/components/wali/WaliDistribusiChart";
import WaliAiInsightCard from "@/components/wali/WaliAiInsightCard";
import WaliKelengkapanProfil from "@/components/wali/WaliKelengkapanProfil";
import WaliTrenPerkembangan from "@/components/wali/WaliTrenPerkembangan";
import WaliBkNotificationCard from "@/components/wali/WaliBkNotificationCard";

export default function WaliDashboardPage() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useAsync(() => getWaliDashboard(), []);

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[1240px] px-4 pt-6 sm:px-6 lg:px-8">
        <PanelError onRetry={reload} />
      </div>
    );
  }
  if (loading || !data) return <PageLoader fullscreen />;

  const wali = user ? { ...data.wali, name: user.name } : data.wali;

  return (
    <div className="flex-1 overflow-y-auto bg-surface-soft">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-5 px-4 pb-12 pt-6 sm:px-6 lg:gap-6 lg:px-8">
        {/* Hero Banner */}
        <WaliHero wali={wali} totalStudents={data.kpi.totalCount} />

        {/* 4 Kartu KPI Metrik */}
        <WaliKpiCards kpi={data.kpi} />

        {/* AI Insight Box */}
        <WaliAiInsightCard insight={data.aiInsight} />

        {/* Grafik Distribusi & Tren Nilai */}
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          <WaliDistribusiChart data={data.distribusi} />
          <WaliTrenPerkembangan data={data.trenSemester} />
        </div>

        {/* Kelengkapan Profil & Notifikasi Guru BK */}
        <div className="grid gap-5 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-6">
          <WaliKelengkapanProfil kelengkapan={data.kelengkapan} />
          <WaliBkNotificationCard notifications={data.notifikasiBk} />
        </div>
      </div>
    </div>
  );
}
