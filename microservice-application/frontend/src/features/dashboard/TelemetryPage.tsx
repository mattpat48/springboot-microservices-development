import { Activity, Clock, CheckCircle2, Layers3, Zap, ShieldCheck, AlertTriangle, RefreshCw, Server } from "lucide-react";
import { useTelemetry, type ServiceName } from "@/hooks/useTelemetry";
import { useHealth } from "@/hooks/useHealth";
import { useUsers } from "@/hooks/useUsers";
import { useJobs } from "@/hooks/useJobs";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TelemetryPage() {
  const { entries, stats, clear } = useTelemetry();
  const health = useHealth();
  const users = useUsers();
  const jobs = useJobs();

  const userStatus = users.isError ? "DOWN" : users.isLoading ? "CHECKING" : "UP";
  const jobStatus = jobs.isError ? "DOWN" : jobs.isLoading ? "CHECKING" : "UP";
  const gatewayStatus = health.isError ? "DOWN" : health.data?.status ?? (health.isLoading ? "CHECKING" : "UNKNOWN");
  const discoveryStatus = gatewayStatus === "UP" ? "UP" : gatewayStatus;

  const servicesList = [
    { name: "Gateway API", key: "Gateway" as ServiceName, status: gatewayStatus, port: "9000", desc: "Routing e bilanciamento carico" },
    { name: "User Microservice", key: "User" as ServiceName, status: userStatus, port: "9044", desc: "Gestione profili e ruoli RBAC" },
    { name: "Job Microservice", key: "Job" as ServiceName, status: jobStatus, port: "9055", desc: "Offerte e candidature" },
    { name: "Eureka Discovery", key: "Discovery" as ServiceName, status: discoveryStatus, port: "8761", desc: "Service Registry & Discovery" },
  ];

  const activeCount = servicesList.filter((s) => s.status === "UP").length;

  const maxDuration = Math.max(1, ...Object.values(stats.serviceStats).map((s) => s.avgDuration));

  const getMethodBadge = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "POST":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "PUT":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "DELETE":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getDurationStyle = (ms: number) => {
    if (ms < 50) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (ms < 200) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  const getBarColor = (ms: number) => {
    if (ms < 50) return "bg-emerald-500";
    if (ms < 200) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Telemetria & Metriche"
          subtitle="Monitoraggio avanzato in tempo reale delle latenze di rete e dello stato operativo dei microservizi."
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              health.refetch();
              users.refetch();
              jobs.refetch();
            }}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Aggiorna Stato</span>
          </Button>
          <Button variant="outline" size="sm" onClick={clear} className="text-rose-600 hover:bg-rose-50 hover:text-rose-700">
            Pulisci Dati
          </Button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-xl border bg-white shadow-2xs dark:bg-zinc-900">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Latenza Media</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-brand">{stats.averageDurationMs}</span>
                <span className="text-sm font-semibold text-muted-foreground">ms</span>
              </div>
              <p className="mt-1 text-xs text-emerald-600 font-medium">⚡ Misurato in tempo reale</p>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-soft text-brand">
              <Zap className="h-6 w-6 fill-brand/20" />
            </span>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-white shadow-2xs dark:bg-zinc-900">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Richieste Processate</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-ink">{stats.totalRequests}</span>
                <span className="text-xs text-muted-foreground">in sessione</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Tracciamento chiamate API</p>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <Activity className="h-6 w-6" />
            </span>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-white shadow-2xs dark:bg-zinc-900">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tasso di Successo</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span
                  className={cn(
                    "font-display text-3xl font-bold",
                    stats.successRate >= 95 ? "text-emerald-600" : "text-amber-600"
                  )}
                >
                  {stats.successRate}%
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{stats.errorCount} errori rilevati</p>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-6 w-6" />
            </span>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-white shadow-2xs dark:bg-zinc-900">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Microservizi Attivi</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-ink">{activeCount}</span>
                <span className="text-sm text-muted-foreground">/ {servicesList.length}</span>
              </div>
              <p className="mt-1 text-xs text-emerald-600 font-medium">● Infrastruttura online</p>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-purple-50 text-purple-600">
              <Server className="h-6 w-6" />
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Middle Grid: Latency Comparison & Health Breakdown */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Latency Comparison Chart */}
        <Card className="rounded-xl border bg-white shadow-2xs dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-brand" />
              <span>Latenza Media per Microservizio</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {servicesList.map((svc) => {
              const stat = stats.serviceStats[svc.key];
              const avg = stat?.avgDuration ?? 0;
              const widthPct = Math.min(100, Math.max(8, (avg / maxDuration) * 100));

              return (
                <div key={svc.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink">{svc.name}</span>
                      <span className="text-xs text-muted-foreground font-mono">(:{svc.port})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{stat?.count ?? 0} chiamate</span>
                      <span className="font-mono text-sm font-bold text-brand">{avg} ms</span>
                    </div>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", getBarColor(avg))}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Health Breakdown Table */}
        <Card className="rounded-xl border bg-white shadow-2xs dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Layers3 className="h-4 w-4 text-brand" />
              <span>Stato e Diagnostica Microservizi</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {servicesList.map((svc) => {
              const stat = stats.serviceStats[svc.key];
              return (
                <div
                  key={svc.key}
                  className="flex items-center justify-between rounded-lg border bg-slate-50/50 p-3 transition-colors hover:bg-slate-50 dark:bg-zinc-800/40"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-ink">{svc.name}</p>
                      <span className="rounded bg-white px-1.5 py-0.2 font-mono text-[11px] font-bold text-muted-foreground border shadow-2xs dark:bg-zinc-900">
                        PORT {svc.port}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{svc.desc}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    {stat?.errors > 0 && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-rose-600">
                        <AlertTriangle className="h-3.5 w-3.5 inline" /> {stat.errors} err
                      </span>
                    )}
                    <StatusBadge status={svc.status} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recent Execution Table */}
      <Card className="rounded-xl border bg-white shadow-2xs dark:bg-zinc-900">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Registro Chiamate API in Tempo Reale</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Storico recente delle transazioni di rete tra console e backend</p>
          </div>
          <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
            {entries.length} transazioni
          </span>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-slate-50/80 text-xs font-semibold text-muted-foreground dark:bg-zinc-800/50">
                  <th className="p-3">Metodo</th>
                  <th className="p-3">Endpoint URL</th>
                  <th className="p-3">Servizio</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Latenza</th>
                  <th className="p-3">Orario</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      Nessuna transazione registrata. Esegui azioni nella console per visualizzare la telemetria.
                    </td>
                  </tr>
                ) : (
                  entries.map((item) => (
                    <tr key={item.id} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
                      <td className="p-3 font-mono">
                        <span className={cn("rounded border px-2 py-0.5 text-xs font-bold", getMethodBadge(item.method))}>
                          {item.method}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-xs font-semibold text-ink">{item.url}</td>
                      <td className="p-3">
                        <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                          {item.service}
                        </span>
                      </td>
                      <td className="p-3 font-medium">
                        <span
                          className={cn(
                            "flex items-center gap-1.5 text-xs font-semibold",
                            item.status >= 200 && item.status < 300 ? "text-emerald-600" : "text-rose-600"
                          )}
                        >
                          {item.status >= 200 && item.status < 300 ? (
                            <CheckCircle2 className="h-3.5 w-3.5 inline" />
                          ) : (
                            <AlertTriangle className="h-3.5 w-3.5 inline" />
                          )}
                          {item.status} {item.statusText}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold shadow-2xs",
                            getDurationStyle(item.durationMs)
                          )}
                        >
                          <Zap className="h-3 w-3 fill-current" />
                          {item.durationMs} ms
                        </span>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground font-mono">{item.timestamp.toLocaleTimeString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
