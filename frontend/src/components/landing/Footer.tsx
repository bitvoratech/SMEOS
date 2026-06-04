import Link from "next/link";

export default function Footer() {
  return (

<footer className="border-t border-black/[0.06] bg-[#F7F7F5]">
  <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
    {/* TOP */}
    <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
      {/* Brand */}
      <div className="max-w-sm">
        <Link
          href="/"
          className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em] text-[#111111]"
        >
          <div className="h-7 w-7 rounded-md bg-[#111111]" />
          SMEOS
        </Link>

        <p className="mt-5 text-[15px] leading-7 text-[#5F6368]">
          The operating system for modern African businesses.
          Manage customers, invoices, expenses, and business
          performance from one intelligent platform.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <div className="rounded-full border border-black/[0.06] bg-white px-3 py-1 text-xs font-medium text-[#5F6368]">
            CRM
          </div>

          <div className="rounded-full border border-black/[0.06] bg-white px-3 py-1 text-xs font-medium text-[#5F6368]">
            Invoicing
          </div>

          <div className="rounded-full border border-black/[0.06] bg-white px-3 py-1 text-xs font-medium text-[#5F6368]">
            Analytics
          </div>
        </div>
      </div>

      {/* Product */}
      <div>
        <h3 className="text-sm font-semibold text-[#111111]">
          Product
        </h3>

        <ul className="mt-5 space-y-4">
          {[
            "Features",
            "Pricing",
            "Customers",
            "Integrations",
            "Changelog",
          ].map((item) => (
            <li key={item}>
              <Link
                href="#"
                className="text-[15px] text-[#5F6368] transition-colors hover:text-[#111111]"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Company */}
      <div>
        <h3 className="text-sm font-semibold text-[#111111]">
          Company
        </h3>

        <ul className="mt-5 space-y-4">
          {[
            "About",
            "Careers",
            "Contact",
            "Partners",
            "Legal",
          ].map((item) => (
            <li key={item}>
              <Link
                href="#"
                className="text-[15px] text-[#5F6368] transition-colors hover:text-[#111111]"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Resources */}
      <div>
        <h3 className="text-sm font-semibold text-[#111111]">
          Resources
        </h3>

        <ul className="mt-5 space-y-4">
          {[
            "Documentation",
            "API Reference",
            "Help Center",
            "Community",
            "Status",
          ].map((item) => (
            <li key={item}>
              <Link
                href="#"
                className="text-[15px] text-[#5F6368] transition-colors hover:text-[#111111]"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* BOTTOM */}
    <div className="mt-16 flex flex-col gap-4 border-t border-black/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-[#5F6368]">
        © 2026 SMEOS Technologies. All rights reserved.
      </p>

      <div className="flex items-center gap-6">
        <Link
          href="#"
          className="text-sm text-[#5F6368] transition-colors hover:text-[#111111]"
        >
          Privacy Policy
        </Link>

        <Link
          href="#"
          className="text-sm text-[#5F6368] transition-colors hover:text-[#111111]"
        >
          Terms
        </Link>

        <Link
          href="#"
          className="text-sm text-[#5F6368] transition-colors hover:text-[#111111]"
        >
          Security
        </Link>
      </div>
    </div>
  </div>
</footer>

  );
}