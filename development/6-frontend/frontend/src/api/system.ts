import { apiClient } from "@/lib/apiClient";
import type { Health, Info } from "@/types/openjob";

export const systemApi = {
  health: () => apiClient.get<Health>("/actuator/health"),
  info: () => apiClient.get<Info>("/actuator/info"),
  refresh: () => apiClient.post("/actuator/refresh"),
};
