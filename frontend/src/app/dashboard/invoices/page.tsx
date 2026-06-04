"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  listInvoices,
  createInvoice,
  convertQuotationToInvoice,
  updateInvoiceStatus,
  formatNaira,
  type Invoice,
} from "@/lib/invoices";
import { api } from "@/lib/api";

import {
  Plus,
  Trash2,
  ChevronDown,
  ArrowRightLeft,
  Search,
  Filter,
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
}

interface Quotation {
  id: string;
  number: number;
  total: number;
  customer: { name: string } | null;
}

const STATUS_STYLES: Record<Invoice["status"], string> = {
  UNPAID:
    "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  PAID:
    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  OVERDUE:
    "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
  CANCELLED:
    "bg-zinc-100 text-zinc-600 ring-1 ring-inset ring-zinc-200",
};

const STATUS_OPTIONS: Invoice["status"][] = [
  "UNPAID",
  "PAID",
  "OVERDUE",
  "CANCELLED",
];

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

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5">
      <p className="text-sm text-zinc-500">{label}</p>

      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
        {value}
      </h3>
    </div>
  );
}

export default function InvoicesPage() {
  const { user } = useAuth();

  const orgId =
    user?.memberships?.[0]?.organization?.id;

  const [invoices, setInvoices] = useState<Invoice[]>(
    []
  );

  const [customers, setCustomers] = useState<
    Customer[]
  >([]);

  const [quotations, setQuotations] = useState<
    Quotation[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [showConvert, setShowConvert] =
    useState(false);

  const [search, setSearch] = useState("");

  // create invoice form
  const [customerId, setCustomerId] =
    useState("");

  const [dueDate, setDueDate] =
    useState("");

  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<
    LineItem[]
  >([emptyItem()]);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  // convert form
  const [selectedQuotationId, setSelectedQuotationId] =
    useState("");

  const [isConverting, setIsConverting] =
    useState(false);

  const load = useCallback(async () => {
    if (!orgId) return;

    setIsLoading(true);

    try {
      const [inv, cust, quot] =
        await Promise.all([
          listInvoices(orgId),

          api
            .get<{ customers: Customer[] }>(
              `/organizations/${orgId}/customers`
            )
            .then((r) => r.data.customers),

          api
            .get<{ quotations: Quotation[] }>(
              `/organizations/${orgId}/quotations`
            )
            .then((r) => r.data.quotations),
        ]);

      setInvoices(inv);
      setCustomers(cust);
      setQuotations(quot);
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
          ? { ...item, [field]: value }
          : item
      )
    );
  }

  const subtotal = items.reduce(
    (sum, item) =>
      sum + item.quantity * item.unitPrice,
    0
  );

  async function handleCreate(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await createInvoice(orgId!, {
        customerId: customerId || undefined,
        dueDate: dueDate || undefined,
        notes: notes || undefined,
        items,
      });

      setCustomerId("");
      setDueDate("");
      setNotes("");
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
        )?.response?.data?.error?.message ??
        "Something went wrong";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleConvert(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!selectedQuotationId) return;

    setIsConverting(true);

    try {
      await convertQuotationToInvoice(
        orgId!,
        selectedQuotationId
      );

      setSelectedQuotationId("");
      setShowConvert(false);

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
        )?.response?.data?.error?.message ??
        "Something went wrong";

      setError(message);
    } finally {
      setIsConverting(false);
    }
  }

  async function handleStatusChange(
    invoiceId: string,
    status: Invoice["status"]
  ) {
    if (!orgId) return;

    await updateInvoiceStatus(
      orgId,
      invoiceId,
      status
    );

    await load();
  }

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.customer?.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      String(inv.number).includes(search)
  );

  const unpaidTotal = invoices
    .filter((i) => i.status === "UNPAID")
    .reduce((sum, i) => sum + i.total, 0);

  const paidTotal = invoices
    .filter((i) => i.status === "PAID")
    .reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="mx-auto max-w-[1600px] px-6 py-8 lg:px-10">
        {/* header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
              Invoices
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Manage invoices, payments and billing
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setShowConvert(!showConvert);
                setShowForm(false);
              }}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              <ArrowRightLeft className="h-4 w-4" />
              Convert quotation
            </button>

            <button
              onClick={() => {
                setShowForm(!showForm);
                setShowConvert(false);
              }}
              className="inline-flex h-11 items-center gap-2 rounded-2xl bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-black"
            >
              <Plus className="h-4 w-4" />
              New invoice
            </button>
          </div>
        </div>

        {/* stats */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard
            label="Total invoices"
            value={String(invoices.length)}
          />

          <StatCard
            label="Outstanding"
            value={formatNaira(unpaidTotal)}
          />

          <StatCard
            label="Paid revenue"
            value={formatNaira(paidTotal)}
          />
        </div>

        {/* filters */}
        <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-zinc-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search invoices..."
              className="h-11 w-full rounded-2xl border border-zinc-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-zinc-400"
            />
          </div>

          <button className="inline-flex h-11 items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* convert card */}
        {showConvert && (
          <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-zinc-950">
              Convert quotation
            </h2>

            <form
              onSubmit={handleConvert}
              className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end"
            >
              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Quotation
                </label>

                <select
                  value={selectedQuotationId}
                  onChange={(e) =>
                    setSelectedQuotationId(
                      e.target.value
                    )
                  }
                  className="h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-400"
                >
                  <option value="">
                    Select quotation
                  </option>

                  {quotations.map((q) => (
                    <option
                      key={q.id}
                      value={q.id}
                    >
                      QUO-
                      {String(q.number).padStart(
                        3,
                        "0"
                      )}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isConverting}
                className="h-11 rounded-2xl bg-zinc-950 px-5 text-sm font-medium text-white"
              >
                {isConverting
                  ? "Converting..."
                  : "Convert"}
              </button>
            </form>
          </div>
        )}

        {/* create invoice */}
        {showForm && (
          <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-zinc-950">
              Create invoice
            </h2>

            <form
              onSubmit={handleCreate}
              className="mt-6 space-y-6"
            >
              <div className="grid gap-4 lg:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Customer
                  </label>

                  <select
                    value={customerId}
                    onChange={(e) =>
                      setCustomerId(
                        e.target.value
                      )
                    }
                    className="h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-400"
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
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Due date
                  </label>

                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) =>
                      setDueDate(
                        e.target.value
                      )
                    }
                    className="h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Notes
                  </label>

                  <input
                    value={notes}
                    onChange={(e) =>
                      setNotes(
                        e.target.value
                      )
                    }
                    placeholder="Payment terms..."
                    className="h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-400"
                  />
                </div>
              </div>

              {/* line items */}
              <div className="rounded-3xl border border-zinc-200">
                <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-950">
                      Line items
                    </h3>

                    <p className="mt-1 text-xs text-zinc-500">
                      Add products or services
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setItems((p) => [
                        ...p,
                        emptyItem(),
                      ])
                    }
                    className="text-sm font-medium text-zinc-950"
                  >
                    + Add item
                  </button>
                </div>

                <div className="divide-y divide-zinc-200">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="grid gap-3 p-5 lg:grid-cols-[1fr_120px_160px_40px]"
                    >
                      <input
                        value={item.description}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Description"
                        className="h-11 rounded-2xl border border-zinc-200 px-4 text-sm outline-none focus:border-zinc-400"
                      />

                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "quantity",
                            Number(
                              e.target.value
                            )
                          )
                        }
                        className="h-11 rounded-2xl border border-zinc-200 px-4 text-sm outline-none focus:border-zinc-400"
                      />

                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "unitPrice",
                            Number(
                              e.target.value
                            )
                          )
                        }
                        className="h-11 rounded-2xl border border-zinc-200 px-4 text-sm outline-none focus:border-zinc-400"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setItems((p) =>
                            p.filter(
                              (_, i) =>
                                i !== index
                            )
                          )
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-zinc-200 px-5 py-4">
                  <p className="text-sm text-zinc-500">
                    Subtotal
                  </p>

                  <p className="text-lg font-semibold text-zinc-950">
                    {formatNaira(
                      subtotal * 100
                    )}
                  </p>
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-11 items-center rounded-2xl bg-zinc-950 px-5 text-sm font-medium text-white"
                >
                  {isSubmitting
                    ? "Saving..."
                    : "Create invoice"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowForm(false)
                  }
                  className="inline-flex h-11 items-center rounded-2xl border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* table */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-zinc-200">
                  {[
                    "Invoice",
                    "Customer",
                    "Status",
                    "Amount",
                    "Due date",
                    "Source",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-16 text-center text-sm text-zinc-500"
                    >
                      Loading invoices...
                    </td>
                  </tr>
                ) : filteredInvoices.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-16 text-center"
                    >
                      <p className="text-sm font-medium text-zinc-700">
                        No invoices found
                      </p>

                      <p className="mt-1 text-sm text-zinc-500">
                        Create your first invoice
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="transition hover:bg-zinc-50/80"
                    >
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-medium text-zinc-950">
                            INV-
                            {String(
                              inv.number
                            ).padStart(3, "0")}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-zinc-600">
                        {inv.customer?.name ??
                          "—"}
                      </td>

                      <td className="px-6 py-5">
                        <div className="relative inline-block">
                          <select
                            value={inv.status}
                            onChange={(e) =>
                              handleStatusChange(
                                inv.id,
                                e.target
                                  .value as Invoice["status"]
                              )
                            }
                            className={`appearance-none rounded-full px-3 py-1.5 pr-7 text-xs font-semibold outline-none ${STATUS_STYLES[inv.status]}`}
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

                          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-current opacity-60" />
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold text-zinc-950">
                        {formatNaira(
                          inv.total
                        )}
                      </td>

                      <td className="px-6 py-5 text-sm text-zinc-600">
                        {inv.dueDate
                          ? new Date(
                              inv.dueDate
                            ).toLocaleDateString(
                              "en-NG",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "—"}
                      </td>

                      <td className="px-6 py-5">
                        {inv.quotation ? (
                          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                            QUO-
                            {String(
                              inv.quotation
                                .number
                            ).padStart(
                              3,
                              "0"
                            )}
                          </span>
                        ) : (
                          <span className="text-sm text-zinc-400">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}