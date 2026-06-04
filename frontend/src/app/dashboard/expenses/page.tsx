"use client";

import { useEffect, useState, useCallback } from "react";

import {
  Plus,
  Trash2,
  Wallet,
  TrendingDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/contexts/auth-context";

import {
  listExpenses,
  createExpense,
  deleteExpense,
  formatNaira,
  EXPENSE_CATEGORIES,
  CATEGORY_LABELS,
  type Expense,
  type ExpenseCategory,
} from "@/lib/expenses";

export default function ExpensesPage() {
  const { user } = useAuth();

  const orgId =
    user?.memberships?.[0]?.organization?.id;

  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [description, setDescription] =
    useState("");

  const [category, setCategory] =
    useState<ExpenseCategory>("OTHER");

  const [amount, setAmount] =
    useState("");

  const [date, setDate] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const load = useCallback(async () => {
    if (!orgId) return;

    setIsLoading(true);

    try {
      const data = await listExpenses(orgId);

      setExpenses(data);
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    if (orgId) void load();
  }, [orgId, load]);

  async function handleCreate(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await createExpense(orgId!, {
        description,
        category,
        amount: Math.round(
          parseFloat(amount) * 100
        ),
        date: date || undefined,
        notes: notes || undefined,
      });

      setDescription("");
      setCategory("OTHER");
      setAmount("");
      setDate("");
      setNotes("");
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

  async function handleDelete(
    expenseId: string
  ) {
    if (!orgId) return;

    await deleteExpense(orgId, expenseId);

    await load();
  }

  const totalThisMonth = expenses
    .filter((e) => {
      const d = new Date(e.date);
      const now = new Date();

      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-[#F5F7FA] px-6 py-8 lg:px-10">
      {/* header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-[#6B7280]">
            Expense management
          </p>

          <h1 className="mt-1 text-4xl font-semibold tracking-[-0.04em] text-[#111111]">
            Expenses
          </h1>
        </div>

        <Button
          onClick={() =>
            setShowForm(!showForm)
          }
          className="h-11 rounded-2xl bg-[#111111] px-5 text-sm font-medium text-white hover:bg-black"
        >
          <Plus className="h-4 w-4" />
          Add expense
        </Button>
      </div>

      {/* summary */}
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl border border-black/[0.06] bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">
                Total expenses
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#111111]">
                {formatNaira(totalThisMonth)}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
              <Wallet className="h-5 w-5 text-red-500" />
            </div>
          </div>

          <div className="mt-5 inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-500">
            <TrendingDown className="h-3 w-3" />
            Monthly outgoing
          </div>
        </div>
      </div>

      {/* form */}
      {showForm && (
        <div className="mt-6 rounded-3xl border border-black/[0.06] bg-white p-6">
          <div className="mb-6">
            <p className="text-sm text-[#6B7280]">
              New expense
            </p>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#111111]">
              Record expense
            </h2>
          </div>

          <form
            onSubmit={handleCreate}
            className="space-y-5"
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#111111]">
                  Description
                </label>

                <input
                  type="text"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Office rent"
                  required
                  className="h-12 w-full rounded-2xl border border-black/[0.08] bg-[#F9FAFB] px-4 text-sm text-[#111111] outline-none transition focus:border-black"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#111111]">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target
                        .value as ExpenseCategory
                    )
                  }
                  className="h-12 w-full rounded-2xl border border-black/[0.08] bg-[#F9FAFB] px-4 text-sm text-[#111111] outline-none transition focus:border-black"
                >
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option
                      key={c}
                      value={c}
                    >
                      {CATEGORY_LABELS[c]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#111111]">
                  Amount (₦)
                </label>

                <input
                  type="number"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
                  placeholder="50000"
                  required
                  min={0}
                  step={0.01}
                  className="h-12 w-full rounded-2xl border border-black/[0.08] bg-[#F9FAFB] px-4 text-sm text-[#111111] outline-none transition focus:border-black"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#111111]">
                  Date
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) =>
                    setDate(e.target.value)
                  }
                  className="h-12 w-full rounded-2xl border border-black/[0.08] bg-[#F9FAFB] px-4 text-sm text-[#111111] outline-none transition focus:border-black"
                />
              </div>

              <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-medium text-[#111111]">
                  Notes
                </label>

                <textarea
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  placeholder="Optional notes"
                  rows={4}
                  className="w-full rounded-2xl border border-black/[0.08] bg-[#F9FAFB] px-4 py-3 text-sm text-[#111111] outline-none transition focus:border-black"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 rounded-2xl bg-[#111111] px-5 text-white hover:bg-black"
              >
                {isSubmitting
                  ? "Saving..."
                  : "Save expense"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setShowForm(false)
                }
                className="h-11 rounded-2xl border-black/[0.08] bg-white px-5 text-[#111111]"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* table */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-black/[0.06] bg-white">
        {isLoading ? (
          <div className="p-10 text-sm text-[#6B7280]">
            Loading expenses...
          </div>
        ) : expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F3F4F6]">
              <Wallet className="h-7 w-7 text-[#6B7280]" />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-[#111111]">
              No expenses yet
            </h3>

            <p className="mt-2 max-w-sm text-sm text-[#6B7280]">
              Start recording your business
              expenses to monitor outgoing cash
              flow.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-black/[0.06] bg-[#FAFAFA]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  Description
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  Category
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  Amount
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  Date
                </th>

                <th className="px-6 py-4" />
              </tr>
            </thead>

            <tbody>
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b border-black/[0.04] transition hover:bg-[#FAFAFA]"
                >
                  <td className="px-6 py-5">
                    <p className="font-medium text-[#111111]">
                      {expense.description}
                    </p>

                    {expense.notes && (
                      <p className="mt-1 text-sm text-[#6B7280]">
                        {expense.notes}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-medium text-[#374151]">
                      {
                        CATEGORY_LABELS[
                          expense.category
                        ]
                      }
                    </span>
                  </td>

                  <td className="px-6 py-5 text-sm font-semibold text-[#111111]">
                    {formatNaira(expense.amount)}
                  </td>

                  <td className="px-6 py-5 text-sm text-[#6B7280]">
                    {new Date(
                      expense.date
                    ).toLocaleDateString(
                      "en-NG",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </td>

                  <td className="px-6 py-5 text-right">
                    <button
                      onClick={() =>
                        handleDelete(expense.id)
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-[#6B7280] transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}