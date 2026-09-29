/** Gaya satu item menu desktop. Item aktif memakai gradient biru. */
export function navItemClasses(active: boolean): string {
  return [
    "flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-[13px] font-semibold transition",
    active ? "bg-gradient-orbit text-white shadow-cta" : "text-ink-soft hover:bg-page hover:text-ink",
  ].join(" ");
}
