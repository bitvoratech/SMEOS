"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight } from "lucide-react";

import { useAuth } from "@/contexts/auth-context";
import { createOrganization } from "@/lib/organizations";

export default function OnboardingPage() {
  const { user, isLoading, refreshUser } = useAuth();

  const router = useRouter();

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }

    if (!isLoading && user?.memberships?.length) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await createOrganization(name);

      await refreshUser();

      router.push("/dashboard");
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
        })?.response?.data?.error?.message ?? "Something went wrong";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F7F5]">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
          <p className="text-sm text-[#5F6368]">
            Loading workspace...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F7F5]">
      {/* subtle background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#4F46E5]/5 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-20 lg:px-10">
        <div className="w-full max-w-lg rounded-[32px] border border-black/[0.06] bg-white p-10 shadow-[0_20px_80px_rgba(0,0,0,0.06)]">
          {/* logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-white">
              <Building2 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-medium text-[#111111]">
                SMEOS
              </p>

              <p className="text-sm text-[#5F6368]">
                Business Operating System
              </p>
            </div>
          </div>

          {/* heading */}
          <div className="mt-10">
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[#111111]">
              Set up your business.
            </h1>

            <p className="mt-4 text-[15px] leading-7 text-[#5F6368]">
              Create your organization workspace to start
              managing invoices, customers, expenses, and
              operations from one centralized platform.
            </p>
          </div>

          {/* form */}
          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6"
          >
            <div>
              <label className="mb-3 block text-sm font-medium text-[#111111]">
                Business name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Bitvoratech Ltd"
                required
                minLength={1}
                className="h-14 w-full rounded-2xl border border-black/[0.08] bg-[#FAFAF9] px-5 text-[15px] text-[#111111] outline-none transition-all placeholder:text-[#9CA3AF] focus:border-[#111111]"
              />

              <p className="mt-3 text-sm leading-6 text-[#5F6368]">
                This name will appear on invoices,
                quotations, and customer-facing documents.
              </p>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#111111] text-[15px] font-medium text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating workspace...
                </>
              ) : (
                <>
                  Create workspace
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* footer */}
          <div className="mt-10 border-t border-black/[0.06] pt-6">
            <p className="text-sm leading-6 text-[#5F6368]">
              By continuing, you agree to SMEOS&apos;s Terms
              of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}