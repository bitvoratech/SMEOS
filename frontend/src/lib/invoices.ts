import { api } from "./api";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  number: number;
  status: "UNPAID" | "PAID" | "OVERDUE" | "CANCELLED";
  issueDate: string;
  dueDate: string | null;
  notes: string | null;
  subtotal: number;
  tax: number;
  total: number;
  paidAt: string | null;
  customerId: string | null;
  customer: { id: string; name: string; email: string | null; phone: string | null } | null;
  quotation: { id: string; number: number } | null;
  items: InvoiceItem[];
  createdAt: string;
}

export async function listInvoices(orgId: string) {
  const res = await api.get<{ invoices: Invoice[] }>(
    `/organizations/${orgId}/invoices`
  );
  return res.data.invoices;
}

export async function createInvoice(
  orgId: string,
  data: {
    customerId?: string;
    dueDate?: string;
    notes?: string;
    items: { description: string; quantity: number; unitPrice: number }[];
  }
) {
  const res = await api.post<{ invoice: Invoice }>(
    `/organizations/${orgId}/invoices`,
    data
  );
  return res.data.invoice;
}

export async function convertQuotationToInvoice(
  orgId: string,
  quotationId: string
) {
  const res = await api.post<{ invoice: Invoice }>(
    `/organizations/${orgId}/invoices/convert`,
    { quotationId }
  );
  return res.data.invoice;
}

export async function updateInvoiceStatus(
  orgId: string,
  invoiceId: string,
  status: Invoice["status"]
) {
  const res = await api.patch<{ invoice: Invoice }>(
    `/organizations/${orgId}/invoices/${invoiceId}`,
    { status }
  );
  return res.data.invoice;
}

export function formatNaira(kobo: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(kobo / 100);
}