import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import type { Booking } from "@/lib/types";

const COLLECTION = "bookings";

export type NewBookingInput = Omit<Booking, "id" | "createdAt">;

/** Persist a booking. Requires Firebase to be configured. */
export async function createBooking(input: NewBookingInput): Promise<Booking> {
  if (!isFirebaseConfigured || !db) {
    throw new Error(
      "Firebase is not configured. Add your keys to .env.local to make a reservation."
    );
  }
  const ref = doc(collection(db, COLLECTION));
  const createdAt = Date.now();
  await setDoc(ref, { ...input, createdAt, createdAtServer: serverTimestamp() });
  return { ...input, id: ref.id, createdAt };
}

/** Fetch all bookings belonging to a user, newest first. */
export async function fetchUserBookings(userId: string): Promise<Booking[]> {
  if (!isFirebaseConfigured || !db) return [];
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      listingId: String(data.listingId ?? ""),
      listingTitle: String(data.listingTitle ?? ""),
      listingImage: String(data.listingImage ?? ""),
      userId: String(data.userId ?? ""),
      startDate: String(data.startDate ?? ""),
      endDate: String(data.endDate ?? ""),
      guests: Number(data.guests ?? 1),
      nights: Number(data.nights ?? 1),
      totalPrice: Number(data.totalPrice ?? 0),
      createdAt: Number(data.createdAt ?? Date.now()),
    } satisfies Booking;
  });
}
