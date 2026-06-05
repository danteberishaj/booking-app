import type { Metadata } from "next";
import HostGuard from "@/components/host/HostGuard";
import ListingForm from "@/components/host/ListingForm";

export const metadata: Metadata = { title: "Become a host · StayFinder" };

export default function HostPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Host your place</h1>
        <p className="mt-1 text-neutral-500">
          Share the details below and your listing goes live instantly.
        </p>
      </header>
      <HostGuard>
        <ListingForm />
      </HostGuard>
    </div>
  );
}
