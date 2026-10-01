import { useRef, type KeyboardEvent } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TEST } from "@/content/analisis";
import { defaultRanking } from "@/lib/asesmen";
import type {
  AsesmenAnswer,
  AsesmenQuestion,
  LikertQuestion,
  MultiQuestion,
  RankingQuestion,
  SingleQuestion,
} from "@/types/analisis";

interface InputProps<Q extends AsesmenQuestion> {
  question: Q;
  value: AsesmenAnswer | undefined;
  onChange: (value: AsesmenAnswer) => void;
}

/** Skala 1–5 berupa 5 tombol (aria-pressed). */
function LikertInput({ question, value, onChange }: InputProps<LikertQuestion>) {
  const labels = question.labels ?? TEST.likertDefault;
  return (
    <>
      <div className="grid max-w-[560px] grid-cols-5 gap-1.5 lg:gap-2">
        {[1, 2, 3, 4, 5].map((v) => {
          const on = value === v;
          return (
            <button
              key={v}
              type="button"
              aria-pressed={on}
              aria-label={TEST.likertAria(v, labels)}
              onClick={() => onChange(v)}
              className={`h-12 rounded-xl border-[1.5px] text-base font-semibold transition-colors lg:h-11 lg:text-[15px] ${
                on ? "border-orbit-1 bg-orbit-1 text-white" : "border-field-rim bg-white text-space-1 hover:border-orbit-1"
              }`}
            >
              {v}
            </button>
          );
        })}
      </div>
      <div aria-hidden="true" className="flex max-w-[560px] justify-between gap-4 text-[11px] text-prose-dim lg:text-xs">
        <span>{labels[0]}</span>
        <span className="text-right">{labels[1]}</span>
      </div>
    </>
  );
}

