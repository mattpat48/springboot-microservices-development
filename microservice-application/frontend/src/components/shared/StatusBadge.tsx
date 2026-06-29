import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status?: string }) {
  const normalized = status?.toUpperCase() ?? "UNKNOWN";
  if (normalized === "UP") return <Badge variant="success">UP</Badge>;
  if (normalized === "DOWN") return <Badge variant="destructive">DOWN</Badge>;
  return <Badge variant="warning">{normalized}</Badge>;
}
