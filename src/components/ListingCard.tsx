"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import type { Listing } from "@/lib/types";

export default function ListingCard({ listing }: { listing: Listing }) {
  const [liked, setLiked] = useState(false);
  const cover = listing.images[0];

  return (
    <Link href={`/listings/${listing.id}`} className="group block">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100">
        {cover ? (
          <Image
            src={cover}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-400">
            No photo
          </div>
        )}

        <button
          type="button"
          aria-label={liked ? "Remove from wishlist" : "Save to wishlist"}
          onClick={(e) => {
            e.preventDefault();
            setLiked((v) => !v);
          }}
          className="absolute right-3 top-3 transition hover:scale-110"
        >
          <Heart
            className={`h-6 w-6 drop-shadow ${
              liked ? "fill-rose-500 text-rose-500" : "fill-black/30 text-white"
            }`}
            strokeWidth={2}
          />
        </button>

        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-neutral-800 shadow-sm">
          {listing.category}
        </span>
      </div>

      <div className="mt-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold text-neutral-900">
            {listing.location}
          </h3>
          <p className="truncate text-sm text-neutral-500">{listing.title}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-sm text-neutral-900">
          <Star className="h-3.5 w-3.5 fill-current" />
          {listing.rating.toFixed(2)}
        </div>
      </div>

      <p className="mt-1 text-sm text-neutral-900">
        <span className="font-semibold">${listing.pricePerNight}</span>
        <span className="text-neutral-500"> night</span>
      </p>
    </Link>
  );
}
