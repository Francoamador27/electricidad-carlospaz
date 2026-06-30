import type { ContactFormData, QuoteFormData, ApiResponse, Service, Project } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

async function request<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  contact: {
    send: (data: ContactFormData) =>
      request<null>("/contact", { method: "POST", body: JSON.stringify(data) }),
  },

  quote: {
    send: (data: QuoteFormData) =>
      request<null>("/quote", { method: "POST", body: JSON.stringify(data) }),
  },

  services: {
    list: () => request<Service[]>("/services"),
  },

  projects: {
    list: () => request<Project[]>("/projects"),
  },

  blog: {
    list: () => request<unknown[]>("/blog"),
  },
};
