import { useRef, useState, type KeyboardEvent } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { BarChart3, BookOpen, CalendarDays, ChevronRight, Clock } from "lucide-react";
import { ROUTES, UJIAN_KEYS } from "@/config/navigation";
import { EXAM_COPY, UJIAN_HEADER, UJIAN_TABS, type UjianTab } from "@/content/siapUjian";
import { useAuth } from "@/context/AuthContext";
import { useStudentStatus } from "@/context/StudentStatusContext";
import { useAsync } from "@/lib/useAsync";
import { examSchedule, getExamOverview } from "@/services/practiceService";
import type { ExamId } from "@/types/practice";
import PageLoader from "@/components/ui/PageLoader";
import { PanelError, PanelSkeleton } from "@/components/ui/PanelState";
import LatihanTab from "@/components/ujian/LatihanTab";
import TryoutTab from "@/components/ujian/TryoutTab";
import PerformanceTab from "@/components/ujian/PerformanceTab";
import NotFoundPage from "./NotFoundPage";
import { usePageTitle } from "@/lib/usePageTitle";

const TAB_ICON: Record<UjianTab, typeof BookOpen> = { latihan: BookOpen, tryout: Clock, performance: BarChart3 };
const isTab = (v: string | null): v is UjianTab => UJIAN_TABS.some((t) => t.id === v);

/**
 * Siap SNBT, Siap TKA, Siap SKD (/portal/persiapan/:ujian?tab=…), satu
 * template sesuai docs/design/portal/Portal-SiapUjian.dc.html.
 */
export default function SiapUjianPage() {
  const { ujian } = useParams();
  const exam = UJIAN_KEYS.includes(ujian as ExamId) ? (ujian as ExamId) : null;
  return exam ? <SiapUjian key={exam} exam={exam} /> : <NotFoundPage />;
}

function SiapUjian({ exam }: { exam: ExamId }) {
  const { user } = useAuth();
  const { status } = useStudentStatus();
  const [params, setParams] = useSearchParams();
  const raw = params.get("tab");
  const tab: UjianTab = isTab(raw) ? raw : "latihan";
  const [now] = useState(() => new Date());
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const overview = useAsync(() => getExamOverview(user?.id ?? "", user?.profile?.grade ?? 12, exam, now), [user?.id, status, exam]);
  const copy = EXAM_COPY[exam];
  usePageTitle(copy.title);

  if (!user) return <PageLoader />;

  function selectTab(next: UjianTab, focus = false) {
    const p = new URLSearchParams(params);
    if (next === "latihan") p.delete("tab");
    else p.set("tab", next);
    setParams(p, { replace: true });
    if (focus) tabRefs.current[UJIAN_TABS.findIndex((t) => t.id === next)]?.focus();
  }

  function onTabKey(e: KeyboardEvent<HTMLDivElement>) {
    const i = UJIAN_TABS.findIndex((t) => t.id === tab);
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    let target: number | null = step ? (i + step + UJIAN_TABS.length) % UJIAN_TABS.length : null;
    if (e.key === "Home") target = 0;
    if (e.key === "End") target = UJIAN_TABS.length - 1;
    if (target === null) return;
    e.preventDefault();
    selectTab(UJIAN_TABS[target].id, true);
  }

  let body;
  if (overview.loading && !overview.data) body = <PanelSkeleton />;
  else if (overview.error || !overview.data) body = <PanelError onRetry={overview.reload} />;
  else if (tab === "latihan") body = <LatihanTab overview={overview.data} />;
  else if (tab === "tryout") body = <TryoutTab overview={overview.data} />;
  else body = <PerformanceTab overview={overview.data} onTab={(t) => selectTab(t)} />;

  return (
    <div className="flex-1 overflow-y-auto bg-surface-soft">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-4 pb-8 pt-4 sm:px-6 lg:gap-5 lg:px-10 lg:pb-12 lg:pt-7">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex max-w-[760px] flex-col gap-1.5 lg:gap-2">
            <nav aria-label="Breadcrumb" className="hidden items-center gap-2 text-[13px] text-prose-dim lg:flex">
              <Link to={ROUTES.portal} className="rounded hover:text-space-2 hover:underline">
                {UJIAN_HEADER.breadcrumbHome}
              </Link>
              <ChevronRight size={12} strokeWidth={2.4} aria-hidden="true" className="text-prose-faint" />
              <span>{UJIAN_HEADER.breadcrumbSection}</span>
              <ChevronRight size={12} strokeWidth={2.4} aria-hidden="true" className="text-prose-faint" />
              <span aria-current="page" className="font-semibold text-space-2">
                {copy.title}
              </span>
            </nav>
            <h1 className="text-2xl font-bold leading-tight text-space-2 lg:text-[30px] lg:tracking-[-0.5px]">{copy.title}</h1>
            <p className="text-sm leading-relaxed text-prose lg:text-[15px]">{copy.description}</p>
          </div>
          <span className="flex items-center gap-2 self-start rounded-full border border-rim-soft bg-white px-3.5 py-2 text-[13px] font-semibold text-space-1 lg:shrink-0 lg:self-auto">
            <CalendarDays size={16} aria-hidden="true" className="text-tint-orange-fg" />
            {examSchedule(exam, now)}
          </span>
        </div>

        {/* Di HP ikon tab disembunyikan supaya tiga tab muat; kalau tetap sempit, tab bisa digeser tanpa membuat halaman melebar. */}
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div role="tablist" aria-label={copy.title} onKeyDown={onTabKey} className="flex min-w-max gap-1 border-b border-rim">
            {UJIAN_TABS.map((t, i) => {
              const Icon = TAB_ICON[t.id];
              const selected = t.id === tab;
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${t.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectTab(t.id)}
                  className={`-mb-px flex h-12 items-center gap-2 whitespace-nowrap border-b-2 px-3 text-sm sm:h-[52px] sm:px-[18px] sm:text-[15px] ${
                    selected ? "border-orbit-1 font-semibold text-orbit-1" : "border-transparent font-medium text-prose hover:text-space-2"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.9} aria-hidden="true" className="hidden sm:block" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
          {body}
        </div>
      </div>
    </div>
  );
}
