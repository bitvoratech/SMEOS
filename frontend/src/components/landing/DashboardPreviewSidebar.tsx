"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Receipt,
  CreditCard,
  BarChart3,
} from "lucide-react";

export default function DashboardPreviewSidebar() {
  const pathname = usePathname();
  const currentPath = pathname?.replace(/\/+$/, "") || "/";

  const items = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Customers", href: "/dashboard/customers", icon: Users },
    { name: "Invoices", href: "/dashboard/invoices", icon: Receipt },
    { name: "Expenses", href: "/dashboard/expenses", icon: CreditCard },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  ];

  return (
    <div className="border-r border-black/[0.06] bg-[#FAFAF9] p-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-[#111111]" />

        <div>
          <p className="font-semibold">SMEOS</p>
          <p className="text-sm text-[#5F6368]">Business OS</p>
        </div>
      </div>

      <div className="mt-10 space-y-2">
        {items.map((item) => {
          const active =
            currentPath === item.href ||
            (item.href !== "/dashboard" && currentPath.startsWith(`${item.href}/`));

          return (
            <div
              key={item.name}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                active ? "bg-[#111111] text-white" : "text-[#5F6368] hover:bg-black/[0.03]"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
