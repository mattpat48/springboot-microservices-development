import { useState, useMemo } from "react";
import { Eye, Send, ArrowUpDown, Search } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");

  const filteredAndSortedRows = useMemo(() => {
    const query = search.toLowerCase().trim();
    const filtered = rows.filter((row) => {
      if (!query) return true;
      const candidateName = row.user ? `${row.user.firstname} ${row.user.lastname}`.toLowerCase() : `utente #${row.userId}`;
      const username = row.user?.username?.toLowerCase() ?? "";
      const jobTitle = row.jobTitle.toLowerCase();
      const jobIdStr = `#${row.jobId}`;
      const userIdStr = `#${row.userId}`;
      return (
        candidateName.includes(query) ||
        username.includes(query) ||
        jobTitle.includes(query) ||
        jobIdStr.includes(query) ||
        userIdStr.includes(query)
      );
    });

    return [...filtered].sort((a, b) => {
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
        const nameA = a.user ? `${a.user.firstname} ${a.user.lastname}` : `Utente #${a.userId}`;
        const nameB = b.user ? `${b.user.firstname} ${b.user.lastname}` : `Utente #${b.userId}`;
        return nameA.localeCompare(nameB);
      }
      if (sortBy === "name_desc") {
        const nameA = a.user ? `${a.user.firstname} ${a.user.lastname}` : `Utente #${a.userId}`;
        const nameB = b.user ? `${b.user.firstname} ${b.user.lastname}` : `Utente #${b.userId}`;
        return nameB.localeCompare(nameA);
      }
      if (sortBy === "id_asc") {
        return a.jobId - b.jobId;
      }
      if (sortBy === "id_desc") {
        return b.jobId - a.jobId;
      }
      if (sortBy === "userid_asc") {
        return a.userId - b.userId;
      }
      if (sortBy === "userid_desc") {
        return b.userId - a.userId;
      }
      return 0;
    });
  }, [rows, search, sortBy]);

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
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-3 rounded-lg border shadow-soft">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca candidato, username, offerta o ID..."
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
              <SelectItem value="date_desc">Ordine cronologico (Più recenti)</SelectItem>
              <SelectItem value="date_asc">Ordine cronologico (Più vecchi)</SelectItem>
              <SelectItem value="name_asc">Nome candidato (A - Z)</SelectItem>
              <SelectItem value="name_desc">Nome candidato (Z - A)</SelectItem>
              <SelectItem value="id_desc">Per Job ID (Decrescente)</SelectItem>
              <SelectItem value="id_asc">Per Job ID (Crescente)</SelectItem>
              <SelectItem value="userid_desc">Per User ID (Decrescente)</SelectItem>
              <SelectItem value="userid_asc">Per User ID (Crescente)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filteredAndSortedRows}
        isLoading={isLoading}
        getRowKey={(row, index) => `${row.jobId}-${row.userId}-${index}`}
        emptyState={<EmptyState icon={Send} title="Nessuna candidatura trovata" description="Nessun risultato corrisponde ai criteri di ricerca o ordinamento selezionati." />}
      />
    </div>
  );
}