/** Pilihan tunggal: radiogroup dengan panah atas/bawah untuk berpindah pilihan. */
function SingleInput({ question, value, onChange }: InputProps<SingleQuestion>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIndex = question.options.findIndex((o) => o.label === value);
  const focusIndex = selectedIndex >= 0 ? selectedIndex : 0;

  function onKeyDown(e: KeyboardEvent, i: number) {
    const last = question.options.length - 1;
    let next = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    if (next < 0) return;
    e.preventDefault();
    onChange(question.options[next].label);
    refs.current[next]?.focus();
  }

  return (
    <div role="radiogroup" aria-label={question.text} className="flex max-w-[560px] flex-col gap-2">
      {question.options.map((o, i) => {
        const on = o.label === value;
        return (
          <button
            key={o.label}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={i === focusIndex ? 0 : -1}
            onClick={() => onChange(o.label)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`flex min-h-12 items-center gap-3 rounded-xl border-[1.5px] px-4 py-2 text-left text-sm font-medium text-space-2 transition-colors ${
              on ? "border-orbit-1 bg-surface-blue" : "border-rim bg-white hover:border-orbit-1"
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${on ? "border-orbit-1" : "border-rim-box"}`}
            >
              {on && <span className="h-2.5 w-2.5 rounded-full bg-orbit-1" />}
            </span>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Pilihan ganda dengan batas: pilihan lain dinonaktifkan saat batas tercapai. */
function MultiInput({ question, value, onChange }: InputProps<MultiQuestion>) {
  const selected = Array.isArray(value) ? value : [];
  const full = selected.length >= question.max;
  return (
    <>
      <span aria-live="polite" className={`text-[13px] font-semibold tabular-nums ${full ? "text-tint-green-fg" : "text-prose"}`}>
        {TEST.multiLimit(selected.length, question.max, question.options.length)}
      </span>
      <div role="group" aria-label={question.text} className="flex max-w-[680px] flex-wrap gap-2">
        {question.options.map((o) => {
          const on = selected.includes(o.label);
          const disabled = !on && full;
          return (
            <button
              key={o.label}
              type="button"
              aria-pressed={on}
              disabled={disabled}
              onClick={() => onChange(on ? selected.filter((x) => x !== o.label) : [...selected, o.label])}
              className={`min-h-[42px] rounded-full border-[1.5px] px-4 py-2 text-left text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
                on ? "border-orbit-1 bg-orbit-1 text-white" : "border-field-rim bg-white text-space-1 enabled:hover:border-orbit-1"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </>
  );
}

/** Urutan dengan tombol naik/turun. Fokus ikut pindah bersama pilihan yang digeser. */
function RankingInput({ question, value, onChange }: InputProps<RankingQuestion>) {
  const order = Array.isArray(value) && value.length === question.options.length ? value : defaultRanking(question);
  const listRef = useRef<HTMLOListElement>(null);

  function move(i: number, delta: -1 | 1) {
    const j = i + delta;
    const next = order.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    // Setelah bergeser, fokus tetap di tombol yang sama pada pilihan yang dipindah.
    const dir = delta < 0 ? "up" : "down";
    requestAnimationFrame(() => {
      const target = listRef.current?.querySelector<HTMLButtonElement>(`[data-pos="${j}"][data-dir="${dir}"]`);
      (target && !target.disabled ? target : listRef.current?.querySelector<HTMLButtonElement>(`[data-pos="${j}"]:not(:disabled)`))?.focus();
    });
  }

  return (
    <>
      <ol ref={listRef} className="flex max-w-[560px] flex-col gap-2">
        {order.map((label, i) => (
          <li key={label} className="flex min-h-[52px] items-center gap-3 rounded-xl border-[1.5px] border-rim bg-white py-1 pl-3.5 pr-1.5">
            <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-lg bg-orbit-1 text-[13px] font-bold tabular-nums text-white">
              {i + 1}
            </span>
            <span className="min-w-0 flex-1 text-sm font-medium text-space-2">{label}</span>
            <button
              type="button"
              data-pos={i}
              data-dir="up"
              aria-label={TEST.moveUp(label)}
              disabled={i === 0}
              onClick={() => move(i, -1)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-rim-soft bg-white text-space-1 enabled:hover:bg-surface-soft disabled:opacity-35"
            >
              <ChevronUp size={16} strokeWidth={2.4} aria-hidden="true" />
            </button>
            <button
              type="button"
              data-pos={i}
              data-dir="down"
              aria-label={TEST.moveDown(label)}
              disabled={i === order.length - 1}
              onClick={() => move(i, 1)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-rim-soft bg-white text-space-1 enabled:hover:bg-surface-soft disabled:opacity-35"
            >
              <ChevronDown size={16} strokeWidth={2.4} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
      <span className="text-xs text-prose-dim">{TEST.rankingHint}</span>
    </>
  );
}

interface QuestionInputProps {
  question: AsesmenQuestion;
  number: number;
  value: AsesmenAnswer | undefined;
  onChange: (value: AsesmenAnswer) => void;
}

/** Satu soal dalam <fieldset>: nomor, teks, dan input sesuai jenisnya. */
export default function QuestionInput({ question, number, value, onChange }: QuestionInputProps) {
  return (
    <fieldset className="flex min-w-0 flex-col gap-3 rounded-[18px] border border-rim-soft bg-white p-4 lg:rounded-none lg:border-0 lg:border-b lg:border-rim-faint lg:px-0 lg:py-5 lg:last:border-b-0">
      <legend className="float-left flex w-full gap-2.5 p-0 text-[15px] font-medium leading-normal text-space-2 lg:gap-3">
        <span className="shrink-0 font-bold tabular-nums text-prose-dim">{number}</span>
        <span>{question.text}</span>
      </legend>
      {question.type === "likert" && <LikertInput question={question} value={value} onChange={onChange} />}
      {question.type === "single" && <SingleInput question={question} value={value} onChange={onChange} />}
      {question.type === "multi" && <MultiInput question={question} value={value} onChange={onChange} />}
      {question.type === "ranking" && <RankingInput question={question} value={value} onChange={onChange} />}
    </fieldset>
  );
}
