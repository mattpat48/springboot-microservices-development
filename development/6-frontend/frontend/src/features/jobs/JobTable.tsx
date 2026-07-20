import { Eye, FileText, Pencil, Trash2 } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import type { Job } from "@/types/openjob";

export function JobTable({
  rows,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: {
  rows: Job[];
  isLoading: boolean;
  onView: (job: Job) => void;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
}) {
  const columns: Column<Job>[] = [
    { header: "Titolo", cell: (job) => job.title },
    { header: "Recruiter", cell: (job) => `#${job.createdBy}` },
    { header: "Candidature", cell: (job) => job.applicants?.length ?? 0 },
    { header: "ID", cell: (job) => `#${job.id}` },
    {
      header: "",
      className: "text-right",
      cell: (job) => (
        <div className="flex justify-end gap-1">
          <Button size="icon" variant="ghost" aria-label="Mostra dettaglio offerta" onClick={() => onView(job)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" aria-label="Modifica offerta" onClick={() => onEdit(job)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" aria-label="Elimina offerta" onClick={() => onDelete(job)}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      isLoading={isLoading}
      getRowKey={(job) => job.id ?? job.title}
      emptyState={<EmptyState icon={FileText} title="Nessuna offerta" description="Crea la prima offerta di lavoro." />}
    />
  );
}
