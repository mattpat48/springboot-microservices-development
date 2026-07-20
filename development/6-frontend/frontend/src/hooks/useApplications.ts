import { useMemo } from "react";
import { deriveApplications } from "@/lib/applications";
import { useJobs } from "./useJobs";
import { useUsers } from "./useUsers";

export function useApplications() {
  const jobs = useJobs();
  const users = useUsers();

  const data = useMemo(() => deriveApplications(jobs.data ?? [], users.data ?? []), [jobs.data, users.data]);

  return {
    data,
    isLoading: jobs.isLoading || users.isLoading,
    isError: jobs.isError || users.isError,
    error: jobs.error ?? users.error,
    refetch: async () => {
      await Promise.all([jobs.refetch(), users.refetch()]);
    },
  };
}
