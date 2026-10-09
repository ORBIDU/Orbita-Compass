import { useEffect, useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import type { CampusGroup, CampusOffering, JurusanDetail } from "@/types/jurusan";
import { CAMPUS_GROUPS, JURUSAN_DETAIL } from "@/content/jurusan";
import { getCampusesForJurusan } from "@/services/jurusanService";

const T = JURUSAN_DETAIL.campus;
const INITIAL_VISIBLE = 5;

const GROUP_BADGE: Record<CampusGroup, string> = {
  PTN: "bg-tint-blue-bg text-tint-blue-fg",
  PTS: "bg-tint-orange-bg text-tint-orange-fg",
  Kedinasan: "bg-tint-navy-bg text-tint-navy-fg",
  PTLN: "bg-tint-teal-bg text-tint-teal-fg",
};

/** "Kampus yang membuka jurusan ini" + filter jenis kampus dan kota. */
export default function CampusList({ jurusan }: { jurusan: JurusanDetail }) {
  const [campuses, setCampuses] = useState<CampusOffering[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [group, setGroup] = useState<CampusGroup | null>(null);
  const [city, setCity] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let active = true;
    setCampuses(null);
    setFailed(false);
    setGroup(null);
    setCity("");
    setExpanded(false);
    getCampusesForJurusan(jurusan)
      .then((data) => active && setCampuses(data))
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, [jurusan]);

  const counts = useMemo(() => {
    const c: Record<CampusGroup, number> = { PTN: 0, PTS: 0, Kedinasan: 0, PTLN: 0 };
    for (const x of campuses ?? []) c[x.group] += 1;
    return c;
  }, [campuses]);

  // Pilihan kota mengikuti jenis kampus yang sedang dipilih.
  const cities = useMemo(
    () => [...new Set((campuses ?? []).filter((x) => !group || x.group === group).map((x) => x.city))].sort((a, b) => a.localeCompare(b, "id")),
    [campuses, group],
  );

  const filtered = useMemo(
    () => (campuses ?? []).filter((x) => (!group || x.group === group) && (!city || x.city === city)),
    [campuses, group, city],
  );
  const visible = expanded ? filtered : filtered.slice(0, INITIAL_VISIBLE);

  function pickGroup(next: CampusGroup | null) {
    setGroup(next);
    setExpanded(false);
    // Kota yang dipilih mungkin tidak ada di jenis kampus baru.
    if (next && city && !(campuses ?? []).some((x) => x.group === next && x.city === city)) setCity("");
  }

  const chip = (active: boolean) =>
    `inline-flex h-9 items-center gap-1.5 rounded-lg border-[1.5px] px-3 text-[13px] font-semibold transition ${
      active ? "border-orbit-1 bg-orbit-1 text-white" : "border-rim bg-white text-space-1 hover:border-rim-strong"
    }`;

  const emptyMessage =
    campuses && campuses.length === 0 ? T.none : group === "PTLN" && counts.PTLN === 0 ? T.noPtln : T.noneFiltered;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-[22px] font-bold text-space-2 lg:text-[26px]">{JURUSAN_DETAIL.campuses}</h2>
        {USE_MOCK && <span className="text-[13px] text-prose-dim">{JURUSAN_DETAIL.sampleData}</span>}
      </div>

      {campuses && campuses.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div role="group" aria-label={T.filterType} className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={group === null} onClick={() => pickGroup(null)} className={chip(group === null)}>
              {T.allTypes}
            </button>
            {CAMPUS_GROUPS.map((g) => (
              <button key={g} type="button" aria-pressed={group === g} onClick={() => pickGroup(group === g ? null : g)} className={chip(group === g)}>
                {g}
                <span className={`text-xs font-medium ${group === g ? "text-white/80" : "text-prose-dim"}`}>{counts[g]}</span>
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-prose">
            <MapPin size={16} aria-hidden="true" />
            <span className="sr-only">{T.filterCity}</span>
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setExpanded(false);
              }}
              className="h-9 min-w-0 max-w-[220px] rounded-lg border-[1.5px] border-rim bg-white px-2.5 text-[13px] font-medium text-space-1 focus:border-orbit-1 focus:outline-none"
            >
              <option value="">{T.allCities}</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {campuses === null && !failed ? (
        <p className="py-6 text-sm text-prose">{T.loading}</p>
      ) : failed ? (
        <p className="py-6 text-sm text-prose">{T.error}</p>
      ) : filtered.length === 0 ? (
        <p className="rounded-2xl bg-surface-soft px-5 py-6 text-sm text-prose">{emptyMessage}</p>
      ) : (
        <>
          <ul className="flex flex-col border-t border-rim">
            {visible.map((x) => (
              <li key={x.id} className="flex items-center gap-3 border-b border-rim py-4 sm:gap-4 sm:py-[18px]">
                {x.logoUrl ? (
                  <img src={x.logoUrl} alt="" className="h-[52px] w-[52px] shrink-0 rounded-xl object-contain" />
                ) : (
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-[1.5px] border-dashed border-rim-strong text-[10px] text-prose-dim sm:h-[52px] sm:w-[52px]">
                    {T.logo}
                  </span>
                )}
                <div className="flex min-w-0 grow flex-col">
                  <span className="text-[15px] font-semibold text-space-2 sm:text-base">{x.universityName}</span>
                  <span className="text-[13px] text-prose">
                    {x.majorName}, {x.city}
                  </span>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${GROUP_BADGE[x.group]}`}>{x.group}</span>
              </li>
            ))}
          </ul>
          {filtered.length > INITIAL_VISIBLE && (
            <button type="button" onClick={() => setExpanded((v) => !v)} className="flex h-11 items-center self-start text-[15px] font-semibold text-orbit-1 hover:underline">
              {expanded ? T.showLess : T.showAll(filtered.length)}
            </button>
          )}
        </>
      )}
    </section>
  );
}
