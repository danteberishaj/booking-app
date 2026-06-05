// One-off script: insert one listing per category into Firestore.
// Run with:  node --env-file=.env.local scripts/seed-firestore.mjs
import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!config.apiKey || !config.projectId) {
  console.error("Missing Firebase env vars. Run with: node --env-file=.env.local scripts/seed-firestore.mjs");
  process.exit(1);
}

const img = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

// Pool of known-good Unsplash photo IDs reused across listings.
const P = {
  beach: "1499793983690-e29da59ef1c2",
  beach2: "1502672260266-1c1ef2d93688",
  cabin: "1449158743715-0a90ebb6d2d8",
  cabin2: "1518780664697-55e3ad937233",
  city: "1493809842364-78817add7ffb",
  villa: "1512917774080-9991f1c4c750",
  villa2: "1564013799919-ab600027ffc6",
  lake: "1503174971373-b1f69850bded",
  lake2: "1470770841072-f978cf4d019e",
  jungle: "1537953773345-d172ccf13cf1",
  jungle2: "1582610116397-edb318620f90",
  modern: "1600585154340-be6161a56a0c",
  modern2: "1600566753086-00f18fb6b3ea",
  luxe: "1570077188670-e3a8d69ac5ff",
  luxe2: "1469796466635-455ede028aca",
};

// One entry per category. Shared defaults applied below.
const base = [
  { category: "Trending", title: "Bright Downtown Apartment", location: "Lisbon", country: "Portugal", price: 175, imgs: [P.city, P.modern] },
  { category: "Beachfront", title: "Oceanfront Modern Beach House", location: "Malibu, California", country: "United States", price: 420, imgs: [P.beach, P.beach2] },
  { category: "Cabins", title: "Cozy Log Cabin in the Pines", location: "Aspen, Colorado", country: "United States", price: 265, imgs: [P.cabin, P.cabin2] },
  { category: "City", title: "Sunlit Loft in SoHo", location: "New York, New York", country: "United States", price: 310, imgs: [P.city, P.modern2] },
  { category: "Countryside", title: "Rustic Villa in the Hills", location: "Tuscany", country: "Italy", price: 380, imgs: [P.villa, P.villa2] },
  { category: "Lakefront", title: "Lakefront A-Frame Retreat", location: "Lake Tahoe, California", country: "United States", price: 295, imgs: [P.lake, P.lake2] },
  { category: "Design", title: "Mid-Century Modern House", location: "Palm Springs, California", country: "United States", price: 350, imgs: [P.modern, P.modern2] },
  { category: "Luxe", title: "Cliffside Luxury Suite", location: "Santorini", country: "Greece", price: 640, imgs: [P.luxe, P.luxe2] },
  { category: "Tropical", title: "Tropical Jungle Villa with Pool", location: "Ubud, Bali", country: "Indonesia", price: 180, imgs: [P.jungle, P.jungle2] },
  { category: "Mountain", title: "Alpine Chalet with Summit Views", location: "Zermatt", country: "Switzerland", price: 410, imgs: [P.cabin2, P.lake] },
  { category: "Skiing", title: "Ski-in Ski-out Snow Lodge", location: "Niseko", country: "Japan", price: 460, imgs: [P.cabin, P.lake2] },
  { category: "Camping", title: "Luxury Glamping Dome", location: "Moab, Utah", country: "United States", price: 140, imgs: [P.jungle, P.cabin] },
  { category: "Castles", title: "Stay in a Restored Castle", location: "Loire Valley", country: "France", price: 720, imgs: [P.villa2, P.luxe] },
  { category: "Mansions", title: "Grand Hillside Mansion", location: "Beverly Hills, California", country: "United States", price: 980, imgs: [P.modern2, P.luxe] },
  { category: "Treehouses", title: "Magical Forest Treehouse", location: "Portland, Oregon", country: "United States", price: 210, imgs: [P.cabin, P.jungle2] },
  { category: "Boats", title: "Houseboat on the Canals", location: "Amsterdam", country: "Netherlands", price: 230, imgs: [P.lake, P.city] },
  { category: "Farms", title: "Charming Countryside Farmhouse", location: "Cotswolds", country: "United Kingdom", price: 195, imgs: [P.villa, P.cabin2] },
  { category: "Vineyards", title: "Vineyard Estate with Terrace", location: "Napa Valley, California", country: "United States", price: 540, imgs: [P.villa2, P.modern] },
  { category: "Desert", title: "Desert Oasis with Plunge Pool", location: "Marrakech", country: "Morocco", price: 260, imgs: [P.modern, P.luxe2] },
];

const HOSTS = ["Sofia", "Marcus", "Priya", "Luca", "Hannah", "Wayan", "Elena", "Niko", "Amara"];
const AMENITIES = ["Wifi", "Kitchen", "Free parking", "Air conditioning", "Pool", "Workspace", "Fireplace", "Garden"];

const app = initializeApp(config);
const db = getFirestore(app);

let count = 0;
for (let i = 0; i < base.length; i++) {
  const b = base[i];
  const ref = doc(collection(db, "listings"));
  const payload = {
    title: b.title,
    description: `A wonderful ${b.category.toLowerCase()} stay in ${b.location}. ${b.title} offers a comfortable, well-appointed space perfect for your next getaway.`,
    location: b.location,
    country: b.country,
    category: b.category,
    pricePerNight: b.price,
    rating: Math.round((4.6 + Math.random() * 0.39) * 100) / 100,
    reviewCount: 40 + Math.floor(Math.random() * 280),
    guests: 2 + (i % 7),
    bedrooms: 1 + (i % 4),
    beds: 1 + (i % 5),
    baths: 1 + (i % 3),
    amenities: AMENITIES.slice(0, 4 + (i % 4)),
    images: b.imgs.map(img),
    hostId: `seed-host-${(i % HOSTS.length) + 1}`,
    hostName: HOSTS[i % HOSTS.length],
    createdAt: Date.now() - i * 1000 * 60 * 60,
    createdAtServer: serverTimestamp(),
  };
  await setDoc(ref, payload);
  count++;
  console.log(`✓ [${b.category}] ${b.title}  (${ref.id})`);
}

console.log(`\nDone. Inserted ${count} listings.`);
process.exit(0);
