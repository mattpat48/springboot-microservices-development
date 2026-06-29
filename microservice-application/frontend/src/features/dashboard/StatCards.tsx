import { BriefcaseBusiness, Layers3, Send, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const cards = [
  { label: "Utenti", icon: Users, key: "users" },
  { label: "Offerte", icon: BriefcaseBusiness, key: "jobs" },
  { label: "Candidature", icon: Send, key: "applications" },
  { label: "Istanze attive", icon: Layers3, key: "services" },
] as const;

export function StatCards({ values }: { values: Record<(typeof cards)[number]["key"], number> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.key} className="rounded-lg">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="mt-2 font-display text-3xl font-bold">{values[card.key]}</p>
            </div>
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-soft text-brand">
              <card.icon className="h-5 w-5" />
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
