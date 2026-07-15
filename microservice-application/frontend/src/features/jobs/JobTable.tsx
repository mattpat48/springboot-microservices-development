import { useState, useMemo } from "react";
import { Eye, FileText, Pencil, Trash2, ArrowUpDown, Search } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id_desc");

  const filteredAndSortedRows = useMemo(() => {
    const query = search.toLowerCase().trim();
    const filtered = rows.filter((job) => {
      if (!query) return true;
      const title = job.title.toLowerCase();
      const desc = job.description.toLowerCase();
      const idStr = `#${job.id}`;
      const recStr = `#${job.createdBy}`;
      return title.includes(query) || desc.includes(query) || idStr.includes(query) || recStr.includes(query);
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "id_desc") return Number(b.id) - Number(a.id);
      if (sortBy === "id_asc") return Number(a.id) - Number(b.id);
      if (sortBy === "title_asc") return a.title.localeCompare(b.title);
      if (sortBy === "title_desc") return b.title.localeCompare(a.title);
      if (sortBy === "apps_desc") return (b.applicants?.length ?? 0) - (a.applicants?.length ?? 0);
      if (sortBy === "apps_asc") return (a.applicants?.length ?? 0) - (b.applicants?.length ?? 0);
      return 0;
    });
  }, [rows, search, sortBy]);

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
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-3 rounded-lg border shadow-soft">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca offerta per titolo, ID o recruiter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Ordina per:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Scegli ordinamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id_desc">Più recenti (ID decrescente)</SelectItem>
              <SelectItem value="id_asc">Più vecchi (ID crescente)</SelectItem>
              <SelectItem value="title_asc">Titolo offerta (A - Z)</SelectItem>
              <SelectItem value="title_desc">Titolo offerta (Z - A)</SelectItem>
              <SelectItem value="apps_desc">Più candidature</SelectItem>
              <SelectItem value="apps_asc">Meno candidature</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filteredAndSortedRows}
        isLoading={isLoading}
        getRowKey={(job) => job.id ?? job.title}
        emptyState={<EmptyState icon={FileText} title="Nessuna offerta trovata" description="Nessuna offerta corrisponde ai criteri di ricerca o ordinamento selezionati." />}
      />
    </div>
  );
}
