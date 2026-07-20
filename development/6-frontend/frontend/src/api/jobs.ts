import { apiClient } from "@/lib/apiClient";
import type { Job } from "@/types/openjob";

export const jobsApi = {
  getAll: () => apiClient.get<Job[]>("/api/job"),
  getById: (id: number) => apiClient.get<Job>(`/api/job/${id}`),
  create: (job: Job) => apiClient.post("/api/job", job),
  update: (job: Job) => apiClient.put("/api/job", job),
  remove: (id: number) => apiClient.del(`/api/job/${id}`),
  apply: (username: string, jobId: number) =>
    apiClient.get<void>(`/api/job/apply/${encodeURIComponent(username)}/${jobId}`),
};
