export default function HowItWorks() {
  return (

<section
  id="how-it-works"
  className="bg-[#F7F7F5] py-28"
>
  <div className="mx-auto max-w-7xl px-6 lg:px-10">
    {/* heading */}
    <div className="max-w-2xl">
      <p className="text-sm font-medium text-[#4F46E5]">
        How it works
      </p>

      <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-[#111111] sm:text-5xl">
        Manage your business
        from a single workspace.
      </h2>

      <p className="mt-6 text-lg leading-8 text-[#5F6368]">
        SMEOS helps businesses centralize operations,
        track finances, and gain visibility into performance
        without spreadsheets or disconnected tools.
      </p>
    </div>

    {/* steps */}
    <div className="mt-20 grid gap-6 lg:grid-cols-3">
      {[
        {
          number: "01",
          title: "Create your workspace",
          description:
            "Set up your organization, invite your team, and configure your business operations in minutes.",
        },
        {
          number: "02",
          title: "Manage operations",
          description:
            "Track customers, quotations, invoices, and expenses from one centralized dashboard.",
        },
        {
          number: "03",
          title: "Gain financial clarity",
          description:
            "Monitor revenue, profitability, and operational performance with real-time analytics.",
        },
      ].map((step) => (
        <div
          key={step.number}
          className="rounded-3xl border border-black/[0.06] bg-white p-8"
        >
          <div className="text-sm font-medium text-[#4F46E5]">
            {step.number}
          </div>

          <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-[#111111]">
            {step.title}
          </h3>

          <p className="mt-4 text-[15px] leading-7 text-[#5F6368]">
            {step.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

  );
}