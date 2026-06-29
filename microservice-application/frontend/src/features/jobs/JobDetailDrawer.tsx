import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useUsers } from "@/hooks/useUsers";
import type { Job } from "@/types/openjob";

export function JobDetailDrawer({ job, onOpenChange }: { job?: Job; onOpenChange: (value: boolean) => void }) {
  const users = useUsers();
  const byId = new Map((users.data ?? []).filter((user) => user.id != null).map((user) => [Number(user.id), user]));
  const recruiter = byId.get(Number(job?.createdBy));
  const applicants = job?.applicants ?? [];

  return (
    <Sheet open={!!job} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{job?.title ?? "Offerta"}</SheetTitle>
          <SheetDescription>{job?.id ? `Offerta #${job.id}` : undefined}</SheetDescription>
        </SheetHeader>
        {job ? (
          <div className="mt-6 space-y-5 text-sm">
            <div>
              <p className="text-muted-foreground">Descrizione</p>
              <p className="mt-1 whitespace-pre-line leading-6">{job.description}</p>
            </div>
            <div className="rounded-md border bg-white p-3">
              <p className="text-muted-foreground">Recruiter</p>
              <p className="font-medium">
                {recruiter ? `${recruiter.firstname} ${recruiter.lastname} (${recruiter.username})` : `Utente #${job.createdBy}`}
              </p>
            </div>
            <div>
              <div className="mb-2 flex items-center gap-2">
                <p className="font-medium">Candidati</p>
                <Badge variant="secondary">{applicants.length}</Badge>
              </div>
              {applicants.length === 0 ? (
                <p className="text-muted-foreground">Nessuna candidatura</p>
              ) : (
                <ul className="space-y-2">
                  {applicants.map((applicant, index) => {
                    const user = byId.get(Number(applicant.applicantIdentity.userId));
                    return (
                      <li key={`${applicant.applicantIdentity.userId}-${index}`} className="rounded-md border bg-white p-3">
                        <p className="font-medium">
                          {user ? `${user.firstname} ${user.lastname}` : `Utente #${applicant.applicantIdentity.userId}`}
                        </p>
                        <p className="text-xs text-muted-foreground">{user?.username ?? "Username non disponibile"}</p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
