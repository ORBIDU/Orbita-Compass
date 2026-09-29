import { NavLink } from "react-router-dom";
import { PORTAL_NAV_AFTER, PORTAL_NAV_BEFORE, type NavItem } from "@/config/navigation";
import PersiapanMenu from "./PersiapanMenu";
import { navItemClasses } from "./navStyles";

function Item({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink to={item.to} end={item.end} className={({ isActive }) => navItemClasses(isActive)}>
      <Icon size={16} />
      {item.label}
    </NavLink>
  );
}

/** Menu utama portal untuk layar lebar (≥ 1024px). Di HP diganti MobileDrawer. */
export default function PortalNav() {
  return (
    <nav aria-label="Menu utama" className="hidden border-t border-line-soft bg-white lg:block">
      <div className="mx-auto flex max-w-[1280px] items-center gap-1 px-6 py-2">
        {PORTAL_NAV_BEFORE.map((item) => (
          <Item key={item.to} item={item} />
        ))}
        <PersiapanMenu />
        {PORTAL_NAV_AFTER.map((item) => (
          <Item key={item.to} item={item} />
        ))}
      </div>
    </nav>
  );
}
