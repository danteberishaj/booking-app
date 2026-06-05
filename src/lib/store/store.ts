import { configureStore } from "@reduxjs/toolkit";
import listingsReducer from "@/lib/features/listings/listingsSlice";
import bookingsReducer from "@/lib/features/bookings/bookingsSlice";
import authReducer from "@/lib/features/auth/authSlice";

/**
 * A new store is created per request on the server to avoid leaking state
 * across users (Next.js App Router pattern).
 */
export const makeStore = () =>
  configureStore({
    reducer: {
      listings: listingsReducer,
      bookings: bookingsReducer,
      auth: authReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
