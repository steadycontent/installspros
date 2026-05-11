import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

/**
 * Returns the admin status for the given session.
 *
 * `loading` is derived synchronously: as soon as the session changes to a
 * user id we have not yet verified, `loading` is true. This avoids a race
 * where a freshly-arrived session is rendered together with a stale
 * `isAdmin=false` from the previous (logged-out) state, causing protected
 * routes to redirect to the homepage before the role check can complete.
 */
export function useAdminRole(session: Session | null) {
  const userId = session?.user?.id ?? null;
  const [checkedUserId, setCheckedUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const inflightFor = useRef<string | null>(null);

  useEffect(() => {
    if (!userId) {
      inflightFor.current = null;
      setCheckedUserId(null);
      setIsAdmin(false);
      return;
    }

    if (inflightFor.current === userId || checkedUserId === userId) return;

    inflightFor.current = userId;
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: userId,
        _role: "admin",
      });
      if (cancelled) return;
      if (error) {
        console.error("[useAdminRole] has_role error", error);
      }
      setIsAdmin(!error && data === true);
      setCheckedUserId(userId);
      inflightFor.current = null;
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, checkedUserId]);

  // Derived synchronously — no stale window between session change and effect.
  const loading = !!userId && checkedUserId !== userId;

  return { isAdmin, loading };
}
