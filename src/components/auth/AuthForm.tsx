"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/features/auth/useAuth";

type Mode = "login" | "signup";

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const { signInEmail, signUpEmail, signInGoogle, isConfigured, isAuthed } =
    useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isLogin = mode === "login";

  // If already signed in, leave the auth page.
  useEffect(() => {
    if (isAuthed) router.replace(redirectTo);
  }, [isAuthed, redirectTo, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (isLogin) await signInEmail(email, password);
      else await signUpEmail(name, email, password);
      router.replace(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setBusy(true);
    try {
      await signInGoogle();
      router.replace(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-semibold text-neutral-900">
        {isLogin ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        {isLogin
          ? "Log in to manage your trips and listings."
          : "Sign up to book stays and host your own."}
      </p>

      {!isConfigured && (
        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          Demo mode: Firebase isn&apos;t configured, so sign-in is disabled. Add
          your keys to <code>.env.local</code> to enable accounts.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        {!isLogin && (
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-neutral-300 px-3 py-3 text-sm outline-none focus:border-neutral-900"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-neutral-300 px-3 py-3 text-sm outline-none focus:border-neutral-900"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full rounded-lg border border-neutral-300 px-3 py-3 text-sm outline-none focus:border-neutral-900"
        />

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-rose-500 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60"
        >
          {busy ? "Please wait…" : isLogin ? "Log in" : "Sign up"}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3 text-xs text-neutral-400">
        <span className="h-px flex-1 bg-neutral-200" />
        or
        <span className="h-px flex-1 bg-neutral-200" />
      </div>

      <button
        onClick={handleGoogle}
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-800 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50 disabled:opacity-60"
      >
        <GoogleIcon /> Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-neutral-600">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <Link
          href={isLogin ? "/signup" : "/login"}
          className="font-semibold text-rose-500 underline"
        >
          {isLogin ? "Sign up" : "Log in"}
        </Link>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}
