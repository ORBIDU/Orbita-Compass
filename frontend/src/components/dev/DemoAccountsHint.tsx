import { AUTH_DEMO_HINT } from "@/mocks/demoAccounts";

/** Petunjuk akun demo di halaman Masuk. Hanya dimuat saat VITE_USE_MOCK=true (MasukForm). */
export default function DemoAccountsHint() {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-surface-soft px-4 py-2.5 text-center text-xs text-prose">
      <p>
        {AUTH_DEMO_HINT.label}, password <span className="font-semibold text-space-1">{AUTH_DEMO_HINT.password}</span>
      </p>
      <ul className="flex flex-col gap-0.5">
        {AUTH_DEMO_HINT.accounts.map((a) => (
          <li key={a.email}>
            <span className="font-semibold text-space-1">{a.email}</span> ({a.note})
          </li>
        ))}
      </ul>
    </div>
  );
}
