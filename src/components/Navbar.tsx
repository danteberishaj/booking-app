"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe, Menu, Search, UserCircle } from "lucide-react";
import { useAuth } from "@/lib/features/auth/useAuth";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectSearch, setSearch } from "@/lib/features/listings/listingsSlice";

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const search = useAppSelector(selectSearch);
  const { user, isAuthed, logout, initializing } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 text-rose-500">
          <svg viewBox="0 0 32 32" className="h-8 w-8 fill-current" aria-hidden>
            <path d="M16 1c2.7 0 4.9 2.2 6.6 5.6 1 2 2.2 4.9 3.6 8.6l.2.5c1.4 3.7 2.1 6 2.1 7.7a6 6 0 0 1-9.7 4.7L16 30l-2.8-1.9A6 6 0 0 1 3.5 23.4c0-1.7.7-4 2.1-7.7l.2-.5c1.4-3.7 2.6-6.6 3.6-8.6C11.1 3.2 13.3 1 16 1zm0 2.4c-1.6 0-3.2 1.6-4.6 4.4-1 2-2.1 4.7-3.5 8.4l-.2.5c-1.3 3.4-1.9 5.4-1.9 6.7a3.7 3.7 0 0 0 6.3 2.6c.6-.6 1.1-1.4 1.6-2.4.9-1.8 1.4-3.9 1.4-6.1h2.8c0 2.2.5 4.3 1.4 6.1.5 1 1 1.8 1.6 2.4A3.7 3.7 0 0 0 27.2 23c0-1.3-.6-3.3-1.9-6.7l-.2-.5c-1.4-3.7-2.5-6.4-3.5-8.4C20.2 5 18.6 3.4 16 3.4z" />
          </svg>
          <span className="hidden text-xl font-bold sm:block">stayfinder</span>
        </Link>

        {/* Search pill */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push("/");
          }}
          className="flex flex-1 items-center justify-center"
        >
          <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 shadow-sm transition hover:shadow-md">
            <Search className="h-4 w-4 text-rose-500" />
            <input
              value={search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              placeholder="Search destinations"
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500"
            />
          </div>
        </form>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/host"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 md:block"
          >
            Become a host
          </Link>
          <button className="hidden rounded-full p-2 hover:bg-neutral-100 md:block">
            <Globe className="h-4 w-4 text-neutral-700" />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-2 transition hover:shadow-md"
            >
              <Menu className="h-4 w-4 text-neutral-700" />
              {isAuthed && user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName ?? "You"}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              ) : (
                <UserCircle className="h-7 w-7 text-neutral-500" />
              )}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white py-2 shadow-lg">
                {initializing ? (
                  <div className="px-4 py-2 text-sm text-neutral-400">Loading…</div>
                ) : isAuthed ? (
                  <>
                    <div className="border-b border-neutral-100 px-4 py-2 text-sm text-neutral-500">
                      {user?.displayName || user?.email}
                    </div>
                    <MenuLink href="/trips" onClick={() => setMenuOpen(false)}>
                      My trips
                    </MenuLink>
                    <MenuLink href="/host" onClick={() => setMenuOpen(false)}>
                      Host a home
                    </MenuLink>
                    <button
                      onClick={async () => {
                        setMenuOpen(false);
                        await logout();
                        router.push("/");
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <MenuLink href="/signup" onClick={() => setMenuOpen(false)}>
                      <span className="font-semibold">Sign up</span>
                    </MenuLink>
                    <MenuLink href="/login" onClick={() => setMenuOpen(false)}>
                      Log in
                    </MenuLink>
                    <div className="my-1 h-px bg-neutral-100" />
                    <MenuLink href="/host" onClick={() => setMenuOpen(false)}>
                      Become a host
                    </MenuLink>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
    >
      {children}
    </Link>
  );
}
