const metrics = [
  { label: "Revenue", value: "₦4.2M", change: "↑ 18% this month", up: true },
  { label: "Invoices", value: "47", change: "↑ 12 new", up: true },
  { label: "Outstanding", value: "₦820K", change: "3 overdue", up: false },
];

const invoices = [
  { id: "INV-0042", amount: "₦180,000", status: "Paid" },
  { id: "INV-0041", amount: "₦95,000", status: "Pending" },
  { id: "INV-0040", amount: "₦240,000", status: "Paid" },
];

const bars = [35, 50, 40, 65, 55, 72, 90];

export default function DashboardPreview() {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#111a16] p-5">
      {/* Traffic light dots */}
      <div className="mb-4 flex gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff6058]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffc130]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#29cc42]" />
      </div>

      {/* Metric cards */}
      <div className="mb-3 grid grid-cols-3 gap-2.5">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-lg border border-white/[0.06] bg-[#0d1612] p-3"
          >
            <p className="mb-1 text-[11px] text-[#e8ede9]/40">{m.label}</p>
            <p className="text-lg font-bold text-[#e8ede9]">{m.value}</p>
            <p
              className={`mt-0.5 text-[11px] ${
                m.up ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {m.change}
            </p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="mb-3 rounded-lg border border-white/[0.06] bg-[#0d1612] p-3">
        <p className="mb-3 text-[11px] text-[#e8ede9]/40">Monthly revenue</p>
        <div className="flex h-14 items-end gap-1.5">
          {bars.map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t-sm ${
                i === bars.length - 1
                  ? "bg-emerald-500"
                  : "bg-emerald-500/20"
              }`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* Recent invoices */}
      <div className="flex flex-col gap-1.5">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="flex items-center justify-between rounded-md border border-white/[0.05] bg-[#0d1612] px-3 py-2"
          >
            <span className="text-xs text-[#e8ede9]/60">#{inv.id}</span>
            <span className="text-xs font-medium text-emerald-400">
              {inv.amount}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                inv.status === "Paid"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-amber-500/15 text-amber-400"
              }`}
            >
              {inv.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}