import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store/store";

/** A serializable subset of the Firebase user (Redux state must be serializable). */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  user: AuthUser | null;
  // `true` until the first Firebase auth state callback resolves.
  initializing: boolean;
}

const initialState: AuthState = {
  user: null,
  initializing: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.initializing = false;
    },
    setAuthReady(state) {
      state.initializing = false;
    },
  },
});

export const { setUser, setAuthReady } = authSlice.actions;
export default authSlice.reducer;

export const selectUser = (s: RootState) => s.auth.user;
export const selectIsAuthed = (s: RootState) => Boolean(s.auth.user);
export const selectAuthInitializing = (s: RootState) => s.auth.initializing;
