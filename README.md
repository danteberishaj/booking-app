# StayFinder 🏡

A full-stack, Airbnb-style booking app built as a portfolio project with **Next.js (App Router)**, **Redux Toolkit**, **Firebase**, and **Tailwind CSS**.

Browse unique stays, filter by category, view rich listing pages, book with a live date-range picker, host your own places, and review your trips — all backed by Firebase Auth, Firestore, and Storage.

> 💡 The app ships with seed data, so it runs and looks complete **before** you add any Firebase keys. Wire in your own project whenever you're ready.

---

## ✨ Features

- **Browse & search** — responsive listing grid (up to 5 per row) with 19 category filters and live location search.
- **Listing details** — photo gallery, amenities, host info, and a sticky booking widget.
- **Bookings** — a cute calendar date-range picker + guest stepper that computes nights, fees, and totals, and saves reservations to Firestore.
- **Authentication** — Email/Password and Google sign-in on dedicated `/login` and `/signup` routes.
- **Hosting** — a protected `/host` form to publish listings, with image upload to Firebase Storage (and a paste-a-URL fallback).
- **My trips** — the signed-in user's bookings listed on `/trips`.
- **State management** — Redux Toolkit slices (listings, bookings, auth) with async thunks, memoized selectors, and an SSR-safe per-request store.

## 🧱 Tech stack

| Area | Tech |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| State | Redux Toolkit + React-Redux |
| Backend | Firebase Auth, Cloud Firestore, Storage |
| Styling | Tailwind CSS v4 |
| UI bits | lucide-react icons, react-day-picker, date-fns |

---

## 🚀 Getting started

### 1. Install

```bash
npm install
```

### 2. Configure Firebase

Create a Firebase project at the [Firebase Console](https://console.firebase.google.com/), then:

1. **Add a Web app** (Project settings → Your apps → Web) and copy its config.
2. Copy the env template and fill in your values:

   ```bash
   cp .env.local.example .env.local
   ```

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

3. **Enable services** in the console:
   - **Authentication** → enable **Email/Password** and **Google**.
   - **Firestore Database** → Create database (test mode is fine for development).
   - **Storage** → Get started (needed for host image uploads).

> Without these env vars the app automatically falls back to bundled **seed data**.

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. (Optional) Seed Firestore

Insert one demo listing per category into your Firestore:

```bash
node --env-file=.env.local scripts/seed-firestore.mjs
```

---

## 🗄️ Data model

**`listings`** — `title, description, location, country, category, pricePerNight, rating, reviewCount, guests, bedrooms, beds, baths, amenities[], images[], hostId, hostName, createdAt`

**`bookings`** — `listingId, listingTitle, listingImage, userId, startDate, endDate, guests, nights, totalPrice, createdAt`

Security rules are in [`firestore.rules`](./firestore.rules); the composite index for the trips query is in [`firestore.indexes.json`](./firestore.indexes.json).

## 📁 Project structure

```
src/
  app/                 # routes: home, listings/[id], login, signup, host, trips
  components/          # Navbar, ListingCard, BookingWidget, host & trips UI, ui/
  lib/
    features/          # Redux slices: listings, bookings, auth
    services/          # Firestore + Storage data access
    store/             # store, typed hooks, StoreProvider
    firebase.ts        # Firebase init (with seed fallback flag)
    seed.ts            # demo listings
```

## ☁️ Deployment

Deploy on [Vercel](https://vercel.com): import the repo, add the `NEXT_PUBLIC_FIREBASE_*` env vars in project settings, and deploy.

---

Built with ❤️ as a portfolio project.
