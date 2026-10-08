import { NavLink, useLocation } from "react-router-dom";
import { PORTAL_NAV_AFTER, PORTAL_NAV_BEFORE, type NavItem } from "@/config/navigation";
import PersiapanMenu from "./PersiapanMenu";
import { NAV_ICON_CLASS, navItemClasses } from "./navStyles";

function Item({ item }: { item: NavItem }) {
  const Icon = item.icon;
  const { pathname } = useLocation();
  const inSection = item.activeFor?.some((p) => pathname.startsWith(p)) ?? false;
  return (
    <NavLink to={item.to} end={item.end} className={({ isActive }) => navItemClasses(isActive || inSection)}>
      <Icon size={18} aria-hidden="true" className={NAV_ICON_CLASS} />
      {item.label}
    </NavLink>
  );
}

/** Menu portal di dalam header desktop (≥1024px). Di HP diganti BottomNav. */
export default function PortalNav() {
  return (
    <nav aria-label="Menu portal" className="hidden h-full items-stretch gap-0.5 lg:flex">
      {PORTAL_NAV_BEFORE.map((item) => (
        <Item key={item.to} item={item} />
      ))}
      <PersiapanMenu />
      {PORTAL_NAV_AFTER.map((item) => (
        <Item key={item.to} item={item} />
      ))}
    </nav>
  );
}
