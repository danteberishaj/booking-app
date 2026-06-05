import type { Metadata } from "next";
import TripsList from "@/components/trips/TripsList";

export const metadata: Metadata = { title: "My trips · StayFinder" };

export default function TripsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-3xl font-bold text-neutral-900">Trips</h1>
      <TripsList />
    </div>
  );
}
