import { useState } from "react";
import { AlertTriangle, FileText, Info, Pencil, Plus, Trash2, Trophy } from "lucide-react";
import { PRESTASI } from "@/content/analisis";
import type { AsyncState } from "@/lib/useAsync";
import { ACHIEVEMENT_FULL_SUPPORT, addAchievement, deleteAchievement, updateAchievement } from "@/services/achievementService";
import type { AchievementInput, AchievementItem, AchievementKind } from "@/types/analisis";
import Dialog from "@/components/ui/Dialog";
import { PanelError, PanelSkeleton } from "@/components/ui/PanelState";
import AchievementDialog from "./AchievementDialog";

const KINDS: AchievementKind[] = ["akademik", "nonakademik"];

function Notice({ tone, children }: { tone: "info" | "warn"; children: string }) {
  const info = tone === "info";
  const Icon = info ? Info : AlertTriangle;
  return (
    <div className={`flex gap-2.5 rounded-[14px] px-3.5 py-3 text-[13px] leading-normal lg:items-center lg:px-4 lg:text-sm ${info ? "bg-surface-blue text-space-1" : "bg-surface-peach text-tint-orange-ink"}`}>
      <Icon size={18} aria-hidden="true" className={`mt-px shrink-0 lg:mt-0 ${info ? "text-orbit-1" : "text-tint-orange-fg"}`} />
      <span>{children}</span>
    </div>
  );
}

function AchievementCard({ item, onEdit, onDelete }: { item: AchievementItem; onEdit: (() => void) | null; onDelete: () => void }) {
  const missingCert = ACHIEVEMENT_FULL_SUPPORT && !item.certificateName;
  const iconBtn = "flex h-10 w-10 items-center justify-center rounded-[10px] border border-rim-soft bg-white hover:bg-surface-soft";
  return (
    <article
      className={`flex flex-col gap-2.5 rounded-[18px] border bg-white p-4 lg:grid lg:grid-cols-[48px_minmax(0,1fr)_auto] lg:items-start lg:gap-4 lg:p-5 ${
        missingCert ? "border-tint-orange-line" : "border-rim-soft"
      }`}
    >
      <div className="flex items-start gap-3 lg:contents">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-tint-orange-bg text-tint-orange-fg lg:h-12 lg:w-12 lg:rounded-[14px]">
          <Trophy size={22} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <h3 className="min-w-0 flex-1 text-[15px] font-bold leading-snug text-space-2 lg:hidden">{item.title}</h3>
        <div className="flex shrink-0 gap-1 lg:order-last">
          {onEdit && (
            <button type="button" onClick={onEdit} aria-label={PRESTASI.edit(item.title)} className={`${iconBtn} text-space-1`}>
              <Pencil size={16} aria-hidden="true" />
            </button>
          )}
          <button type="button" onClick={onDelete} aria-label={PRESTASI.remove(item.title)} className={`${iconBtn} text-alert-fg`}>
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-2.5 lg:gap-2">
        <h3 className="hidden text-base font-bold leading-snug text-space-2 lg:block">{item.title}</h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-tint-blue-bg px-2.5 py-[3px] text-xs font-semibold text-tint-blue-fg">{item.level}</span>
          {item.rank && <span className="rounded-full bg-tint-orange-bg px-2.5 py-[3px] text-xs font-semibold text-tint-orange-fg">{item.rank}</span>}
        </div>
        <span className="text-[13px] text-prose">{[item.organizer, item.year].filter(Boolean).join(", ")}</span>
        {ACHIEVEMENT_FULL_SUPPORT && (
          <span className={`flex items-center gap-1.5 text-[13px] font-medium ${item.certificateName ? "text-tint-blue-fg" : "text-tint-orange-fg"}`}>
            {item.certificateName ? <FileText size={16} aria-hidden="true" /> : <AlertTriangle size={16} aria-hidden="true" />}
            <span className="truncate">{item.certificateName ?? PRESTASI.noCertificate}</span>
          </span>
        )}
      </div>
    </article>
  );
}

interface PrestasiPanelProps {
  state: AsyncState<AchievementItem[]>;
}

