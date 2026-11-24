import { SNBP_FACTORS, SNBP_RESULT, SNBP_STRATEGY } from "@/content/siapSnbp";
import { formatScore, semesterRange } from "@/lib/rapor";
import type { SnbpCategory, SnbpChoiceResult, SnbpFactor, SnbpInput, SnbpResult } from "@/types/snbp";

// Sementara, dipakai juga di mode backend sampai endpoint POST /snbp/rationalization (API_CONTRACT 12.2) ada.
//
// SIMULASI SEMENTARA rasionalisasi SNBP (aturan data nomor 4 di CLAUDE.md),
// menunggu rumus resmi dari tim. Hanya memakai data yang benar-benar ada:
// rata-rata dan tren rapor, mapel pendukung prodi, prestasi terpilih, dan
// nilai TKA. Daya tampung dan keketatan prodi BELUM dihitung karena datanya
// tidak ada (API_CONTRACT 12.2), jadi dua pilihan bisa berkategori sama.

/** Bonus prestasi per tingkat (diambil yang tertinggi, ditambah sedikit untuk prestasi lain). */
const LEVEL_BONUS: Record<string, number> = {
  Internasional: 3,
  Nasional: 2.5,
  Provinsi: 1.5,
  "Kota/Kabupaten": 0.8,
  Sekolah: 0.3,
};

/** Batas kategori dari skor gabungan (skala rapor 0–100). */
const SAFE_MIN = 88;
const WATCH_MIN = 84;

const mean = (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length;

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

function joinNames(names: string[]): string {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} dan ${names[names.length - 1]}`;
}

function choiceResult(input: SnbpInput, choice: SnbpInput["choices"][number]): SnbpChoiceResult {
  const averages = input.semesters.map((s) => s.average);
  const raporAvg = mean(averages);
  const trend = averages.length > 1 ? averages[averages.length - 1] - averages[0] : 0;
  const rising = averages.every((v, i) => i === 0 || v >= averages[i - 1]);
  const factors: SnbpFactor[] = [];
  let score = raporAvg;

  // Rapor dan tren
  if (trend < -0.5) {
    factors.push({ direction: "down", text: SNBP_FACTORS.trendDown(formatScore(raporAvg)) });
  } else if (raporAvg >= 80) {
    const trendText = trend > 0.5 ? (rising ? SNBP_FACTORS.trendUp : SNBP_FACTORS.trendMostlyUp) : "";
    factors.push({ direction: "up", text: SNBP_FACTORS.raporHigh(formatScore(raporAvg), trendText) });
  } else {
    factors.push({ direction: "down", text: SNBP_FACTORS.raporLow(formatScore(raporAvg)) });
  }
  score += Math.max(-1.5, Math.min(1.5, trend * 0.3));

  // Mapel pendukung prodi (dari katalog jurusan)
  const support = choice.supportingSubjects.filter((s) => input.subjects[s] !== undefined);
  if (support.length > 0) {
    const supportAvg = mean(support.map((s) => input.subjects[s]));
    score += (supportAvg - raporAvg) * 0.5;
    if (Math.abs(supportAvg - raporAvg) >= 0.5) {
      const sorted = [...support].sort((a, b) =>
        supportAvg >= raporAvg ? input.subjects[b] - input.subjects[a] : input.subjects[a] - input.subjects[b],
      );
      const names = joinNames(sorted.slice(0, 2));
      factors.push(
        supportAvg >= raporAvg
          ? { direction: "up", text: SNBP_FACTORS.supportUp(names) }
          : { direction: "down", text: SNBP_FACTORS.supportDown(names) },
      );
    }
  }

  // Prestasi terpilih
  const bonuses = input.achievements
    .map((a) => ({ a, bonus: LEVEL_BONUS[a.level] ?? 0 }))
    .sort((x, y) => y.bonus - x.bonus);
  if (bonuses.length > 0) {
    score += Math.min(3, bonuses[0].bonus + bonuses.slice(1).reduce((sum, b) => sum + b.bonus * 0.2, 0));
    if (bonuses[0].bonus >= 1.5) factors.push({ direction: "up", text: SNBP_FACTORS.achievement(bonuses[0].a.title, bonuses[0].a.level) });
  }

  // Nilai TKA
  const tkaValues = input.tka ? Object.values(input.tka) : [];
  if (tkaValues.length > 0) {
    const tkaAvg = mean(tkaValues);
    score += Math.max(-1.5, Math.min(1.5, (tkaAvg - 75) * 0.06));
    factors.push(
      tkaAvg >= 70
        ? { direction: "up", text: SNBP_FACTORS.tkaUp(formatScore(tkaAvg)) }
        : { direction: "down", text: SNBP_FACTORS.tkaDown(formatScore(tkaAvg)) },
    );
  }

  // Semester yang belum ada selalu ditampilkan (faktor lain dibatasi supaya kartu tetap ringkas).
  if (input.missingSemesters.length > 0) {
    factors.splice(3);
    factors.push({ direction: "down", text: SNBP_FACTORS.missingSem(capitalize(semesterRange(input.missingSemesters))) });
  }

  const category: SnbpCategory = score >= SAFE_MIN ? "aman" : score >= WATCH_MIN ? "waspada" : "berisiko";
  const { supportingSubjects: _s, ...rest } = choice;
  return { ...rest, category, factors: factors.slice(0, 4) };
}

function strategyFor(results: SnbpChoiceResult[]): string {
  const label = (c: SnbpCategory) => SNBP_RESULT.category[c].toLowerCase();
  if (results.every((r) => r.category === "berisiko")) return SNBP_STRATEGY.risky;
  if (results.length === 1) return SNBP_STRATEGY.single(label(results[0].category));
  const [a, b] = results;
  if (a.category === b.category) return SNBP_STRATEGY.bothSame(label(a.category));
  return SNBP_STRATEGY.mixed(label(a.category), label(b.category));
}

/** Hitung kategori per pilihan beserta strategi dan saran. */
export function rationalizeSnbp(input: SnbpInput, now = new Date()): SnbpResult {
  const choices = input.choices.map((c) => choiceResult(input, c));
  const suggestions: string[] = [];
  const noCert = input.achievements.find((a) => !a.hasCertificate);
  if (noCert) suggestions.push(SNBP_STRATEGY.uploadCertificate(noCert.title));
  if (input.missingSemesters.length > 0) {
    const support = [...new Set(input.choices.flatMap((c) => c.supportingSubjects))]
      .filter((s) => input.subjects[s] !== undefined)
      .slice(0, 2);
    suggestions.push(SNBP_STRATEGY.keepSemester(semesterRange(input.missingSemesters), support.length ? joinNames(support) : null));
  }
  if (!input.tka) suggestions.push(SNBP_STRATEGY.addTka);
  suggestions.push(SNBP_STRATEGY.snbtBackup);
  return { computedAt: now.toISOString(), choices, strategy: strategyFor(choices), suggestions };
}
