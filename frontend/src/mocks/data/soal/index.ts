import type { BankQuestion } from "@/types/soal";
import type { ExamId } from "@/types/practice";
import { SNBT_BANK } from "./snbt";
import { TKA_BANK } from "./tka";
import { SKD_BANK } from "./skd";

// CONTOH bank soal (75 soal). Semua paket tryout contoh memakai soal yang
// sama; bank resmi harus punya soal berbeda per paket (API_CONTRACT 12.5).

export const QUESTION_BANK: BankQuestion[] = [...SNBT_BANK, ...TKA_BANK, ...SKD_BANK];

export function bankFor(exam: ExamId, subject: string): BankQuestion[] {
  return QUESTION_BANK.filter((q) => q.exam === exam && q.subject === subject);
}

export function findQuestion(id: string): BankQuestion | undefined {
  return QUESTION_BANK.find((q) => q.id === id);
}
