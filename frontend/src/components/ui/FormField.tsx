import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

// Gaya input mengikuti desain halaman Masuk (docs/design/auth). Ukuran huruf
// 16px di HP supaya iOS tidak memperbesar layar saat input disentuh.
const controlClass = (hasError: boolean, extra = "") =>
  [
    "h-12 w-full rounded-xl border-[1.5px] bg-field-bg px-4 text-base text-space-2 placeholder:text-field-hint transition lg:text-[15px]",
    "focus:outline-none focus:ring-2",
    hasError ? "border-alert-rim focus:ring-alert-rim/20" : "border-field-rim focus:border-orbit-1 focus:ring-orbit-1/20",
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
      <label htmlFor={id} className="text-sm font-semibold text-space-1">
        {label}
      </label>
      {children}
      {/* Tanpa role="alert": pesan dibacakan lewat aria-describedby saat field difokuskan. */}
      {error ? (
        <FieldError id={`${id}-error`}>{error}</FieldError>
      ) : (
        hint && <p className="text-[13px] text-prose">{hint}</p>
      )}
    </div>
  );
}

/** Pesan error di bawah field. Dipakai juga oleh kontrol lain (mis. pilihan kelas). */
export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="text-[13px] leading-snug text-alert-fg">
      {children}
    </p>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: ReactNode;
  /** Border merah tanpa pesan (mis. saat banner error server menjelaskan masalahnya). */
  invalid?: boolean;
}

/** Input teks dengan label dan pesan error. type="password" otomatis punya tombol lihat/sembunyikan. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, hint, invalid = false, id, type = "text", className = "", ...props },
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
          aria-invalid={error || invalid ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={controlClass(Boolean(error) || invalid, `${isPassword ? "pr-14" : ""} ${className}`)}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-prose hover:text-space-2"
          >
            {showPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
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
