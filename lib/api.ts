const BASE = "";

export type ApiError = {
  error: string;
  details?: Record<string, string[]>;
};

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    const err: ApiError = {
      error: data.error || "Request failed",
      details: data.details,
    };
    throw err;
  }
  return data;
}

export const api = {
  cities: {
    list: () => fetcher<{ id: string; name: string; slug: string }[]>("/api/cities"),
    get: (slug: string) =>
      fetcher<{ id: string; name: string; slug: string }>(`/api/cities/${slug}`),
  },
  auth: {
    me: () =>
      fetcher<{
        user: {
          id: string;
          name: string;
          email: string | null;
          cityId: string;
          avatarUrl: string | null;
          city: { id: string; name: string; slug: string };
        } | null;
      }>("/api/auth/me"),
    login: (body: { email: string; password: string }) =>
      fetcher<{ user: { id: string; name: string; email: string | null; cityId: string } }>(
        "/api/auth/login",
        { method: "POST", body: JSON.stringify(body) }
      ),
    signup: (body: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      password: string;
      cityId: string;
    }) =>
      fetcher<{ user: { id: string; name: string; email: string | null; cityId: string } }>(
        "/api/auth/signup",
        { method: "POST", body: JSON.stringify(body) }
      ),
    logout: () =>
      fetcher<{ success: boolean }>("/api/auth/logout", { method: "POST" }),
  },
};
