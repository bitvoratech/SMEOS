"use client";

import { TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="px-8 py-8 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/70 bg-card/70 backdrop-blur mb-6">
        <TrendingUp className="h-6 w-6 text-primary" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
      <p className="mt-2 text-sm text-muted text-center max-w-sm">
        Business intelligence and insights are coming soon. Revenue trends,
        expense breakdowns, and your funding readiness score will live here.
      </p>
      <div className="mt-6 rounded-full border border-border/70 bg-white/5 px-4 py-1.5 text-xs text-muted">
        Coming soon
      </div>
    </div>
  );
}