import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDeleteJob, useJobs } from "@/hooks/useJobs";
import type { Job } from "@/types/openjob";
import { JobDetailDrawer } from "./JobDetailDrawer";
import { JobFormDialog } from "./JobFormDialog";
import { JobTable } from "./JobTable";

export function JobsPage() {
  const jobs = useJobs();
  const remove = useDeleteJob();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Job | undefined>();
  const [viewing, setViewing] = useState<Job | undefined>();
  const [toDelete, setToDelete] = useState<Job | undefined>();

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setEditing(undefined);
      setFormOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const rows = useMemo(
    () => (jobs.data ?? []).filter((job) => `${job.title} ${job.description}`.toLowerCase().includes(query.toLowerCase())),
    [jobs.data, query]
  );

  const confirmDelete = async () => {
    if (!toDelete?.id) return;
    try {
      await remove.mutateAsync(toDelete.id);
      toast.success("Offerta eliminata");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Eliminazione non riuscita");
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Offerte"
        subtitle="Gestione delle offerte e delle candidature collegate."
        action={
          <Button
            className="bg-brand text-white hover:bg-brand/90"
            onClick={() => {
              setEditing(undefined);
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuova offerta
          </Button>
        }
      />
      {jobs.isError ? <ErrorState message={jobs.error.message} onRetry={() => jobs.refetch()} /> : null}
      <Input placeholder="Cerca per titolo o descrizione" value={query} onChange={(event) => setQuery(event.target.value)} className="max-w-sm" />
      <JobTable
        rows={rows}
        isLoading={jobs.isLoading}
        onView={setViewing}
        onEdit={(job) => {
          setEditing(job);
          setFormOpen(true);
        }}
        onDelete={setToDelete}
      />
      <JobFormDialog open={formOpen} onOpenChange={setFormOpen} editing={editing} />
      <JobDetailDrawer job={viewing} onOpenChange={(value) => !value && setViewing(undefined)} />
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(value) => !value && setToDelete(undefined)}
        title="Eliminare l'offerta?"
        description={`"${toDelete?.title ?? ""}" verra' rimossa definitivamente.`}
        confirmLabel="Elimina"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
