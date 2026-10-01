import { AlertCircle, Check, Clock } from "lucide-react";
import { COMPLETENESS } from "@/content/analisis";
import { formatPoints, type CompletenessItem, type CompletenessKind } from "@/lib/kelengkapan";

const MARK: Record<CompletenessKind, { box: string; text: string }> = {
  done: { box: "border-tint-green-fg bg-tint-green-fg text-white", text: "text-space-1" },
  partial: { box: "border-orbit-1 bg-white text-orbit-1", text: "text-space-1" },
  wait: { box: "border-field-rim bg-rim-faint text-prose-dim", text: "text-prose" },
  todo: { box: "border-tint-orange-rim bg-tint-orange-bg text-tint-orange-fg", text: "text-tint-orange-ink" },
};

function Mark({ kind }: { kind: CompletenessKind }) {
  return (
    <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] ${MARK[kind].box}`}>
      {kind === "done" && <Check size={11} strokeWidth={3.2} aria-hidden="true" />}
      {kind === "partial" && <span className="h-1.5 w-1.5 rounded-full bg-orbit-1" />}
      {kind === "wait" && <Clock size={11} strokeWidth={3} aria-hidden="true" />}
      {kind === "todo" && <AlertCircle size={11} strokeWidth={3} aria-hidden="true" />}
    </span>
  );
}

function Ring({ pct }: { pct: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label={COMPLETENESS.ringLabel(pct)} className="h-14 w-14 shrink-0 lg:h-16 lg:w-16">
      <circle cx="32" cy="32" r={r} fill="none" strokeWidth="7" className="stroke-rim-soft" />
      {pct > 0 && (
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${(c * pct) / 100} ${c}`}
          transform="rotate(-90 32 32)"
          className="stroke-orbit-1"
        />
      )}
      <text x="32" y="37" textAnchor="middle" className="fill-space-2 text-sm font-bold">
        {pct}%
      </text>
    </svg>
  );
}

interface CompletenessCardProps {
  pct: number;
  items: CompletenessItem[];
  hint: string;
}

/** Kartu "Kelengkapan profil": persentase dan penjelasan apa saja yang masih kurang. */
export default function CompletenessCard({ pct, items, hint }: CompletenessCardProps) {
  return (
    <section
      aria-label={COMPLETENESS.title}
      className="flex w-full flex-col gap-3 rounded-[18px] border border-rim-soft bg-white p-4 lg:grid lg:w-[410px] lg:shrink-0 lg:grid-cols-[64px_minmax(0,1fr)] lg:items-start lg:gap-4 lg:rounded-card lg:px-5 lg:py-[18px]"
    >
      <div className="flex items-center gap-3.5 lg:contents">
        <Ring pct={pct} />
        <div className="flex flex-col lg:hidden">
          <span className="text-[15px] font-bold text-space-2">{COMPLETENESS.title}</span>
          <span className="text-[13px] text-prose">{hint}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 lg:gap-[7px]">
        <span className="hidden text-[15px] font-bold text-space-2 lg:block">{COMPLETENESS.title}</span>
        <ul className="flex flex-col gap-2 lg:gap-[7px]">
          {items.map((item) => (
            <li key={item.key} className={`flex items-center gap-2 text-[13px] ${MARK[item.kind].text}`}>
              <Mark kind={item.kind} />
              <span className="min-w-0 flex-1">{item.text}</span>
              <span className="shrink-0 text-xs tabular-nums text-field-hint">
                {formatPoints(item.earned)}/{item.max}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
