import type { ReactNode } from "react";
import { AlertCircle, Info } from "lucide-react";

interface AuthAlertProps {
  /** "error" = banner merah untuk error dari server, "info" = catatan biasa. */
  tone?: "error" | "info";
  children: ReactNode;
}

/** Banner di atas form. Versi error memakai role="alert" supaya langsung dibacakan pembaca layar. */
export default function AuthAlert({ tone = "error", children }: AuthAlertProps) {
  const error = tone === "error";
  const Icon = error ? AlertCircle : Info;
  return (
    <div
      role={error ? "alert" : "status"}
      className={`flex items-start gap-2.5 rounded-xl px-3.5 py-3 text-sm leading-normal ${
        error ? "bg-alert-bg text-alert-fg" : "bg-cloud text-space-1"
      }`}
    >
      <Icon size={18} aria-hidden="true" className={`mt-px shrink-0 ${error ? "" : "text-orbit-1"}`} />
      <span>{children}</span>
    </div>
  );
}
