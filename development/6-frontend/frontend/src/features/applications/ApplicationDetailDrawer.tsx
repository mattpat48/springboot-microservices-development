import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { ApplicationRow } from "@/lib/applications";

function formatDate(value?: string) {
  if (!value) return "Non disponibile";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("it-IT", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function ApplicationDetailDrawer({
  application,
  onOpenChange,
}: {
  application?: ApplicationRow;
  onOpenChange: (value: boolean) => void;
}) {
  return (
    <Sheet open={!!application} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Dettaglio candidatura</SheetTitle>
          <SheetDescription>{application ? `${application.jobTitle} - utente #${application.userId}` : undefined}</SheetDescription>
        </SheetHeader>
        {application ? (
          <div className="mt-6 space-y-5 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md border bg-white p-3">
                <p className="text-muted-foreground">Job ID</p>
                <p className="font-medium">#{application.jobId}</p>
              </div>
              <div className="rounded-md border bg-white p-3">
                <p className="text-muted-foreground">User ID</p>
                <p className="font-medium">#{application.userId}</p>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground">Offerta</p>
              <p className="mt-1 font-medium">{application.jobTitle}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Candidato</p>
              <p className="mt-1 font-medium">
                {application.user ? `${application.user.firstname} ${application.user.lastname}` : `Utente #${application.userId}`}
              </p>
              <p className="text-muted-foreground">{application.user?.username ?? "Username non disponibile"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="mt-1 font-medium">{application.user?.email ?? "Non disponibile"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Data candidatura</p>
              <p className="mt-1 font-medium">{formatDate(application.createdAt)}</p>
            </div>
            <div>
              <Badge variant={application.user?.active === false ? "warning" : "success"}>
                {application.user?.active === false ? "Utente disattivo" : "Utente attivo"}
              </Badge>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
