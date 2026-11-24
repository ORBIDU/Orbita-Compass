import { useState } from "react";
import { X, UploadCloud, FileSpreadsheet, CheckCircle2, Download, ArrowRight } from "lucide-react";
import { importRaporExcel } from "@/services/waliService";

interface WaliImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  /** Nama kelas dari profil wali, mis. "XI IPA 2". */
  kelas?: string;
}

export default function WaliImportModal({ isOpen, onClose, onSuccess, kelas }: WaliImportModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [semester, setSemester] = useState("Semester 5 (Ganjil)");
  const [tahunAjaran, setTahunAjaran] = useState("2026 / 2027");
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSimulateUpload = () => {
    setFileName("Rekap_Nilai_XI_IPA_2_Sem5.xlsx");
    setStep(2);
  };

  const handleProcessImport = async () => {
    setLoading(true);
    try {
      await importRaporExcel({
        semester,
        tahunAjaran,
        fileName: fileName || "rekap.xlsx",
      });
      setStep(3);
      if (onSuccess) onSuccess();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFileName(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-space-2/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-card-lg bg-white p-6 shadow-dialog border border-rim-soft">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rim-soft pb-4">
          <div>
            <h3 className="text-lg font-bold text-space-2">
              Impor Rekap Nilai Rapor
            </h3>
            <p className="text-xs text-prose-dim">
              Unggah format template Excel e-Rapor{kelas ? ` kelas ${kelas}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-prose-dim hover:bg-surface-soft hover:text-space-2 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Steps Content */}
        <div className="py-5">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-prose-dim mb-1.5">
                  Semester & Tahun Ajaran
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="h-11 rounded-xl border border-rim-soft bg-field-bg px-3 text-xs font-semibold text-space-2 focus:border-orbit-1 focus:outline-none"
                  >
                    <option value="Semester 1 (Ganjil)">Semester 1 (Ganjil)</option>
                    <option value="Semester 2 (Genap)">Semester 2 (Genap)</option>
                    <option value="Semester 3 (Ganjil)">Semester 3 (Ganjil)</option>
                    <option value="Semester 4 (Genap)">Semester 4 (Genap)</option>
                    <option value="Semester 5 (Ganjil)">Semester 5 (Ganjil)</option>
                    <option value="Semester 6 (Genap)">Semester 6 (Genap)</option>
                  </select>

                  <select
                    value={tahunAjaran}
                    onChange={(e) => setTahunAjaran(e.target.value)}
                    className="h-11 rounded-xl border border-rim-soft bg-field-bg px-3 text-xs font-semibold text-space-2 focus:border-orbit-1 focus:outline-none"
                  >
                    <option value="2025 / 2026">2025 / 2026</option>
                    <option value="2026 / 2027">2026 / 2027</option>
                  </select>
                </div>
              </div>

              {/* Dropzone Area */}
              <div
                onClick={handleSimulateUpload}
                className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-rim-dash bg-surface-soft p-8 text-center cursor-pointer hover:border-orbit-1 hover:bg-surface-blue transition"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-card group-hover:scale-105 transition text-orbit-1">
                  <UploadCloud size={24} />
                </div>
                <p className="mt-3 text-sm font-semibold text-space-2">
                  Klik untuk pilih file Excel (.xlsx)
                </p>
                <p className="mt-1 text-xs text-prose-dim">
                  Format template e-Rapor resmi Kemdikbud
                </p>
              </div>

              {/* Unduh Template Helper */}
              <div className="flex items-center justify-between rounded-xl bg-surface-soft p-3 text-xs">
                <div className="flex items-center gap-2 text-prose">
                  <FileSpreadsheet size={16} className="text-success" />
                  <span>Belum punya format Excel?</span>
                </div>
                <button
                  type="button"
                  className="font-semibold text-orbit-1 hover:underline inline-flex items-center gap-1"
                >
                  <Download size={13} />
                  Unduh Template
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-rim-soft bg-surface-soft p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/15 text-success">
                    <FileSpreadsheet size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-bold text-space-2">
                      {fileName}
                    </p>
                    <p className="text-xs text-prose-dim">
                      36 baris siswa terdeteksi · Siap diproses
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-rim-soft bg-white p-3 text-xs space-y-2">
                <div className="flex justify-between text-prose">
                  <span>Target Semester:</span>
                  <strong className="text-space-2">{semester}</strong>
                </div>
                <div className="flex justify-between text-prose">
                  <span>Tahun Ajaran:</span>
                  <strong className="text-space-2">{tahunAjaran}</strong>
                </div>
                <div className="flex justify-between text-prose">
                  <span>Mata Pelajaran:</span>
                  <strong className="text-space-2">6 Mapel (IPA & Wajib)</strong>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-tint-green-bg text-success mb-3">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-lg font-bold text-space-2">
                Rekap Nilai Berhasil Disimpan!
              </h4>
              <p className="mt-1 text-xs text-prose-dim max-w-sm mx-auto">
                Nilai rapor 36 siswa untuk {semester} telah tersimpan dan siap dijadikan bahan evaluasi perkembangan kelas.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-rim-soft pt-4">
          {step === 1 && (
            <button
              type="button"
              onClick={handleClose}
              className="h-10 rounded-xl px-4 text-xs font-semibold text-prose-dim hover:bg-surface-soft transition"
            >
              Batal
            </button>
          )}

          {step === 2 && (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="h-10 rounded-xl px-4 text-xs font-semibold text-prose-dim hover:bg-surface-soft transition"
              >
                Ganti File
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleProcessImport}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-sun-x px-5 text-xs font-bold text-space-2 shadow-sun hover:brightness-105 transition disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Konfirmasi & Simpan Nilai"}
                <ArrowRight size={14} />
              </button>
            </>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={handleClose}
              className="h-10 rounded-xl bg-orbit-1 px-6 text-xs font-bold text-white shadow-cta hover:bg-orbit-1/90 transition"
            >
              Selesai
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
