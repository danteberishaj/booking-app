"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/features/auth/useAuth";

/** Client-side route guard: only signed-in users can reach the host form. */
export default function HostGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthed, initializing } = useAuth();

  useEffect(() => {
    if (!initializing && !isAuthed) {
      router.replace("/login?redirect=/host");
    }
  }, [initializing, isAuthed, router]);

  if (initializing || !isAuthed) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  return <>{children}</>;
}
