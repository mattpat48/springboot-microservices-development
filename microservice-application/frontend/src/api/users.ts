import { apiClient } from "@/lib/apiClient";
import type { User } from "@/types/openjob";

export const usersApi = {
  getAll: () => apiClient.get<User[]>("/api/usr"),
  getById: (id: number) => apiClient.get<User>(`/api/usr/id/${id}`),
  getByUsername: (username: string) => apiClient.get<User>(`/api/usr/username/${encodeURIComponent(username)}`),
  create: (user: User) => apiClient.post("/api/usr", user),
  update: (user: User) => apiClient.put("/api/usr", user),
  remove: (id: number) => apiClient.del(`/api/usr/id/${id}`),
};
