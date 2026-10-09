import { useEffect, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowLeft, Check, Clock, Flag, X } from "lucide-react";
import { LATIHAN_RUN, SESSION } from "@/content/pengerjaan";
import type { PublicQuestion } from "@/types/soal";

/** Waktu sekarang yang diperbarui setiap detik (untuk timer). */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

export const mmss = (sec: number) => {
  const s = Math.max(0, Math.floor(sec));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

/** Header halaman pengerjaan (tanpa menu portal): Keluar, judul, timer, Selesai. */
export function RunHeader({
  title,
  sub,
  timer,
  finishLabel,
  onExit,
  onFinish,
  busy,
}: {
  title: string;
  sub: string;
  timer: { label: string; text: string; aria: string; warn: boolean };
  finishLabel: string;
  onExit: () => void;
  onFinish: () => void;
  busy: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-rim-soft bg-white px-4 py-3 sm:px-6 lg:h-[68px] lg:flex-nowrap lg:gap-4 lg:px-8 lg:py-0">
      <button
        type="button"
        onClick={onExit}
        className="flex h-[42px] items-center gap-2 rounded-[10px] border-[1.5px] border-rim px-3 text-sm font-semibold text-space-1 hover:bg-surface-soft"
      >
        <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" />
        {SESSION.exit}
      </button>
      <div className="order-last flex min-w-0 basis-full flex-col lg:order-none lg:basis-auto lg:flex-1">
        <span className="truncate text-[15px] font-bold text-space-2 lg:text-base">{title}</span>
        <span className="truncate text-[13px] text-prose">{sub}</span>
      </div>
      <span
        role="timer"
        aria-label={timer.aria}
        className={`ml-auto flex h-[42px] items-center gap-2 rounded-[10px] px-3 text-[15px] font-bold lg:ml-0 ${
          timer.warn ? "bg-surface-peach text-tint-orange-fg" : "bg-field-track text-space-1"
        }`}
      >
        <Clock size={18} aria-hidden="true" />
        <span className="hidden text-xs font-medium sm:inline">{timer.label}</span>
        <span aria-hidden="true" className="tabular-nums">
          {timer.text}
        </span>
      </span>
      <button
        type="button"
        onClick={onFinish}
        disabled={busy}
        className="h-[42px] rounded-[10px] bg-space-2 px-4 text-sm font-semibold text-white hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
      >
        {finishLabel}
      </button>
    </header>
  );
}

export type OptionState = "idle" | "picked" | "correct" | "wrong" | "dim";

/** Pilihan jawaban A–E sebagai radio group (panah atas/bawah memindah pilihan). */
export function OptionList({
  question,
  labelledBy,
  selected,
  states,
  marks,
  disabled,
  onPick,
}: {
  question: PublicQuestion;
  labelledBy: string;
  /** Pilihan siswa (null = belum memilih). */
  selected: number | null;
  states: OptionState[];
  /** Label kecil di kanan pilihan, mis. "Jawaban benar". */
  marks?: (string | null)[];
  disabled: boolean;
  onPick: (i: number) => void;
}) {
  const picked = selected ?? -1;
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const n = question.options.length;
    const next = ((picked < 0 ? (step > 0 ? -1 : 0) : picked) + step + n) % n;
    onPick(next);
    (e.currentTarget.querySelectorAll<HTMLButtonElement>("[role=radio]")[next] ?? null)?.focus();
  }
  const tone: Record<OptionState, { box: string; letter: string }> = {
    idle: { box: "border-rim bg-white hover:bg-surface-soft", letter: "bg-rim-faint text-space-1" },
    picked: { box: "border-orbit-1 bg-surface-blue", letter: "bg-orbit-1 text-white" },
    correct: { box: "border-tint-green-fg bg-tint-green-bg", letter: "bg-tint-green-fg text-white" },
    wrong: { box: "border-alert-fg bg-alert-bg", letter: "bg-alert-fg text-white" },
    dim: { box: "border-rim-soft bg-white", letter: "bg-rim-faint text-prose-dim" },
  };
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} onKeyDown={onKeyDown} className="flex flex-col gap-2.5">
      {question.options.map((text, i) => {
        const st = states[i];
        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={i === picked}
            aria-disabled={disabled || undefined}
            tabIndex={i === (picked < 0 ? 0 : picked) ? 0 : -1}
            onClick={() => !disabled && onPick(i)}
            className={`flex min-h-14 items-center gap-3.5 rounded-[14px] border-[1.5px] px-3.5 py-2.5 text-left text-[15px] text-space-2 sm:px-4 sm:text-base ${tone[st].box} ${disabled ? "cursor-default" : ""}`}
          >
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${tone[st].letter}`}>{SESSION.letters[i]}</span>
            <span className="flex-1 tabular-nums">{text}</span>
            {marks?.[i] && (
              <span className={`shrink-0 text-[13px] font-bold ${st === "correct" ? "text-tint-green-fg" : "text-alert-fg"}`}>{marks[i]}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Teks soal + bacaan (jika ada). */
export function QuestionBody({ question, headingId, heading, chip }: { question: PublicQuestion; headingId: string; heading: string; chip?: ReactNode }) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 id={headingId} className="text-[15px] font-bold tabular-nums text-orbit-1">
          {heading}
        </h1>
        {chip}
      </div>
      {question.passage && <p className="whitespace-pre-line rounded-[14px] bg-surface-soft p-4 text-[15px] leading-relaxed text-space-1">{question.passage}</p>}
      <p className="whitespace-pre-line text-base leading-[1.75] text-space-2 sm:text-[17px]">{question.text}</p>
    </>
  );
}

export function FlagChip({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-tint-orange-bg px-2.5 py-1 text-xs font-semibold text-tint-orange-fg">
      <Flag size={14} aria-hidden="true" />
      {label}
    </span>
  );
}

export type NavTone = "correct" | "wrong" | "answered" | "empty";

const NAV_TONE: Record<NavTone, string> = {
  correct: "border-tint-green-fg bg-tint-green-bg text-tint-green-fg",
  wrong: "border-alert-fg bg-alert-bg text-alert-fg",
  answered: "border-orbit-1 bg-orbit-1 text-white",
  empty: "border-rim bg-white text-space-1",
};

/** Grid nomor soal + keterangan warna. */
export function NumberGrid({
  items,
  current,
  onPick,
  summary,
  legend,
}: {
  items: { tone: NavTone; flagged: boolean; aria: string }[];
  current: number;
  onPick: (i: number) => void;
  summary: string;
  legend: { label: string; tone: NavTone | "current"; flagged?: boolean }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-[13px] tabular-nums text-prose">{summary}</span>
      <div className="grid grid-cols-5 gap-2">
        {items.map((it, i) => (
          <button
            key={i}
            type="button"
            aria-label={it.aria}
            aria-current={i === current ? "step" : undefined}
            onClick={() => onPick(i)}
            className={`relative h-[46px] rounded-xl border-2 text-sm font-bold tabular-nums ${NAV_TONE[it.tone]} ${i === current ? "!border-space-2" : ""}`}
          >
            {i + 1}
            {it.flagged && <span aria-hidden="true" className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-sun-1" />}
          </button>
        ))}
      </div>
      <ul className="flex flex-col gap-2 border-t border-rim-faint pt-3.5 text-xs text-prose">
        {legend.map((l) => (
          <li key={l.label} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`relative h-[18px] w-[18px] rounded-md border-2 ${l.tone === "current" ? "border-space-2 bg-white" : NAV_TONE[l.tone]}`}
            >
              {l.flagged && <span className="absolute -right-[5px] -top-[5px] h-[9px] w-[9px] rounded-full bg-sun-1" />}
            </span>
            {l.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Kotak benar/salah + pembahasan (mode latihan). */
export function Feedback({ correct, title, body, extra }: { correct: boolean; title: string; body: string; extra?: string }) {
  return (
    <div role="status" className={`flex flex-col gap-2 rounded-2xl border px-4 py-4 sm:px-5 ${correct ? "border-tint-green-fg/30 bg-tint-green-bg" : "border-alert-rim/30 bg-alert-bg"}`}>
      <span className={`flex items-center gap-2 text-[15px] font-bold ${correct ? "text-tint-green-fg" : "text-alert-fg"}`}>
        {correct ? <Check size={18} strokeWidth={2.4} aria-hidden="true" /> : <X size={18} strokeWidth={2.4} aria-hidden="true" />}
        {title}
      </span>
      {extra && <span className="text-sm text-space-1">{extra}</span>}
      <span className="text-sm font-bold text-space-1">{LATIHAN_RUN.explanation}</span>
      <p className="text-[15px] leading-relaxed text-space-1">{body}</p>
    </div>
  );
}
