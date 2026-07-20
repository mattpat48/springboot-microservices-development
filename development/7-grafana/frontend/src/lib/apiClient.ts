import { recordTelemetry } from "@/hooks/useTelemetry";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const start = performance.now();
  const method = options.method || "GET";
  try {
    const response = await fetch(path, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
    });
    const durationMs = performance.now() - start;

    recordTelemetry({
      method,
      url: path,
      durationMs,
      status: response.status,
      statusText: response.statusText,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      let errorMessage = `${response.status} ${response.statusText}`;
      if (body) {
        try {
          const json = JSON.parse(body);
          if (json.message && typeof json.message === "string" && json.message !== "No message available") {
            errorMessage = json.message;
          } else if (json.error && typeof json.error === "string" && json.error !== "Internal Server Error") {
            errorMessage = json.error;
          } else {
            errorMessage = `${response.status}: ${body}`;
          }
        } catch {
          errorMessage = `${response.status}: ${body}`;
        }
      }
      throw new ApiError(errorMessage, response.status);
    }

    if (response.status === 204) return undefined as T;

    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  } catch (error) {
    const durationMs = performance.now() - start;
    if (error instanceof ApiError) {
      throw error;
    }
    recordTelemetry({
      method,
      url: path,
      durationMs,
      status: 0,
      statusText: error instanceof Error ? error.message : "Network Error",
    });
    throw error;
  }
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: (path: string, body?: unknown) =>
    request<void>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: (path: string, body?: unknown) =>
    request<void>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  del: (path: string) => request<void>(path, { method: "DELETE" }),
};
