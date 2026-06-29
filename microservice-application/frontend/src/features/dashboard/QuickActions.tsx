import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BriefcaseBusiness, DatabaseZap, RefreshCw, Send, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { jobsApi } from "@/api/jobs";
import { usersApi } from "@/api/users";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Job, User } from "@/types/openjob";

const quickActionClass =
  "flex h-16 items-center justify-start rounded-md border border-input bg-white px-4 text-base font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const iconBoxClass = "mr-3 grid h-9 w-9 shrink-0 place-items-center rounded-md bg-brand-soft text-brand";

async function resetAndPopulateFromScript() {
  const [jobs, users] = await Promise.all([jobsApi.getAll(), usersApi.getAll()]);

  await Promise.all(jobs.filter((job) => job.id != null).map((job) => jobsApi.remove(Number(job.id))));
  await Promise.all(users.filter((user) => user.id != null).map((user) => usersApi.remove(Number(user.id))));

  const seedUsers: User[] = [
    {
      firstname: "Mario",
      lastname: "Rossi",
      username: "admin",
      password: "password123",
      email: "mario.rossi@openjob.com",
      active: true,
      passwordExpired: false,
    },
    {
      firstname: "Luigi",
      lastname: "Verdi",
      username: "luigi_dev",
      password: "password123",
      email: "luigi.verdi@example.com",
      active: true,
      passwordExpired: false,
    },
  ];

  for (const user of seedUsers) {
    await usersApi.create(user);
  }

  const recruiter = await usersApi.getByUsername("admin");
  if (!recruiter.id) throw new Error("Recruiter admin non trovato dopo il popolamento");

  const seedJobs: Job[] = [
    {
      title: "Senior Java Developer",
      description: "Cerchiamo uno sviluppatore esperto in Spring Boot e Microservizi per un progetto innovativo.",
      createdBy: recruiter.id,
    },
    {
      title: "Frontend React Engineer",
      description: "Posizione aperta per sviluppatore UI/UX con ottima conoscenza di React e TypeScript.",
      createdBy: recruiter.id,
    },
  ];

  for (const job of seedJobs) {
    await jobsApi.create(job);
  }
}

export function QuickActions() {
  const queryClient = useQueryClient();
  const [resetOpen, setResetOpen] = useState(false);
  const resetData = useMutation({
    mutationFn: resetAndPopulateFromScript,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["users"] }),
        queryClient.invalidateQueries({ queryKey: ["jobs"] }),
      ]);
      toast.success("Database ricaricato");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Reset non riuscito"),
  });

  const refreshConfig = async () => {
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["system", "health"] }),
        queryClient.invalidateQueries({ queryKey: ["users"] }),
        queryClient.invalidateQueries({ queryKey: ["jobs"] }),
      ]);
      toast.success("Dati aggiornati");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Refresh non riuscito");
    }
  };

  return (
    <>
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>Azioni rapide</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Link to="/utenti?new=1" className={quickActionClass}>
            <span className={iconBoxClass}>
              <UserPlus className="h-5 w-5" strokeWidth={2.25} />
            </span>
            Nuovo utente
          </Link>
          <Link to="/offerte?new=1" className={quickActionClass}>
            <span className={iconBoxClass}>
              <BriefcaseBusiness className="h-5 w-5" strokeWidth={2.25} />
            </span>
            Nuova offerta
          </Link>
          <Link to="/candidature" className={quickActionClass}>
            <span className={iconBoxClass}>
              <Send className="h-5 w-5" strokeWidth={2.25} />
            </span>
            Candidatura
          </Link>
          <Button type="button" variant="outline" size="lg" className={cn("h-16 justify-start px-4 text-base", quickActionClass)} onClick={refreshConfig}>
            <span className={iconBoxClass}>
              <RefreshCw className="h-5 w-5" strokeWidth={2.25} />
            </span>
            Aggiorna dati
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className={cn("h-16 justify-start px-4 text-base", quickActionClass)}
            onClick={() => setResetOpen(true)}
            disabled={resetData.isPending}
          >
            <span className={iconBoxClass}>
              <DatabaseZap className="h-5 w-5" strokeWidth={2.25} />
            </span>
            Ricarica dati base
          </Button>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Svuotare e ricaricare i dati?"
        description="Offerte, candidature e utenti verranno cancellati e sostituiti con i dati di populate.sh."
        confirmLabel="Ricarica"
        onConfirm={() => resetData.mutateAsync()}
      />
    </>
  );
}
