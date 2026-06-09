"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/dashboard";

    if (!code) {
      router.push("/login?message=Could not authenticate");
      return;
    }

    const supabase = createClient();
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        router.push("/login?message=Could not authenticate");
      } else {
        router.push(next);
      }
    });
  }, [router, searchParams]);

  return null;
}

export default function AuthCallbackPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-white text-sm font-mono">Authenticating...</div>
      <Suspense>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
