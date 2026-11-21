/** Warna tiap lapis bukit (jauh → dekat), dari token Tailwind. */
const TONES = {
  /** Malam/fajar: Tentang Kami, FAQ. */
  malam: ["fill-gunung-jauh", "fill-gunung-tengah", "fill-gunung-dekat"],
  /** Pagi: Eksplor Jurusan. */
  pagi: ["fill-bukit-jauh", "fill-bukit-tengah", "fill-bukit-dekat"],
} as const;

const PATHS = [
  "M0 150 C120 120 180 60 260 70 C340 80 380 150 470 140 C560 130 620 40 720 50 C820 60 860 140 960 130 C1060 120 1110 60 1200 70 C1290 80 1360 130 1440 120 V320 H0Z",
  "M0 210 C90 180 150 120 240 130 C330 140 400 210 500 200 C600 190 650 120 760 125 C870 130 920 205 1030 200 C1140 195 1200 140 1300 150 C1370 157 1410 180 1440 185 V320 H0Z",
  "M0 260 C120 240 200 200 320 215 C440 230 520 270 650 262 C780 254 860 222 990 232 C1120 242 1200 275 1320 266 C1380 262 1420 255 1440 252 V320 H0Z",
];

/**
 * Tiga lapis bukit bergelombang halus di dasar hero (makin dekat makin pekat).
 * Letakkan di dalam section `relative`; tinggi diatur lewat className.
 */
export default function Hills({ tone = "malam", className = "" }: { tone?: keyof typeof TONES; className?: string }) {
  return (
    <svg viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true" className={`pointer-events-none absolute bottom-0 left-0 w-full ${className}`}>
      {PATHS.map((d, i) => (
        <path key={d} d={d} className={TONES[tone][i]} />
      ))}
    </svg>
  );
}
