import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TrenSemesterItem } from "@/types/wali";

interface WaliTrenPerkembanganProps {
  data: TrenSemesterItem[];
}

export default function WaliTrenPerkembangan({ data }: WaliTrenPerkembanganProps) {
  return (
    <div className="flex flex-col justify-between rounded-card border border-rim-soft bg-white p-5 shadow-card sm:p-6">
      <div className="mb-4">
        <h2 className="text-base font-bold text-space-2 sm:text-lg">
          Tren Nilai Rata-rata Kelas
        </h2>
        <p className="text-xs text-prose-dim">
          Perkembangan rerata akademik kelas per semester (Semester 1–5)
        </p>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="sem"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#5F6B8A", fontFamily: "Poppins" }}
            />
            <YAxis
              domain={[75, 95]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#5F6B8A", fontFamily: "Poppins" }}
            />
            <Tooltip
              contentStyle={{
                background: "#101A33",
                border: "none",
                borderRadius: "12px",
                color: "white",
                fontSize: "12px",
                fontFamily: "Poppins",
                padding: "8px 12px",
              }}
              formatter={(val: any) => [`${Number(val).toFixed(1)}`, "Rata-rata"]}
            />
            <Line
              type="monotone"
              dataKey="avg"
              stroke="#0965FA"
              strokeWidth={3}
              dot={{ fill: "#0965FA", r: 4, strokeWidth: 2, stroke: "#ffffff" }}
              activeDot={{ r: 6, fill: "#00B2DD" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-prose-dim border-t border-rim-soft pt-3">
        <span>Semester Awal: <strong>82.4</strong></span>
        <span className="text-success font-semibold">Tren Naik (+5.2 poin)</span>
        <span>Semester Ini: <strong>87.6</strong></span>
      </div>
    </div>
  );
}
