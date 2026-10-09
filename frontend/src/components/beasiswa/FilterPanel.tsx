import { Bookmark, Check } from "lucide-react";
import { FILTERS } from "@/content/beasiswa";
import {
  SCHOLARSHIP_AID,
  SCHOLARSHIP_LEVELS,
  SCHOLARSHIP_LOCATIONS,
  type ScholarshipAid,
  type ScholarshipFilters,
  type ScholarshipLevel,
  type ScholarshipLocation,
} from "@/types/beasiswa";

export interface OptionCounts {
  levels: Record<ScholarshipLevel, number>;
  locations: Record<ScholarshipLocation, number>;
  aid: Record<ScholarshipAid, number>;
}

interface FilterPanelProps {
  filters: ScholarshipFilters;
  counts: OptionCounts;
  savedCount: number;
  /** Alasan "Cocok dengan jalurku" belum bisa dipakai; null = bisa dipakai. */
  matchUnavailable: string | null;
  onChange: (next: ScholarshipFilters) => void;
}

function Checkbox({ label, count, checked, onToggle }: { label: string; count: number; checked: boolean; onToggle: () => void }) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-lg px-1 text-sm text-space-2 hover:bg-surface-soft">
      <input type="checkbox" checked={checked} onChange={onToggle} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-orbit-1 ${
          checked ? "border-orbit-1 bg-orbit-1 text-white" : "border-rim-box bg-white"
        }`}
      >
        {checked && <Check size={12} strokeWidth={3.4} />}
      </span>
      <span className="flex-1">{label}</span>
      <span className="text-xs tabular-nums text-prose-dim">{count}</span>
    </label>
  );
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

/** Isi filter beasiswa; dipakai di panel kiri (desktop) dan lembar bawah (HP). */
export default function FilterPanel({ filters, counts, savedCount, matchUnavailable, onChange }: FilterPanelProps) {
  const matchOn = filters.matchOnly && !matchUnavailable;
  const groups = [
    { key: "levels" as const, title: FILTERS.groups.levels, options: SCHOLARSHIP_LEVELS, counts: counts.levels as Record<string, number> },
    { key: "locations" as const, title: FILTERS.groups.locations, options: SCHOLARSHIP_LOCATIONS, counts: counts.locations as Record<string, number> },
    { key: "aid" as const, title: FILTERS.groups.aid, options: SCHOLARSHIP_AID, counts: counts.aid as Record<string, number> },
  ];

  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        role="switch"
        aria-checked={matchOn}
        aria-describedby="beasiswa-match-hint"
        disabled={Boolean(matchUnavailable)}
        onClick={() => onChange({ ...filters, matchOnly: !filters.matchOnly })}
        className={`flex min-h-14 items-center gap-3 rounded-[14px] border-[1.5px] px-3 py-2.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
          matchOn ? "border-orbit-1 bg-surface-blue" : "border-rim-soft bg-field-bg"
        }`}
      >
        <span className="flex flex-1 flex-col">
          <span className="text-sm font-semibold text-space-2">{FILTERS.match.title}</span>
          <span id="beasiswa-match-hint" className="text-xs text-prose">
            {matchUnavailable ?? FILTERS.match.hint}
          </span>
        </span>
        <span aria-hidden="true" className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${matchOn ? "bg-orbit-1" : "bg-rim-strong"}`}>
          <span className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow transition-[left] ${matchOn ? "left-[19px]" : "left-[3px]"}`} />
        </span>
      </button>

      {groups.map((g) => (
        <fieldset key={g.key} className="flex flex-col gap-1">
          <legend className="pb-2 text-[13px] font-semibold text-prose">{g.title}</legend>
          {g.options.map((v) => {
            const list = filters[g.key] as string[];
            return (
              <Checkbox
                key={v}
                label={v}
                count={g.counts[v]}
                checked={list.includes(v)}
                onToggle={() => onChange({ ...filters, [g.key]: toggle(list, v) })}
              />
            );
          })}
        </fieldset>
      ))}

      <label
        className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border px-3 text-sm font-medium text-space-2 ${
          filters.savedOnly ? "border-orbit-1 bg-surface-blue" : "border-rim-soft bg-field-bg"
        }`}
      >
        <input
          type="checkbox"
          checked={filters.savedOnly}
          onChange={() => onChange({ ...filters, savedOnly: !filters.savedOnly })}
          className="peer sr-only"
        />
        <Bookmark
          size={18}
          aria-hidden="true"
          className={`shrink-0 text-orbit-1 peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-orbit-1 ${filters.savedOnly ? "fill-orbit-1" : ""}`}
        />
        <span className="flex-1">{FILTERS.saved}</span>
        <span className="text-xs tabular-nums text-prose-dim">{savedCount}</span>
      </label>
    </div>
  );
}
