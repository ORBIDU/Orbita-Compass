import { ArrowRight, Check } from "lucide-react";
import { SEKOLAH_PERAN } from "@/content/untukSekolah";
import { whatsappLink } from "@/config/brand";
import { CONTAINER, ExternalLink } from "@/components/landing/primitives";
import Reveal from "@/components/landing/motion/Reveal";
import avatarSiswa from "@/assets/publik/sekolah/avatar-siswa.svg";
import avatarGuru from "@/assets/publik/sekolah/avatar-guru.svg";
import avatarWali from "@/assets/publik/sekolah/avatar-wali.svg";

const AVATAR = { siswa: avatarSiswa, guru: avatarGuru, wali: avatarWali } as const;

/** Tiga kartu peran: Siswa, Guru BK, Wali Kelas (avatar menonjol di atas kartu). */
export default function PeranSection() {
  return (
    <section aria-labelledby="sekolah-peran" className="relative overflow-hidden bg-white pb-20 pt-16 lg:pb-28 lg:pt-24">
      {/* Cahaya biru samar di kanan seperti desain. */}
      <span aria-hidden="true" className="pointer-events-none absolute -right-40 top-1/3 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(9,101,250,0.10),transparent_70%)]" />
      <h2 id="sekolah-peran" className="sr-only">
        {SEKOLAH_PERAN.title}
      </h2>
      <div className={`${CONTAINER} relative grid gap-20 pt-16 md:grid-cols-3 md:gap-6 lg:gap-8 xl:max-w-[1500px]`}>
        {SEKOLAH_PERAN.cards.map((card, i) => (
          <Reveal
            key={card.kicker}
            delay={i * 120}
            className="relative flex flex-col rounded-[28px] bg-white px-6 pb-8 pt-28 shadow-[0_18px_60px_rgba(16,26,51,0.08)] ring-1 ring-rim-faint lg:px-10 lg:pt-36"
          >
            <img
              src={AVATAR[card.avatar]}
              alt=""
              width={236}
              height={252}
              className="absolute left-1/2 top-0 w-[150px] -translate-x-1/2 -translate-y-[45%] lg:w-[190px]"
            />
            <p className="text-center text-sm font-bold uppercase tracking-[0.02em] text-space-2 lg:text-base">{card.kicker}</p>
            <h3 className="mt-3 text-balance text-center text-[22px] font-semibold leading-[1.3] text-sekolah-judul lg:text-[26px]">{card.title}</h3>
            <ul className="mt-6 flex flex-col gap-3.5">
              {card.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-[1.5] text-space-1 lg:text-[15px]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sun-1 text-white">
                    <Check size={12} strokeWidth={3.2} aria-hidden="true" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <ExternalLink
              href={whatsappLink("sekolah")}
              className="mt-8 inline-flex items-center gap-2 self-start text-[15px] font-medium text-orbit-1 hover:underline"
            >
              {SEKOLAH_PERAN.link}
              <ArrowRight size={16} aria-hidden="true" />
            </ExternalLink>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
