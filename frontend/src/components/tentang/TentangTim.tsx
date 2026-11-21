import { useRef, useState, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight, UserRound } from "lucide-react";
import { TENTANG_TIM, type TeamMember } from "@/content/tentangKami";
import { Badge, CONTAINER } from "@/components/landing/primitives";

/** Foto anggota; kalau belum ada, avatar bawaan. */
function Avatar({ member, big }: { member: TeamMember; big: boolean }) {
  const size = big ? "h-24 w-24 lg:h-28 lg:w-28" : "h-20 w-20 lg:h-24 lg:w-24";
  return (
    <span className={`relative flex items-center justify-center rounded-full border-2 border-dashed p-1.5 ${big ? "border-orbit-1/60" : "border-orbit-1/35"}`}>
      {member.photo ? (
        <img src={member.photo} alt="" className={`${size} rounded-full object-cover`} />
      ) : (
        <span aria-hidden="true" className={`${size} flex items-center justify-center rounded-full bg-gradient-orbit text-white`}>
          <UserRound className="h-1/2 w-1/2" strokeWidth={1.8} />
        </span>
      )}
    </span>
  );
}

function Card({ member, center, className = "" }: { member: TeamMember; center: boolean; className?: string }) {
  return (
    <article
      className={`flex flex-col items-center rounded-card-lg bg-white px-5 text-center shadow-card ring-1 ring-rim-faint transition-all duration-300 ${
        center ? "w-full max-w-[300px] py-8 lg:max-w-[320px]" : "w-full max-w-[260px] py-6 opacity-90"
      } ${className}`}
    >
      <Avatar member={member} big={center} />
      <h3 className={`mt-4 font-bold text-space-2 ${center ? "text-lg lg:text-xl" : "text-base"}`}>{member.name}</h3>
      <p className="mt-0.5 text-xs font-semibold text-orbit-1">{member.role}</p>
      <p className="mt-3 rounded-xl bg-surface-soft px-3 py-2.5 text-[13px] leading-relaxed text-prose">{member.body}</p>
    </article>
  );
}

/** Meet the Team: carousel; desktop/tablet tiga kartu (tengah lebih besar), HP satu kartu. Bisa digeser. */
export default function TentangTim() {
  const T = TENTANG_TIM;
  const n = T.members.length;
  // Mulai dari anggota kedua supaya tiga kartu pertama tampil seperti desain (Dhiya di tengah).
  const [i, setI] = useState(Math.min(1, n - 1));
  const startX = useRef<number | null>(null);
  const go = (d: number) => setI((v) => (v + d + n) % n);

  function onPointerDown(e: PointerEvent) {
    if (e.pointerType !== "mouse") startX.current = e.clientX;
  }
  function onPointerUp(e: PointerEvent) {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  }

  const arrow =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-space-2 shadow-card ring-1 ring-rim-faint transition hover:text-orbit-1 lg:h-14 lg:w-14";

  return (
    <section className="relative overflow-hidden bg-surface-blue/60 py-16 lg:py-24">
      <div className={`${CONTAINER} flex flex-col items-center xl:max-w-[1200px]`}>
        <Badge>{T.badge}</Badge>
        <h2 className="mt-3 text-[26px] font-bold text-space-2 lg:text-[38px]">{T.title}</h2>
        <p className="mt-3 max-w-[720px] text-center text-base leading-[1.65] text-prose">{T.body}</p>

        <div className="mt-10 flex w-full items-center justify-center gap-3 sm:gap-5 lg:mt-12">
          <button type="button" onClick={() => go(-1)} aria-label={T.prev} className={arrow}>
            <ChevronLeft size={22} strokeWidth={2.4} aria-hidden="true" />
          </button>

          <div
            className="flex flex-1 touch-pan-y items-center justify-center gap-4 lg:gap-6"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (startX.current = null)}
            aria-live="polite"
          >
            {[-1, 0, 1].map((d) => {
              const idx = (i + d + n) % n;
              return <Card key={`${idx}-${d}`} member={T.members[idx]} center={d === 0} className={d === 0 ? "" : "hidden md:flex"} />;
            })}
          </div>

          <button type="button" onClick={() => go(1)} aria-label={T.next} className={arrow}>
            <ChevronRight size={22} strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>
        <p className="mt-6 text-sm font-semibold text-prose-dim">{T.position(i + 1, n)}</p>
      </div>
    </section>
  );
}
