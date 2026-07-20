import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/api/users";
import type { User } from "@/types/openjob";

export const usersQueryKey = ["users"] as const;

export function useUsers() {
  return useQuery({ queryKey: usersQueryKey, queryFn: usersApi.getAll });
}

export function useUser(id?: number) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => usersApi.getById(Number(id)),
    enabled: id != null,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: User) => usersApi.create(user),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersQueryKey }),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: User) => usersApi.update(user),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersQueryKey }),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => usersApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}
