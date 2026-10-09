import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Briefcase,
  ChevronRight,
  Code2,
  House,
  Monitor,
  SearchX,
  Shield,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { CareerIcon, FitLabel, JurusanDetail, JurusanSummary } from "@/types/jurusan";
import { BIDANG, COVER_CLASSES } from "@/config/bidang";
import { ROUTES } from "@/config/navigation";
import { whatsappLink } from "@/config/brand";
import { JALUR_INFO, JURUSAN_DETAIL as T } from "@/content/jurusan";
import { getJurusanDetail, getSimilarJurusan } from "@/services/jurusanService";
import { useAuth } from "@/context/AuthContext";
import { useStudentStatus } from "@/context/StudentStatusContext";
import JurusanCover from "@/components/jurusan/JurusanCover";
import FitBadge from "@/components/jurusan/FitBadge";
import CampusList from "@/components/jurusan/CampusList";
import { useJurusanFit } from "@/components/jurusan/useJurusanFit";
import { CONTAINER } from "@/components/landing/primitives";
import { ButtonLink } from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import PageLoader from "@/components/ui/PageLoader";
import { usePageTitle } from "@/lib/usePageTitle";

// Ikon dan warna kotak ikon prospek karier (warna berputar seperti desain).
const CAREER_ICON: Record<CareerIcon, LucideIcon> = {
  code: Code2,
  chart: BarChart3,
  monitor: Monitor,
  shield: Shield,
  sparkles: Sparkles,
  user: UserRound,
  briefcase: Briefcase,
};
const CAREER_TONES = [
  "bg-tint-blue-bg text-orbit-1",
  "bg-tint-orange-bg text-tint-orange-fg",
  "bg-tint-teal-bg text-tint-teal-fg",
  "bg-tint-navy-bg text-space-1",
];

const H2 = "text-[22px] font-bold text-space-2 lg:text-[26px]";
const SIDE_CARD = "flex flex-col gap-3.5 rounded-[20px] border border-rim bg-surface-soft p-5 sm:p-6";

function EmptyNote({ children }: { children: string }) {
  return <p className="rounded-2xl bg-surface-soft px-5 py-4 text-sm text-prose">{children}</p>;
}

