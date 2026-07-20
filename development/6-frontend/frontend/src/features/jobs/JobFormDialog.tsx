import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateJob, useUpdateJob } from "@/hooks/useJobs";
import { useUsers } from "@/hooks/useUsers";
import type { Job } from "@/types/openjob";

const emptyJob: Job = { title: "", description: "", createdBy: 0 };

export function JobFormDialog({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  editing?: Job;
}) {
  const users = useUsers();
  const create = useCreateJob();
  const update = useUpdateJob();
  const [form, setForm] = useState<Job>(emptyJob);

  useEffect(() => {
    setForm(editing ?? emptyJob);
  }, [editing, open]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.createdBy) {
      toast.error("Seleziona un recruiter");
      return;
    }

    try {
      if (editing) {
        await update.mutateAsync({ ...editing, ...form });
        toast.success("Offerta aggiornata");
      } else {
        await create.mutateAsync(form);
        toast.success("Offerta creata");
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
          <DialogTitle>{editing ? "Modifica offerta" : "Nuova offerta"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titolo</Label>
            <Input id="title" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrizione</Label>
            <Textarea
              id="description"
              required
              rows={4}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Recruiter</Label>
            <Select value={form.createdBy ? String(form.createdBy) : ""} onValueChange={(value) => setForm({ ...form, createdBy: Number(value) })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona recruiter" />
              </SelectTrigger>
              <SelectContent>
                {(users.data ?? [])
                  .filter((user) => user.id != null)
                  .map((user) => (
                    <SelectItem key={user.id} value={String(user.id)}>
                      {user.username} (#{user.id})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
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
