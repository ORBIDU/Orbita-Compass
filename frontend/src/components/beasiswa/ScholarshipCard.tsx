import { ArrowRight, Bookmark, CalendarDays } from "lucide-react";
import { CARD } from "@/content/beasiswa";
import type { Scholarship } from "@/types/beasiswa";
import { PROVIDER_STYLE } from "./providerStyle";

export function Chip({ children, tone = "neutral" }: { children: string; tone?: "neutral" | "match" }) {
  return (
    <span
      className={`rounded-full px-2.5 py-[3px] text-xs font-semibold ${tone === "match" ? "bg-tint-green-bg text-tint-green-fg" : "bg-rim-faint text-space-1"}`}
    >
      {children}
    </span>
  );
}

export function SaveButton({ s, saved, busy, onToggle }: { s: Scholarship; saved: boolean; busy: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? CARD.unsave(s.name) : CARD.save(s.name)}
      disabled={busy}
      onClick={onToggle}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-rim-soft bg-white text-orbit-1 hover:bg-surface-sky disabled:cursor-wait disabled:opacity-60"
    >
      <Bookmark size={18} aria-hidden="true" className={saved ? "fill-orbit-1" : ""} />
    </button>
  );
}

interface ScholarshipCardProps {
  s: Scholarship;
  match: boolean;
  saved: boolean;
  busy: boolean;
  onToggleSave: () => void;
  onOpen: () => void;
}

/** Kartu beasiswa di daftar Explore Beasiswa. */
export default function ScholarshipCard({ s, match, saved, busy, onToggleSave, onOpen }: ScholarshipCardProps) {
  const { icon: Icon, tile } = PROVIDER_STYLE[s.provider];
  return (
    <article className="flex flex-col gap-3 rounded-card border border-rim-soft bg-white p-4 lg:p-5">
      <div className="flex items-start gap-3.5">
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] ${tile}`}>
          <Icon size={24} strokeWidth={1.9} aria-hidden="true" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h2 className="text-base font-bold leading-snug text-space-2 lg:text-[17px]">{s.name}</h2>
          <span className="text-[13px] text-prose">{s.organizer}</span>
        </div>
        <SaveButton s={s} saved={saved} busy={busy} onToggle={onToggleSave} />
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Chip>{s.levels.join(", ")}</Chip>
        <Chip>{s.location}</Chip>
        {match && <Chip tone="match">{CARD.match}</Chip>}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-prose-dim">{CARD.coverage}</span>
        <span className="text-sm leading-normal text-space-2">{s.coverage}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-prose-dim">{CARD.requirements}</span>
        <span className="text-sm leading-relaxed text-prose">{s.requirements.slice(0, 2).join(". ")}.</span>
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-rim-faint pt-3">
        <span className="flex min-w-0 flex-1 items-center gap-1.5 text-[13px] leading-snug text-prose">
          <CalendarDays size={16} aria-hidden="true" className="shrink-0" />
          {s.period}
        </span>
        <button
          type="button"
          onClick={onOpen}
          aria-haspopup="dialog"
          className="flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[10px] border-[1.5px] border-rim bg-white px-3.5 text-[13px] font-semibold text-orbit-1 hover:bg-surface-sky"
        >
          {CARD.detail}
          <span className="sr-only">: {s.name}</span>
          <ArrowRight size={14} strokeWidth={2.4} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