/** Tab Prestasi: daftar per jenis, tambah, ubah (mode dummy), dan hapus dengan konfirmasi. */
export default function PrestasiPanel({ state }: PrestasiPanelProps) {
  const [kind, setKind] = useState<AchievementKind>("akademik");
  const [dialog, setDialog] = useState<{ editing: AchievementItem | null } | null>(null);
  const [toDelete, setToDelete] = useState<AchievementItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (state.loading && !state.data) return <PanelSkeleton />;
  if (state.error || !state.data) return <PanelError onRetry={state.reload} />;

  const all = state.data;
  const list = all.filter((a) => a.kind === kind);
  const counts = { akademik: all.filter((a) => a.kind === "akademik").length, nonakademik: all.filter((a) => a.kind === "nonakademik").length };

  async function save(input: AchievementInput) {
    if (dialog?.editing) await updateAchievement(dialog.editing.id, input, dialog.editing);
    else await addAchievement(input);
    setDialog(null);
    state.reload();
  }

  async function confirmDelete() {
    if (!toDelete || deleting) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteAchievement(toDelete.id);
      setToDelete(null);
      state.reload();
    } catch {
      setDeleteError(PRESTASI.confirm.error);
    } finally {
      setDeleting(false);
    }
  }

  const empty = PRESTASI.empty[kind];

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <div className="flex flex-col-reverse gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label={PRESTASI.kindLabel} className="grid grid-cols-2 rounded-[14px] bg-surface-toggle p-1 lg:flex">
          {KINDS.map((k) => {
            const on = k === kind;
            return (
              <button
                key={k}
                type="button"
                aria-pressed={on}
                onClick={() => setKind(k)}
                className={`h-[42px] rounded-[11px] px-4 text-sm font-semibold transition-colors lg:h-10 ${on ? "bg-white text-space-2 shadow-toggle" : "text-prose hover:text-space-2"}`}
              >
                {PRESTASI.kinds[k]} ({counts[k]})
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setDialog({ editing: null })}
          className="flex h-[50px] items-center justify-center gap-2 rounded-xl bg-orbit-1 px-[18px] text-[15px] font-semibold text-white hover:brightness-95 lg:h-[46px] lg:text-sm"
        >
          <Plus size={18} strokeWidth={2.4} aria-hidden="true" />
          {PRESTASI.add}
        </button>
      </div>

      <Notice tone="info">{PRESTASI.info}</Notice>
      {!ACHIEVEMENT_FULL_SUPPORT && <Notice tone="warn">{PRESTASI.backendNote}</Notice>}

      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-card border-[1.5px] border-dashed border-field-rim bg-white px-5 py-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tint-orange-bg text-tint-orange-fg">
            <Trophy size={24} aria-hidden="true" />
          </span>
          <p className="text-base font-semibold text-space-2">{empty.title}</p>
          <p className="max-w-[380px] text-sm text-prose">{empty.body}</p>
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
          {list.map((item) => (
            <AchievementCard
              key={item.id}
              item={item}
              onEdit={ACHIEVEMENT_FULL_SUPPORT ? () => setDialog({ editing: item }) : null}
              onDelete={() => {
                setDeleteError(null);
                setToDelete(item);
              }}
            />
          ))}
        </div>
      )}

      {dialog && (
        <AchievementDialog
          editing={dialog.editing}
          kind={kind}
          fullSupport={ACHIEVEMENT_FULL_SUPPORT}
          onClose={() => setDialog(null)}
          onSubmit={save}
        />
      )}

      {toDelete && (
        <Dialog
          role="alertdialog"
          title={PRESTASI.confirm.title}
          onClose={() => setToDelete(null)}
          busy={deleting}
          showClose={false}
          widthClass="max-w-[440px]"
          icon={
            <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-alert-bg text-alert-fg">
              <Trash2 size={24} aria-hidden="true" />
            </span>
          }
        >
          <p className="-mt-1 text-[15px] leading-relaxed text-prose">
            <strong className="font-semibold text-space-2">{toDelete.title}</strong> {PRESTASI.confirm.body}
          </p>
          {deleteError && (
            <p role="alert" className="rounded-xl bg-alert-bg px-3.5 py-2.5 text-sm text-alert-fg">
              {deleteError}
            </p>
          )}
          <div className="mt-2 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
            <button
              type="button"
              data-autofocus
              onClick={() => setToDelete(null)}
              disabled={deleting}
              className="h-[46px] rounded-xl border-[1.5px] border-rim bg-white px-[18px] text-sm font-semibold text-space-1 hover:bg-surface-soft disabled:opacity-60"
            >
              {PRESTASI.confirm.cancel}
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={deleting}
              aria-busy={deleting}
              className="h-[46px] rounded-xl bg-alert-fg px-5 text-sm font-semibold text-white hover:brightness-110 disabled:cursor-wait disabled:opacity-75"
            >
              {deleting ? PRESTASI.confirm.deleting : PRESTASI.confirm.confirm}
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
