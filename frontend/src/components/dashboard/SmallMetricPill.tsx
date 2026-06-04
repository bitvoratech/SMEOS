"use client";

export default function SmallMetricPill({
  title,
  value,
  sub,
  trend,
}: {
  title: string;
  value: string;
  sub?: string;
  trend?: number | null;
}) {
  return (
    <div className="hidden sm:flex flex-col items-end gap-2">
      <div className="rounded-2xl border border-black/[0.06] bg-[#FAFAF9] px-4 py-3 text-sm">
        <p className="text-xs text-[#5F6368]">{title}</p>

        <div className="mt-1 flex items-center gap-3">
          <p className="text-lg font-semibold text-[#111111]">{value}</p>

          {trend !== undefined && trend !== null && (
            <div
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                trend >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              }`}
            >
              {trend >= 0 ? "+" : ""}
              {trend}%
            </div>
          )}
        </div>

        {sub && <p className="mt-1 text-xs text-[#5F6368]">{sub}</p>}
      </div>
    </div>
  );
}
