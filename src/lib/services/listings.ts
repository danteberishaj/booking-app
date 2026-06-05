import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { SEED_LISTINGS } from "@/lib/seed";
import type { Listing } from "@/lib/types";

const COLLECTION = "listings";

function normalize(id: string, data: Record<string, unknown>): Listing {
  return {
    id,
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    location: String(data.location ?? ""),
    country: String(data.country ?? ""),
    category: (data.category as Listing["category"]) ?? "Trending",
    pricePerNight: Number(data.pricePerNight ?? 0),
    rating: Number(data.rating ?? 5),
    reviewCount: Number(data.reviewCount ?? 0),
    guests: Number(data.guests ?? 1),
    bedrooms: Number(data.bedrooms ?? 1),
    beds: Number(data.beds ?? 1),
    baths: Number(data.baths ?? 1),
    amenities: Array.isArray(data.amenities) ? (data.amenities as string[]) : [],
    images: Array.isArray(data.images) ? (data.images as string[]) : [],
    hostId: String(data.hostId ?? ""),
    hostName: String(data.hostName ?? "Host"),
    createdAt: Number(data.createdAt ?? Date.now()),
  };
}

/** Fetch all listings. Falls back to seed data when Firebase is off or empty. */
export async function fetchListings(): Promise<Listing[]> {
  if (!isFirebaseConfigured || !db) return SEED_LISTINGS;
  try {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    if (snap.empty) return SEED_LISTINGS;
    return snap.docs.map((d) => normalize(d.id, d.data()));
  } catch (err) {
    console.warn("[listings] Firestore read failed, using seed data.", err);
    return SEED_LISTINGS;
  }
}

/** Fetch a single listing by id, checking seed data as a fallback. */
export async function fetchListingById(id: string): Promise<Listing | null> {
  const fromSeed = SEED_LISTINGS.find((l) => l.id === id) ?? null;
  if (!isFirebaseConfigured || !db) return fromSeed;
  try {
    const ref = doc(db, COLLECTION, id);
    const snap = await getDoc(ref);
    if (snap.exists()) return normalize(snap.id, snap.data());
    return fromSeed;
  } catch (err) {
    console.warn("[listings] Firestore read failed, using seed data.", err);
    return fromSeed;
  }
}

export type NewListingInput = Omit<
  Listing,
  "id" | "rating" | "reviewCount" | "createdAt"
>;

/** Create a listing in Firestore. Requires Firebase to be configured. */
export async function createListing(input: NewListingInput): Promise<string> {
  if (!isFirebaseConfigured || !db) {
    throw new Error(
      "Firebase is not configured. Add your keys to .env.local to publish listings."
    );
  }
  const ref = doc(collection(db, COLLECTION));
  const payload = {
    ...input,
    rating: 5,
    reviewCount: 0,
    createdAt: Date.now(),
    createdAtServer: serverTimestamp(),
  };
  await setDoc(ref, payload);
  return ref.id;
}
