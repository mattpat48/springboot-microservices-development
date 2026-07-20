import { useState, useMemo } from "react";
import { ArrowUpDown, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useUsers } from "@/hooks/useUsers";
import type { Job } from "@/types/openjob";

export function JobDetailDrawer({ job, onOpenChange }: { job?: Job; onOpenChange: (value: boolean) => void }) {
  const users = useUsers();
  const byId = new Map((users.data ?? []).filter((user) => user.id != null).map((user) => [Number(user.id), user]));
  const recruiter = byId.get(Number(job?.createdBy));
  const applicants = job?.applicants ?? [];

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");

  const filteredAndSortedApplicants = useMemo(() => {
    const query = search.toLowerCase().trim();
    const filtered = applicants.filter((applicant) => {
      if (!query) return true;
      const userId = Number(applicant.applicantIdentity.userId);
      const user = byId.get(userId);
      const name = user ? `${user.firstname} ${user.lastname}`.toLowerCase() : `utente #${userId}`;
      const username = user?.username?.toLowerCase() ?? "";
      return name.includes(query) || username.includes(query) || `#${userId}`.includes(query);
    });

    return [...filtered].sort((a, b) => {
      const userA = byId.get(Number(a.applicantIdentity.userId));
      const userB = byId.get(Number(b.applicantIdentity.userId));

      if (sortBy === "date_desc") {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      }
      if (sortBy === "date_asc") {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeA - timeB;
      }
      if (sortBy === "name_asc") {
        const nameA = userA ? `${userA.firstname} ${userA.lastname}` : `Utente #${a.applicantIdentity.userId}`;
        const nameB = userB ? `${userB.firstname} ${userB.lastname}` : `Utente #${b.applicantIdentity.userId}`;
        return nameA.localeCompare(nameB);
      }
      if (sortBy === "name_desc") {
        const nameA = userA ? `${userA.firstname} ${userA.lastname}` : `Utente #${a.applicantIdentity.userId}`;
        const nameB = userB ? `${userB.firstname} ${userB.lastname}` : `Utente #${b.applicantIdentity.userId}`;
        return nameB.localeCompare(nameA);
      }
      if (sortBy === "id_asc") {
        return Number(a.applicantIdentity.userId) - Number(b.applicantIdentity.userId);
      }
      if (sortBy === "id_desc") {
        return Number(b.applicantIdentity.userId) - Number(a.applicantIdentity.userId);
      }
      return 0;
    });
  }, [applicants, byId, search, sortBy]);

  return (
    <Sheet open={!!job} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
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
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="font-medium">Candidati</p>
                  <Badge variant="secondary">{applicants.length}</Badge>
                </div>
              </div>

              {applicants.length > 0 ? (
                <div className="space-y-2 bg-slate-50/50 p-2.5 rounded-md border">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Cerca candidato per nome o ID..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-8 pl-8 text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">Ordina:</span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Ordina" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date_desc">Cronologico (Più recenti)</SelectItem>
                        <SelectItem value="date_asc">Cronologico (Più vecchi)</SelectItem>
                        <SelectItem value="name_asc">Nome candidato (A - Z)</SelectItem>
                        <SelectItem value="name_desc">Nome candidato (Z - A)</SelectItem>
                        <SelectItem value="id_asc">Per ID Utente (Crescente)</SelectItem>
                        <SelectItem value="id_desc">Per ID Utente (Decrescente)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : null}

              {applicants.length === 0 ? (
                <p className="text-muted-foreground">Nessuna candidatura</p>
              ) : filteredAndSortedApplicants.length === 0 ? (
                <p className="text-muted-foreground text-xs italic py-2">Nessun candidato corrisponde alla ricerca</p>
              ) : (
                <ul className="space-y-2">
                  {filteredAndSortedApplicants.map((applicant, index) => {
                    const user = byId.get(Number(applicant.applicantIdentity.userId));
                    return (
                      <li key={`${applicant.applicantIdentity.userId}-${index}`} className="rounded-md border bg-white p-3 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              {user ? `${user.firstname} ${user.lastname}` : `Utente #${applicant.applicantIdentity.userId}`}
                            </p>
                            <p className="text-xs text-muted-foreground">{user?.username ?? "Username non disponibile"}</p>
                          </div>
                          <Badge variant="outline" className="text-[10px]">ID #{applicant.applicantIdentity.userId}</Badge>
                        </div>
                        {applicant.createdAt ? (
                          <p className="text-[11px] text-muted-foreground mt-2 pt-1 border-t">
                            Candidato il: {new Intl.DateTimeFormat("it-IT", { dateStyle: "short", timeStyle: "short" }).format(new Date(applicant.createdAt))}
                          </p>
                        ) : null}
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
