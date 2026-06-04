import { api } from "./api";

export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  id: string;
  number: number;
  status: "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  issueDate: string;
  expiryDate: string | null;
  notes: string | null;
  subtotal: number;
  tax: number;
  total: number;
  customerId: string | null;
  customer: { id: string; name: string; email: string | null } | null;
  items: QuotationItem[];
  createdAt: string;
}

export async function listQuotations(orgId: string) {
  const res = await api.get<{ quotations: Quotation[] }>(
    `/organizations/${orgId}/quotations`
  );
  return res.data.quotations;
}

export async function createQuotation(
  orgId: string,
  data: {
    customerId?: string;
    notes?: string;
    expiryDate?: string;
    items: { description: string; quantity: number; unitPrice: number }[];
  }
) {
  const res = await api.post<{ quotation: Quotation }>(
    `/organizations/${orgId}/quotations`,
    data
  );
  return res.data.quotation;
}

export async function updateQuotationStatus(
  orgId: string,
  quotationId: string,
  status: Quotation["status"]
) {
  const res = await api.patch<{ quotation: Quotation }>(
    `/organizations/${orgId}/quotations/${quotationId}`,
    { status }
  );
  return res.data.quotation;
}

export function formatNaira(kobo: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(kobo / 100);
}