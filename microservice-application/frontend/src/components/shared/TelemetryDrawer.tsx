import { useState } from "react";
import { Activity, Clock, Filter, Trash2, X, Zap, CheckCircle2, AlertTriangle } from "lucide-react";
import { useTelemetry, type ServiceName } from "@/hooks/useTelemetry";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TelemetryDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceName | "ALL">("ALL");
  const { entries, stats, clear } = useTelemetry();

  const filteredEntries =
    selectedService === "ALL" ? entries : entries.filter((item) => item.service === selectedService);

  const services: (ServiceName | "ALL")[] = ["ALL", "Gateway", "User", "Job", "Discovery"];

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
    if (ms < 50) return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300";
    if (ms < 200) return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300";
    return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300";
  };

  return (
    <>
      {/* Floating Telemetry Pill */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 rounded-full border border-brand/20 bg-white/90 px-4 py-2.5 shadow-lg backdrop-blur transition-all duration-300 hover:scale-105 hover:border-brand/40 hover:bg-white hover:shadow-xl dark:bg-zinc-900/90"
          aria-label="Apri pannello telemetria e tempi di esecuzione"
        >
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
          </span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
            <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500 transition-transform group-hover:rotate-12" />
            <span>
              Latency: <span className="font-mono text-brand">{stats.averageDurationMs} ms</span>
            </span>
          </div>
          <span className="h-3 w-px bg-border"></span>
          <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Activity className="h-3.5 w-3.5 text-brand" />
            <span>{stats.totalRequests} reqs</span>
          </div>
        </button>
      </div>

      {/* Slide-over Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-over Drawer Panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l bg-white shadow-2xl transition-transform duration-300 dark:bg-zinc-900",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-brand-soft/30 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand text-white shadow-sm">
              <Zap className="h-5 w-5 fill-white" />
            </span>
            <div>
              <h2 className="font-display text-base font-bold text-ink">Telemetria & Attività API</h2>
              <p className="text-xs text-muted-foreground">Tempi di esecuzione in tempo reale dei microservizi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-rose-600"
              onClick={clear}
              title="Pulisci cronologia"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-ink"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Live Session Summary Cards */}
        <div className="grid grid-cols-3 gap-2 border-b bg-slate-50/50 p-4 dark:bg-zinc-800/30">
          <div className="rounded-lg border bg-white p-2.5 text-center shadow-2xs dark:bg-zinc-900">
            <p className="text-[11px] font-medium text-muted-foreground">Tempo Medio</p>
            <p className="mt-0.5 font-mono text-lg font-bold text-brand">{stats.averageDurationMs} ms</p>
          </div>
          <div className="rounded-lg border bg-white p-2.5 text-center shadow-2xs dark:bg-zinc-900">
            <p className="text-[11px] font-medium text-muted-foreground">Richieste Sessione</p>
            <p className="mt-0.5 font-mono text-lg font-bold text-ink">{stats.totalRequests}</p>
          </div>
          <div className="rounded-lg border bg-white p-2.5 text-center shadow-2xs dark:bg-zinc-900">
            <p className="text-[11px] font-medium text-muted-foreground">Tasso di Successo</p>
            <p className={cn("mt-0.5 font-mono text-lg font-bold", stats.successRate >= 95 ? "text-emerald-600" : "text-amber-600")}>
              {stats.successRate}%
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b px-4 py-2.5 no-scrollbar">
          <Filter className="mr-1 h-3.5 w-3.5 text-muted-foreground shrink-0" />
          {services.map((svc) => (
            <button
              key={svc}
              onClick={() => setSelectedService(svc)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors shrink-0",
                selectedService === svc
                  ? "bg-brand text-white shadow-xs"
                  : "bg-slate-100 text-muted-foreground hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              )}
            >
              {svc === "ALL" ? "Tutti i Servizi" : svc}
            </button>
          ))}
        </div>

        {/* Activity Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <Clock className="mb-2 h-8 w-8 stroke-1 opacity-40" />
              <p className="text-sm font-medium">Nessuna attività registrata</p>
              <p className="mt-1 text-xs opacity-75">Le chiamate di rete ai microservizi appariranno qui in tempo reale.</p>
            </div>
          ) : (
            filteredEntries.map((item) => (
              <div
                key={item.id}
                className="group flex items-center justify-between gap-3 rounded-lg border bg-white p-3 shadow-2xs transition-all hover:border-brand/30 hover:shadow-sm dark:bg-zinc-900"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className={cn("rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold", getMethodBadge(item.method))}>
                    {item.method}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-mono text-xs font-semibold text-ink" title={item.url}>
                        {item.url}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="rounded bg-slate-100 px-1.5 py-0.2 font-medium text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                        {item.service}
                      </span>
                      <span>•</span>
                      <span>{item.timestamp.toLocaleTimeString()}</span>
                      <span>•</span>
                      <span
                        className={cn(
                          "flex items-center gap-1 font-medium",
                          item.status >= 200 && item.status < 300 ? "text-emerald-600" : "text-rose-600"
                        )}
                      >
                        {item.status >= 200 && item.status < 300 ? (
                          <CheckCircle2 className="h-3 w-3 inline" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 inline" />
                        )}
                        {item.status} {item.statusText}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={cn("flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-xs font-bold shrink-0 shadow-2xs", getDurationStyle(item.durationMs))}>
                  <Zap className="h-3 w-3 fill-current" />
                  <span>{item.durationMs} ms</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-slate-50 px-5 py-3 text-center text-xs text-muted-foreground dark:bg-zinc-900">
          Misurazione precisione microsecondi tramite <code className="font-mono text-brand">performance.now()</code>.
        </div>
      </div>
    </>
  );
}
