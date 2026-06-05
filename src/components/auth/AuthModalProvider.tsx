"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import AuthListener from "@/lib/features/auth/AuthListener";
import AuthModal from "./AuthModal";

type Mode = "login" | "signup";

interface AuthModalContextValue {
  /** Open the auth modal, optionally choosing the initial tab. */
  openAuthModal: (mode?: Mode) => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error("useAuthModal must be used within <AuthModalProvider>");
  }
  return ctx;
}

/**
 * Provides app-wide control of the auth modal and keeps the Redux auth state
 * synced with Firebase via <AuthListener />.
 */
export default function AuthModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("login");

  const openAuthModal = useCallback((m: Mode = "login") => {
    setMode(m);
    setOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ openAuthModal, closeAuthModal }),
    [openAuthModal, closeAuthModal]
  );

  return (
    <AuthModalContext.Provider value={value}>
      <AuthListener />
      {children}
      {open && <AuthModal initialMode={mode} onClose={closeAuthModal} />}
    </AuthModalContext.Provider>
  );
}
