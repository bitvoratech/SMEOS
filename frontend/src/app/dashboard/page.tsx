// app/dashboard/page.tsx

"use client";

import { useEffect, useState, useCallback } from "react";

import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";

import { useAuth } from "@/contexts/auth-context";

import {
  getDashboardStats,
  type DashboardStats,
} from "@/lib/stats";

import { formatNaira } from "@/lib/expenses";

function StatCard({
  label,
  value,
  sub,
  trend,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: number | null;
}) {
  return (
    <div className="rounded-3xl border border-black/[0.06] bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#5F6368]">
            {label}
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-[#111111]">
            {value}
          </p>
        </div>

        {trend !== null && trend !== undefined && (
          <div
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              trend >= 0
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {trend >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}

            {trend >= 0 ? "+" : ""}
            {trend}%
          </div>
        )}
      </div>

      {sub && (
        <p className="mt-3 text-sm text-[#5F6368]">
          {sub}
        </p>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  const orgId =
    user?.memberships?.[0]?.organization?.id;

  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const load = useCallback(async () => {
    if (!orgId) return;

    try {
      const data = await getDashboardStats(orgId);

      setStats(data);
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    if (orgId) void load();
  }, [orgId, load]);

  return (
    <div className="px-6 py-8 lg:px-10">
      {/* header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-[#5F6368]">
            Welcome back
          </p>

          <h1 className="mt-1 text-4xl font-semibold tracking-[-0.04em] text-[#111111]">
            {user?.name?.split(" ")[0]}
          </h1>
        </div>

        <button className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#111111] px-5 text-sm font-medium text-white transition hover:bg-black">
          Generate report
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[140px] animate-pulse rounded-3xl bg-white"
            />
          ))}
        </div>
      ) : stats ? (
        <>
          {/* stats */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Customers"
              value={String(stats.totalCustomers)}
              sub="Active customers"
            />

            <StatCard
              label="Open Invoices"
              value={formatNaira(
                stats.openInvoices.total
              )}
              sub={`${stats.openInvoices.count} unpaid invoices`}
            />

            <StatCard
              label="Revenue"
              value={formatNaira(
                stats.revenue.thisMonth
              )}
              trend={stats.revenue.percentChange}
            />

            <StatCard
              label="Expenses"
              value={formatNaira(
                stats.expenses.thisMonth
              )}
              trend={
                stats.expenses.percentChange !== null
                  ? -stats.expenses.percentChange
                  : null
              }
            />
          </div>

          {/* lower grid */}
          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
            {/* profit card */}
            <div className="rounded-3xl border border-black/[0.06] bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#5F6368]">
                    Net Profit
                  </p>

                  <h2
                    className={`mt-2 text-4xl font-semibold tracking-tight ${
                      stats.profit.thisMonth >= 0
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatNaira(
                      stats.profit.thisMonth
                    )}
                  </h2>
                </div>

                <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
                  Healthy
                </div>
              </div>

              {/* fake graph */}
              <div className="mt-10 flex h-50 items-end gap-3">
                {[30, 40, 48, 60, 58, 72, 80, 92].map(
                  (height, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-full bg-[#E5E7EB]"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  )
                )}
              </div>
            </div>

            {/* invoice status */}
            <div className="rounded-3xl border border-black/[0.06] bg-white p-6">
              <div>
                <p className="text-sm text-[#5F6368]">
                  Invoice status
                </p>

                <h3 className="mt-1 text-2xl font-semibold tracking-tight text-[#111111]">
                  Payment overview
                </h3>
              </div>

              <div className="mt-8 space-y-4">
                {stats.invoicesByStatus.length === 0 ? (
                  <div className="rounded-2xl bg-[#F7F7F5] p-5 text-sm text-[#5F6368]">
                    No invoices yet
                  </div>
                ) : (
                  stats.invoicesByStatus.map((s) => (
                    <div
                      key={s.status}
                      className="flex items-center justify-between rounded-2xl bg-[#F7F7F5] px-5 py-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#111111] capitalize">
                          {s.status.toLowerCase()}
                        </p>

                        <p className="mt-1 text-xs text-[#5F6368]">
                          {s.count} invoices
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-[#111111]">
                        {formatNaira(s.total)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}