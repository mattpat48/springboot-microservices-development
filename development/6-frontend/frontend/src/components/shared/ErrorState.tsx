import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-energy/30 bg-energy-soft p-4 text-sm text-ink">
      <div className="flex min-w-0 items-center gap-3">
        <AlertCircle className="h-5 w-5 shrink-0 text-energy" />
        <p className="truncate">{message ?? "Dati non disponibili"}</p>
      </div>
      {onRetry ? (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          Riprova
        </Button>
      ) : null}
    </div>
  );
}
