"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Minus, Plus, Users } from "lucide-react";

export default function GuestSelector({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (n: number) => void;
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

  const dec = () => onChange(Math.max(1, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-xl border border-neutral-300 px-4 py-3 text-left transition hover:border-neutral-900"
      >
        <span className="flex items-center gap-2">
          <Users className="h-4 w-4 text-neutral-500" />
          <span className="text-sm">
            <span className="block text-[10px] font-bold uppercase tracking-wide text-neutral-700">
              Guests
            </span>
            <span className="font-medium text-neutral-900">
              {value} guest{value > 1 ? "s" : ""}
            </span>
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-neutral-500 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-900">Guests</p>
              <p className="text-xs text-neutral-500">This place allows up to {max}</p>
            </div>
            <div className="flex items-center gap-3">
              <StepButton onClick={dec} disabled={value <= 1} label="Decrease guests">
                <Minus className="h-4 w-4" />
              </StepButton>
              <span className="w-6 text-center text-sm font-medium tabular-nums">
                {value}
              </span>
              <StepButton onClick={inc} disabled={value >= max} label="Increase guests">
                <Plus className="h-4 w-4" />
              </StepButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StepButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-400 text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}
