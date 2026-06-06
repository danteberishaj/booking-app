"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { CalendarDays, Loader2, MapPin, Plane } from "lucide-react";
import { useAuth } from "@/lib/features/auth/useAuth";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  loadUserBookings,
  selectBookings,
  selectBookingsError,
  selectBookingsStatus,
} from "@/lib/features/bookings/bookingsSlice";

const fmt = (iso: string) => {
  try {
    return format(parseISO(iso), "MMM d, yyyy");
  } catch {
    return iso;
  }
};

export default function TripsList() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthed, initializing } = useAuth();
  const bookings = useAppSelector(selectBookings);
  const status = useAppSelector(selectBookingsStatus);
  const error = useAppSelector(selectBookingsError);

  useEffect(() => {
    if (!initializing && !isAuthed) router.replace("/login?redirect=/trips");
  }, [initializing, isAuthed, router]);

  useEffect(() => {
    if (isAuthed && user) dispatch(loadUserBookings(user.uid));
  }, [isAuthed, user, dispatch]);

  if (initializing || !isAuthed || status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <p className="font-medium">Couldn&apos;t load your trips.</p>
        <p className="mt-1 break-words">{error}</p>
        <p className="mt-2 text-amber-700">
          If this mentions a missing index, open the link in the message to create
          it in the Firebase console, then refresh.
        </p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <Plane className="h-10 w-10 text-neutral-300" />
        <h2 className="text-lg font-semibold text-neutral-900">No trips booked… yet!</h2>
        <p className="max-w-sm text-sm text-neutral-500">
          Time to dust off your bags and start planning your next adventure.
        </p>
        <Link
          href="/"
          className="mt-2 rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
        >
          Start searching
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {bookings.map((b) => (
        <li key={b.id}>
          <Link
            href={`/listings/${b.listingId}`}
            className="flex h-full flex-col gap-4 rounded-2xl border border-neutral-200 p-3 transition hover:shadow-md sm:flex-row"
          >
            <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:h-32 sm:w-48">
              {b.listingImage && (
                <Image
                  src={b.listingImage}
                  alt={b.listingTitle}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between py-1">
              <div>
                <h3 className="font-semibold text-neutral-900">{b.listingTitle}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-600">
                  <CalendarDays className="h-4 w-4" />
                  {fmt(b.startDate)} → {fmt(b.endDate)} · {b.nights} night
                  {b.nights > 1 ? "s" : ""}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-600">
                  <MapPin className="h-4 w-4" />
                  {b.guests} guest{b.guests > 1 ? "s" : ""}
                </p>
              </div>
              <p className="mt-2 text-sm font-semibold text-neutral-900">
                Total paid: ${b.totalPrice}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
