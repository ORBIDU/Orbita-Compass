import { forwardRef, useId } from "react";
import { AUTH_FIELDS } from "@/content/auth";
import { FieldError } from "@/components/ui/FormField";

interface ClassPickerProps {
  value: number | null;
  onChange: (grade: number) => void;
  error?: string;
}

/**
 * Pilihan kelas 10/11/12 berupa tombol (aria-pressed), bukan dropdown.
 * ref menunjuk ke tombol pertama, untuk difokuskan saat belum dipilih.
 */
const ClassPicker = forwardRef<HTMLButtonElement, ClassPickerProps>(function ClassPicker({ value, onChange, error }, ref) {
  const id = useId();
  const labelId = `${id}-label`;
  const errorId = `${id}-error`;
  const { label, options, optionLabel } = AUTH_FIELDS.grade;

  return (
    <div className="flex flex-col gap-1.5">
      <span id={labelId} className="text-sm font-semibold text-space-1">
        {label}
      </span>
      <div
        role="group"
        aria-labelledby={labelId}
        aria-describedby={error ? errorId : undefined}
        className="grid grid-cols-3 gap-1.5"
      >
        {options.map((k, i) => {
          const active = value === k;
          return (
            <button
              key={k}
              ref={i === 0 ? ref : undefined}
              type="button"
              aria-pressed={active}
              aria-label={optionLabel(k)}
              onClick={() => onChange(k)}
              className={`h-12 rounded-xl border-[1.5px] text-[15px] font-semibold transition ${
                active
                  ? "border-orbit-1 bg-orbit-1 text-white"
                  : `${error ? "border-alert-rim" : "border-field-rim"} bg-field-bg text-space-1 hover:border-orbit-1`
              }`}
            >
              {k}
            </button>
          );
        })}
      </div>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
});

export default ClassPicker;
