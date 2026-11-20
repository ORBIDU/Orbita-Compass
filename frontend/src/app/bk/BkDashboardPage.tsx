import { useAsync } from "@/lib/useAsync";
import { useAuth } from "@/context/AuthContext";
import { getBkDashboard } from "@/services/bkService";
import PageLoader from "@/components/ui/PageLoader";
import { PanelError } from "@/components/ui/PanelState";
import BkHero from "@/components/bk/BkHero";
import BkKpiCards from "@/components/bk/BkKpiCards";
import BkAiMonitoringCard from "@/components/bk/BkAiMonitoringCard";
import BkPotensiChart from "@/components/bk/BkPotensiChart";
import BkAktivitasCard from "@/components/bk/BkAktivitasCard";

export default function BkDashboardPage() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useAsync(() => getBkDashboard(), []);

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[1240px] px-4 pt-6 sm:px-6 lg:px-8">
        <PanelError onRetry={reload} />
      </div>
    );
  }
  if (loading || !data) return <PageLoader fullscreen />;

  const guru = user ? { ...data.guru, name: user.name } : data.guru;

  return (
    <div className="flex-1 overflow-y-auto bg-surface-soft">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-5 px-4 pb-12 pt-6 sm:px-6 lg:gap-6 lg:px-8">
        {/* Hero Banner */}
        <BkHero
          guru={guru}
          totalKelas={data.kpi.totalKelas}
          totalSiswa={data.kpi.totalSiswa}
        />

        {/* 3 Kartu KPI Sekolah */}
        <BkKpiCards kpi={data.kpi} />

        {/* ORBIDU AI Monitoring */}
        <BkAiMonitoringCard aiMonitoring={data.aiMonitoring} />

        {/* Peta Potensi Siswa & Aktivitas Terkini */}
        <div className="grid gap-5 lg:grid-cols-[440px_minmax(0,1fr)] lg:gap-6">
          <BkPotensiChart data={data.potensi} />
          <BkAktivitasCard aktivitas={data.aktivitas} />
        </div>
      </div>
    </div>
  );
}
