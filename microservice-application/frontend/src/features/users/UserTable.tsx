import { Eye, Pencil, Trash2, Users } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <DataTable
      columns={columns}
      rows={rows}
      isLoading={isLoading}
      getRowKey={(user) => user.id ?? user.username}
      emptyState={<EmptyState icon={Users} title="Nessun utente" description="Crea il primo utente dalla CTA in alto." />}
    />
  );
}
