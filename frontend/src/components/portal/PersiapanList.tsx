import { NavLink } from "react-router-dom";
import { PERSIAPAN_ITEMS, ROUTES } from "@/config/navigation";
import { useSkdRelevant } from "@/lib/useSkdRelevant";

export const SOON_LABEL = "Segera hadir";

/**
 * Daftar pilihan Persiapan (Siap SNBP s.d. Siap Mandiri). Dipakai dropdown
 * desktop dan bottom sheet HP. Pilihan tanpa `to` tampil "Segera hadir" dan
 * tidak bisa diklik. Siap SKD hanya tampil jika relevan (lib/persiapan.ts);
 * URL-nya tetap bisa dibuka langsung.
 */
export default function PersiapanList({ itemRole }: { itemRole?: "menuitem" }) {
  const skdRelevant = useSkdRelevant();
  const items = PERSIAPAN_ITEMS.filter((item) => item.to !== ROUTES.persiapanUjian("skd") || skdRelevant);
  return (
    <>
      {items.map((item) => {
        const Icon = item.icon;
        const content = (
          <>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cloud text-orbit-1">
              <Icon size={18} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm font-semibold text-space-2">
                {item.label}
                {!item.to && (
                  <span className="rounded-full bg-surface-track px-2 py-0.5 text-[10px] font-semibold text-prose">{SOON_LABEL}</span>
                )}
              </span>
              <span className="block text-xs text-prose-dim">{item.description}</span>
            </span>
          </>
        );
        if (!item.to) {
          return (
            <div
              key={item.label}
              role={itemRole}
              aria-disabled="true"
              className="flex min-h-14 cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2 opacity-60"
            >
              {content}
            </div>
          );
        }
        return (
          <NavLink
            key={item.label}
            to={item.to}
            role={itemRole}
            className={({ isActive }) =>
              `flex min-h-14 items-center gap-3 rounded-xl px-3 py-2 transition-colors ${isActive ? "bg-cloud" : "hover:bg-surface-soft"}`
            }
          >
            {content}
          </NavLink>
        );
      })}
    </>
  );
}
