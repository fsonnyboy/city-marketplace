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
      router.push("/");
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
      router.push("/");
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
