import { useQuery } from "@tanstack/react-query";
import { jobsApi } from "@/api/jobs";
import { usersApi } from "@/api/users";

export const domainStatsQueryKeys = {
  userStats: ["domain-stats", "user"] as const,
  jobStats: ["domain-stats", "job"] as const,
};

export function useUserDomainStats() {
  return useQuery({
    queryKey: domainStatsQueryKeys.userStats,
    queryFn: usersApi.getStats,
    refetchInterval: 10000,
  });
}

export function useJobDomainStats() {
  return useQuery({
    queryKey: domainStatsQueryKeys.jobStats,
    queryFn: jobsApi.getStats,
    refetchInterval: 10000,
  });
}
