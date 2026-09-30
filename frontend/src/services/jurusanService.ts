import type { JurusanSummary } from "@/types/jurusan";
import { FEATURED_JURUSAN } from "@/mocks/data/jurusan";
import { delay } from "@/mocks/delay";

// Backend belum punya data jurusan yang dikelompokkan per nama jurusan
// (hanya /ptn/majors per kampus). Sementara selalu memakai data contoh,
// di mode dummy maupun backend. Kebutuhannya dicatat di docs/API_CONTRACT.md.

/** Jurusan unggulan untuk carousel beranda. */
export async function getFeaturedJurusan(): Promise<JurusanSummary[]> {
  await delay(150);
  return FEATURED_JURUSAN;
}
