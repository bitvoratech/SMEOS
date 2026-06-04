import { api } from "./api";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  currency: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export async function createOrganization(name: string) {
  const response = await api.post<{ organization: Organization }>(
    "/organizations",
    { name }
  );
  return response.data.organization;
}