import { useRef, useState, type DragEvent, type FormEvent } from "react";
import { FileText, Upload } from "lucide-react";
import { PRESTASI } from "@/content/analisis";
import { ACHIEVEMENT_LEVELS, type AchievementInput, type AchievementItem, type AchievementKind, type AchievementLevel } from "@/types/analisis";
import { SelectField, TextField } from "@/components/ui/FormField";
import Dialog from "@/components/ui/Dialog";
import AuthAlert from "@/components/auth/AuthAlert";

const COPY = PRESTASI.dialog;
const MAX_FILE_BYTES = 2 * 1024 * 1024;
const ALLOWED_EXT = /\.(pdf|jpe?g|png)$/i;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

interface AchievementDialogProps {
  /** null = tambah baru. */
  editing: AchievementItem | null;
  kind: AchievementKind;
  /** false di mode backend: capaian, penyelenggara, dan sertifikat disembunyikan. */
  fullSupport: boolean;
  onClose: () => void;
  onSubmit: (input: AchievementInput) => Promise<void>;
}

type Errors = Partial<Record<"title" | "level" | "file", string>>;

function yearOptions(now = new Date()): number[] {
  const y = now.getFullYear();
  return [y, y - 1, y - 2, y - 3];
}

const isLevel = (v: string): v is AchievementLevel => (ACHIEVEMENT_LEVELS as readonly string[]).includes(v);

