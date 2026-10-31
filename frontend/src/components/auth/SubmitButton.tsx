import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  loading: boolean;
  label: string;
  loadingLabel: string;
}

/**
 * Tombol kirim form auth. Selama loading tombol dinonaktifkan dan
 * aria-busy aktif, jadi tidak bisa diklik dua kali.
 */
export default function SubmitButton({ loading, label, loadingLabel }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      aria-busy={loading}
      className="mt-0.5 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-orbit-1 text-base font-semibold text-white transition hover:brightness-95 disabled:cursor-wait disabled:opacity-75"
    >
      {loading && <Loader2 size={18} aria-hidden="true" className="motion-safe:animate-spin" />}
      {loading ? loadingLabel : label}
    </button>
  );
}
