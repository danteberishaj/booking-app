import CategoryBar from "@/components/CategoryBar";
import ListingsGrid from "@/components/ListingsGrid";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2000&q=80)",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-black/40" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white drop-shadow sm:text-5xl">
            Find a place you&apos;ll never want to leave
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/90 drop-shadow">
            Book unique homes, cabins, and beachfront escapes around the world.
          </p>
        </div>
      </section>

      <CategoryBar />

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <ListingsGrid />
      </section>
    </>
  );
}
