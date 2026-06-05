import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Bath, BedDouble, Check, MapPin, Star, Users } from "lucide-react";
import { fetchListingById } from "@/lib/services/listings";
import BookingWidget from "@/components/BookingWidget";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const listing = await fetchListingById(id);
  return {
    title: listing ? `${listing.title} · StayFinder` : "Listing · StayFinder",
  };
}

export default async function ListingPage({ params }: Params) {
  const { id } = await params;
  const listing = await fetchListingById(id);
  if (!listing) notFound();

  const [cover, ...rest] = listing.images;
  const facts = [
    { Icon: Users, label: `${listing.guests} guests` },
    { Icon: BedDouble, label: `${listing.bedrooms} bedrooms · ${listing.beds} beds` },
    { Icon: Bath, label: `${listing.baths} baths` },
  ];

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-10">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
        {listing.title}
      </h1>
      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-700">
        <span className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-current" />
          {listing.rating.toFixed(2)}
        </span>
        <span>· {listing.reviewCount} reviews ·</span>
        <span className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {listing.location}, {listing.country}
        </span>
      </div>

      {/* Gallery */}
      <div className="mt-5 flex h-[300px] gap-2 overflow-hidden rounded-2xl sm:h-[440px]">
        <div className="relative flex-1">
          {cover && (
            <Image
              src={cover}
              alt={listing.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          )}
        </div>
        {rest.length > 0 && (
          <div className="hidden flex-1 flex-col gap-2 sm:flex">
            {rest.slice(0, 2).map((src, i) => (
              <div key={i} className="relative flex-1">
                <Image
                  src={src}
                  alt={`${listing.title} photo ${i + 2}`}
                  fill
                  sizes="40vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Body: info + booking */}
      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex items-center justify-between border-b border-neutral-200 pb-6">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">
                Hosted by {listing.hostName}
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                {facts.map((f) => f.label).join(" · ")}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-lg font-semibold text-white">
              {listing.hostName.charAt(0)}
            </div>
          </div>

          <div className="flex flex-wrap gap-6 border-b border-neutral-200 py-6">
            {facts.map(({ Icon, label }) => (
              <span key={label} className="flex items-center gap-2 text-sm text-neutral-700">
                <Icon className="h-5 w-5 text-neutral-500" strokeWidth={1.6} />
                {label}
              </span>
            ))}
          </div>

          <p className="whitespace-pre-line border-b border-neutral-200 py-6 leading-relaxed text-neutral-700">
            {listing.description}
          </p>

          <div className="py-6">
            <h3 className="mb-4 text-lg font-semibold text-neutral-900">
              What this place offers
            </h3>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {listing.amenities.map((a) => (
                <li key={a} className="flex items-center gap-3 text-sm text-neutral-700">
                  <Check className="h-5 w-5 text-rose-500" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Booking widget */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <BookingWidget listing={listing} />
        </aside>
      </div>
    </div>
  );
}
