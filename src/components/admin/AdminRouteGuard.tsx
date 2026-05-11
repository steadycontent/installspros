import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminRole } from "@/hooks/useAdminRole";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

/**
 * Centralized gate for /admin routes. Waits for both auth and role checks
 * before deciding to render or redirect, eliminating the race that was
 * sending logged-in admins back to the homepage.
 */
export function AdminRouteGuard({ children }: Props) {
  const { session, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminRole(session);
  const location = useLocation();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // Not authorized — send to login rather than silently to homepage so
    // the user gets a clear path forward.
    return <Navigate to="/admin/login" state={{ from: location, reason: "not_admin" }} replace />;
  }

  return <>{children}</>;
}