/** Jendela tambah/ubah prestasi (docs/design/portal/Portal-Analisis.dc.html). */
export default function AchievementDialog({ editing, kind, fullSupport, onClose, onSubmit }: AchievementDialogProps) {
  const years = yearOptions();
  const [title, setTitle] = useState(editing?.title ?? "");
  const [level, setLevel] = useState<string>(editing && isLevel(editing.level) ? editing.level : "");
  const [rank, setRank] = useState(editing?.rank ?? "");
  const [organizer, setOrganizer] = useState(editing?.organizer ?? "");
  const [year, setYear] = useState(String(editing?.year ?? years[0]));
  // undefined = sertifikat tidak diubah; null = dihapus; string = file baru.
  const [certificate, setCertificate] = useState<string | null | undefined>(undefined);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const currentFile = certificate === undefined ? (editing?.certificateName ?? null) : certificate;
  const yearChoices = editing && !years.includes(editing.year) ? [...years, editing.year] : years;

  function pickFile(file: File | undefined) {
    if (!file) return;
    if (!ALLOWED_EXT.test(file.name) || (file.type && !ALLOWED_TYPES.includes(file.type))) {
      setErrors((e) => ({ ...e, file: COPY.errors.fileType }));
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setErrors((e) => ({ ...e, file: COPY.errors.fileSize }));
      return;
    }
    setErrors((e) => ({ ...e, file: undefined }));
    // Mode dummy: hanya nama file yang disimpan (unggah belum ada, API_CONTRACT 8.1).
    setCertificate(file.name);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files[0]);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (saving) return;
    const found: Errors = {};
    if (!title.trim()) found.title = COPY.errors.title;
    if (!isLevel(level)) found.level = COPY.errors.level;
    setErrors((prev) => ({ ...found, file: prev.file }));
    if (found.title) return titleRef.current?.focus();
    if (found.level) return document.getElementById("prestasi-level")?.focus();

    setSaving(true);
    setServerError(null);
    try {
      await onSubmit({
        title,
        kind: editing?.kind ?? kind,
        level: level as AchievementLevel,
        rank: fullSupport ? rank : "",
        organizer: fullSupport ? organizer : "",
        year: Number(year),
        ...(fullSupport && certificate !== undefined ? { certificateName: certificate } : {}),
      });
    } catch {
      setServerError(COPY.errors.server);
      setSaving(false);
    }
  }

  return (
    <Dialog title={editing ? COPY.editTitle : COPY.addTitle} onClose={onClose} busy={saving} closeLabel={COPY.close}>
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        {serverError && <AuthAlert>{serverError}</AuthAlert>}
        <TextField
          ref={titleRef}
          data-autofocus
          label={COPY.title}
          placeholder={COPY.titlePlaceholder}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((x) => ({ ...x, title: undefined }));
          }}
          error={errors.title}
        />
        <div className={`grid gap-3 ${fullSupport ? "sm:grid-cols-2" : ""}`}>
          <SelectField
            id="prestasi-level"
            label={COPY.level}
            placeholder={COPY.levelPlaceholder}
            options={ACHIEVEMENT_LEVELS.map((l) => ({ value: l, label: l }))}
            value={level}
            onChange={(e) => {
              setLevel(e.target.value);
              if (errors.level) setErrors((x) => ({ ...x, level: undefined }));
            }}
            error={errors.level}
          />
          {fullSupport && <TextField label={COPY.rank} placeholder={COPY.rankPlaceholder} value={rank} onChange={(e) => setRank(e.target.value)} />}
        </div>
        <div className={`grid gap-3 ${fullSupport ? "sm:grid-cols-[minmax(0,1fr)_140px]" : ""}`}>
          {fullSupport && (
            <TextField label={COPY.organizer} placeholder={COPY.organizerPlaceholder} value={organizer} onChange={(e) => setOrganizer(e.target.value)} />
          )}
          <SelectField label={COPY.year} options={yearChoices.map((y) => ({ value: String(y), label: String(y) }))} value={year} onChange={(e) => setYear(e.target.value)} />
        </div>

        {fullSupport && (
          <div className="flex flex-col gap-1.5">
            <span id="prestasi-file-label" className="text-sm font-semibold text-space-1">
              {COPY.certificate}
            </span>
            {currentFile ? (
              <div className="flex min-h-14 flex-wrap items-center gap-2.5 rounded-xl border-[1.5px] border-field-rim bg-field-bg py-2 pl-3.5 pr-2">
                <FileText size={20} aria-hidden="true" className="shrink-0 text-orbit-1" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-space-2">{currentFile}</span>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="h-10 rounded-[10px] border border-rim bg-white px-3 text-[13px] font-semibold text-orbit-1 hover:bg-surface-soft"
                >
                  {COPY.replaceFile}
                </button>
                <button
                  type="button"
                  onClick={() => setCertificate(null)}
                  className="h-10 rounded-[10px] px-3 text-[13px] font-semibold text-alert-fg hover:bg-alert-bg"
                >
                  {COPY.removeFile}
                </button>
              </div>
            ) : (
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={`relative flex min-h-[104px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[14px] border-[1.5px] border-dashed p-4 text-center transition-colors focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-sun-2 ${
                  dragging ? "border-orbit-1 bg-surface-blue" : "border-rim-upload bg-field-bg"
                }`}
              >
                <Upload size={24} aria-hidden="true" className="text-orbit-1" />
                <span className="text-sm font-semibold text-orbit-1">{COPY.pickFile}</span>
                <span className="text-xs text-prose-dim">{COPY.fileRule}</span>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  aria-labelledby="prestasi-file-label"
                  aria-describedby={errors.file ? "prestasi-file-error" : undefined}
                  onChange={(e) => {
                    pickFile(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                  className="absolute h-px w-px opacity-0"
                />
              </label>
            )}
            {/* Input tersembunyi untuk "Ganti file" saat file sudah ada. */}
            {currentFile && (
              <input
                ref={fileRef}
                type="file"
                tabIndex={-1}
                aria-hidden="true"
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                onChange={(e) => {
                  pickFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
                className="hidden"
              />
            )}
            {errors.file && (
              <p id="prestasi-file-error" className="text-[13px] text-alert-fg">
                {errors.file}
              </p>
            )}
          </div>
        )}

        <div className="mt-1 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-[46px] rounded-xl border-[1.5px] border-rim bg-white px-[18px] text-sm font-semibold text-space-1 hover:bg-surface-soft disabled:opacity-60"
          >
            {COPY.cancel}
          </button>
          <button
            type="submit"
            disabled={saving}
            aria-busy={saving}
            className="h-[46px] rounded-xl bg-orbit-1 px-[22px] text-sm font-semibold text-white hover:brightness-95 disabled:cursor-wait disabled:opacity-75"
          >
            {saving ? COPY.saving : editing ? COPY.saveEdit : COPY.saveNew}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
