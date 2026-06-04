"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

const links = [
  {
    label: "Products",
    items: [
      { label: "Invoicing", href: "#features" },
      { label: "Expenses", href: "#features" },
      { label: "Analytics", href: "#features" },
    ],
  },
  {
    label: "Solutions",
    items: [
      { label: "Small business", href: "#customers" },
      { label: "Agencies", href: "#customers" },
      { label: "Freelancers", href: "#customers" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Pricing", href: "#pricing" },
      { label: "Documentation", href: "#resources" },
      { label: "Support", href: "#resources" },
    ],
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.04] bg-white/80 backdrop-blur-2xl">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* LEFT */}
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#111111] text-white shadow-sm">
              <span className="text-sm font-semibold">
                S
              </span>
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-[15px] font-semibold tracking-[-0.03em] text-[#111111]">
                SMEOS
              </span>

              <span className="mt-1 text-[11px] font-medium text-[#5F6368]">
                Financial OS
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex">
            <ul className="flex items-center gap-2">
              {links.map((link) => (
                <li
                  key={link.label}
                  className="group relative"
                >
                  <button className="flex items-center gap-1 rounded-xl px-4 py-2 text-[14px] font-medium text-[#5F6368] transition-all hover:bg-black/[0.03] hover:text-[#111111]">
                    {link.label}

                    <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                  </button>

                  {/* Dropdown */}
                  <div className="pointer-events-none absolute left-0 top-[calc(100%+14px)] w-64 translate-y-2 rounded-3xl border border-black/[0.06] bg-white p-2 opacity-0 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                    {link.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center justify-between rounded-2xl px-4 py-3 transition-colors hover:bg-black/[0.03]"
                      >
                        <div>
                          <p className="text-sm font-medium text-[#111111]">
                            {item.label}
                          </p>
                        </div>

                        <ArrowRight className="h-4 w-4 text-[#9CA3AF]" />
                      </Link>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="rounded-2xl px-4 py-2 text-[14px] font-medium text-[#5F6368] transition-all hover:bg-black/[0.04] hover:text-[#111111]"
          >
            Sign in
          </Link>

          <Link
            href="/register"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#111111] px-5 text-[14px] font-medium text-white transition-all hover:scale-[1.01] hover:bg-black"
          >
            Get started
          </Link>
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/[0.06] bg-white transition-colors hover:bg-black/[0.03] lg:hidden"
        >
          {open ? (
            <X className="h-5 w-5 text-[#111111]" />
          ) : (
            <Menu className="h-5 w-5 text-[#111111]" />
          )}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t border-black/[0.06] bg-white lg:hidden">
          <div className="mx-auto max-w-7xl px-6 py-6">
            <div className="space-y-6">
              {links.map((group) => (
                <div key={group.label}>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
                    {group.label}
                  </p>

                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] font-medium text-[#111111] transition-colors hover:bg-black/[0.03]"
                      >
                        {item.label}

                        <ArrowRight className="h-4 w-4 text-[#9CA3AF]" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="mt-8 flex flex-col gap-3 border-t border-black/[0.06] pt-6">
              <Link
                href="/login"
                className="flex h-11 items-center justify-center rounded-2xl border border-black/[0.08] bg-white text-[14px] font-medium text-[#111111]"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="flex h-11 items-center justify-center rounded-2xl bg-[#111111] text-[14px] font-medium text-white"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}