"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/style.css";

export default function DateRangePicker({
  value,
  onChange,
}: {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const fmt = (d?: Date) => (d ? format(d, "MMM d") : "Add date");

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="grid w-full grid-cols-2 overflow-hidden rounded-xl border border-neutral-300 text-left transition hover:border-neutral-900"
      >
        <span className="border-r border-neutral-300 px-4 py-3">
          <span className="block text-[10px] font-bold uppercase tracking-wide text-neutral-700">
            Check-in
          </span>
          <span className="text-sm font-medium text-neutral-900">{fmt(value?.from)}</span>
        </span>
        <span className="px-4 py-3">
          <span className="block text-[10px] font-bold uppercase tracking-wide text-neutral-700">
            Checkout
          </span>
          <span className="text-sm font-medium text-neutral-900">{fmt(value?.to)}</span>
        </span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl">
          <DayPicker
            mode="range"
            selected={value}
            onSelect={onChange}
            numberOfMonths={1}
            disabled={{ before: new Date() }}
            className="rdp-cute"
          />
          <div className="flex justify-end gap-2 border-t border-neutral-100 px-1 pt-2">
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 underline hover:text-neutral-900"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-neutral-700"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
