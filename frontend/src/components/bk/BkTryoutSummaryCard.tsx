import { useState } from "react";
import { Award, BarChart3, Sparkles, Target, TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BRAND } from "@/config/brand";
import type { BkTryoutCategory, BkTryoutCategoryData, BkTryoutSubtest } from "@/types/bk";

interface BkTryoutSummaryCardProps {
  tryout: Record<BkTryoutCategory, BkTryoutCategoryData>;
}

const CATEGORIES: BkTryoutCategory[] = ["TKA", "SNBT", "SKD"];

const SUBTEST_STYLE: Record<
  BkTryoutSubtest["status"],
  { bar: string; badge: string; text: string }
> = {
  "Sangat Baik": {
    bar: "bg-success",
    badge: "bg-tint-green-bg text-tint-green-fg",
    text: "text-success",
  },
  Baik: {
    bar: "bg-orbit-1",
    badge: "bg-tint-blue-bg text-tint-blue-fg",
    text: "text-orbit-1",
  },
  "Perlu Peningkatan": {
    bar: "bg-warning",
    badge: "bg-tint-amber-bg text-tint-amber-fg",
    text: "text-sun-1",
  },
};

export default function BkTryoutSummaryCard({ tryout }: BkTryoutSummaryCardProps) {
  const [tab, setTab] = useState<BkTryoutCategory>("SNBT");
  const d = tryout[tab];

  return (
    <section className="flex flex-col gap-6 rounded-card border border-rim-soft bg-white p-5 shadow-card sm:p-6">
      {/* Header + Segmented Switch */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-space-2 sm:text-lg">Ringkasan Tryout</h3>
          <p className="mt-0.5 text-xs text-prose-dim">
            Perkembangan performa siswa berdasarkan hasil simulasi {tab}
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Kategori Tryout"
          className="inline-flex self-start rounded-xl bg-surface-toggle p-1"
        >
          {CATEGORIES.map((c) => {
            const active = tab === c;
            return (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(c)}
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
                  active ? "bg-white text-orbit-1 shadow-toggle" : "text-prose-dim hover:text-space-2"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Mini Metric Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-rim-soft bg-surface-soft p-3.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-prose-dim">
            <BarChart3 size={14} className="text-orbit-1" aria-hidden="true" />
            <span>Rata-rata</span>
          </div>
          <p className="mt-2 text-xl font-bold text-space-2">{d.avgScore}</p>
          <p className="mt-0.5 text-[11px] text-prose-dim">Dari {d.history.length} sesi</p>
        </div>

        <div className="rounded-xl border border-rim-soft bg-surface-soft p-3.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-prose-dim">
            <Target size={14} className="text-orbit-1" aria-hidden="true" />
            <span>Skor Terakhir</span>
          </div>
          <p className="mt-2 text-xl font-bold text-orbit-1">{d.lastScore}</p>
          <p className="mt-0.5 text-[11px] text-prose-dim">{d.lastLabel}</p>
        </div>

        <div className="rounded-xl border border-rim-soft bg-surface-soft p-3.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-prose-dim">
            <Award size={14} className="text-sun-1" aria-hidden="true" />
            <span>Peringkat</span>
          </div>
          <p className="mt-2 text-xl font-bold text-space-2">{d.ranking}</p>
          <p className="mt-0.5 text-[11px] text-prose-dim">Dari total peserta</p>
        </div>

        <div className="rounded-xl border border-rim-soft bg-surface-soft p-3.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-prose-dim">
            <TrendingUp size={14} className="text-success" aria-hidden="true" />
            <span>Tren</span>
          </div>
          <p className="mt-2 text-xl font-bold text-tint-green-fg">{d.trenLabel}</p>
          <p className="mt-0.5 text-[11px] text-prose-dim">Berdasarkan histori</p>
        </div>
      </div>

      {/* Grafik Perkembangan Skor */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-prose-dim">
          Perkembangan Skor {tab}
        </h4>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={d.history} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F8" vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#5F6B8A", fontFamily: "Poppins" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                domain={["dataMin - 15", "dataMax + 15"]}
                tick={{ fontSize: 11, fill: "#5F6B8A", fontFamily: "Poppins" }}
              />
              <Tooltip
                contentStyle={{
                  background: "#101A33",
                  border: "none",
                  borderRadius: "10px",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontFamily: "Poppins",
                }}
                formatter={(value) => [String(value ?? 0), `Skor ${tab}`]}
              />
              <Line
                type="monotone"
                dataKey="skor"
                stroke="#FF7000"
                strokeWidth={2.5}
                dot={{ fill: "#FF7000", r: 4, strokeWidth: 2, stroke: "#FFFFFF" }}
                activeDot={{ r: 6, fill: "#FF7000", stroke: "#FFFFFF", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performa Per Subtes */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-prose-dim">
          Performa Per {tab === "SKD" ? "Tes" : "Subtes"}
        </h4>
        <div className="space-y-2.5">
          {d.subtests.map((st) => {
            const pct = Math.min(100, Math.round((st.score / st.max) * 100));
            const style = SUBTEST_STYLE[st.status];
            return (
              <div
                key={st.name}
                className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border border-rim-soft bg-surface-soft/70 px-4 py-3 sm:grid-cols-[1fr_72px_140px]"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-space-2">{st.name}</p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-track">
                    <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className={`text-right text-sm font-bold ${style.text}`}>
                  {st.score}
                  {st.max !== 100 && (
                    <span className="text-[11px] font-medium text-prose-dim">/{st.max}</span>
                  )}
                </div>
                <span
                  className={`col-span-2 inline-flex justify-center rounded-full px-3 py-1 text-[11px] font-semibold sm:col-span-1 ${style.badge}`}
                >
                  {st.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Tryout Insight */}
      <div className="rounded-xl border border-orbit-1/20 bg-surface-blue p-4">
        <div className="flex items-center gap-2 text-xs font-bold text-orbit-1">
          <Sparkles size={15} aria-hidden="true" />
          <span>{BRAND.name} AI</span>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-prose">{d.aiInsight}</p>
      </div>
    </section>
  );
}
