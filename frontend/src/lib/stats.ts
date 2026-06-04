import { api } from "./api";

export interface DashboardStats {
  totalCustomers: number;
  openInvoices: {
    count: number;
    total: number;
  };
  revenue: {
    thisMonth: number;
    lastMonth: number;
    percentChange: number | null;
  };
  expenses: {
    thisMonth: number;
    lastMonth: number;
    percentChange: number | null;
  };
  profit: {
    thisMonth: number;
  };
  invoicesByStatus: {
    status: string;
    count: number;
    total: number;
  }[];
}

export async function getDashboardStats(orgId: string) {
  const res = await api.get<{ stats: DashboardStats }>(
    `/organizations/${orgId}/stats`
  );
  return res.data.stats;
}