import type { ReactNode } from "react";
import { Bookmark, CalendarDays, ExternalLink } from "lucide-react";
import { CARD, DETAIL } from "@/content/beasiswa";
import type { Scholarship } from "@/types/beasiswa";
import Dialog from "@/components/ui/Dialog";
import { Chip } from "./ScholarshipCard";
import { PROVIDER_STYLE } from "./providerStyle";

interface ScholarshipDialogProps {
  s: Scholarship;
  match: boolean;
  saved: boolean;
  busy: boolean;
  onToggleSave: () => void;
  onClose: () => void;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-1.5">
      <h3 className="text-sm font-bold text-space-2">{title}</h3>
      {children}
    </section>
  );
}

/** Jendela detail beasiswa (memakai komponen Dialog). */
export default function ScholarshipDialog({ s, match, saved, busy, onToggleSave, onClose }: ScholarshipDialogProps) {
  const { icon: Icon, tile } = PROVIDER_STYLE[s.provider];
  return (
    <Dialog
      title={s.name}
      onClose={onClose}
      widthClass="max-w-[600px]"
      icon={
        <span className={`flex h-[52px] w-[52px] items-center justify-center rounded-[14px] ${tile}`}>
          <Icon size={26} strokeWidth={1.9} aria-hidden="true" />
        </span>
      }
    >
      <p className="-mt-3 text-sm text-prose">{s.organizer}</p>
      <div className="flex flex-wrap gap-1.5">
        <Chip>{s.levels.join(", ")}</Chip>
        <Chip>{s.location}</Chip>
        {match && <Chip tone="match">{CARD.match}</Chip>}
      </div>
      <Section title={DETAIL.coverage}>
        <p className="text-sm leading-relaxed text-prose">{s.coverage}</p>
      </Section>
      <Section title={DETAIL.requirements}>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-sm leading-normal text-prose">
          {s.requirements.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Section>
      <Section title={DETAIL.documents}>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-sm leading-normal text-prose">
          {s.documents.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </Section>
      <div className="flex items-center gap-2 rounded-xl bg-surface-soft px-3.5 py-3 text-[13px] text-space-1">
        <CalendarDays size={16} aria-hidden="true" className="shrink-0 text-prose" />
        {s.period}
      </div>
      <div className="mt-1 flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        {s.officialUrl ? (
          <a
            href={s.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[46px] items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-orbit-1 hover:bg-surface-sky"
          >
            {DETAIL.website}
            <span className="sr-only">{DETAIL.websiteNewTab}</span>
            <ExternalLink size={16} strokeWidth={2.2} aria-hidden="true" />
          </a>
        ) : (
          <p className="text-[13px] leading-normal text-prose-dim sm:max-w-[300px]">{DETAIL.noWebsite}</p>
        )}
        <button
          type="button"
          aria-pressed={saved}
          disabled={busy}
          onClick={onToggleSave}
          className="flex h-[46px] items-center justify-center gap-2 rounded-xl bg-orbit-1 px-[18px] text-sm font-semibold text-white hover:brightness-95 disabled:cursor-wait disabled:opacity-75"
        >
          <Bookmark size={16} aria-hidden="true" className={saved ? "fill-white" : ""} />
          {saved ? DETAIL.saved : DETAIL.save}
        </button>
      </div>
    </Dialog>
  );
}