function SimilarCard({ jurusan }: { jurusan: JurusanSummary }) {
  const bidang = BIDANG[jurusan.bidang];
  const theme = COVER_CLASSES[bidang.theme];
  const Icon = bidang.icon;
  return (
    <Link
      to={ROUTES.jurusanDetail(jurusan.slug)}
      className="group flex items-center gap-3.5 rounded-2xl border border-rim bg-white p-4 transition hover:shadow-soft sm:p-[18px]"
    >
      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] ${theme.bg} ${theme.ink}`}>
        <Icon size={26} strokeWidth={1.7} aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-base font-semibold text-space-2 group-hover:text-orbit-1">{jurusan.name}</span>
        <span className="text-[13px] text-prose">{bidang.label}</span>
      </span>
    </Link>
  );
}

/** Kartu ajakan "Cocok nggak sih buatku?" yang isinya menyesuaikan status siswa. */
function FitCta({ jurusan, fit }: { jurusan: JurusanDetail; fit: FitLabel | undefined }) {
  const { status: authStatus } = useAuth();
  const { status } = useStudentStatus();
  const loggedIn = authStatus === "authenticated";

  const buttonClass =
    "mt-1.5 flex h-[50px] items-center justify-center gap-2 rounded-xl bg-gradient-sun-x px-4 text-center text-[15px] font-semibold text-space-2 transition hover:brightness-105";

  // Tamu: tidak ada pendaftaran mandiri, jadi ajak berlangganan (WhatsApp) atau masuk.
  if (!loggedIn) {
    return (
      <div className="on-dark relative flex flex-col gap-3 overflow-hidden rounded-[20px] bg-gradient-to-b from-space-1 to-space-2 p-5 sm:p-6">
        <p className="font-accent text-[26px] font-bold leading-[1.1] text-sun-2">{T.cta.accent}</p>
        <p className="text-[15px] leading-[1.65] text-night-sub">{T.cta.guestBody(jurusan.name)}</p>
        <a href={whatsappLink("berlangganan")} target="_blank" rel="noopener noreferrer" className={buttonClass}>
          {T.cta.guestButton}
          <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
        </a>
        <p className="text-center text-sm text-night-sub">
          {T.cta.guestLoginText}{" "}
          <Link to={ROUTES.masuk} className="rounded font-semibold text-night-light underline-offset-2 hover:underline">
            {T.cta.guestLogin}
          </Link>
        </p>
      </div>
    );
  }

  let body: string;
  let to: string;
  let label: string;
  if (status === "baru" || status === null) {
    body = T.cta.baruBody(jurusan.name);
    to = ROUTES.analisisPotensi;
    label = T.cta.baruButton;
  } else {
    body = fit ? T.cta.fitBody(jurusan.name, fit) : T.cta.noFitBody(jurusan.name);
    to = ROUTES.compass;
    label = T.cta.compassButton;
  }

  return (
    <div className="on-dark relative flex flex-col gap-3 overflow-hidden rounded-[20px] bg-gradient-to-b from-space-1 to-space-2 p-5 sm:p-6">
      <p className="font-accent text-[26px] font-bold leading-[1.1] text-sun-2">{T.cta.accent}</p>
      <p className="text-[15px] leading-[1.65] text-night-sub">{body}</p>
      <Link to={to} className={buttonClass}>
        {label}
        <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
      </Link>
    </div>
  );
}

export default function JurusanDetailPage() {
  const { slug = "" } = useParams();
  const [detail, setDetail] = useState<JurusanDetail | null | undefined>(undefined);
  usePageTitle(detail ? detail.name : detail === null ? T.notFoundTitle : null);
  const { status: authStatus } = useAuth();
  const fit = useJurusanFit();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    setDetail(undefined);
    getJurusanDetail(slug).then((d) => active && setDetail(d));
    // Pindah ke jurusan lain (mis. dari "Jurusan lain yang mirip") → mulai dari atas.
    scrollRef.current?.scrollTo(0, 0);
    window.scrollTo(0, 0);
    return () => {
      active = false;
    };
  }, [slug]);

  if (detail === undefined) return <PageLoader />;

  if (detail === null) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <EmptyState
          icon={SearchX}
          title={T.notFoundTitle}
          description={T.notFoundBody}
          action={
            <ButtonLink to={ROUTES.jurusan} variant="primary">
              {T.back}
            </ButtonLink>
          }
        />
      </div>
    );
  }

  const bidang = BIDANG[detail.bidang];
  const similar = getSimilarJurusan(detail);
  const about = detail.about.length > 0 ? detail.about : [detail.description];
  const homeTo = authStatus === "authenticated" ? ROUTES.portal : ROUTES.landing;
  const myFit = fit[detail.slug];

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto bg-white">
      <div className={`${CONTAINER} flex flex-col gap-6 pb-16 pt-6 lg:gap-8 lg:pb-24 lg:pt-8`}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2.5 text-sm text-prose-dim">
          <Link to={homeTo} aria-label={T.breadcrumbHome} className="flex shrink-0 items-center hover:text-space-2">
            <House size={18} strokeWidth={2} />
          </Link>
          <ChevronRight size={14} strokeWidth={2.4} aria-hidden="true" className="shrink-0" />
          <Link to={ROUTES.jurusan} className="shrink-0 hover:text-space-2">
            {T.breadcrumbList}
          </Link>
          <ChevronRight size={14} strokeWidth={2.4} aria-hidden="true" className="shrink-0" />
          <span aria-current="page" className="truncate font-semibold text-space-2">
            {detail.name}
          </span>
        </nav>

        <JurusanCover
          jurusan={detail}
          variant="hero"
          placeholderLabel={T.photoPlaceholder(detail.name)}
          className="h-[200px] rounded-card-lg sm:h-[300px] lg:h-[400px]"
        />

        {/* Judul */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[30px] font-bold leading-[1.1] tracking-[-0.6px] text-space-2 lg:text-[44px] lg:tracking-[-0.8px]">{detail.name}</h1>
              {myFit && <FitBadge label={myFit} className="text-[13px]" />}
            </div>
            <span className="text-base text-prose lg:text-lg">{bidang.label}</span>
            <div className="mt-1.5 flex flex-wrap gap-2">
              <span className="rounded-lg bg-tint-blue-bg px-3 py-[5px] text-[13px] font-semibold text-tint-blue-fg">{detail.degree}</span>
              {/* Kedinasan: rumpun dan jalur sama-sama "Kedinasan", cukup tampil sekali. */}
              {!detail.jalur.includes(detail.rumpun as JurusanDetail["jalur"][number]) && (
                <span className="rounded-lg bg-tint-blue-bg px-3 py-[5px] text-[13px] font-semibold text-tint-blue-fg">{detail.rumpun}</span>
              )}
              <span className="rounded-lg bg-tint-orange-bg px-3 py-[5px] text-[13px] font-semibold text-tint-orange-fg">{detail.jalur.join(", ")}</span>
            </div>
          </div>
          <Link
            to={ROUTES.jurusan}
            className="flex h-12 shrink-0 items-center gap-2 self-start rounded-xl border-[1.5px] border-rim px-5 text-[15px] font-medium text-space-1 transition hover:bg-surface-soft sm:self-auto"
          >
            <ArrowLeft size={18} strokeWidth={2.2} aria-hidden="true" />
            {T.back}
          </Link>
        </div>

        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:items-start lg:gap-10 xl:grid-cols-[760px_400px]">
          <div className="flex min-w-0 flex-col gap-10 lg:gap-12">
            <section className="flex flex-col gap-3.5">
              <h2 className={H2}>{T.about}</h2>
              {about.map((p, i) => (
                <p key={i} className="text-base leading-[1.75] text-prose lg:text-[17px]">
                  {p}
                </p>
              ))}
            </section>

            <section className="flex flex-col gap-4">
              <h2 className={H2}>{T.topics}</h2>
              {detail.topics.length > 0 ? (
                <ul className="flex flex-wrap gap-2.5">
                  {detail.topics.map((t) => (
                    <li key={t} className="rounded-xl border border-rim bg-surface-soft px-4 py-2.5 text-sm font-medium text-space-1 sm:text-[15px]">
                      {t}
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyNote>{T.empty.topics}</EmptyNote>
              )}
            </section>

            <section className="flex flex-col gap-4">
              <h2 className={H2}>{T.careers}</h2>
              {detail.careers.length > 0 ? (
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {detail.careers.map((career, i) => {
                    const Icon = CAREER_ICON[career.icon ?? "briefcase"];
                    return (
                      <li key={career.title} className="flex items-center gap-3.5 rounded-2xl border border-rim p-4">
                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${CAREER_TONES[i % CAREER_TONES.length]}`}>
                          <Icon size={22} strokeWidth={1.9} aria-hidden="true" />
                        </span>
                        <span className="flex min-w-0 flex-col">
                          <span className="text-base font-semibold text-space-2">{career.title}</span>
                          <span className="text-[13px] text-prose">{career.description}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <EmptyNote>{T.empty.careers}</EmptyNote>
              )}
            </section>

            <CampusList jurusan={detail} />
          </div>

          <aside className="flex flex-col gap-5">
            <div className={SIDE_CARD}>
              <h3 className="text-lg font-bold text-space-2">{T.subjects}</h3>
              {detail.supportingSubjects.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {detail.supportingSubjects.map((s) => (
                    <li key={s} className="rounded-full border border-rim bg-white px-3 py-1.5 text-sm font-medium text-space-1">
                      {s}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-prose">{T.empty.subjects}</p>
              )}
            </div>

            <div className={SIDE_CARD}>
              <h3 className="text-lg font-bold text-space-2">{T.jalur}</h3>
              <dl className="flex flex-col gap-2.5">
                {detail.jalur.map((j) => (
                  <div key={j} className="flex flex-col gap-0.5">
                    <dt className="text-[15px] font-semibold text-space-2">{j}</dt>
                    <dd className="text-[13px] leading-normal text-prose">{JALUR_INFO[j]}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <FitCta jurusan={detail} fit={myFit} />
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="mt-4 flex flex-col gap-5 lg:mt-8">
            <h2 className={H2}>{T.similar}</h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {similar.map((s) => (
                <li key={s.slug}>
                  <SimilarCard jurusan={s} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
