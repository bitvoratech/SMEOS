"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: unknown) {
      const message =
        (err as {
          response?: {
            data?: {
              error?: {
                message?: string;
              };
            };
          };
        })?.response?.data?.error?.message ??
        "Something went wrong";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAFAF8]">
      {/* ambient background */}
      <div className="absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-black/[0.03] blur-3xl" />

        <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-black/[0.03] blur-3xl" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      {/* top nav */}
      <div className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-10">
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#111111] text-white shadow-lg">
            <span className="text-sm font-semibold">
              S
            </span>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-[-0.03em] text-[#111111]">
              SMEOS
            </p>

            <p className="text-xs text-[#666666]">
              Finance OS
            </p>
          </div>
        </Link>

        <Link
          href="/register"
          className="hidden rounded-2xl border border-black/[0.06] bg-white px-5 py-2.5 text-sm font-medium text-[#111111] transition-all hover:border-black/[0.12] hover:bg-black/[0.02] sm:flex"
        >
          Create account
        </Link>
      </div>

      {/* content */}
      <div className="relative z-10 flex min-h-[calc(100vh-88px)] items-center justify-center px-6 pb-10">
        <div className="w-full max-w-[430px]">
          {/* card */}
          <div className="relative overflow-hidden rounded-[32px] border border-black/[0.06] bg-white/80 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-2xl sm:p-10">
            {/* glow */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

            {/* heading */}
            <div>
              <div className="inline-flex items-center rounded-full border border-black/[0.06] bg-black/[0.02] px-3 py-1 text-xs font-medium text-[#666666]">
                Welcome back
              </div>

              <h1 className="mt-5 text-[42px] font-semibold leading-none tracking-[-0.06em] text-[#111111]">
                Sign in
              </h1>

              <p className="mt-4 text-sm leading-6 text-[#666666]">
                Access your workspace, manage
                invoices, customers and business
                operations in one place.
              </p>
            </div>

            {/* form */}
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {/* email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#111111]">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@example.com"
                  required
                  className="h-14 w-full rounded-2xl border border-black/[0.08] bg-[#F7F7F5] px-4 text-[15px] text-[#111111] placeholder:text-[#999999] outline-none transition-all focus:border-[#111111] focus:bg-white"
                />
              </div>

              {/* password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-[#111111]">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-medium text-[#666666] hover:text-[#111111]"
                  >
                    Forgot?
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="••••••••"
                    required
                    className="h-14 w-full rounded-2xl border border-black/[0.08] bg-[#F7F7F5] px-4 pr-12 text-[15px] text-[#111111] placeholder:text-[#999999] outline-none transition-all focus:border-[#111111] focus:bg-white"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] transition-colors hover:text-[#111111]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* error */}
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#111111] text-sm font-medium text-white transition-all hover:scale-[1.01] hover:bg-black disabled:opacity-60"
              >
                {isLoading ? (
                  "Signing in..."
                ) : (
                  <>
                    Continue

                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            {/* divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-black/[0.06]" />

              <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#999999]">
                OR
              </span>

              <div className="h-px flex-1 bg-black/[0.06]" />
            </div>

            {/* socials */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex h-12 items-center justify-center rounded-2xl border border-black/[0.08] bg-white text-sm font-medium text-[#111111] transition-all hover:bg-black/[0.02]"
              >
                Google
              </button>

              <button
                type="button"
                className="flex h-12 items-center justify-center rounded-2xl border border-black/[0.08] bg-white text-sm font-medium text-[#111111] transition-all hover:bg-black/[0.02]"
              >
                Apple
              </button>
            </div>

            {/* footer */}
            <p className="mt-8 text-center text-sm text-[#666666]">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#111111] hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}