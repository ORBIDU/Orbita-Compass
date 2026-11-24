import { useState, type FormEvent } from "react";
import { AlertCircle } from "lucide-react";
import Dialog from "@/components/ui/Dialog";
import { addBkCounselingNote } from "@/services/bkService";
import type { BkNoteItem, BkPriority } from "@/types/bk";

interface BkAddNoteModalProps {
  isOpen: boolean;
  studentId: number;
  studentName: string;
  studentKelas: string;
  defaultKonselor: string;
  onClose: () => void;
  onSaved: (note: BkNoteItem) => void;
}

const PRIORITIES: { value: BkPriority; label: string; activeClass: string; dotClass: string }[] = [
  {
    value: "Rendah",
    label: "Rendah",
    activeClass: "border-success bg-tint-green-bg text-tint-green-fg",
    dotClass: "bg-success",
  },
  {
    value: "Sedang",
    label: "Sedang",
    activeClass: "border-warning bg-tint-amber-bg text-tint-amber-fg",
    dotClass: "bg-warning",
  },
  {
    value: "Tinggi",
    label: "Tinggi",
    activeClass: "border-danger bg-alert-bg text-alert-fg",
    dotClass: "bg-danger",
  },
];

export default function BkAddNoteModal({
  isOpen,
  studentId,
  studentName,
  studentKelas,
  defaultKonselor,
  onClose,
  onSaved,
}: BkAddNoteModalProps) {
  const [tanggal, setTanggal] = useState(() => new Date().toISOString().slice(0, 10));
  const [konselor, setKonselor] = useState(defaultKonselor);
  const [topik, setTopik] = useState("");
  const [catatan, setCatatan] = useState("");
  const [rekomendasi, setRekomendasi] = useState("");
  const [tindakLanjut, setTindakLanjut] = useState("");
  const [prioritas, setPrioritas] = useState<BkPriority>("Rendah");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!topik.trim()) {
      setErrorMsg("Topik konseling wajib diisi.");
      return;
    }

    setErrorMsg(null);
    setSubmitting(true);
    try {
      const created = await addBkCounselingNote(studentId, {
        tanggal,
        konselor: konselor.trim() || defaultKonselor,
        topik: topik.trim(),
        catatan: catatan.trim(),
        rekomendasi: rekomendasi.trim(),
        tindakLanjut: tindakLanjut.trim(),
        prioritas,
      });
      onSaved(created);
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal menyimpan catatan konseling.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog title="Tambah Catatan BK" onClose={onClose} widthClass="max-w-[560px]" busy={submitting}>
      <p className="-mt-2 text-xs text-prose-dim">
        Siswa: <strong className="text-space-2">{studentName}</strong> · {studentKelas}
      </p>

      {errorMsg && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-alert-rim bg-alert-bg px-3.5 py-2.5 text-xs font-semibold text-alert-fg"
        >
          <AlertCircle size={16} aria-hidden="true" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-prose-dim">
              Tanggal Konseling
            </label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="h-10 w-full rounded-xl border border-field-rim bg-field-bg px-3 text-xs font-medium text-space-2 focus:border-orbit-1 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-prose-dim">
              Nama Konselor
            </label>
            <input
              type="text"
              value={konselor}
              onChange={(e) => setKonselor(e.target.value)}
              placeholder="cth. Hendra Raharjo, S.Psi."
              className="h-10 w-full rounded-xl border border-field-rim bg-field-bg px-3 text-xs font-medium text-space-2 placeholder:text-field-hint focus:border-orbit-1 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-prose-dim">
            Topik Konseling <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            data-autofocus
            value={topik}
            onChange={(e) => {
              setTopik(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder="cth. Motivasi Belajar, Persiapan SNBT, Pemilihan Jurusan..."
            className="h-10 w-full rounded-xl border border-field-rim bg-field-bg px-3 text-xs font-medium text-space-2 placeholder:text-field-hint focus:border-orbit-1 focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-prose-dim">
            Catatan Konselor
          </label>
          <textarea
            rows={3}
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Tuliskan ringkasan hasil sesi konseling dengan siswa..."
            className="w-full rounded-xl border border-field-rim bg-field-bg p-3 text-xs font-medium text-space-2 placeholder:text-field-hint focus:border-orbit-1 focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-prose-dim">
            Rekomendasi untuk Siswa
          </label>
          <input
            type="text"
            value={rekomendasi}
            onChange={(e) => setRekomendasi(e.target.value)}
            placeholder="Saran atau strategi yang disepakati bersama siswa..."
            className="h-10 w-full rounded-xl border border-field-rim bg-field-bg px-3 text-xs font-medium text-space-2 placeholder:text-field-hint focus:border-orbit-1 focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-prose-dim">
            Tindak Lanjut untuk Wali Kelas
          </label>
          <input
            type="text"
            value={tindakLanjut}
            onChange={(e) => setTindakLanjut(e.target.value)}
            placeholder="Arahan koordinasi yang perlu diperhatikan wali kelas..."
            className="h-10 w-full rounded-xl border border-field-rim bg-field-bg px-3 text-xs font-medium text-space-2 placeholder:text-field-hint focus:border-orbit-1 focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-prose-dim">
            Tingkat Prioritas
          </span>
          <div className="grid grid-cols-3 gap-2">
            {PRIORITIES.map((p) => {
              const selected = prioritas === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPrioritas(p.value)}
                  className={`flex h-10 items-center justify-center gap-2 rounded-xl border-2 text-xs font-bold transition ${
                    selected
                      ? p.activeClass
                      : "border-rim-soft bg-white text-prose-dim hover:bg-surface-soft"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${p.dotClass}`} />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-rim-soft pt-4">
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="h-11 flex-1 rounded-xl border border-rim-soft bg-surface-soft text-xs font-semibold text-space-2 transition hover:bg-surface-blue disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="h-11 flex-[2] rounded-xl bg-orbit-1 text-xs font-bold text-white shadow-cta transition hover:brightness-95 disabled:opacity-60"
          >
            {submitting ? "Menyimpan..." : "Simpan Catatan"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
