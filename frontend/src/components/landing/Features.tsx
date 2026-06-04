export default function Features() {
  return (

<section
  id="features"
  className="bg-white py-28"
>
  <div className="mx-auto max-w-7xl px-6 lg:px-10">
    {/* heading */}
    <div className="max-w-2xl">
      <p className="text-sm font-medium text-[#4F46E5]">
        Features
      </p>

      <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-[#111111] sm:text-5xl">
        Built for operational excellence.
      </h2>

      <p className="mt-6 text-lg leading-8 text-[#5F6368]">
        Everything your business needs to structure,
        automate, and scale operations with confidence.
      </p>
    </div>

    {/* feature grid */}
    <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {[
        {
          title: "Customer management",
          description:
            "Centralize customer records, contacts, and business relationships.",
        },
        {
          title: "Invoice operations",
          description:
            "Create invoices, monitor payments, and track outstanding balances.",
        },
        {
          title: "Expense tracking",
          description:
            "Record operational spending and monitor profitability in real time.",
        },
        {
          title: "Business analytics",
          description:
            "Track revenue, expenses, and financial performance from one dashboard.",
        },
        {
          title: "Quotation workflows",
          description:
            "Generate professional quotations and manage approvals efficiently.",
        },
        {
          title: "Team collaboration",
          description:
            "Invite team members and manage business operations collaboratively.",
        },
      ].map((feature) => (
        <div
          key={feature.title}
          className="rounded-3xl border border-black/[0.06] bg-[#F7F7F5] p-8 transition-all duration-200 hover:bg-[#F2F2EF]"
        >
          <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#111111]">
            {feature.title}
          </h3>

          <p className="mt-4 text-[15px] leading-7 text-[#5F6368]">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
  )
}