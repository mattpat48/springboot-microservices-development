import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApplications } from "@/hooks/useApplications";
import type { ApplicationRow } from "@/lib/applications";
import { ApplicationDetailDrawer } from "./ApplicationDetailDrawer";
import { ApplicationsTable } from "./ApplicationsTable";
import { ApplyDialog } from "./ApplyDialog";

export function ApplicationsPage() {
  const applications = useApplications();
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState<ApplicationRow | undefined>();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Candidature"
        subtitle="Candidature degli utenti sulle offerte pubblicate."
        action={
          <Button className="bg-brand text-white hover:bg-brand/90" onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuova candidatura
          </Button>
        }
      />
      {applications.isError ? (
        <ErrorState message={applications.error instanceof Error ? applications.error.message : "Candidature non disponibili"} onRetry={applications.refetch} />
      ) : null}
      <ApplicationsTable rows={applications.data} isLoading={applications.isLoading} onView={setViewing} />
      <ApplicationDetailDrawer application={viewing} onOpenChange={(value) => !value && setViewing(undefined)} />
      <ApplyDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
