// Menyusun daftar label–nilai halaman Profil dari data sekolah.
// null = "Belum diisi sekolah" (ditampilkan apa adanya, tanpa nilai contoh).

import { LABELS, SECTIONS, VALUES } from "@/content/profil";
import type { ProfilView } from "@/types/profil";
import { formatKelas } from "./user";
import { formatDate } from "@/lib/datetime";

export interface InfoRow {
  label: string;
  value: string | null;
  /** true = memakai dua kolom di laptop. */
  full?: boolean;
}

export interface InfoSectionData {
  id: string;
  title: string;
  /** Kelas warna garis judul. */
  accent: string;
  private: boolean;
  rows: InfoRow[];
}


const yesNo = (v: boolean | null, types?: string[] | null) =>
  v === null ? null : v ? (types && types.length ? VALUES.yesWith(types.join(", ")) : VALUES.yes) : VALUES.no;

const join = (a: string | null, b: string | null, sep: string) => (a && b ? `${a}${sep}${b}` : (a ?? b));

export function buildSections(v: ProfilView): InfoSectionData[] {
  const { identity: id, address: ad, contact: ct, family: fm, special: sp } = v.school;
  return [
    {
      id: "pf-diri",
      title: SECTIONS.diri,
      accent: "bg-orbit-1",
      private: false,
      rows: [
        { label: LABELS.name, value: v.name, full: true },
        { label: LABELS.gender, value: id.gender ? VALUES.gender[id.gender] : null },
        { label: LABELS.birth, value: join(id.birthPlace, id.birthDate ? formatDate(id.birthDate) : null, ", ") },
        { label: LABELS.nis, value: id.nis },
        { label: LABELS.nisn, value: id.nisn },
        { label: LABELS.religion, value: id.religion },
        { label: LABELS.grade, value: formatKelas(v.grade) || null },
        { label: LABELS.school, value: v.schoolName, full: true },
      ],
    },
    {
      id: "pf-alamat",
      title: SECTIONS.alamat,
      accent: "bg-sun-1",
      private: false,
      rows: [
        { label: LABELS.street, value: ad.street, full: true },
        { label: LABELS.rtrw, value: join(ad.rt, ad.rw, " / ") },
        { label: LABELS.village, value: ad.village },
        { label: LABELS.district, value: ad.district },
        { label: LABELS.city, value: ad.city },
        { label: LABELS.province, value: ad.province },
        { label: LABELS.postalCode, value: ad.postalCode },
      ],
    },
    {
      id: "pf-kontak",
      title: SECTIONS.kontak,
      accent: "bg-orbit-2",
      private: false,
      rows: [
        { label: LABELS.studentPhone, value: ct.studentPhone },
        { label: LABELS.guardianPhone, value: ct.guardianPhone },
        { label: LABELS.fatherName, value: ct.fatherName },
        { label: LABELS.fatherJob, value: ct.fatherJob },
        { label: LABELS.motherName, value: ct.motherName },
        { label: LABELS.motherJob, value: ct.motherJob },
        { label: LABELS.guardianName, value: ct.guardianName },
      ],
    },
    {
      id: "pf-keluarga",
      title: SECTIONS.keluarga,
      accent: "bg-tint-purple-dot",
      private: true,
      rows: [
        { label: LABELS.parentStatus, value: fm.parentStatus },
        { label: LABELS.livingWith, value: fm.livingWith },
        { label: LABELS.fatherEducation, value: fm.fatherEducation },
        { label: LABELS.motherEducation, value: fm.motherEducation },
        { label: LABELS.socioEconomic, value: fm.socioEconomic },
        { label: LABELS.educationAid, value: fm.educationAid === null ? null : fm.educationAid.length ? fm.educationAid.join(", ") : VALUES.noAid },
        {
          label: LABELS.siblings,
          value: fm.childOrder === null && fm.siblingCount === null ? null : VALUES.siblings(fm.childOrder, fm.siblingCount),
          full: true,
        },
      ],
    },
    {
      id: "pf-khusus",
      title: SECTIONS.khusus,
      accent: "bg-tint-green-fg",
      private: true,
      rows: [
        { label: LABELS.specialNeeds, value: yesNo(sp.specialNeeds, sp.specialNeedsTypes) },
        { label: LABELS.colorBlind, value: yesNo(sp.colorBlind) },
        { label: LABELS.notes, value: sp.notes, full: true },
      ],
    },
  ];
}
