"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { differenceInCalendarDays } from "date-fns";
import { Star } from "lucide-react";
import { useAuth } from "@/lib/features/auth/useAuth";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  makeBooking,
  selectBookingCreating,
} from "@/lib/features/bookings/bookingsSlice";
import type { Listing } from "@/lib/types";

const SERVICE_FEE_RATE = 0.12;
const todayISO = () => new Date().toISOString().slice(0, 10);

export default function BookingWidget({ listing }: { listing: Listing }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthed, user } = useAuth();
  const creating = useAppSelector(selectBookingCreating);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const n = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    return n > 0 ? n : 0;
  }, [checkIn, checkOut]);

  const subtotal = nights * listing.pricePerNight;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const total = subtotal + serviceFee;

  async function handleReserve() {
    setError(null);
    if (!isAuthed || !user) {
      router.push(`/login?redirect=/listings/${listing.id}`);
      return;
    }
    if (nights <= 0) {
      setError("Please choose valid check-in and check-out dates.");
      return;
    }
    try {
      await dispatch(
        makeBooking({
          listingId: listing.id,
          listingTitle: listing.title,
          listingImage: listing.images[0] ?? "",
          userId: user.uid,
          startDate: checkIn,
          endDate: checkOut,
          guests,
          nights,
          totalPrice: total,
        })
      ).unwrap();
      setDone(true);
      router.push("/trips");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not complete booking.");
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-200 p-6 shadow-lg">
      <div className="flex items-baseline justify-between">
        <p className="text-xl">
          <span className="font-semibold">${listing.pricePerNight}</span>
          <span className="text-neutral-500"> night</span>
        </p>
        <span className="flex items-center gap-1 text-sm text-neutral-700">
          <Star className="h-3.5 w-3.5 fill-current" />
          {listing.rating.toFixed(2)} · {listing.reviewCount} reviews
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-neutral-300">
        <div className="grid grid-cols-2">
          <label className="border-r border-neutral-300 p-3">
            <span className="block text-[10px] font-bold uppercase tracking-wide text-neutral-700">
              Check-in
            </span>
            <input
              type="date"
              min={todayISO()}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="mt-1 w-full bg-transparent text-sm outline-none"
            />
          </label>
          <label className="p-3">
            <span className="block text-[10px] font-bold uppercase tracking-wide text-neutral-700">
              Checkout
            </span>
            <input
              type="date"
              min={checkIn || todayISO()}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="mt-1 w-full bg-transparent text-sm outline-none"
            />
          </label>
        </div>
        <label className="block border-t border-neutral-300 p-3">
          <span className="block text-[10px] font-bold uppercase tracking-wide text-neutral-700">
            Guests
          </span>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="mt-1 w-full bg-transparent text-sm outline-none"
          >
            {Array.from({ length: listing.guests }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} guest{i + 1 > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

      <button
        onClick={handleReserve}
        disabled={creating || done}
        className="mt-4 w-full rounded-lg bg-rose-500 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60"
      >
        {creating ? "Reserving…" : nights > 0 ? "Reserve" : "Check availability"}
      </button>

      {!isAuthed && (
        <p className="mt-2 text-center text-xs text-neutral-500">
          You&apos;ll need to log in to complete your booking.
        </p>
      )}

      {nights > 0 && (
        <div className="mt-5 space-y-2 text-sm text-neutral-700">
          <div className="flex justify-between">
            <span className="underline">
              ${listing.pricePerNight} × {nights} night{nights > 1 ? "s" : ""}
            </span>
            <span>${subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline">Service fee</span>
            <span>${serviceFee}</span>
          </div>
          <div className="flex justify-between border-t border-neutral-200 pt-3 font-semibold text-neutral-900">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      )}
    </div>
  );
}
