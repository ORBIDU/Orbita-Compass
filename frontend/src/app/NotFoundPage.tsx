import { Compass } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/config/navigation";
import { ButtonLink } from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { usePageTitle } from "@/lib/usePageTitle";
import { NOT_FOUND, PAGE_TITLES } from "@/content/common";

export default function NotFoundPage() {
  usePageTitle(PAGE_TITLES.notFound);
  const { status } = useAuth();
  const loggedIn = status === "authenticated";
  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto px-4 py-10">
      <EmptyState
        icon={Compass}
        headingLevel={1}
        title={NOT_FOUND.title}
        description={NOT_FOUND.body}
        action={
          <ButtonLink to={loggedIn ? ROUTES.portal : ROUTES.landing}>
            {loggedIn ? NOT_FOUND.toPortal : NOT_FOUND.toHome}
          </ButtonLink>
        }
      />
    </div>
  );
}
