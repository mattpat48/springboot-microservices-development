import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApplyToJob, useJobs } from "@/hooks/useJobs";
import { useUsers } from "@/hooks/useUsers";

export function ApplyDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (value: boolean) => void }) {
  const users = useUsers();
  const jobs = useJobs();
  const apply = useApplyToJob();
  const [username, setUsername] = useState("");
  const [jobId, setJobId] = useState("");

  useEffect(() => {
    if (!open) {
      setUsername("");
      setJobId("");
    }
  }, [open]);

  const submit = async () => {
    if (!username || !jobId) {
      toast.error("Seleziona candidato e offerta");
      return;
    }

    try {
      await apply.mutateAsync({ username, jobId: Number(jobId) });
      toast.success("Candidatura inviata");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Candidatura non riuscita");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuova candidatura</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Candidato</Label>
            <Select value={username} onValueChange={setUsername}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona candidato" />
              </SelectTrigger>
              <SelectContent>
                {(users.data ?? []).map((user) => (
                  <SelectItem key={user.id ?? user.username} value={user.username}>
                    {user.username} (#{user.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Offerta</Label>
            <Select value={jobId} onValueChange={setJobId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona offerta" />
              </SelectTrigger>
              <SelectContent>
                {(jobs.data ?? [])
                  .filter((job) => job.id != null)
                  .map((job) => (
                    <SelectItem key={job.id} value={String(job.id)}>
                      {job.title} (#{job.id})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button className="bg-brand text-white hover:bg-brand/90" onClick={submit} disabled={apply.isPending}>
            Invia candidatura
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
