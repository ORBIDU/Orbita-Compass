import { useEffect, useState } from "react";
import { Link, useRouteError } from "react-router-dom";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { ERROR_PAGE, PAGE_TITLES } from "@/content/common";
import { ROUTES } from "@/config/navigation";
import { useAuth } from "@/context/AuthContext";
import { claimReload, isChunkLoadError } from "@/lib/reloadOnce";
import PageLoader from "@/components/ui/PageLoader";
import { usePageTitle } from "@/lib/usePageTitle";

/**
 * Halaman error untuk `errorElement` router: tampil kalau komponen crash atau
 * file halaman gagal dimuat. File halaman yang gagal dimuat (biasanya karena
 * situs baru di-update) dimuat ulang otomatis sekali dulu.
 * `inLayout` = tampil di dalam kerangka portal/publik (header tetap ada).
 */
export default function ErrorPage({ inLayout = false }: { inLayout?: boolean }) {
  usePageTitle(PAGE_TITLES.error);
  const error = useRouteError();
  const { status } = useAuth();
  const [reloading] = useState(() => isChunkLoadError(error) && claimReload());

  useEffect(() => {
    if (reloading) window.location.reload();
  }, [reloading]);

  if (reloading) return <PageLoader fullscreen={!inLayout} label={ERROR_PAGE.updating} />;

  const loggedIn = status === "authenticated";
  const content = (
    <div role="alert" className="mx-auto flex max-w-md flex-col items-center gap-3 px-6 py-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-tint-orange-bg text-tint-orange-fg">
        <TriangleAlert size={26} aria-hidden="true" />
      </span>
      <h1 className="text-xl font-bold text-space-2">{ERROR_PAGE.title}</h1>
      <p className="text-sm leading-relaxed text-prose">{ERROR_PAGE.body}</p>
      <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-orbit-1 px-5 text-sm font-semibold text-white hover:brightness-95"
        >
          <RotateCcw size={16} aria-hidden="true" />
          {ERROR_PAGE.reload}
        </button>
        <Link
          to={loggedIn ? ROUTES.portal : ROUTES.landing}
          reloadDocument
          className="inline-flex h-11 items-center justify-center rounded-xl border-[1.5px] border-rim px-5 text-sm font-semibold text-space-1 hover:bg-surface-soft"
        >
          {loggedIn ? ERROR_PAGE.portal : ERROR_PAGE.home}
        </Link>
      </div>
      {import.meta.env.DEV && error != null && (
        <details className="mt-4 w-full rounded-xl bg-surface-soft p-3 text-left text-xs text-prose">
          <summary className="cursor-pointer font-semibold">{ERROR_PAGE.detail}</summary>
          <pre className="mt-2 whitespace-pre-wrap break-words">{error instanceof Error ? (error.stack ?? error.message) : JSON.stringify(error)}</pre>
        </details>
      )}
    </div>
  );

  if (inLayout) return <div className="flex flex-1 items-center justify-center overflow-y-auto">{content}</div>;
  return <main className="portal-site flex min-h-dvh items-center justify-center bg-surface-soft">{content}</main>;
}
