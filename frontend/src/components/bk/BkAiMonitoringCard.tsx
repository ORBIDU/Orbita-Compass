import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import type { BkDashboardData } from "@/types/bk";

interface BkAiMonitoringCardProps {
  aiMonitoring: BkDashboardData["aiMonitoring"];
}

const TONE_CLASSES = {
  danger: { dot: "bg-danger", text: "text-danger" },
  warning: { dot: "bg-warning", text: "text-sun-1" },
  purple: { dot: "bg-tint-purple-dot", text: "text-tint-purple-fg" },
} as const;

export default function BkAiMonitoringCard({ aiMonitoring }: BkAiMonitoringCardProps) {
  return (
    <section
      aria-labelledby="bk-ai-monitoring-title"
      className="relative overflow-hidden rounded-card border border-orbit-1/25 bg-gradient-to-br from-surface-blue via-white to-surface-soft p-5 shadow-card sm:p-6"
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-orbit text-white shadow-cta">
          <Sparkles size={22} aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="bk-ai-monitoring-title" className="text-base font-bold text-space-2 sm:text-lg">
              {aiMonitoring.title}
            </h2>
            <span className="rounded-full bg-orbit-1/10 px-2.5 py-0.5 text-[11px] font-semibold text-orbit-1">
              AI Powered
            </span>
          </div>
          <p className="mt-1 text-xs text-prose-dim sm:text-sm">{aiMonitoring.subtitle}</p>

          <ul className="mt-3.5 space-y-2.5">
            {aiMonitoring.findings.map((item) => {
              const tone = TONE_CLASSES[item.tone];
              return (
                <li key={item.id} className="flex items-start gap-3 text-sm leading-relaxed text-prose">
                  <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${tone.dot}`} aria-hidden="true" />
                  <span>
                    <strong className={`font-bold ${tone.text}`}>{item.highlight}</strong>{" "}
                    {item.text}
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="mt-3.5 text-xs italic text-prose-dim">{aiMonitoring.summary}</p>

          <div className="mt-4">
            <Link
              to={`${ROUTES.bkSiswa}?prioritas=pendampingan`}
              className="inline-flex h-10 items-center gap-2 rounded-xl border-[1.5px] border-rim bg-white px-4 text-xs font-bold text-orbit-1 transition-colors hover:bg-surface-sky sm:text-sm"
            >
              <span>Lihat Daftar Prioritas</span>
              <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
