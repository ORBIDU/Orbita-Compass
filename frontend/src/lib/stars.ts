export interface Star {
  /** Posisi dalam persen lebar/tinggi wadah */
  x: number;
  y: number;
  /** Ukuran dalam px */
  size: number;
  opacity: number;
  /** Jeda animasi berkelip, detik */
  delay: number;
}

/**
 * Bintang dekorasi dengan posisi acak yang selalu sama untuk seed yang sama
 * (meniru makeStars() di desain), supaya tampilan tidak berubah tiap render.
 */
export function makeStars(count: number, seed: number): Star[] {
  let s = seed;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  return Array.from({ length: count }, () => ({
    x: Math.round(rnd() * 1000) / 10,
    y: Math.round(rnd() * 1000) / 10,
    size: Math.round((1 + rnd() * 2) * 10) / 10,
    opacity: Math.round((0.3 + rnd() * 0.6) * 100) / 100,
    delay: Math.round(rnd() * 40) / 10,
  }));
}
