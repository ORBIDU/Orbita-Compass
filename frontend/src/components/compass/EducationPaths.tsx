import { useState } from "react";
import { ChevronDown, EyeOff } from "lucide-react";
import { PATHS } from "@/content/compass";
import type { HiddenPath, PathGroup, PathKey } from "@/types/compass";
import FitBadge from "@/components/jurusan/FitBadge";

interface EducationPathsProps {
  groups: PathGroup[];
  hidden: HiddenPath[];
  /** true di mode dummy: data kampus masih contoh. */
  sample: boolean;
}

/** Jalur pendidikan: kartu per jalur yang bisa dibuka, plus alasan jalur yang disembunyikan. */
export default function EducationPaths({ groups, hidden, sample }: EducationPathsProps) {
  const [open, setOpen] = useState<PathKey | null>(groups[0]?.key ?? null);
  const active = groups.find((g) => g.key === open) ?? null;
  const panelId = "compass-path-panel";

  return (
    <section aria-labelledby="compass-jalur" className="flex flex-col gap-4 rounded-card border border-rim-soft bg-white p-4 lg:p-6">
      <div className="flex flex-col gap-1">
        <h2 id="compass-jalur" className="text-lg font-bold text-space-2 lg:text-xl">
          {PATHS.title}
        </h2>
        <p className="text-sm text-prose">{PATHS.subtitle}</p>
      </div>

      {groups.length === 0 ? (
        <p className="rounded-2xl bg-surface-soft p-4 text-sm text-prose">{PATHS.empty}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
            {groups.map((g) => {
              const on = g.key === open;
              const name = PATHS.names[g.key];
              return (
                <button
                  key={g.key}
                  type="button"
                  aria-expanded={on}
                  aria-controls={panelId}
                  onClick={() => setOpen(on ? null : g.key)}
                  className={`flex flex-col items-start gap-2 rounded-2xl border-[1.5px] p-3.5 text-left transition-colors lg:p-4 ${
                    on ? "border-orbit-1 bg-surface-sky" : "border-rim-soft bg-white hover:border-orbit-1"
                  }`}
                >
                  <span className="flex w-full flex-wrap items-center justify-between gap-1.5">
                    <span className="text-[15px] font-bold text-space-2 lg:text-base">{name.title}</span>
                    <FitBadge label={g.fit} className="!px-2 !py-0.5 !text-[11px]" />
                  </span>
                  <span className="text-[13px] text-prose">{name.sub}</span>
                  <span className="mt-1 flex items-center gap-1 text-[13px] font-semibold text-orbit-1">
                    {on ? PATHS.showing : PATHS.show}
                    <ChevronDown size={14} strokeWidth={2.4} aria-hidden="true" className={`transition-transform ${on ? "rotate-180" : ""}`} />
                  </span>
                </button>
              );
            })}
          </div>

          {active && (
            <div id={panelId} className="overflow-hidden rounded-2xl border border-rim-soft">
              <div className="flex items-center justify-between gap-3 border-b border-rim-soft bg-field-bg px-4 py-3">
                <span className="text-sm font-bold text-space-2">{PATHS.listTitle(PATHS.names[active.key].title)}</span>
                {sample && <span className="shrink-0 rounded-full bg-tint-orange-bg px-2 py-0.5 text-[11px] font-semibold text-tint-orange-fg">{PATHS.sampleData}</span>}
              </div>
              <ul>
                {active.options.map((o) => (
                  <li
                    key={`${o.prodi}-${o.kampus}`}
                    className="grid gap-0.5 border-b border-rim-faint px-4 py-3 text-sm last:border-b-0 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_140px] sm:items-center sm:gap-4"
                  >
                    <span className="font-semibold text-space-2">{o.prodi}</span>
                    <span className="text-prose">{o.kampus}</span>
                    <span className="text-[13px] text-prose-dim sm:text-right sm:text-sm">{o.kota}</span>
                  </li>
                ))}
              </ul>
              {active.total > active.options.length && (
                <p className="border-t border-rim-faint px-4 py-2.5 text-[13px] text-prose-dim">{PATHS.more(active.total - active.options.length)}</p>
              )}
            </div>
          )}
        </>
      )}

      {/* Alasan per jalur hanya berguna jika ada jalur lain yang tampil. */}
      {groups.length > 0 && hidden.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {hidden.map((h) => (
            <li key={h.key} className="flex items-start gap-2 text-[13px] text-prose-dim">
              <EyeOff size={16} aria-hidden="true" className="mt-px shrink-0" />
              {PATHS.hidden[h.reason](PATHS.names[h.key].title)}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
