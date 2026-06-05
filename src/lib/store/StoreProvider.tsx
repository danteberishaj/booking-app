"use client";

import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";

/**
 * Creates the Redux store once per client (via a lazy useState initializer) so
 * it is stable across re-renders. This is the recommended App Router pattern.
 */
export default function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);
  return <Provider store={store}>{children}</Provider>;
}
