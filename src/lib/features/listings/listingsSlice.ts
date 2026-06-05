import {
  createAsyncThunk,
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { fetchListings } from "@/lib/services/listings";
import type { RootState } from "@/lib/store/store";
import type { Category, Listing } from "@/lib/types";

interface ListingsState {
  items: Listing[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  category: Category | "All";
  search: string;
}

const initialState: ListingsState = {
  items: [],
  status: "idle",
  error: null,
  category: "All",
  search: "",
};

export const loadListings = createAsyncThunk("listings/load", async () => {
  return fetchListings();
});

const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<Category | "All">) {
      state.category = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    listingAdded(state, action: PayloadAction<Listing>) {
      state.items.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadListings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadListings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(loadListings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load listings";
      });
  },
});

export const { setCategory, setSearch, listingAdded } = listingsSlice.actions;
export default listingsSlice.reducer;

// --- Selectors ---
export const selectAllListings = (s: RootState) => s.listings.items;
export const selectListingsStatus = (s: RootState) => s.listings.status;
export const selectCategory = (s: RootState) => s.listings.category;
export const selectSearch = (s: RootState) => s.listings.search;

/** Listings filtered by the active category and search query (memoized). */
export const selectFilteredListings = createSelector(
  [selectAllListings, selectCategory, selectSearch],
  (items, category, search): Listing[] => {
    const q = search.trim().toLowerCase();
    return items.filter((l) => {
      const matchesCategory = category === "All" || l.category === category;
      const matchesSearch =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.country.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }
);
