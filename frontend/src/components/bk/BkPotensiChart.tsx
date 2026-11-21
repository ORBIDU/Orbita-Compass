import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { BkPotensiData, PotensiGradeFilter } from "@/types/bk";

interface BkPotensiChartProps {
  data: BkPotensiData;
}

const FILTER_OPTIONS: { id: PotensiGradeFilter; label: string }[] = [
  { id: "semua", label: "Semua" },
  { id: "x", label: "Kelas X" },
  { id: "xi", label: "Kelas XI" },
  { id: "xii", label: "Kelas XII" },
];

export default function BkPotensiChart({ data }: BkPotensiChartProps) {
  const [filter, setFilter] = useState<PotensiGradeFilter>("semua");
  const active = data[filter];

  return (
    <section
      aria-labelledby="bk-potensi-title"
      className="flex flex-col rounded-card border border-rim-soft bg-white p-5 shadow-card sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="bk-potensi-title" className="text-base font-bold text-space-2 sm:text-lg">
            Peta Potensi Siswa
          </h2>
          <p className="mt-0.5 text-xs font-medium text-sun-1">
            {active.total} siswa telah dianalisis
          </p>
        </div>

        {/* Filter Tingkat Kelas */}
        <div
          role="tablist"
          aria-label="Filter tingkat kelas"
          className="inline-flex self-start rounded-xl bg-surface-toggle p-1"
        >
          {FILTER_OPTIONS.map((opt) => {
            const isActive = filter === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilter(opt.id)}
                className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition ${
                  isActive
                    ? "bg-white text-orbit-1 shadow-toggle"
                    : "text-prose-dim hover:text-space-2"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={active.items}
              dataKey="pct"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={54}
              outerRadius={82}
              paddingAngle={3}
              strokeWidth={0}
            >
              {active.items.map((entry) => (
                <Cell key={entry.label} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#101A33",
                border: "none",
                borderRadius: "12px",
                color: "#FFFFFF",
                fontSize: "12px",
                fontFamily: "Poppins",
                padding: "8px 12px",
              }}
              itemStyle={{ color: "#FFFFFF" }}
              formatter={(value, name) => [`${String(value ?? 0)}%`, String(name ?? "")]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5 border-t border-rim-soft pt-4">
        {active.items.map((p) => (
          <div key={p.label} className="flex items-center gap-2 text-xs">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: p.color }}
              aria-hidden="true"
            />
            <span className="flex-1 text-prose">{p.label}</span>
            <span className="font-bold text-space-2">{p.pct}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}
