import { useState } from "react";
import { Check, FlaskConical, Loader2, RotateCcw, X } from "lucide-react";
import { USE_MOCK } from "@/services/config";
import { resetMockDb } from "@/mocks/db";
import { useAuth } from "@/context/AuthContext";
import { useStudentStatus } from "@/context/StudentStatusContext";
import { STUDENT_STATUSES, STUDENT_STATUS_LABEL, type StudentStatus } from "@/types/student";

const STATUS_HINT: Record<StudentStatus, string> = {
  baru: "Belum isi tes minat bakat. Kompas, Performa, dan Action Plan terkunci.",
  sudah_asesmen: "Tes selesai, belum pernah latihan atau tryout.",
  aktif: "Sudah punya data latihan atau tryout. Semua bagian terisi.",
};

/**
 * Panel kecil untuk berpindah status siswa dan melihat semua kondisi halaman.
 * Hanya muncul saat VITE_USE_MOCK=true dan yang login adalah siswa.
 */
export default function DemoModePanel() {
  const { user } = useAuth();
  const { status, setDemoStatus } = useStudentStatus();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<StudentStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!USE_MOCK || !user || status === null) return null;

  async function choose(next: StudentStatus) {
    if (next === status || pending) return;
    setPending(next);
    setError(null);
    try {
      await setDemoStatus(next);
    } catch {
      setError("Gagal mengganti status. Coba lagi.");
    } finally {
      setPending(null);
    }
  }

  function reset() {
    resetMockDb();
    // Muat ulang supaya semua halaman membaca data dummy yang baru.
    window.location.reload();
  }

  return (
    // Di HP dinaikkan di atas menu bawah portal (68px + area aman).
    <div className="fixed bottom-[calc(80px+env(safe-area-inset-bottom))] left-4 z-[60] flex flex-col items-start gap-2 lg:bottom-4">
      {open && (
        <div
          role="dialog"
          aria-label="Mode Demo"
          className="w-[min(320px,calc(100vw-2rem))] rounded-card bg-white p-4 shadow-card-hover ring-1 ring-line"
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-ink">Mode Demo</p>
              <p className="text-xs text-ink-muted">Data dummy · {user.email}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup panel Mode Demo"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-ink-faint hover:bg-page hover:text-ink"
            >
              <X size={16} />
            </button>
          </div>

          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">Status siswa</p>
          <div className="flex flex-col gap-2">
            {STUDENT_STATUSES.map((s) => {
              const active = s === status;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => choose(s)}
                  disabled={pending !== null}
                  aria-pressed={active}
                  className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors disabled:cursor-wait ${
                    active ? "border-orbit-1 bg-cloud" : "border-line hover:border-orbit-2"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                      active ? "bg-gradient-orbit text-white" : "ring-1 ring-line"
                    }`}
                  >
                    {pending === s ? (
                      <Loader2 size={10} className="animate-spin text-orbit-1" />
                    ) : (
                      active && <Check size={10} strokeWidth={3} />
                    )}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{STUDENT_STATUS_LABEL[s]}</span>
                    <span className="block text-xs leading-snug text-ink-muted">{STATUS_HINT[s]}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {error && <p className="mt-2 text-xs text-danger">{error}</p>}

          <button
            type="button"
            onClick={reset}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-line py-2 text-xs font-semibold text-ink-soft hover:bg-page"
          >
            <RotateCcw size={13} /> Kembalikan data dummy ke awal
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full bg-gradient-navy px-4 py-2 text-xs font-semibold text-white shadow-card-hover"
      >
        <FlaskConical size={14} />
        Mode Demo · {STUDENT_STATUS_LABEL[status]}
      </button>
    </div>
  );
}
