import { SEKOLAH_LANGKAH } from "@/content/untukSekolah";
import { usePauseOffscreen } from "@/lib/usePauseOffscreen";
import Reveal from "@/components/landing/motion/Reveal";
import { StarShape } from "@/components/landing/motion/Sky";
import awanPucat from "@/assets/publik/sekolah/awan-pucat.svg";
import awanAbu from "@/assets/publik/sekolah/awan-abu.svg";
import awanKuning from "@/assets/publik/sekolah/awan-kuning.svg";
import awanBiru from "@/assets/publik/sekolah/awan-biru.svg";
import ikonSiswa from "@/assets/publik/sekolah/ikon-siswa.svg";
import ikonMaskot from "@/assets/publik/sekolah/ikon-maskot.svg";
import gedungIkon from "@/assets/publik/sekolah/sekolah-gedung-ikon.webp";
import gedung from "@/assets/publik/sekolah/sekolah-gedung.webp";
import lanskapBelakang from "@/assets/publik/sekolah/lanskap-belakang.svg";
import lanskapDepan from "@/assets/publik/sekolah/lanskap-depan.svg";

const ICON = { sekolah: gedungIkon, siswa: ikonSiswa, maskot: ikonMaskot } as const;

/** Langkah 1–3 bernuansa kuning, 4–5 biru, mengikuti warna garis linimasa. */
const toneOf = (i: number) => (i < 3 ? "border-sun-2 text-sun-1" : "border-orbit-2 text-orbit-1");

/** Dekorasi latar: awan bergeser pelan, bintang berkelip, cahaya samar. */
function Dekorasi() {
  const awan = "pointer-events-none absolute h-auto max-w-none motion-safe:animate-ob-awan";
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span className="absolute -left-24 top-[3%] h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle,rgba(9,101,250,0.10),transparent_70%)]" />
      <span className="absolute -right-24 top-[14%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(241,173,0,0.16),transparent_70%)]" />
      <img src={awanPucat} alt="" className={`${awan} right-[-4%] top-[6%] w-[42%]`} />
      <img src={awanAbu} alt="" className={`${awan} -left-[16%] top-[17%] w-[38%] [animation-duration:18s]`} />
      <img src={awanKuning} alt="" className={`${awan} -left-[6%] top-[37%] w-[40%] [animation-direction:alternate-reverse]`} />
      <img src={awanAbu} alt="" className={`${awan} right-[-18%] top-[30%] w-[38%] [animation-duration:22s]`} />
      <img src={awanBiru} alt="" className={`${awan} right-[-6%] top-[60%] w-[40%] [animation-duration:16s]`} />
      <StarShape className="absolute right-[13%] top-[3%] w-[52px] text-sun-2/30 motion-safe:animate-ob-kelip" />
      <StarShape className="absolute left-[7%] top-[26%] w-[48px] text-sun-2/30 motion-safe:animate-ob-kelip [animation-delay:-1.4s]" />
      <StarShape className="absolute right-[26%] top-[56%] w-[46px] text-sun-2/30 motion-safe:animate-ob-kelip [animation-delay:-2.2s]" />
    </div>
  );
}

/** "Cara kerjanya": linimasa lima langkah, lalu lanskap bukit dan gedung sekolah. */
export default function LangkahSection() {
  const ref = usePauseOffscreen<HTMLElement>();
  const L = SEKOLAH_LANGKAH;

  return (
    <section ref={ref} aria-labelledby="sekolah-langkah" className="relative overflow-hidden bg-white pt-16 lg:pt-24">
      <Dekorasi />
      <div className="relative z-10 mx-auto flex max-w-[1180px] flex-col items-center px-5 sm:px-8">
        <h2 id="sekolah-langkah" className="rounded-full bg-tint-amber-soft px-8 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-tint-amber-fg lg:text-base">
          {L.badge}
        </h2>

        <ol className="relative mt-12 flex w-full flex-col gap-10 lg:mt-20 lg:gap-6">
          {/* Garis linimasa: di kiri (HP) atau di tengah (desktop). */}
          <span aria-hidden="true" className="absolute bottom-10 left-[22px] top-6 w-[5px] rounded-full bg-linimasa lg:left-1/2 lg:-translate-x-1/2" />
          {L.steps.map((step, i) => {
            const right = i % 2 === 1;
            const tone = toneOf(i);
            return (
              <li key={step.no} className={`relative flex pl-14 lg:pl-0 ${right ? "lg:justify-end" : "lg:justify-start"}`}>
                <Reveal className={`relative w-full rounded-[24px] border-[1.5px] bg-white p-6 shadow-[0_10px_40px_rgba(16,26,51,0.06)] lg:w-[calc(50%-40px)] lg:p-9 ${tone}`}>
                  {/* Nomor langkah menempel di garis linimasa. */}
                  <span
                    className={`absolute top-6 flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] bg-white text-base font-medium lg:top-8 lg:h-16 lg:w-16 lg:text-2xl ${tone} -left-[54px] ${right ? "lg:-left-[72px]" : "lg:left-auto lg:-right-[72px]"}`}
                  >
                    {step.no}
                  </span>
                  <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-tint-orange-bg lg:h-[72px] lg:w-[72px]">
                    <img src={ICON[step.icon]} alt="" className="h-[86%] w-[86%] object-contain" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold uppercase tracking-[0.01em] text-space-2 lg:text-[22px]">{step.title}</h3>
                  <p className="mt-3 text-[15px] leading-[1.65] text-prose lg:text-base">{step.body}</p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Lanskap: bukit dan pohon (dua lapis SVG) mengapit gedung sekolah. */}
      {/* Bidang hijau paling bawah dipotong sedikit (1100 → 1000) supaya CTA tidak terlalu jauh. */}
      <div aria-hidden="true" className="relative -mt-6 aspect-[1730/1000] w-full overflow-hidden lg:-mt-[14%]">
        <div className="absolute inset-x-0 top-0 aspect-[1730/1100]">
          <img src={lanskapBelakang} alt="" className="absolute inset-0 h-full w-full" />
          <img
            src={gedung}
            alt=""
            width={960}
            height={850}
            loading="lazy"
            className="absolute h-auto"
            style={{ left: "52.3%", top: "24.3%", width: "46.6%" }}
          />
          <img src={lanskapDepan} alt="" className="absolute inset-0 h-full w-full" />
        </div>
      </div>
    </section>
  );
}
