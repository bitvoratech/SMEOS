import { api } from "./api";

export const EXPENSE_CATEGORIES = [
  "SALARIES",
  "RENT",
  "UTILITIES",
  "MARKETING",
  "EQUIPMENT",
  "TRAVEL",
  "SOFTWARE",
  "PROFESSIONAL_SERVICES",
  "TAXES",
  "OTHER",
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  SALARIES: "Salaries",
  RENT: "Rent",
  UTILITIES: "Utilities",
  MARKETING: "Marketing",
  EQUIPMENT: "Equipment",
  TRAVEL: "Travel",
  SOFTWARE: "Software",
  PROFESSIONAL_SERVICES: "Professional Services",
  TAXES: "Taxes",
  OTHER: "Other",
};

export interface Expense {
  id: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  notes: string | null;
  createdAt: string;
}

export async function listExpenses(orgId: string) {
  const res = await api.get<{ expenses: Expense[] }>(
    `/organizations/${orgId}/expenses`
  );
  return res.data.expenses;
}

export async function createExpense(
  orgId: string,
  data: {
    description: string;
    category: ExpenseCategory;
    amount: number;
    date?: string;
    notes?: string;
  }
) {
  const res = await api.post<{ expense: Expense }>(
    `/organizations/${orgId}/expenses`,
    data
  );
  return res.data.expense;
}

export async function deleteExpense(orgId: string, expenseId: string) {
  await api.delete(`/organizations/${orgId}/expenses/${expenseId}`);
}

export function formatNaira(kobo: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(kobo / 100);
}