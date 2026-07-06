import { useSyncExternalStore } from "react";

export type ServiceName = "Gateway" | "User" | "Job" | "Discovery" | "Config" | "Other";

export interface TelemetryEntry {
  id: string;
  method: string;
  url: string;
  durationMs: number;
  status: number;
  statusText: string;
  timestamp: Date;
  service: ServiceName;
}

export interface ServiceStat {
  service: ServiceName;
  count: number;
  totalDuration: number;
  avgDuration: number;
  errors: number;
  lastStatus: number;
}

export interface TelemetryStats {
  totalRequests: number;
  averageDurationMs: number;
  successRate: number;
  errorCount: number;
  serviceStats: Record<ServiceName, ServiceStat>;
}

// In-memory store capped at 150 entries to prevent memory leaks
const MAX_ENTRIES = 150;
let entries: TelemetryEntry[] = [
  // Initial seed data so the dashboard is immediately populated with realistic examples on startup
  {
    id: "seed-1",
    method: "GET",
    url: "/actuator/health",
    durationMs: 14.2,
    status: 200,
    statusText: "OK",
    timestamp: new Date(Date.now() - 45000),
    service: "Gateway",
  },
  {
    id: "seed-2",
    method: "GET",
    url: "/api/user",
    durationMs: 28.5,
    status: 200,
    statusText: "OK",
    timestamp: new Date(Date.now() - 32000),
    service: "User",
  },
  {
    id: "seed-3",
    method: "GET",
    url: "/api/job",
    durationMs: 35.1,
    status: 200,
    statusText: "OK",
    timestamp: new Date(Date.now() - 18000),
    service: "Job",
  },
];

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((listener) => listener());
}

function resolveService(url: string): ServiceName {
  const lower = url.toLowerCase();
  if (lower.includes("/user") || lower.includes("/usr")) return "User";
  if (lower.includes("/job") || lower.includes("/offerte") || lower.includes("/apply")) return "Job";
  if (lower.includes("/eureka") || lower.includes("/discovery")) return "Discovery";
  if (lower.includes("/config")) return "Config";
  if (lower.includes("/actuator") || lower.includes("/health") || lower.includes("/info")) return "Gateway";
  return "Other";
}

export function recordTelemetry(data: {
  method: string;
  url: string;
  durationMs: number;
  status: number;
  statusText?: string;
}) {
  const entry: TelemetryEntry = {
    id: Math.random().toString(36).substring(2, 9),
    method: data.method.toUpperCase(),
    url: data.url,
    durationMs: Math.round(data.durationMs * 10) / 10,
    status: data.status,
    statusText: data.statusText || (data.status >= 200 && data.status < 300 ? "OK" : "Error"),
    timestamp: new Date(),
    service: resolveService(data.url),
  };

  entries = [entry, ...entries].slice(0, MAX_ENTRIES);
  notify();
}

export function clearTelemetry() {
  entries = [];
  notify();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return entries;
}

export function useTelemetry() {
  const data = useSyncExternalStore(subscribe, getSnapshot);

  const totalRequests = data.length;
  let totalDuration = 0;
  let errorCount = 0;

  const serviceStats: Record<ServiceName, ServiceStat> = {
    Gateway: { service: "Gateway", count: 0, totalDuration: 0, avgDuration: 0, errors: 0, lastStatus: 200 },
    User: { service: "User", count: 0, totalDuration: 0, avgDuration: 0, errors: 0, lastStatus: 200 },
    Job: { service: "Job", count: 0, totalDuration: 0, avgDuration: 0, errors: 0, lastStatus: 200 },
    Discovery: { service: "Discovery", count: 0, totalDuration: 0, avgDuration: 0, errors: 0, lastStatus: 200 },
    Config: { service: "Config", count: 0, totalDuration: 0, avgDuration: 0, errors: 0, lastStatus: 200 },
    Other: { service: "Other", count: 0, totalDuration: 0, avgDuration: 0, errors: 0, lastStatus: 200 },
  };

  data.forEach((item) => {
    totalDuration += item.durationMs;
    const isError = item.status >= 400 || item.status === 0;
    if (isError) errorCount++;

    const stat = serviceStats[item.service];
    if (stat) {
      stat.count++;
      stat.totalDuration += item.durationMs;
      if (isError) stat.errors++;
      if (stat.count === 1) {
        stat.lastStatus = item.status;
      }
    }
  });

  const averageDurationMs = totalRequests > 0 ? Math.round((totalDuration / totalRequests) * 10) / 10 : 0;
  const successRate = totalRequests > 0 ? Math.round(((totalRequests - errorCount) / totalRequests) * 1000) / 10 : 100;

  (Object.keys(serviceStats) as ServiceName[]).forEach((key) => {
    const stat = serviceStats[key];
    stat.avgDuration = stat.count > 0 ? Math.round((stat.totalDuration / stat.count) * 10) / 10 : 0;
  });

  const stats: TelemetryStats = {
    totalRequests,
    averageDurationMs,
    successRate,
    errorCount,
    serviceStats,
  };

  return {
    entries: data,
    stats,
    clear: clearTelemetry,
  };
}
