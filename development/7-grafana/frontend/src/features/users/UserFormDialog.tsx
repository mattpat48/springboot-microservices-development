import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateUser, useUpdateUser } from "@/hooks/useUsers";
import type { User } from "@/types/openjob";

const emptyUser: User = {
  firstname: "",
  lastname: "",
  username: "",
  email: "",
  password: "password123",
  active: true,
  passwordExpired: false,
};

export function UserFormDialog({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  editing?: User;
}) {
  const create = useCreateUser();
  const update = useUpdateUser();
  const [form, setForm] = useState<User>(emptyUser);

  useEffect(() => {
    setForm(editing ? { ...editing, password: editing.password ?? "password123" } : emptyUser);
  }, [editing, open]);

  const hasRole = (roleName: string) => (form.roles ?? []).some((r) => r.name?.toLowerCase() === roleName.toLowerCase());

  const toggleRole = (roleName: string, checked: boolean) => {
    let roles = [...(form.roles ?? [])];
    if (checked) {
      if (roleName.toLowerCase() === "admin") {
        roles = [{ id: 1, name: "admin" }];
      } else {
        roles = roles.filter((r) => r.name?.toLowerCase() !== "admin");
        const roleId = roleName.toLowerCase() === "job" ? 3 : 2;
        if (!roles.some((r) => r.name?.toLowerCase() === roleName.toLowerCase())) {
          roles.push({ id: roleId, name: roleName.toLowerCase() });
        }
      }
    } else {
      roles = roles.filter((r) => r.name?.toLowerCase() !== roleName.toLowerCase());
    }
    setForm({ ...form, roles });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (editing) {
        await update.mutateAsync({ ...editing, ...form, password: form.password || editing.password || "password123" });
        toast.success("Utente aggiornato");
      } else {
        await create.mutateAsync({ ...form, password: form.password || "password123" });
        toast.success("Utente creato");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Operazione non riuscita");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Modifica utente" : "Nuovo utente"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstname">Nome</Label>
              <Input id="firstname" required value={form.firstname} onChange={(event) => setForm({ ...form, firstname: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname">Cognome</Label>
              <Input id="lastname" required value={form.lastname} onChange={(event) => setForm({ ...form, lastname: event.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" required value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              required={!editing}
              type="password"
              value={form.password ?? ""}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Ruoli</Label>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={hasRole("admin")}
                  onChange={(event) => toggleRole("admin", event.target.checked)}
                />
                Admin
              </label>
              <label className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={hasRole("job")}
                  disabled={hasRole("admin")}
                  onChange={(event) => toggleRole("job", event.target.checked)}
                />
                Job Manager
              </label>
              <label className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={hasRole("applicant") || hasRole("candidate")}
                  disabled={hasRole("admin")}
                  onChange={(event) => toggleRole("applicant", event.target.checked)}
                />
                Candidate
              </label>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={form.active ?? true}
                onChange={(event) => setForm({ ...form, active: event.target.checked })}
              />
              Attivo
            </label>
            <label className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={form.passwordExpired ?? false}
                onChange={(event) => setForm({ ...form, passwordExpired: event.target.checked })}
              />
              Password scaduta
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button type="submit" className="bg-brand text-white hover:bg-brand/90" disabled={create.isPending || update.isPending}>
              {editing ? "Salva" : "Crea"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
