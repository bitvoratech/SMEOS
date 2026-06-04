// components/dashboard/Sidebar.tsx

"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  Receipt,
  CreditCard,
  FileText,
  Settings,
  BarChart3,
  Building2,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "@/contexts/auth-context";

const items = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    label: "Quotations",
    href: "/dashboard/quotations",
    icon: FileText,
  },
  {
    label: "Invoices",
    href: "/dashboard/invoices",
    icon: Receipt,
  },
  {
    label: "Expenses",
    href: "/dashboard/expenses",
    icon: CreditCard,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const currentPath = pathname?.replace(/\/+$/, "") || "/";

  const { user } = useAuth();

  const organization =
    user?.memberships?.[0]?.organization;

  return (
    <aside className="hidden lg:flex lg:flex-col w-[240px] shrink-0 border-r border-black/[0.06] bg-[#FAFAF9]">
      {/* LOGO */}
      <div className="border-b border-black/[0.06] px-6 py-6">
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-white">
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-[#111111]">
              SMEOS
            </p>

            <p className="text-xs text-[#5F6368]">
              Business OS
            </p>
          </div>
        </Link>
      </div>

      {/* WORKSPACE */}
      <div className="border-b border-black/[0.06] px-4 py-5">
        <div className="rounded-3xl bg-[#F7F7F5] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#111111] text-md font-semibold text-white">
              {organization?.name?.charAt(0) ?? "S"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-md font-semibold text-[#111111]">
                {organization?.name ?? "SMEOS"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 px-4 py-6">
        <div className="space-y-1">
          {items.map((item) => {
            const active =
              // exact match
              currentPath === item.href ||
              // match nested routes, but avoid treating the root dashboard
              // item as active for all dashboard subroutes
              (item.href !== "/dashboard" &&
                currentPath.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? "bg-[#111111] text-white"
                    : "text-[#5F6368] hover:bg-black/[0.04] hover:text-[#111111]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`h-4 w-4 ${
                      active
                        ? "text-white"
                        : "text-[#7C8188] group-hover:text-[#111111]"
                    }`}
                  />

                  {item.label}
                </div>

                {active && (
                  <ChevronRight className="h-4 w-4 text-white/70" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t border-black/[0.06] p-4">
        <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[#5F6368] transition hover:bg-black/[0.04] hover:text-[#111111]">
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </div>
    </aside>
  );
}