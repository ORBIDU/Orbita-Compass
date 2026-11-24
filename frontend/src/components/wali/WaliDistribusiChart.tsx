import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { DistribusiNilaiItem } from "@/types/wali";

interface WaliDistribusiChartProps {
  data: DistribusiNilaiItem[];
}

export default function WaliDistribusiChart({ data }: WaliDistribusiChartProps) {
  const chartData = data.map((d) => ({
    name: `${d.label}\n(${d.subLabel})`,
    shortName: d.label,
    count: d.count,
    color: d.color,
  }));

  return (
    <div className="rounded-card border border-rim-soft bg-white p-5 shadow-card sm:p-6">
      <div className="mb-4">
        <h2 className="text-base font-bold text-space-2 sm:text-lg">
          Distribusi Nilai Siswa
        </h2>
        <p className="text-xs text-prose-dim">
          Pengelompokan siswa berdasarkan kategori capaian akademik rapor saat ini
        </p>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="shortName"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#5F6B8A", fontFamily: "Poppins" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#5F6B8A", fontFamily: "Poppins" }}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(9, 101, 250, 0.04)" }}
              contentStyle={{
                background: "#101A33",
                border: "none",
                borderRadius: "12px",
                color: "white",
                fontSize: "12px",
                fontFamily: "Poppins",
                padding: "8px 12px",
              }}
              formatter={(value: any) => [`${value} Siswa`, "Jumlah"]}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={70}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
