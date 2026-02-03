"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "./api";

export const queryKeys = {
  auth: ["auth"] as const,
  cities: ["cities"] as const,
  listings: ["listings"] as const,
  categories: ["categories"] as const,
};

export function useAuth() {
  return useQuery({
    queryKey: queryKeys.auth,
    queryFn: api.auth.me,
  });
}

export function useCities() {
  return useQuery({
    queryKey: queryKeys.cities,
    queryFn: api.cities.list,
  });
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.auth.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth });
      router.push("/dashboard");
      router.refresh();
    },
  });
}

export function useSignup() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.auth.signup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth });
      router.push("/dashboard");
      router.refresh();
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.auth.logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth });
      router.push("/");
      router.refresh();
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: api.categories.list,
  });
}

export function useListings() {
  const { data: user } = useAuth();
  const cityId = user?.user?.cityId ?? "";
  return useQuery({ 
    queryKey: queryKeys.listings,
    queryFn: () => api.listings.list(cityId),
    enabled: !!cityId,
  });
}

export function useUserListings() {
  const { data: user } = useAuth();
  const userId = user?.user?.id ?? "";
  return useQuery({
    queryKey: ["userListings", userId] as const,
    queryFn: () => api.userListings.list(userId),
    enabled: !!userId,
  });
}

export function useUserListing(listingId: string) {
  const { data: user } = useAuth();
  const userId = user?.user?.id ?? "";
  return useQuery({
    queryKey: ["userListing", listingId, userId] as const,
    queryFn: () => api.userListings.get(listingId, userId),
    enabled: !!listingId && !!userId,
  });
}

export function useCreateListing() {
  const { data: user } = useAuth();
  const userId = user?.user?.id ?? "";
  const cityId = user?.user?.cityId ?? "";
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (body: {
      title: string;
      description: string;
      price: number;
      negotiable: boolean;
      condition: "NEW" | "USED";
      status: "ACTIVE" | "SOLD" | "EXPIRED" | "REMOVED";
      categoryId: string;
    }) => api.userListings.create({ ...body, userId, cityId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userListings", userId] as const });
      router.push("/dashboard");
      router.refresh();
    },
  });
}

type UpdateListingPayload = {
  listingId: string;
  title: string;
  description: string;
  price: number;
  negotiable: boolean;
  condition: "NEW" | "USED";
  status: "ACTIVE" | "SOLD" | "EXPIRED" | "REMOVED";
  categoryId: string;
};


export function useUpdateListing() {
  const { data: user } = useAuth();
  const userId = user?.user?.id ?? "";
  const cityId = user?.user?.cityId ?? "";
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (payload: UpdateListingPayload) => {
      const { listingId, ...body } = payload;
      return api.userListings.update(listingId, { ...body, userId, cityId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userListings", userId] as const });
      router.push("/dashboard");
      router.refresh();
    },
  });
}