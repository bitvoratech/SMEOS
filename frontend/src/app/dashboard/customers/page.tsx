// app/dashboard/customers/page.tsx

"use client";

import {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  Plus,
  Mail,
  Phone,
  Search,
  ArrowUpRight,
} from "lucide-react";

import { useAuth } from "@/contexts/auth-context";

import { api } from "@/lib/api";

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
}

export default function CustomersPage() {
  const { user } = useAuth();

  const orgId =
    user?.memberships?.[0]?.organization?.id;

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadCustomers = useCallback(async () => {
    if (!orgId) return;

    setIsLoading(true);

    try {
      const res = await api.get<{
        customers: Customer[];
      }>(
        `/organizations/${orgId}/customers`
      );

      setCustomers(res.data.customers);
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    if (orgId) {
      void loadCustomers();
    }
  }, [orgId, loadCustomers]);

  async function handleCreate(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");

    setIsSubmitting(true);

    try {
      await api.post(
        `/organizations/${orgId}/customers`,
        {
          name,
          email: email || undefined,
          phone: phone || undefined,
        }
      );

      setName("");
      setEmail("");
      setPhone("");

      setShowForm(false);

      await loadCustomers();
    } catch (err: unknown) {
      const message =
        (
          err as {
            response?: {
              data?: {
                error?: {
                  message?: string;
                };
              };
            };
          }
        )?.response?.data?.error?.message ??
        "Something went wrong";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredCustomers =
    customers.filter((customer) => {
      const q = search.toLowerCase();

      return (
        customer.name
          .toLowerCase()
          .includes(q) ||
        customer.email
          ?.toLowerCase()
          .includes(q) ||
        customer.phone
          ?.toLowerCase()
          .includes(q)
      );
    });

  return (
    <div className="min-h-screen bg-[#F7F7F5] px-6 py-8 lg:px-10">
      {/* HEADER */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-[#5F6368]">
            Customer relationships
          </p>

          <h1 className="mt-1 text-4xl font-semibold tracking-[-0.04em] text-[#111111]">
            Customers
          </h1>
        </div>

        <button
          onClick={() =>
            setShowForm(!showForm)
          }
          className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#111111] px-5 text-sm font-medium text-white transition hover:bg-black"
        >
          <Plus className="h-4 w-4" />
          Add customer
        </button>
      </div>

      {/* TOP STATS */}
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-black/[0.06] bg-white p-6">
          <p className="text-sm text-[#5F6368]">
            Total customers
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#111111]">
            {customers.length}
          </h2>
        </div>

        <div className="rounded-3xl border border-black/[0.06] bg-white p-6">
          <p className="text-sm text-[#5F6368]">
            Active relationships
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#111111]">
            {customers.length}
          </h2>
        </div>

        <div className="rounded-3xl border border-black/[0.06] bg-white p-6">
          <p className="text-sm text-[#5F6368]">
            Growth this month
          </p>

          <div className="mt-3 flex items-center gap-2">
            <h2 className="text-4xl font-semibold tracking-tight text-[#111111]">
              +12%
            </h2>

            <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600">
              <ArrowUpRight className="h-3 w-3" />
              Healthy
            </div>
          </div>
        </div>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="mt-6 rounded-[28px] border border-black/[0.06] bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5F6368]">
                Customer information
              </p>

              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#111111]">
                New customer
              </h2>
            </div>
          </div>

          <form
            onSubmit={handleCreate}
            className="mt-8"
          >
            <div className="grid gap-4 lg:grid-cols-3">
              {/* name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#111111]">
                  Full name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Acme Corporation"
                  required
                  className="h-12 w-full rounded-2xl border border-black/[0.08] bg-[#F7F7F5] px-4 text-sm text-[#111111] outline-none transition focus:border-black"
                />
              </div>

              {/* email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#111111]">
                  Email address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="hello@company.com"
                  className="h-12 w-full rounded-2xl border border-black/[0.08] bg-[#F7F7F5] px-4 text-sm text-[#111111] outline-none transition focus:border-black"
                />
              </div>

              {/* phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#111111]">
                  Phone number
                </label>

                <input
                  type="text"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="+234..."
                  className="h-12 w-full rounded-2xl border border-black/[0.08] bg-[#F7F7F5] px-4 text-sm text-[#111111] outline-none transition focus:border-black"
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mt-6 flex items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-11 items-center rounded-2xl bg-[#111111] px-5 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60"
              >
                {isSubmitting
                  ? "Saving..."
                  : "Save customer"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="inline-flex h-11 items-center rounded-2xl border border-black/[0.08] bg-white px-5 text-sm font-medium text-[#111111] transition hover:bg-black/[0.03]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE */}
      <div className="mt-6 overflow-hidden rounded-[28px] border border-black/[0.06] bg-white">
        {/* table top */}
        <div className="flex flex-col gap-4 border-b border-black/[0.06] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-[#5F6368]">
              Customer directory
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#111111]">
              All customers
            </h2>
          </div>

          {/* search */}
          <div className="relative w-full lg:w-[320px]">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7C8188]" />

            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="h-11 w-full rounded-2xl border border-black/[0.08] bg-[#F7F7F5] pl-11 pr-4 text-sm text-[#111111] outline-none transition focus:border-black"
            />
          </div>
        </div>

        {/* loading */}
        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({
              length: 5,
            }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-2xl bg-[#F7F7F5]"
              />
            ))}
          </div>
        ) : filteredCustomers.length ===
          0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F7F7F5]">
              <Users className="h-7 w-7 text-[#7C8188]" />
            </div>

            <h3 className="mt-6 text-xl font-semibold text-[#111111]">
              No customers found
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-7 text-[#5F6368]">
              Add your first customer to
              start managing relationships,
              invoices, and quotations.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-black/[0.06]">
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#7C8188]">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#7C8188]">
                    Contact
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#7C8188]">
                    Phone
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#7C8188]">
                    Added
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map(
                  (customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-black/[0.04] transition hover:bg-black/[0.02]"
                    >
                      {/* customer */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-sm font-semibold text-white">
                            {customer.name.charAt(0)}
                          </div>

                          <div>
                            <p className="font-medium text-[#111111]">
                              {customer.name}
                            </p>

                            <p className="mt-1 text-sm text-[#5F6368]">
                              Client
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* email */}
                      <td className="px-6 py-5">
                        {customer.email ? (
                          <div className="flex items-center gap-2 text-sm text-[#111111]">
                            <Mail className="h-4 w-4 text-[#7C8188]" />

                            {customer.email}
                          </div>
                        ) : (
                          <span className="text-sm text-[#A1A1AA]">
                            —
                          </span>
                        )}
                      </td>

                      {/* phone */}
                      <td className="px-6 py-5">
                        {customer.phone ? (
                          <div className="flex items-center gap-2 text-sm text-[#111111]">
                            <Phone className="h-4 w-4 text-[#7C8188]" />

                            {customer.phone}
                          </div>
                        ) : (
                          <span className="text-sm text-[#A1A1AA]">
                            —
                          </span>
                        )}
                      </td>

                      {/* date */}
                      <td className="px-6 py-5 text-sm text-[#5F6368]">
                        {new Date(
                          customer.createdAt
                        ).toLocaleDateString(
                          "en-NG",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}