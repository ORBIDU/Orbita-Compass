import type { CSSProperties } from "react";
import { PROBLEM } from "@/content/landing";
import siswa from "@/assets/publik/masalah-siswa.svg";
import judul from "@/assets/publik/masalah/judul.webp";
import balonKotakKanan from "@/assets/publik/masalah/balon-kotak-kanan.webp";
import balonKotakKiri from "@/assets/publik/masalah/balon-kotak-kiri.webp";
import balonOval from "@/assets/publik/masalah/balon-oval.webp";
import balonBebas from "@/assets/publik/masalah/balon-bebas.webp";
import { CONTAINER } from "../primitives";

type Shape = (typeof PROBLEM.bubbles)[number]["shape"];

/**
 * Gambar gelembung dari desain + area teks di dalam badannya (persen gambar, ekor tidak termasuk).
 * aspect = lebar / tinggi gambar.
 */
const BUBBLE: Record<Shape, { src: string; aspect: string; text: CSSProperties }> = {
  kotakKanan: { src: balonKotakKanan, aspect: "348/202", text: { left: "7%", right: "7%", top: "4%", height: "68%" } },
  kotakKiri: { src: balonKotakKiri, aspect: "337/182", text: { left: "7%", right: "7%", top: "4%", height: "70%" } },
  oval: { src: balonOval, aspect: "274/239", text: { left: "15%", right: "11%", top: "10%", height: "72%" } },
  bebas: { src: balonBebas, aspect: "348/262", text: { left: "8%", right: "7%", top: "8%", height: "72%" } },
};

// Posisi gelembung di desktop: persen dari panggung (lebar 1728, tinggi 894 dari desain).
// Dua baris: "Masih bingung" sejajar "Kalau aku suka", "PTN, PTS" sejajar "Aku gatau".
const ROW_ATAS = "3.7%";
const ROW_BAWAH = "17%";
const DESKTOP_POS: CSSProperties[] = [
  { left: "5%", top: ROW_BAWAH, width: "19.7%" },
  { left: "27%", top: ROW_ATAS, width: "15.4%" },
  { left: "62.7%", top: ROW_BAWAH, width: "19.7%" },
  { left: "78.5%", top: ROW_ATAS, width: "19%" },
];

/** Gelembung ucapan memakai gambar dari desain, teksnya ditaruh di atas gambar. */
function SpeechBubble({ text, shape, className = "", style }: { text: string; shape: Shape; className?: string; style?: CSSProperties }) {
  const b = BUBBLE[shape];
  return (
    // className wajib berisi "relative" atau "absolute" (posisi diatur pemanggil).
    <div className={className} style={{ aspectRatio: b.aspect, ...style }}>
      <img src={b.src} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full select-none" />
      <p className="absolute flex items-center justify-center text-center leading-[1.55] text-black" style={b.text}>
        {text}
      </p>
    </div>
  );
}

/** "Masih bingung harus mulai dari mana?" dengan siswa yang bingung dan empat gelembung pertanyaan. */
export default function ProblemSection() {
  return (
    <section id="masalah" className="scroll-mt-16 overflow-hidden bg-masalah-glow pt-14 lg:scroll-mt-20 lg:pt-20">
      <div className={CONTAINER}>
        {/* Judul memakai gambar tulisan dari desain; alt menjadi teks judul untuk pembaca layar. */}
        <h2>
          <img src={judul} alt={PROBLEM.title} className="mx-auto block w-full max-w-[340px] sm:max-w-[520px] lg:w-[45%] lg:max-w-[780px]" />
        </h2>

        {/* HP & tablet: gelembung dalam grid, lalu ilustrasi */}
        {/* HP: zig-zag kiri-kanan dan sedikit bertumpuk supaya tidak terlalu panjang. Tablet: dua kolom. */}
        <ul className="mx-auto mt-8 flex max-w-[440px] flex-col text-[13.5px] min-[400px]:text-[14.5px] sm:grid sm:max-w-none sm:grid-cols-2 sm:gap-x-6 sm:gap-y-6 sm:text-[15px] lg:hidden">
          {PROBLEM.bubbles.map((b, i) => (
            <li key={b.text} className={`${i % 2 ? "self-end" : "self-start"} ${i ? "-mt-5 sm:mt-0" : ""} w-[74%] sm:w-auto`}>
              <SpeechBubble text={b.text} shape={b.shape} className={`relative mx-auto ${b.shape === "oval" ? "w-[82%] sm:w-[230px]" : "sm:w-[290px]"} max-w-full`} />
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop: panggung berasio desain, gelembung di sekeliling siswa */}
      <div className="relative mx-auto mt-6 w-full max-w-[1728px] lg:mt-0 lg:aspect-[1728/894]">
        <img
          src={siswa}
          alt=""
          className="mx-auto block w-[110%] max-w-none -translate-x-[5%] sm:w-full sm:translate-x-0 lg:absolute lg:bottom-0 lg:left-[16.2%] lg:w-[64.8%]"
        />
        <ul className="hidden text-[clamp(12px,1.2vw,21px)] lg:block">
          {PROBLEM.bubbles.map((b, i) => (
            <li key={b.text}>
              <SpeechBubble text={b.text} shape={b.shape} className="absolute" style={DESKTOP_POS[i]} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
