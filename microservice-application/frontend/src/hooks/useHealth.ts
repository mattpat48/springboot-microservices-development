import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { systemApi } from "@/api/system";

export const healthQueryKey = ["system", "health"] as const;

export function useHealth() {
  return useQuery({
    queryKey: healthQueryKey,
    queryFn: systemApi.health,
    refetchInterval: 30000,
    retry: 1,
  });
}

export function useRefreshConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: systemApi.refresh,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: healthQueryKey }),
  });
}
