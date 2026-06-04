import Link from "next/link";
import DashboardPreview from "../DashboardPreview";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:px-12 lg:py-32">
      {/* Left — copy */}
      <div>
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Now in early access</span>
        </div>

        <h1 className="mb-5 text-5xl font-extrabold leading-[1.05] tracking-[-2px] lg:text-6xl">
          Run your business.{" "}
          <em className="not-italic text-emerald-400">Not your paperwork.</em>
        </h1>

        <p className="mb-10 max-w-md text-lg font-light leading-relaxed text-[#e8ede9]/60">
          SMEOrbit gives growing businesses one place to handle invoicing,
          expenses, customers, and quotations — with real-time insights to stay
          ahead.
        </p>

        <div className="mb-10 flex flex-wrap items-center gap-4">
          <Link
            href="/register"
            className="rounded-lg bg-emerald-600 px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-emerald-500 hover:-translate-y-px"
          >
            Start for free →
          </Link>
          <Link
            href="#how-it-works"
            className="rounded-lg border border-white/20 px-7 py-3.5 text-sm text-[#e8ede9] transition-colors hover:border-white/40"
          >
            Watch demo
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-5">
          {["No credit card", "14-day free trial", "Cancel anytime"].map((t) => (
            <div key={t} className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] text-emerald-400">
                ✓
              </span>
              <span className="text-sm text-[#e8ede9]/50">{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — dashboard preview */}
      <DashboardPreview />
    </section>
  );
}