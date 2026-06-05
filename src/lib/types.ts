export type Category =
  | "Beachfront"
  | "Cabins"
  | "Trending"
  | "City"
  | "Countryside"
  | "Lakefront"
  | "Design"
  | "Luxe"
  | "Tropical";

export const CATEGORIES: Category[] = [
  "Trending",
  "Beachfront",
  "Cabins",
  "City",
  "Countryside",
  "Lakefront",
  "Design",
  "Tropical",
  "Luxe",
];

export interface Listing {
  id: string;
  title: string;
  description: string;
  location: string;
  country: string;
  category: Category;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  amenities: string[];
  images: string[];
  hostId: string;
  hostName: string;
  createdAt: number;
}

export interface Booking {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  userId: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  guests: number;
  nights: number;
  totalPrice: number;
  createdAt: number;
}
