import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface ServiceStatus {
  name: string;
  status?: string;
  detail: string;
}

export function ServiceStatusCard({
  services,
  isLoading,
  onRefresh,
}: {
  services: ServiceStatus[];
  isLoading: boolean;
  onRefresh: () => void;
}) {
  return (
    <Card className="rounded-lg">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Stato servizi</CardTitle>
        <Button type="button" variant="ghost" size="icon" aria-label="Aggiorna stato servizi" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-12" />)
          : services.map((service) => (
              <div key={service.name} className="flex items-center justify-between gap-3 rounded-md border bg-white p-3">
                <div className="min-w-0">
                  <p className="font-medium">{service.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{service.detail}</p>
                </div>
                <StatusBadge status={service.status} />
              </div>
            ))}
      </CardContent>
    </Card>
  );
}
