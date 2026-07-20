import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jobsApi } from "@/api/jobs";
import type { Job } from "@/types/openjob";

export const jobsQueryKey = ["jobs"] as const;

export function useJobs() {
  return useQuery({ queryKey: jobsQueryKey, queryFn: jobsApi.getAll });
}

export function useJob(id?: number) {
  return useQuery({
    queryKey: ["jobs", id],
    queryFn: () => jobsApi.getById(Number(id)),
    enabled: id != null,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (job: Job) => jobsApi.create(job),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: jobsQueryKey }),
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (job: Job) => jobsApi.update(job),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: jobsQueryKey }),
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => jobsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: jobsQueryKey }),
  });
}

export function useApplyToJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ username, jobId }: { username: string; jobId: number }) => jobsApi.apply(username, jobId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: jobsQueryKey }),
  });
}
