import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchX } from "lucide-react";
import type { BidangKey, JurusanSummary } from "@/types/jurusan";
import { BIDANG, BIDANG_KEYS } from "@/config/bidang";
import { JURUSAN_LIST } from "@/content/jurusan";
import { JURUSAN_SECTION } from "@/content/landing";
import { countByBidang, getJurusanList, type JenisLembaga } from "@/services/jurusanService";
import JurusanHero from "@/components/jurusan/JurusanHero";
import JurusanCard from "@/components/jurusan/JurusanCard";
import { useJurusanFit } from "@/components/jurusan/useJurusanFit";
import { CONTAINER } from "@/components/landing/primitives";
import EmptyState from "@/components/ui/EmptyState";
import PageLoader from "@/components/ui/PageLoader";
import { usePageTitle } from "@/lib/usePageTitle";

const SEARCH_DEBOUNCE_MS = 200;

const isBidang = (value: string | null): value is BidangKey => value !== null && value in BIDANG;

/**
 * /jurusan: hero (docs/design/publik/EksplorJurusan-Desktop.jpg) dengan tab jenis
 * kampus dan pencarian, lalu katalog jurusan dengan filter bidang. Jenis, kata
 * kunci, dan bidang disimpan di URL (?jenis=&q=&bidang=) supaya bisa dibagikan.
 */
export default function JurusanListPage() {
  usePageTitle(JURUSAN_LIST.title);
  const [params, setParams] = useSearchParams();
  const jenis: JenisLembaga = params.get("jenis") === "kedinasan" ? "kedinasan" : "umum";
  const bidang = isBidang(params.get("bidang")) ? (params.get("bidang") as BidangKey) : null;
  const [search, setSearch] = useState(params.get("q") ?? "");
  const [items, setItems] = useState<JurusanSummary[] | null>(null);
  const counts = useMemo(() => countByBidang(jenis), [jenis]);
  const total = useMemo(() => Object.values(counts).reduce((a, b) => a + b, 0), [counts]);
  const fit = useJurusanFit();

  // Simpan kata kunci ke URL setelah berhenti mengetik sebentar.
  useEffect(() => {
    const t = window.setTimeout(() => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (search.trim()) next.set("q", search.trim());
          else next.delete("q");
          return next;
        },
        { replace: true },
      );
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [search, setParams]);

  const query = params.get("q") ?? "";
  useEffect(() => {
    let active = true;
    getJurusanList({ search: query, bidang, jenis }).then((data) => active && setItems(data));
    return () => {
      active = false;
    };
  }, [query, bidang, jenis]);

  /** Ganti tab jenis kampus; filter bidang dilepas karena daftar bidangnya berbeda. */
  function pickJenis(value: JenisLembaga) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === "kedinasan") next.set("jenis", value);
        else next.delete("jenis");
        next.delete("bidang");
        return next;
      },
      { replace: true },
    );
  }

  function pickBidang(key: BidangKey | null) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (key) next.set("bidang", key);
        else next.delete("bidang");
        return next;
      },
      { replace: true },
    );
  }

  function resetAll() {
    setSearch("");
    setParams({}, { replace: true });
  }

  const chip = (active: boolean) =>
    `inline-flex h-10 items-center gap-1.5 rounded-xl border-[1.5px] px-3.5 text-[13px] font-semibold transition sm:text-sm ${
      active ? "border-orbit-1 bg-orbit-1 text-white" : "border-rim bg-white text-space-1 hover:border-rim-strong"
    }`;
  const count = (active: boolean) => `text-xs font-medium ${active ? "text-white/80" : "text-prose-dim"}`;

  // Kedinasan hanya satu bidang, jadi chip bidang hanya tampil untuk PTN & PTS.
  const showChips = jenis === "umum";

  return (
    <div className="bg-surface-soft">
      <JurusanHero search={search} onSearch={setSearch} jenis={jenis} onJenis={pickJenis} />
      <div className={`${CONTAINER} flex flex-col gap-6 py-10 lg:gap-8 lg:py-14`}>
        <header className="flex flex-col gap-2">
          <h2 className="text-[26px] font-bold leading-tight tracking-[-0.4px] text-space-2 lg:text-[36px]">{JURUSAN_LIST.listTitle}</h2>
          <p className="max-w-[760px] text-base leading-[1.65] text-prose lg:text-lg">{JURUSAN_LIST.listBody}</p>
        </header>

        {showChips && (
          /* Chip bidang turun ke baris baru kalau tidak muat (tidak digeser). */
          <div role="group" aria-label={JURUSAN_LIST.filterLabel} className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={bidang === null} onClick={() => pickBidang(null)} className={chip(bidang === null)}>
              {JURUSAN_LIST.allBidang}
              <span className={count(bidang === null)}>{total}</span>
            </button>
            {BIDANG_KEYS.filter((key) => counts[key]).map((key) => {
              const active = bidang === key;
              return (
                <button key={key} type="button" aria-pressed={active} onClick={() => pickBidang(active ? null : key)} className={chip(active)}>
                  {BIDANG[key].label}
                  <span className={count(active)}>{counts[key]}</span>
                </button>
              );
            })}
          </div>
        )}

        {items === null ? (
          <PageLoader label={JURUSAN_LIST.loading} />
        ) : items.length === 0 ? (
          <div className="rounded-card-lg bg-white">
            <EmptyState
              icon={SearchX}
              title={JURUSAN_LIST.emptyTitle}
              description={JURUSAN_LIST.emptyBody}
              action={
                <button type="button" onClick={resetAll} className="rounded-xl bg-orbit-1 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orbit-1/90">
                  {JURUSAN_LIST.resetFilter}
                </button>
              }
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p aria-live="polite" className="text-sm text-prose">
              {JURUSAN_LIST.resultCount(items.length)}
              {Object.keys(fit).length > 0 && <span className="text-prose-dim"> · {JURUSAN_LIST.fitHint}</span>}
            </p>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
              {items.map((j) => (
                <li key={j.slug} className="flex">
                  <JurusanCard jurusan={j} photoPlaceholder={JURUSAN_SECTION.photoPlaceholder} fit={fit[j.slug]} className="w-full" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
