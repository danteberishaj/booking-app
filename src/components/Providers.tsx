"use client";

import type { ReactNode } from "react";
import StoreProvider from "@/lib/store/StoreProvider";
import AuthListener from "@/lib/features/auth/AuthListener";

/**
 * App-wide client providers. StoreProvider must wrap AuthListener since the
 * listener dispatches into the Redux store.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <AuthListener />
      {children}
    </StoreProvider>
  );
}
