import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Compass } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { BIDANG, COVER_CLASSES } from "@/config/bidang";
import { COMPASS, LOCKED } from "@/content/dashboard";
import { formatShortDate } from "@/lib/datetime";
import type { AsyncState } from "@/lib/useAsync";
import type { CompassHighlights } from "@/types/dashboard";
import FitBadge from "@/components/jurusan/FitBadge";
import { CardButton, CardError, CardSkeleton, DashCard, EmptyPanel, LockedPanel } from "./DashCard";

const FIELD_FIT_STYLE = {
  "Sangat sesuai": "bg-tint-green-bg text-tint-green-fg",
  Sesuai: "bg-tint-blue-bg text-tint-blue-fg",
} as const;

function CompassBody({ data }: { data: CompassHighlights }) {
  const field = BIDANG[data.bidang];
  return (
    <div className="flex flex-col gap-3.5 lg:gap-4">
      <div className="flex items-center gap-3 rounded-2xl bg-compass-soft p-3.5 lg:gap-4 lg:p-[18px]">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-white text-orbit-1 lg:h-[52px] lg:w-[52px] lg:rounded-2xl">
          <Compass size={24} aria-hidden="true" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1 lg:gap-0.5">
          <span className="hidden text-[13px] text-prose lg:block">{COMPASS.topField}</span>
          <span className="sr-only lg:hidden">{COMPASS.topField}:</span>
          <span className="text-base font-bold text-space-2 lg:text-xl">{field.label}</span>
          <span className={`self-start rounded-full px-2 py-0.5 text-[11px] font-semibold lg:hidden ${FIELD_FIT_STYLE[data.bidangFit]}`}>
            {COMPASS.fieldFit[data.bidangFit]}
          </span>
        </div>
        <span className={`hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold lg:inline ${FIELD_FIT_STYLE[data.bidangFit]}`}>
          {COMPASS.fieldFit[data.bidangFit]}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="mb-1 hidden text-[13px] font-semibold text-prose lg:block">{COMPASS.explore}</span>
        <ul>
          {data.jurusan.map((j) => {
            const bidang = BIDANG[j.bidang];
            const theme = COVER_CLASSES[bidang.theme];
            const Icon = bidang.icon;
            return (
              <li key={j.slug}>
                <Link
                  to={ROUTES.jurusanDetail(j.slug)}
                  className="flex min-h-14 items-center gap-3 border-b border-rim-soft transition-colors hover:bg-surface-soft lg:gap-3.5"
                >
                  <span className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-[10px] lg:flex ${theme.bg} ${theme.ink}`}>
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-semibold text-space-2 lg:text-[15px]">{j.name}</span>
                  <FitBadge label={j.fit} className="shrink-0" />
                  <ChevronRight size={18} aria-hidden="true" className="shrink-0 text-prose-faint" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <Link
        to={ROUTES.compass}
        className="inline-flex h-[46px] items-center justify-center gap-2 rounded-xl border-[1.5px] border-rim px-[18px] text-sm font-semibold text-orbit-1 transition-colors hover:bg-surface-sky lg:h-11 lg:self-start"
      >
        {COMPASS.open}
        <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" className="hidden lg:block" />
      </Link>
    </div>
  );
}

/** Kartu ORBIDU Compass: bidang paling selaras dan 3 jurusan teratas. */
export default function CompassCard({ locked, state }: { locked: boolean; state: AsyncState<CompassHighlights | null> }) {
  const aside =
    !locked && state.data ? (
      <span className="shrink-0 text-xs text-prose-dim lg:text-[13px]">
        <span className="lg:hidden">{formatShortDate(state.data.analyzedAt)}</span>
        <span className="hidden lg:inline">{COMPASS.updated(formatShortDate(state.data.analyzedAt))}</span>
      </span>
    ) : undefined;

  let body;
  if (locked) body = <LockedPanel description={LOCKED.compass} lines={3} />;
  else if (state.loading) body = <CardSkeleton />;
  else if (state.error) body = <CardError onRetry={state.reload} />;
  else if (!state.data)
    body = (
      <EmptyPanel
        icon={Compass}
        title={COMPASS.empty.title}
        body={COMPASS.empty.body}
        action={<CardButton to={ROUTES.compass}>{COMPASS.open}</CardButton>}
      />
    );
  else body = <CompassBody data={state.data} />;

  return (
    <DashCard id="dash-compass" title={COMPASS.title} aside={aside}>
      {body}
    </DashCard>
  );
}
