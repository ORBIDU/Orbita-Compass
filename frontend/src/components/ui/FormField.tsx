import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

const controlClass = (hasError: boolean, extra = "") =>
  [
    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint transition",
    "focus:outline-none focus:ring-2",
    hasError ? "border-danger focus:ring-danger/20" : "border-line focus:border-orbit-1 focus:ring-orbit-1/15",
    extra,
  ].join(" ");

interface FieldShellProps {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
}

function FieldShell({ id, label, error, hint, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink-soft">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-ink-muted">{hint}</p>
      )}
    </div>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: ReactNode;
}

/** Input teks dengan label dan pesan error. type="password" otomatis punya tombol lihat/sembunyikan. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, hint, id, type = "text", className = "", ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <FieldShell id={inputId} label={label} error={error} hint={hint}>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={isPassword && showPassword ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={controlClass(Boolean(error), `${isPassword ? "pr-12" : ""} ${className}`)}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-ink-faint hover:text-ink-soft"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </FieldShell>
  );
});

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: ReactNode;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function SelectField({ label, error, hint, id, options, placeholder, className = "", ...props }: SelectFieldProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  return (
    <FieldShell id={selectId} label={label} error={error} hint={hint}>
      <select
        id={selectId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${selectId}-error` : undefined}
        className={controlClass(Boolean(error), className)}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
