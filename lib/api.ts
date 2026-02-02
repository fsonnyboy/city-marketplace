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
          firstName: string;
          lastName: string;
          email: string | null;
          cityId: string;
          avatarUrl: string | null;
          city: { id: string; name: string; slug: string };
        } | null;
      }>("/api/auth/me"),
    login: (body: { email: string; password: string }) =>
      fetcher<{ user: { id: string; firstName: string; lastName: string; email: string | null; cityId: string } }>(
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
      fetcher<{ user: { id: string; firstName: string; lastName: string; email: string | null; cityId: string } }>(
        "/api/auth/signup",
        { method: "POST", body: JSON.stringify(body) }
      ),
    logout: () =>
      fetcher<{ success: boolean }>("/api/auth/logout", { method: "POST" }),
  },
  listings: {
    list: (cityId: string) =>
      fetcher<{ id: string; title: string; price: number; condition: string; status: string; category: { id: string; name: string; slug: string }; user: { id: string; firstName: string; lastName: string; avatarUrl: string | null; rating: number; ratingCount: number } }[]>(`/api/listings?cityId=${cityId}`),
  },
  userListings: {
    list: (userId: string) =>
      fetcher<{ id: string; title: string; price: number; condition: string; status: string; category: { id: string; name: string; slug: string }; user: { id: string; firstName: string; lastName: string; avatarUrl: string | null; rating: number; ratingCount: number } }[]>(`/api/user/listings?userId=${userId}`),
    get: (listingId: string, userId: string) =>
      fetcher<{ id: string; title: string; price: number; condition: string; status: string; category: { id: string; name: string; slug: string }; user: { id: string; firstName: string; lastName: string; avatarUrl: string | null; rating: number; ratingCount: number } }>(`/api/user/listings/${listingId}?userId=${userId}`),
    create: (body: { title: string; price: number; condition: string; status: string; categoryId: string; userId: string }) =>
      fetcher<{ id: string; title: string; price: number; condition: string; status: string; category: { id: string; name: string; slug: string }; user: { id: string; firstName: string; lastName: string; avatarUrl: string | null; rating: number; ratingCount: number } }>("/api/user/listings", { method: "POST", body: JSON.stringify(body) }),
    update: (listingId: string, body: { title: string; price: number; condition: string; status: string; categoryId: string; userId: string }) =>
      fetcher<{ id: string; title: string; price: number; condition: string; status: string; category: { id: string; name: string; slug: string }; user: { id: string; firstName: string; lastName: string; avatarUrl: string | null; rating: number; ratingCount: number } }>(`/api/user/listings/${listingId}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (listingId: string, userId: string) =>
      fetcher<{ id: string; title: string; price: number; condition: string; status: string; category: { id: string; name: string; slug: string }; user: { id: string; firstName: string; lastName: string; avatarUrl: string | null; rating: number; ratingCount: number } }>(`/api/user/listings/${listingId}?userId=${userId}`, { method: "DELETE" }),
  },
};
