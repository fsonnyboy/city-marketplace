"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "./api";
import { getListings } from "./listings";

export const queryKeys = {
  auth: ["auth"] as const,
  cities: ["cities"] as const,
  listings: ["listings"] as const,
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