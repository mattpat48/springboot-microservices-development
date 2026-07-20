import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useJobs } from "@/hooks/useJobs";
import type { User } from "@/types/openjob";

export function UserDetailDrawer({ user, onOpenChange }: { user?: User; onOpenChange: (value: boolean) => void }) {
  const jobs = useJobs();
  const createdJobs = (jobs.data ?? []).filter((job) => Number(job.createdBy) === Number(user?.id));

  return (
    <Sheet open={!!user} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{user ? `${user.firstname} ${user.lastname}` : "Utente"}</SheetTitle>
          <SheetDescription>{user?.username}</SheetDescription>
        </SheetHeader>
        {user ? (
          <div className="mt-6 space-y-5 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md border bg-white p-3">
                <p className="text-muted-foreground">ID</p>
                <p className="font-medium">#{user.id}</p>
              </div>
              <div className="rounded-md border bg-white p-3">
                <p className="text-muted-foreground">Stato</p>
                <p className="font-medium">{user.active === false ? "Disattivo" : "Attivo"}</p>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="mb-2 text-muted-foreground">Ruoli</p>
              <div className="flex flex-wrap gap-2">
                {(user.roles ?? []).length > 0 ? (
                  user.roles?.map((role, index) => (
                    <Badge key={`${role.id ?? index}-${role.name ?? "role"}`} variant="secondary">
                      {role.name ?? `Ruolo #${role.id}`}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">Nessun ruolo</span>
                )}
              </div>
            </div>
            <div>
              <p className="mb-2 font-medium">Offerte create ({createdJobs.length})</p>
              {createdJobs.length === 0 ? (
                <p className="text-muted-foreground">Nessuna offerta associata</p>
              ) : (
                <ul className="space-y-2">
                  {createdJobs.map((job) => (
                    <li key={job.id} className="rounded-md border bg-white p-3">
                      <p className="font-medium">{job.title}</p>
                      <p className="line-clamp-2 text-muted-foreground">{job.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
