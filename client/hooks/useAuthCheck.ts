import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export function useAuthCheck() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data.user);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const requireAuth = (callback: () => void): boolean => {
    if (!isAuthenticated) {
      return false;
    }
    callback();
    return true;
  };

  const redirectIfNotAuth = (targetUrl: string) => {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(targetUrl)}`);
      return false;
    }
    router.push(targetUrl);
    return true;
  };

  return { isAuthenticated, loading, requireAuth, redirectIfNotAuth };
}
