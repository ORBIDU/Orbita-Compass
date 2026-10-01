import { useRef, type KeyboardEvent } from "react";
import { TABS } from "@/content/analisis";

export type AnalisisTab = "minat" | "prestasi" | "rapor";
export const ANALISIS_TABS: AnalisisTab[] = ["minat", "prestasi", "rapor"];

export const tabId = (tab: AnalisisTab) => `analisis-tab-${tab}`;
export const panelId = (tab: AnalisisTab) => `analisis-panel-${tab}`;

interface AnalisisTabsProps {
  active: AnalisisTab;
  chips: Record<AnalisisTab, string>;
  onChange: (tab: AnalisisTab) => void;
}

/** Tab Gambaran Minat Bakat | Prestasi | Nilai Rapor. Panah kiri/kanan berpindah tab. */
export default function AnalisisTabs({ active, chips, onChange }: AnalisisTabsProps) {
  const refs = useRef<Record<AnalisisTab, HTMLButtonElement | null>>({ minat: null, prestasi: null, rapor: null });

  function onKeyDown(e: KeyboardEvent) {
    const i = ANALISIS_TABS.indexOf(active);
    let next: AnalisisTab | null = null;
    if (e.key === "ArrowRight") next = ANALISIS_TABS[(i + 1) % ANALISIS_TABS.length];
    if (e.key === "ArrowLeft") next = ANALISIS_TABS[(i - 1 + ANALISIS_TABS.length) % ANALISIS_TABS.length];
    if (e.key === "Home") next = ANALISIS_TABS[0];
    if (e.key === "End") next = ANALISIS_TABS[ANALISIS_TABS.length - 1];
    if (!next) return;
    e.preventDefault();
    onChange(next);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={TABS.label}
      onKeyDown={onKeyDown}
      className="grid grid-cols-3 border-b border-rim lg:flex lg:gap-1"
    >
      {ANALISIS_TABS.map((tab) => {
        const selected = tab === active;
        return (
          <button
            key={tab}
            ref={(el) => {
              refs.current[tab] = el;
            }}
            id={tabId(tab)}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={panelId(tab)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab)}
            className={`-mb-px flex min-h-[60px] flex-col items-center justify-center gap-1 border-b-2 px-1 py-1.5 text-sm transition-colors lg:h-[52px] lg:min-h-0 lg:flex-row lg:gap-2.5 lg:px-4 lg:py-0 lg:text-[15px] ${
              selected ? "border-orbit-1 font-semibold text-orbit-1" : "border-transparent font-medium text-prose hover:text-space-2"
            }`}
          >
            <span className="text-center leading-tight">{TABS[tab]}</span>
            <span
              className={`rounded-full px-2 py-px text-[11px] font-semibold tabular-nums lg:py-0.5 lg:text-xs ${
                selected ? "bg-tint-blue-bg text-tint-blue-fg" : "bg-rim-faint text-prose"
              }`}
            >
              {chips[tab]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
