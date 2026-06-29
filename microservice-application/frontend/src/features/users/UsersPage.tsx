import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDeleteUser, useUsers } from "@/hooks/useUsers";
import type { User } from "@/types/openjob";
import { UserDetailDrawer } from "./UserDetailDrawer";
import { UserFormDialog } from "./UserFormDialog";
import { UserTable } from "./UserTable";

export function UsersPage() {
  const users = useUsers();
  const remove = useDeleteUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<User | undefined>();
  const [viewing, setViewing] = useState<User | undefined>();
  const [toDelete, setToDelete] = useState<User | undefined>();

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setEditing(undefined);
      setFormOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const rows = useMemo(
    () =>
      (users.data ?? []).filter((user) =>
        `${user.firstname} ${user.lastname} ${user.username} ${user.email}`.toLowerCase().includes(query.toLowerCase())
      ),
    [users.data, query]
  );

  const confirmDelete = async () => {
    if (!toDelete?.id) return;
    try {
      await remove.mutateAsync(toDelete.id);
      toast.success("Utente eliminato");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Eliminazione non riuscita");
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Utenti"
        subtitle="Gestione completa degli utenti OpenJob."
        action={
          <Button
            className="bg-brand text-white hover:bg-brand/90"
            onClick={() => {
              setEditing(undefined);
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuovo utente
          </Button>
        }
      />
      {users.isError ? <ErrorState message={users.error.message} onRetry={() => users.refetch()} /> : null}
      <Input
        placeholder="Cerca per nome, username o email"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="max-w-sm"
      />
      <UserTable
        rows={rows}
        isLoading={users.isLoading}
        onView={setViewing}
        onEdit={(user) => {
          setEditing(user);
          setFormOpen(true);
        }}
        onDelete={setToDelete}
      />
      <UserFormDialog open={formOpen} onOpenChange={setFormOpen} editing={editing} />
      <UserDetailDrawer user={viewing} onOpenChange={(value) => !value && setViewing(undefined)} />
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(value) => !value && setToDelete(undefined)}
        title="Eliminare l'utente?"
        description={`"${toDelete?.username ?? ""}" verra' rimosso definitivamente.`}
        confirmLabel="Elimina"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
