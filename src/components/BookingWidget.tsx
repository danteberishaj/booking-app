"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { differenceInCalendarDays, format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Star } from "lucide-react";
import { useAuth } from "@/lib/features/auth/useAuth";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  makeBooking,
  selectBookingCreating,
} from "@/lib/features/bookings/bookingsSlice";
import DateRangePicker from "@/components/ui/DateRangePicker";
import GuestSelector from "@/components/ui/GuestSelector";
import type { Listing } from "@/lib/types";

const SERVICE_FEE_RATE = 0.12;

export default function BookingWidget({ listing }: { listing: Listing }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthed, user } = useAuth();
  const creating = useAppSelector(selectBookingCreating);

  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const nights = useMemo(() => {
    if (!range?.from || !range?.to) return 0;
    const n = differenceInCalendarDays(range.to, range.from);
    return n > 0 ? n : 0;
  }, [range]);

  const subtotal = nights * listing.pricePerNight;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const total = subtotal + serviceFee;

  async function handleReserve() {
    setError(null);
    if (!isAuthed || !user) {
      router.push(`/login?redirect=/listings/${listing.id}`);
      return;
    }
    if (!range?.from || !range?.to || nights <= 0) {
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
          startDate: format(range.from, "yyyy-MM-dd"),
          endDate: format(range.to, "yyyy-MM-dd"),
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

      <div className="mt-4 space-y-3">
        <DateRangePicker value={range} onChange={setRange} />
        <GuestSelector value={guests} max={listing.guests} onChange={setGuests} />
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
