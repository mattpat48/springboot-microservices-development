import { useState, useMemo } from "react";
import { Eye, Pencil, Trash2, Users, ArrowUpDown, Search } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { User } from "@/types/openjob";

export function UserTable({
  rows,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: {
  rows: User[];
  isLoading: boolean;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id_desc");

  const filteredAndSortedRows = useMemo(() => {
    const query = search.toLowerCase().trim();
    const filtered = rows.filter((user) => {
      if (!query) return true;
      const name = `${user.firstname} ${user.lastname}`.toLowerCase();
      const username = user.username?.toLowerCase() ?? "";
      const email = user.email?.toLowerCase() ?? "";
      const idStr = `#${user.id}`;
      return name.includes(query) || username.includes(query) || email.includes(query) || idStr.includes(query);
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "id_desc") return Number(b.id) - Number(a.id);
      if (sortBy === "id_asc") return Number(a.id) - Number(b.id);
      if (sortBy === "name_asc") return `${a.firstname} ${a.lastname}`.localeCompare(`${b.firstname} ${b.lastname}`);
      if (sortBy === "name_desc") return `${b.firstname} ${b.lastname}`.localeCompare(`${a.firstname} ${a.lastname}`);
      if (sortBy === "username_asc") return (a.username ?? "").localeCompare(b.username ?? "");
      if (sortBy === "username_desc") return (b.username ?? "").localeCompare(a.username ?? "");
      return 0;
    });
  }, [rows, search, sortBy]);

  const columns: Column<User>[] = [
    { header: "Nome", cell: (user) => `${user.firstname} ${user.lastname}` },
    { header: "Username", cell: (user) => user.username },
    { header: "Email", cell: (user) => user.email },
    {
      header: "Stato",
      cell: (user) => (
        <Badge variant={user.active === false ? "warning" : "success"}>{user.active === false ? "Disattivo" : "Attivo"}</Badge>
      ),
    },
    { header: "ID", cell: (user) => `#${user.id}` },
    {
      header: "",
      className: "text-right",
      cell: (user) => (
        <div className="flex justify-end gap-1">
          <Button size="icon" variant="ghost" aria-label="Mostra dettaglio utente" onClick={() => onView(user)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" aria-label="Modifica utente" onClick={() => onEdit(user)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" aria-label="Elimina utente" onClick={() => onDelete(user)}>
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
            placeholder="Cerca utente per nome, username, email o ID..."
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
              <SelectItem value="name_asc">Nome e Cognome (A - Z)</SelectItem>
              <SelectItem value="name_desc">Nome e Cognome (Z - A)</SelectItem>
              <SelectItem value="username_asc">Username (A - Z)</SelectItem>
              <SelectItem value="username_desc">Username (Z - A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filteredAndSortedRows}
        isLoading={isLoading}
        getRowKey={(user) => user.id ?? user.username}
        emptyState={<EmptyState icon={Users} title="Nessun utente trovato" description="Nessun utente corrisponde ai criteri di ricerca o ordinamento selezionati." />}
      />
    </div>
  );
}
