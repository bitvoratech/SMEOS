import Link from "next/link";

export default function CTA() {
  return (

<section className="bg-[#F7F7F5] py-28">
  <div className="mx-auto max-w-5xl px-6 lg:px-10">
    <div className="rounded-[40px] bg-[#111111] px-8 py-20 text-center sm:px-16">
      <p className="text-sm font-medium text-white/60">
        Start today
      </p>

      <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
        Build a more structured,
        scalable business.
      </h2>

      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/60">
        Gain visibility into your operations, improve financial
        clarity, and manage your business from one intelligent system.
      </p>

      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          href="/register"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-[15px] font-medium text-[#111111] transition-colors hover:bg-[#E5E7EB]"
        >
          Start free
        </Link>

        <Link
          href="/login"
          className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 px-6 text-[15px] font-medium text-white transition-colors hover:bg-white/[0.06]"
        >
          Book a demo
        </Link>
      </div>
    </div>
  </div>
</section>
  )
}