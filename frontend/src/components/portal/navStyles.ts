/**
 * Gaya satu item menu desktop (docs/design/portal/PortalHeader.dc.html):
 * setinggi header, menu aktif ditandai garis bawah biru.
 */
export function navItemClasses(active: boolean): string {
  return [
    "flex h-full items-center gap-2 whitespace-nowrap border-b-2 px-2.5 pt-0.5 text-sm transition-colors nav:px-3",
    active ? "border-orbit-1 font-semibold text-orbit-1" : "border-transparent font-medium text-prose hover:text-space-2",
  ].join(" ");
}

/** Ikon menu desktop disembunyikan di 1024–1399px supaya semua menu muat satu baris. */
export const NAV_ICON_CLASS = "hidden shrink-0 nav:block";
