import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Receipt,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import DashboardPreviewSidebar from "@/components/landing/DashboardPreviewSidebar";

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import CTA from "@/components/landing/CTA";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";

import { Button } from "@/components/ui/button";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SMEOS - The operating system for modern African businesses",
  description:
    "Manage customers, invoices, expenses, and business performance from one intelligent platform.",
};

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F7F5] text-[#111111]">
      <Navbar />

      {/* HERO */}
      <section className="relative border-b border-black/[0.06]">
        {/* background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[#4F46E5]/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-10">
          {/* badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-4 py-2 text-sm text-[#5F6368]">
              <ShieldCheck className="h-4 w-4 text-[#4F46E5]" />
              Built for ambitious African businesses
            </div>
          </div>

          {/* heading */}
          <div className="mx-auto mt-10 max-w-5xl text-center">
            <h1 className="text-5xl font-semibold tracking-[-0.06em] text-[#111111] sm:text-6xl lg:text-8xl leading-[0.95]">
              Operate your business
              <span className="block text-[#4F46E5]">
                from one intelligent system.
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[#5F6368]">
              CRM, invoicing, expense tracking, and business analytics
              designed for modern SMEs that need structure, visibility,
              and growth.
            </p>

            {/* buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                className="h-12 rounded-xl bg-[#111111] px-6 text-white hover:bg-black"
                asChild
              >
                <Link href="/register">
                  Start free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border-black/[0.08] bg-white px-6 text-[#111111] hover:bg-black/[0.03]"
                asChild
              >
                <Link href="/login">Book demo</Link>
              </Button>
            </div>

            {/* metrics */}
            <div className="mt-14 flex flex-wrap items-center justify-center gap-10 text-sm text-[#5F6368]">
              <div>
                <p className="text-2xl font-semibold text-[#111111]">
                  ₦120M+
                </p>
                <p className="mt-1">Revenue tracked</p>
              </div>

              <div>
                <p className="text-2xl font-semibold text-[#111111]">
                  4.8x
                </p>
                <p className="mt-1">Operational visibility</p>
              </div>

              <div>
                <p className="text-2xl font-semibold text-[#111111]">
                  84%
                </p>
                <p className="mt-1">Business health score</p>
              </div>
            </div>
          </div>

          {/* dashboard preview */}
          <div className="relative mx-auto mt-20 max-w-6xl">
            <div className="overflow-hidden rounded-[32px] border border-black/[0.06] bg-white shadow-[0_40px_120px_rgba(0,0,0,0.08)]">
              <div className="grid lg:grid-cols-[240px_1fr]">
                {/* sidebar */}
                <DashboardPreviewSidebar />

                {/* content */}
                <div className="p-6 lg:p-8">
                  {/* top row */}
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm text-[#5F6368]">
                        Business Overview
                      </p>

                      <h2 className="mt-1 text-3xl font-semibold tracking-tight">
                        Bitvoratech
                      </h2>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl border border-black/[0.06] bg-[#FAFAF9] px-4 py-3">
                        <p className="text-xs text-[#5F6368]">
                          Revenue Growth
                        </p>

                        <p className="mt-1 text-lg font-semibold text-emerald-600">
                          +12.4%
                        </p>
                      </div>

                      <div className="rounded-2xl border border-black/[0.06] bg-[#FAFAF9] px-4 py-3">
                        <p className="text-xs text-[#5F6368]">
                          Outstanding
                        </p>

                        <p className="mt-1 text-lg font-semibold">
                          ₦780K
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* stat cards */}
                  <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-3xl border border-black/[0.06] bg-[#FAFAF9] p-5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="rounded-xl bg-white p-2 shadow-sm">
                            <stat.icon className="h-5 w-5 text-[#4F46E5]" />
                          </div>

                          <span className="text-xs text-emerald-600">
                            +8%
                          </span>
                        </div>

                        <p className="mt-5 text-3xl font-semibold tracking-tight">
                          {stat.value}
                        </p>

                        <p className="mt-1 text-sm text-[#5F6368]">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* chart + activity */}
                  <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_320px]">
                    {/* chart */}
                    <div className="rounded-3xl border border-black/[0.06] bg-[#FAFAF9] p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[#5F6368]">
                            Revenue Analytics
                          </p>

                          <h3 className="mt-1 text-xl font-semibold">
                            Monthly performance
                          </h3>
                        </div>

                        <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                          Healthy growth
                        </div>
                      </div>

                      {/* fake chart */}
                      <div className="mt-10 flex h-72 items-end gap-4">
                        {[35, 45, 55, 48, 72, 85, 92, 76, 98].map(
                          (height, i) => (
                            <div
                              key={i}
                              className="flex-1 rounded-t-full bg-[#E5E7EB]"
                              style={{ height: `${height}%` }}
                            />
                          )
                        )}
                      </div>
                    </div>

                    {/* activity */}
                    <div className="rounded-3xl border border-black/[0.06] bg-[#FAFAF9] p-6">
                      <div>
                        <p className="text-sm text-[#5F6368]">
                          Recent activity
                        </p>

                        <h3 className="mt-1 text-xl font-semibold">
                          Business operations
                        </h3>
                      </div>

                      <div className="mt-8 space-y-6">
                        {activities.map((activity) => (
                          <div
                            key={activity.title}
                            className="flex gap-4"
                          >
                            <div className="mt-2 h-2.5 w-2.5 rounded-full bg-[#4F46E5]" />

                            <div>
                              <p className="font-medium">
                                {activity.title}
                              </p>

                              <p className="mt-1 text-sm leading-6 text-[#5F6368]">
                                {activity.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}

const sidebar = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    name: "Customers",
    icon: Users,
  },
  {
    name: "Invoices",
    icon: Receipt,
  },
  {
    name: "Expenses",
    icon: CreditCard,
  },
  {
    name: "Analytics",
    icon: BarChart3,
  },
];

const stats = [
  {
    label: "Revenue",
    value: "₦2.4M",
    icon: TrendingUp,
  },
  {
    label: "Expenses",
    value: "₦950K",
    icon: CreditCard,
  },
  {
    label: "Invoices",
    value: "48",
    icon: Receipt,
  },
  {
    label: "Customers",
    value: "120",
    icon: Users,
  },
];

const activities = [
  {
    title: "Invoice paid",
    description:
      "HNK Interiors completed payment for invoice INV-2039.",
  },
  {
    title: "New quotation created",
    description:
      "A quotation worth ₦1.2M was sent to Crest Logistics.",
  },
  {
    title: "Expense recorded",
    description:
      "Operational expense added under marketing category.",
  },
];