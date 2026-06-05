"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORY_OPTIONS } from "@/lib/categories";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectCategory, setCategory } from "@/lib/features/listings/listingsSlice";

export default function CategoryBar() {
  const dispatch = useAppDispatch();
  const active = useAppSelector(selectCategory);
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }

  return (
    <div className="relative border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* scroll buttons (desktop) */}
        <button
          onClick={() => scrollBy(-1)}
          aria-label="Scroll left"
          className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-neutral-200 bg-white p-2 shadow-sm hover:scale-105 lg:block"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => scrollBy(1)}
          aria-label="Scroll right"
          className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-neutral-200 bg-white p-2 shadow-sm hover:scale-105 lg:block"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div
          ref={scrollerRef}
          className="flex items-center gap-2 overflow-x-auto py-3 lg:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {CATEGORY_OPTIONS.map(({ value, label, Icon }) => {
            const isActive = active === value;
            return (
              <button
                key={value}
                onClick={() => dispatch(setCategory(value))}
                className={`group flex shrink-0 flex-col items-center gap-1.5 border-b-2 px-3 py-2 transition ${
                  isActive
                    ? "border-neutral-900 text-neutral-900"
                    : "border-transparent text-neutral-500 hover:border-neutral-200 hover:text-neutral-900"
                }`}
              >
                <Icon
                  className={`h-6 w-6 transition ${
                    isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                  }`}
                  strokeWidth={1.6}
                />
                <span className="whitespace-nowrap text-xs font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
