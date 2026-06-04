import { api } from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  memberships: {
    id: string;
    role: string;
    organization: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await api.post<{ user: User; token: string }>(
    "/auth/register",
    data
  );
  return response.data;
}

export async function loginUser(data: { email: string; password: string }) {
  const response = await api.post<{ user: User; token: string }>(
    "/auth/login",
    data
  );
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get<{ user: User }>("/auth/me");
  return response.data.user;
}