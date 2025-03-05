import { apiRequest } from "./queryClient";
import type { User } from "@shared/schema";

export async function login(email: string, password: string): Promise<User> {
  const res = await apiRequest("POST", "/api/auth/login", { email, password });
  return res.json();
}

export async function register(userData: {
  email: string;
  password: string;
  name: string;
  role: string;
}): Promise<User> {
  const res = await apiRequest("POST", "/api/auth/register", userData);
  return res.json();
}

export async function logout(): Promise<void> {
  await apiRequest("POST", "/api/auth/logout");
}
