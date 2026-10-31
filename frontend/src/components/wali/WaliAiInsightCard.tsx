import { Sparkles, TrendingUp, AlertTriangle } from "lucide-react";

interface WaliAiInsightCardProps {
  insight: {
    title: string;
    body: string;
    highlightCountUp: number;
    highlightCountDown: number;
  };
}

export default function WaliAiInsightCard({ insight }: WaliAiInsightCardProps) {
  return (
    <div className="relative overflow-hidden rounded-card border border-orbit-1/25 bg-gradient-to-br from-surface-blue via-white to-surface-soft p-5 shadow-card sm:p-6">
      <div className="flex items-start gap-4">
        {/* Ikon Bot AI */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-orbit text-white shadow-cta">
          <Sparkles size={22} aria-hidden="true" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-space-2">
              {insight.title}
            </h2>
            <span className="rounded-full bg-orbit-1/10 px-2.5 py-0.5 text-[11px] font-semibold text-orbit-1">
              AI Powered
            </span>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-prose">
            Sebagian besar siswa menunjukkan perkembangan akademik yang stabil. Sebanyak{" "}
            <strong className="font-semibold text-orbit-1">
              {insight.highlightCountUp} siswa
            </strong>{" "}
            mengalami peningkatan nilai lebih dari 5 poin, sedangkan{" "}
            <strong className="font-semibold text-danger">
              {insight.highlightCountDown} siswa
            </strong>{" "}
            mengalami tren penurunan berturut-turut dan disarankan mendapatkan pendampingan lebih lanjut bersama Guru BK.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1 text-xs font-semibold text-success border border-success/20">
              <TrendingUp size={14} />
              {insight.highlightCountUp} Siswa Naik
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1 text-xs font-semibold text-danger border border-danger/20">
              <AlertTriangle size={14} />
              {insight.highlightCountDown} Perlu Perhatian
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
