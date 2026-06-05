"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { useAppDispatch } from "@/lib/store/hooks";
import { clearBookings } from "@/lib/features/bookings/bookingsSlice";
import { setAuthReady, setUser } from "./authSlice";

/**
 * Subscribes to Firebase auth changes and mirrors the user into the Redux store.
 * Renders nothing. Mounted once near the root of the app.
 */
export default function AuthListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      dispatch(setAuthReady());
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        dispatch(
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
          })
        );
      } else {
        dispatch(setUser(null));
        dispatch(clearBookings());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return null;
}
