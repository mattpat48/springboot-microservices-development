import { Eye, Send } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import type { ApplicationRow } from "@/lib/applications";

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("it-IT", { dateStyle: "short", timeStyle: "short" }).format(date);
}

export function ApplicationsTable({
  rows,
  isLoading,
  onView,
}: {
  rows: ApplicationRow[];
  isLoading: boolean;
  onView: (row: ApplicationRow) => void;
}) {
  const columns: Column<ApplicationRow>[] = [
    { header: "Candidato", cell: (row) => (row.user ? `${row.user.firstname} ${row.user.lastname}` : `Utente #${row.userId}`) },
    { header: "Username", cell: (row) => row.user?.username ?? "-" },
    { header: "Offerta", cell: (row) => row.jobTitle },
    { header: "Job ID", cell: (row) => `#${row.jobId}` },
    { header: "User ID", cell: (row) => `#${row.userId}` },
    { header: "Data", cell: (row) => formatDate(row.createdAt) },
    {
      header: "",
      className: "text-right",
      cell: (row) => (
        <Button size="icon" variant="ghost" aria-label="Mostra dettaglio candidatura" onClick={() => onView(row)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      isLoading={isLoading}
      getRowKey={(row, index) => `${row.jobId}-${row.userId}-${index}`}
      emptyState={<EmptyState icon={Send} title="Nessuna candidatura" description="Invia la prima candidatura dal pulsante in alto." />}
    />
  );
}
