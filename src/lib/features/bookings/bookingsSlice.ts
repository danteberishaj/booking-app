import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createBooking,
  fetchUserBookings,
  type NewBookingInput,
} from "@/lib/services/bookings";
import type { RootState } from "@/lib/store/store";
import type { Booking } from "@/lib/types";

interface BookingsState {
  items: Booking[];
  status: "idle" | "loading" | "succeeded" | "failed";
  creating: boolean;
  error: string | null;
}

const initialState: BookingsState = {
  items: [],
  status: "idle",
  creating: false,
  error: null,
};

export const loadUserBookings = createAsyncThunk(
  "bookings/loadForUser",
  async (userId: string) => fetchUserBookings(userId)
);

export const makeBooking = createAsyncThunk(
  "bookings/create",
  async (input: NewBookingInput) => createBooking(input)
);

const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearBookings(state) {
      state.items = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserBookings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadUserBookings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(loadUserBookings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load bookings";
      })
      .addCase(makeBooking.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(makeBooking.fulfilled, (state, action) => {
        state.creating = false;
        state.items.unshift(action.payload);
      })
      .addCase(makeBooking.rejected, (state, action) => {
        state.creating = false;
        state.error = action.error.message ?? "Failed to create booking";
      });
  },
});

export const { clearBookings } = bookingsSlice.actions;
export default bookingsSlice.reducer;

export const selectBookings = (s: RootState) => s.bookings.items;
export const selectBookingsStatus = (s: RootState) => s.bookings.status;
export const selectBookingCreating = (s: RootState) => s.bookings.creating;
export const selectBookingsError = (s: RootState) => s.bookings.error;
