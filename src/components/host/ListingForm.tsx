"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Plus, X } from "lucide-react";
import { CATEGORY_OPTIONS } from "@/lib/categories";
import { useAuth } from "@/lib/features/auth/useAuth";
import { publishListing } from "@/lib/features/listings/listingsSlice";
import { uploadListingImage } from "@/lib/services/storage";
import { useAppDispatch } from "@/lib/store/hooks";
import type { Category } from "@/lib/types";

const CATEGORIES = CATEGORY_OPTIONS.filter((c) => c.value !== "All");
const AMENITY_OPTIONS = [
  "Wifi",
  "Kitchen",
  "Free parking",
  "Air conditioning",
  "Pool",
  "Hot tub",
  "Workspace",
  "Fireplace",
  "Garden",
  "BBQ grill",
  "Washer",
  "TV",
];

const numberFields = [
  { name: "pricePerNight", label: "Price / night ($)", min: 1 },
  { name: "guests", label: "Max guests", min: 1 },
  { name: "bedrooms", label: "Bedrooms", min: 0 },
  { name: "beds", label: "Beds", min: 1 },
  { name: "baths", label: "Baths", min: 1 },
] as const;

export default function ListingForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState<Category>("Trending");
  const [nums, setNums] = useState({
    pricePerNight: 150,
    guests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1,
  });
  const [amenities, setAmenities] = useState<string[]>(["Wifi", "Kitchen"]);
  const [images, setImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setNum(name: string, value: number) {
    setNums((n) => ({ ...n, [name]: value }));
  }

  function toggleAmenity(a: string) {
    setAmenities((cur) =>
      cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]
    );
  }

  async function handleFiles(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !user) return;
    setError(null);
    setUploading(true);
    try {
      for (const file of files) {
        const url = await uploadListingImage(file, user.uid);
        setImages((cur) => [...cur, url]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Upload failed. Try pasting an image URL."
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function addUrl() {
    const url = urlInput.trim();
    if (!url) return;
    setImages((cur) => [...cur, url]);
    setUrlInput("");
  }

  function removeImage(i: number) {
    setImages((cur) => cur.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!user) {
      router.push("/login?redirect=/host");
      return;
    }
    if (images.length === 0) {
      setError("Add at least one image (upload a file or paste a URL).");
      return;
    }
    setSubmitting(true);
    try {
      const listing = await dispatch(
        publishListing({
          title,
          description,
          location,
          country,
          category,
          pricePerNight: Number(nums.pricePerNight),
          guests: Number(nums.guests),
          bedrooms: Number(nums.bedrooms),
          beds: Number(nums.beds),
          baths: Number(nums.baths),
          amenities,
          images,
          hostId: user.uid,
          hostName: user.displayName || user.email || "Host",
        })
      ).unwrap();
      router.push(`/listings/${listing.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not publish listing.");
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-900";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basics */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900">The basics</h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">Title</label>
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sunlit loft with skyline views"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Description
          </label>
          <textarea
            className={`${inputClass} min-h-28 resize-y`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what makes your place special…"
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              City / area
            </label>
            <input
              className={inputClass}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Lisbon"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Country
            </label>
            <input
              className={inputClass}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Portugal"
              required
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Category
          </label>
          <select
            className={inputClass}
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Numbers */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900">Details & price</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {numberFields.map((f) => (
            <div key={f.name}>
              <label className="mb-1 block text-xs font-medium text-neutral-700">
                {f.label}
              </label>
              <input
                type="number"
                min={f.min}
                className={inputClass}
                value={nums[f.name]}
                onChange={(e) => setNum(f.name, Number(e.target.value))}
                required
              />
            </div>
          ))}
        </div>
      </section>

      {/* Amenities */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900">Amenities</h2>
        <div className="flex flex-wrap gap-2">
          {AMENITY_OPTIONS.map((a) => {
            const active = amenities.includes(a);
            return (
              <button
                key={a}
                type="button"
                onClick={() => toggleAmenity(a)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  active
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 text-neutral-700 hover:border-neutral-900"
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>
      </section>

      {/* Photos */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900">Photos</h2>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-neutral-400 px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-900">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImagePlus className="h-4 w-4" />
            )}
            {uploading ? "Uploading…" : "Upload images"}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              className="hidden"
              disabled={uploading}
            />
          </label>

          <div className="flex flex-1 items-center gap-2">
            <input
              className={inputClass}
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="…or paste an image URL"
            />
            <button
              type="button"
              onClick={addUrl}
              className="flex shrink-0 items-center gap-1 rounded-lg border border-neutral-300 px-3 py-2.5 text-sm font-medium hover:border-neutral-900"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="group relative aspect-square overflow-hidden rounded-xl bg-neutral-100"
              >
                <Image
                  src={src}
                  alt={`Photo ${i + 1}`}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  aria-label="Remove photo"
                  className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1 shadow hover:bg-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting || uploading}
        className="w-full rounded-lg bg-rose-500 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {submitting ? "Publishing…" : "Publish listing"}
      </button>
    </form>
  );
}
