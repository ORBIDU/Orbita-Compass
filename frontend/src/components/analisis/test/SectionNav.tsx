import { Check } from "lucide-react";
import { TEST } from "@/content/analisis";
import type { AsesmenSection } from "@/types/analisis";

interface SectionNavProps {
  sections: AsesmenSection[];
  doneFlags: boolean[];
  current: number;
  onPick: (index: number) => void;
  /** "aside" = panel kiri desktop, "compact" = daftar yang bisa dibuka-tutup di HP. */
  variant: "aside" | "compact";
}

/** Daftar bagian tes beserta statusnya; setiap bagian bisa dibuka langsung. */
export default function SectionNav({ sections, doneFlags, current, onPick, variant }: SectionNavProps) {
  const compact = variant === "compact";
  return (
    <ol className="flex flex-col gap-0.5">
      {sections.map((s, i) => {
        const done = doneFlags[i];
        const isCurrent = i === current;
        const status = done ? TEST.status.done : isCurrent ? TEST.status.current : compact ? TEST.status.todoShort : TEST.status.todo;
        return (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => onPick(i)}
              aria-current={isCurrent ? "step" : undefined}
              className={`flex w-full items-center text-left transition-colors ${
                compact ? "min-h-11 gap-2.5 rounded-[10px] px-2 py-1" : "min-h-[52px] gap-3 rounded-xl px-2.5 py-1.5"
              } ${isCurrent ? "bg-surface-blue" : "hover:bg-surface-soft"}`}
            >
              <span
                className={`flex shrink-0 items-center justify-center rounded-full border-2 font-bold tabular-nums ${
                  compact ? "h-6 w-6 text-[11px]" : "h-7 w-7 text-xs"
                } ${
                  done
                    ? "border-tint-green-fg bg-tint-green-fg text-white"
                    : isCurrent
                      ? "border-orbit-1 bg-white text-orbit-1"
                      : "border-field-rim bg-white text-prose-dim"
                }`}
              >
                {done ? <Check size={compact ? 12 : 13} strokeWidth={3.2} aria-hidden="true" /> : i + 1}
              </span>
              {compact ? (
                <>
                  <span className={`min-w-0 flex-1 text-[13px] text-space-2 ${isCurrent ? "font-semibold" : "font-medium"}`}>{s.title}</span>
                  <span className={`shrink-0 text-[11px] ${done ? "text-tint-green-fg" : isCurrent ? "text-orbit-1" : "text-prose-dim"}`}>{status}</span>
                </>
              ) : (
                <span className="flex min-w-0 flex-col">
                  <span className={`text-sm text-space-2 ${isCurrent ? "font-semibold" : "font-medium"}`}>{s.title}</span>
                  <span className={`text-xs ${done ? "text-tint-green-fg" : isCurrent ? "text-orbit-1" : "text-prose-dim"}`}>{status}</span>
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
