"use client";

import { useCallback } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { useAppSelector } from "@/lib/store/hooks";
import {
  selectAuthInitializing,
  selectIsAuthed,
  selectUser,
} from "./authSlice";

const NOT_CONFIGURED =
  "Firebase isn't configured yet. Add your keys to .env.local to enable sign-in.";

/**
 * Auth facade: reads the current user from the Redux store and exposes the
 * Firebase auth actions. The store is kept in sync by <AuthListener />.
 */
export function useAuth() {
  const user = useAppSelector(selectUser);
  const isAuthed = useAppSelector(selectIsAuthed);
  const initializing = useAppSelector(selectAuthInitializing);

  const signInEmail = useCallback(async (email: string, password: string) => {
    if (!auth) throw new Error(NOT_CONFIGURED);
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUpEmail = useCallback(
    async (name: string, email: string, password: string) => {
      if (!auth) throw new Error(NOT_CONFIGURED);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
    },
    []
  );

  const signInGoogle = useCallback(async () => {
    if (!auth) throw new Error(NOT_CONFIGURED);
    await signInWithPopup(auth, new GoogleAuthProvider());
  }, []);

  const logout = useCallback(async () => {
    if (!auth) return;
    await signOut(auth);
  }, []);

  return {
    user,
    isAuthed,
    initializing,
    isConfigured: isFirebaseConfigured,
    signInEmail,
    signUpEmail,
    signInGoogle,
    logout,
  };
}
