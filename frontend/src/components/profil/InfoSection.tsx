import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { EMPTY_VALUE, SECTIONS } from "@/content/profil";
import type { InfoSectionData } from "@/lib/profil";

/** Satu bagian data diri: daftar label–nilai (hanya dibaca). Bagian rahasia disembunyikan dulu. */
export default function InfoSection({ section }: { section: InfoSectionData }) {
  const [open, setOpen] = useState(!section.private);
  const bodyId = `${section.id}-isi`;
  return (
    <section aria-labelledby={section.id} className="flex flex-col gap-4 rounded-card border border-rim-soft bg-white p-4 sm:px-6 sm:py-[22px]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 id={section.id} className="flex items-center gap-2.5 text-[17px] font-bold text-space-2">
            <span aria-hidden="true" className={`h-[18px] w-1 rounded-sm ${section.accent}`} />
            {section.title}
          </h2>
          {section.private && (
            <span className="flex items-center gap-1.5 text-xs text-prose-dim">
              <Lock size={14} aria-hidden="true" className="shrink-0" />
              {SECTIONS.privateNote}
            </span>
          )}
        </div>
        {section.private && (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={bodyId}
            onClick={() => setOpen((o) => !o)}
            className="flex h-[38px] shrink-0 items-center gap-1.5 rounded-[10px] border-[1.5px] border-rim bg-white px-3 text-[13px] font-semibold text-orbit-1 hover:bg-surface-sky"
          >
            {open ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
            {open ? SECTIONS.hide : SECTIONS.show}
          </button>
        )}
      </div>
      <div id={bodyId}>
        {open ? (
          <dl className="grid gap-x-6 sm:grid-cols-2">
            {section.rows.map((r) => (
              <div key={r.label} className={`flex flex-col gap-[3px] border-b border-rim-faint py-3 ${r.full ? "sm:col-span-2" : ""}`}>
                <dt className="text-xs font-medium text-prose-dim">{r.label}</dt>
                <dd className={`text-[15px] tabular-nums ${r.value ? "font-medium text-space-2" : "italic text-field-hint"}`}>{r.value ?? EMPTY_VALUE}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="rounded-xl bg-surface-soft px-4 py-3.5 text-[13px] text-prose">{SECTIONS.hiddenBody}</p>
        )}
      </div>
    </section>
  );
}
