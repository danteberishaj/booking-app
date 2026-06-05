"use client";

import { useEffect } from "react";
import { SearchX } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  loadListings,
  selectFilteredListings,
  selectListingsStatus,
} from "@/lib/features/listings/listingsSlice";
import ListingCard from "./ListingCard";

const GRID = "grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export default function ListingsGrid() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectListingsStatus);
  const listings = useAppSelector(selectFilteredListings);

  useEffect(() => {
    if (status === "idle") dispatch(loadListings());
  }, [status, dispatch]);

  if (status === "loading" || status === "idle") {
    return (
      <div className={GRID}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square w-full rounded-2xl bg-neutral-200" />
            <div className="mt-3 h-4 w-2/3 rounded bg-neutral-200" />
            <div className="mt-2 h-3 w-1/2 rounded bg-neutral-200" />
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <SearchX className="h-10 w-10 text-neutral-300" />
        <h2 className="text-lg font-semibold text-neutral-900">No stays found</h2>
        <p className="max-w-sm text-sm text-neutral-500">
          Try a different category or adjust your search to see more places.
        </p>
      </div>
    );
  }

  return (
    <div className={GRID}>
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
