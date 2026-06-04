"use client";

import { useEffect, useState, useCallback } from "react";

import {
  Plus,
  Trash2,
  ChevronDown,
  Search,
  ArrowUpRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/contexts/auth-context";

import {
  listQuotations,
  createQuotation,
  updateQuotationStatus,
  formatNaira,
  type Quotation,
} from "@/lib/quotations";

import { api } from "@/lib/api";

interface Customer {
  id: string;
  name: string;
}

const STATUS_OPTIONS: Quotation["status"][] = [
  "DRAFT",
  "SENT",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
];

const STATUS_STYLES: Record<Quotation["status"], string> = {
  DRAFT:
    "bg-[#F5F5F5] text-[#5F6368]",
  SENT:
    "bg-blue-50 text-blue-600",
  ACCEPTED:
    "bg-emerald-50 text-emerald-600",
  REJECTED:
    "bg-red-50 text-red-600",
  EXPIRED:
    "bg-yellow-50 text-yellow-700",
};

type LineItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

const emptyItem = (): LineItem => ({
  description: "",
  quantity: 1,
  unitPrice: 0,
});

export default function QuotationsPage() {
  const { user } = useAuth();

  const orgId =
    user?.memberships?.[0]?.organization?.id;

  const [quotations, setQuotations] =
    useState<Quotation[]>([]);

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [search, setSearch] =
    useState("");

  // form state
  const [customerId, setCustomerId] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [expiryDate, setExpiryDate] =
    useState("");

  const [items, setItems] =
    useState<LineItem[]>([
      emptyItem(),
    ]);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const load = useCallback(async () => {
    if (!orgId) return;

    setIsLoading(true);

    try {
      const [q, c] =
        await Promise.all([
          listQuotations(orgId),
          api
            .get<{
              customers: Customer[];
            }>(
              `/organizations/${orgId}/customers`
            )
            .then(
              (r) => r.data.customers
            ),
        ]);

      setQuotations(q);
      setCustomers(c);
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    if (orgId) void load();
  }, [orgId, load]);

  function updateItem(
    index: number,
    field: keyof LineItem,
    value: string | number
  ) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      emptyItem(),
    ]);
  }

  function removeItem(index: number) {
    setItems((prev) =>
      prev.filter((_, i) => i !== index)
    );
  }

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      item.quantity *
        item.unitPrice,
    0
  );

  async function handleCreate(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await createQuotation(orgId!, {
        customerId:
          customerId || undefined,
        notes: notes || undefined,
        expiryDate:
          expiryDate || undefined,
        items,
      });

      setCustomerId("");
      setNotes("");
      setExpiryDate("");
      setItems([emptyItem()]);
      setShowForm(false);

      await load();
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
        )?.response?.data?.error
          ?.message ??
        "Something went wrong";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusChange(
    quotationId: string,
    status: Quotation["status"]
  ) {
    if (!orgId) return;

    await updateQuotationStatus(
      orgId,
      quotationId,
      status
    );

    await load();
  }

  const filtered =
    quotations.filter((q) => {
      const customer =
        q.customer?.name || "";

      return (
        customer
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        String(q.number).includes(
          search
        )
      );
    });

  return (
    <div className="min-h-screen bg-[#F7F7F5] px-6 py-8 lg:px-10">
      {/* header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-[#5F6368]">
            Quotations
          </p>

          <h1 className="mt-1 text-4xl font-semibold tracking-[-0.04em] text-[#111111]">
            Manage quotations
          </h1>
        </div>

        <Button
          onClick={() =>
            setShowForm(!showForm)
          }
          className="h-12 rounded-2xl bg-[#111111] px-5 text-sm font-medium text-white hover:bg-black"
        >
          <Plus className="h-4 w-4" />
          New quotation
        </Button>
      </div>

      {/* filters */}
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7C8188]" />

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search quotation..."
            className="h-12 w-full rounded-2xl border border-black/[0.06] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-black"
          />
        </div>

        <div className="rounded-2xl border border-black/[0.06] bg-white px-5 py-3">
          <p className="text-xs text-[#5F6368]">
            Total quotations
          </p>

          <p className="mt-1 text-lg font-semibold text-[#111111]">
            {quotations.length}
          </p>
        </div>
      </div>

      {/* form */}
      {showForm && (
        <div className="mt-8 rounded-[28px] border border-black/[0.06] bg-white p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5F6368]">
                Create quotation
              </p>

              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#111111]">
                New quotation
              </h2>
            </div>

            <button
              onClick={() =>
                setShowForm(false)
              }
              className="text-sm text-[#5F6368] hover:text-black"
            >
              Cancel
            </button>
          </div>

          <form
            onSubmit={handleCreate}
            className="mt-8 space-y-8"
          >
            {/* meta */}
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#111111]">
                  Customer
                </label>

                <select
                  value={customerId}
                  onChange={(e) =>
                    setCustomerId(
                      e.target.value
                    )
                  }
                  className="h-12 w-full rounded-2xl border border-black/[0.06] bg-white px-4 text-sm outline-none focus:border-black"
                >
                  <option value="">
                    Select customer
                  </option>

                  {customers.map((c) => (
                    <option
                      key={c.id}
                      value={c.id}
                    >
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#111111]">
                  Expiry date
                </label>

                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) =>
                    setExpiryDate(
                      e.target.value
                    )
                  }
                  className="h-12 w-full rounded-2xl border border-black/[0.06] bg-white px-4 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#111111]">
                  Notes
                </label>

                <input
                  value={notes}
                  onChange={(e) =>
                    setNotes(
                      e.target.value
                    )
                  }
                  placeholder="Optional note"
                  className="h-12 w-full rounded-2xl border border-black/[0.06] bg-white px-4 text-sm outline-none focus:border-black"
                />
              </div>
            </div>

            {/* items */}
            <div>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#111111]">
                    Line items
                  </p>

                  <p className="mt-1 text-sm text-[#5F6368]">
                    Add services or products
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addItem}
                  className="text-sm font-medium text-[#111111] hover:opacity-70"
                >
                  + Add item
                </button>
              </div>

              <div className="space-y-3">
                {items.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="grid gap-3 lg:grid-cols-[1fr_120px_180px_48px]"
                    >
                      <input
                        type="text"
                        value={
                          item.description
                        }
                        onChange={(e) =>
                          updateItem(
                            index,
                            "description",
                            e.target
                              .value
                          )
                        }
                        placeholder="Website redesign"
                        className="h-12 rounded-2xl border border-black/[0.06] bg-[#FAFAFA] px-4 text-sm outline-none focus:border-black"
                      />

                      <input
                        type="number"
                        min={1}
                        value={
                          item.quantity
                        }
                        onChange={(e) =>
                          updateItem(
                            index,
                            "quantity",
                            Number(
                              e.target
                                .value
                            )
                          )
                        }
                        className="h-12 rounded-2xl border border-black/[0.06] bg-[#FAFAFA] px-4 text-sm outline-none focus:border-black"
                      />

                      <input
                        type="number"
                        min={0}
                        value={
                          item.unitPrice
                        }
                        onChange={(e) =>
                          updateItem(
                            index,
                            "unitPrice",
                            Number(
                              e.target
                                .value
                            )
                          )
                        }
                        placeholder="0"
                        className="h-12 rounded-2xl border border-black/[0.06] bg-[#FAFAFA] px-4 text-sm outline-none focus:border-black"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeItem(index)
                        }
                        disabled={
                          items.length === 1
                        }
                        className="flex h-12 items-center justify-center rounded-2xl border border-black/[0.06] transition hover:bg-black hover:text-white disabled:opacity-30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <div className="rounded-2xl bg-[#111111] px-5 py-4 text-white">
                  <p className="text-xs text-white/60">
                    Subtotal
                  </p>

                  <p className="mt-1 text-2xl font-semibold">
                    {formatNaira(
                      subtotal * 100
                    )}
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 rounded-2xl bg-[#111111] px-6 text-sm font-medium text-white hover:bg-black"
            >
              {isSubmitting
                ? "Creating..."
                : "Create quotation"}

              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}

      {/* table */}
      <div className="mt-8 overflow-hidden rounded-[28px] border border-black/[0.06] bg-white">
        <div className="border-b border-black/[0.06] px-7 py-5">
          <h3 className="text-lg font-semibold text-[#111111]">
            All quotations
          </h3>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-7">
            {Array.from({
              length: 6,
            }).map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-2xl bg-[#F5F5F5]"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
            <div className="rounded-3xl bg-[#F5F5F5] p-5">
              <FileText className="h-8 w-8 text-[#7C8188]" />
            </div>

            <h3 className="mt-6 text-xl font-semibold text-[#111111]">
              No quotations yet
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-7 text-[#5F6368]">
              Create your first quotation
              to start managing client
              proposals and approvals.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-black/[0.06] bg-[#FAFAFA]">
                  <th className="px-7 py-4 text-left text-xs font-medium uppercase tracking-wide text-[#7C8188]">
                    Number
                  </th>

                  <th className="px-7 py-4 text-left text-xs font-medium uppercase tracking-wide text-[#7C8188]">
                    Customer
                  </th>

                  <th className="px-7 py-4 text-left text-xs font-medium uppercase tracking-wide text-[#7C8188]">
                    Status
                  </th>

                  <th className="px-7 py-4 text-left text-xs font-medium uppercase tracking-wide text-[#7C8188]">
                    Total
                  </th>

                  <th className="px-7 py-4 text-left text-xs font-medium uppercase tracking-wide text-[#7C8188]">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((q) => (
                  <tr
                    key={q.id}
                    className="border-b border-black/[0.04] transition hover:bg-[#FAFAFA]"
                  >
                    <td className="px-7 py-5">
                      <p className="font-semibold text-[#111111]">
                        QUO-
                        {String(
                          q.number
                        ).padStart(
                          3,
                          "0"
                        )}
                      </p>
                    </td>

                    <td className="px-7 py-5 text-sm text-[#5F6368]">
                      {q.customer
                        ?.name ?? "—"}
                    </td>

                    <td className="px-7 py-5">
                      <div className="relative inline-flex">
                        <select
                          value={q.status}
                          onChange={(e) =>
                            handleStatusChange(
                              q.id,
                              e.target
                                .value as Quotation["status"]
                            )
                          }
                          className={`appearance-none rounded-full px-3 py-1.5 pr-7 text-xs font-medium outline-none ${STATUS_STYLES[q.status]}`}
                        >
                          {STATUS_OPTIONS.map(
                            (s) => (
                              <option
                                key={s}
                                value={s}
                              >
                                {s}
                              </option>
                            )
                          )}
                        </select>

                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 opacity-60" />
                      </div>
                    </td>

                    <td className="px-7 py-5 font-medium text-[#111111]">
                      {formatNaira(
                        q.total
                      )}
                    </td>

                    <td className="px-7 py-5 text-sm text-[#5F6368]">
                      {new Date(
                        q.issueDate
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}