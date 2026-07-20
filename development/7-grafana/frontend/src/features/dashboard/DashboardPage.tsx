import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { useApplications } from "@/hooks/useApplications";
import { useHealth } from "@/hooks/useHealth";
import { useJobs } from "@/hooks/useJobs";
import { useUsers } from "@/hooks/useUsers";
import { QuickActions } from "./QuickActions";
import { ServiceStatusCard } from "./ServiceStatusCard";
import { StatCards } from "./StatCards";

export function DashboardPage() {
  const health = useHealth();
  const users = useUsers();
  const jobs = useJobs();
  const applications = useApplications();

  const userStatus = users.isError ? "DOWN" : users.isLoading ? "CHECKING" : "UP";
  const jobStatus = jobs.isError ? "DOWN" : jobs.isLoading ? "CHECKING" : "UP";
  const gatewayStatus = health.isError ? "DOWN" : health.data?.status ?? (health.isLoading ? "CHECKING" : "UNKNOWN");

  const services = [
    { name: "Gateway", status: gatewayStatus, detail: "/actuator/health" },
    { name: "Discovery", status: gatewayStatus === "UP" ? "UP" : gatewayStatus, detail: "Eureka via gateway" },
    { name: "User", status: userStatus, detail: "/api/usr" },
    { name: "Job", status: jobStatus, detail: "/api/job" },
  ];

  const activeServices = services.filter((service) => service.status === "UP").length;

  return (
    <div className="space-y-5">
      <PageHeader title="Dashboard" subtitle="Stato operativo e metriche principali della console OpenJob." />
      {(health.isError || users.isError || jobs.isError) && (
        <ErrorState
          message="Alcuni dati non sono raggiungibili. Verifica che lo stack Docker sia avviato."
          onRetry={() => {
            health.refetch();
            users.refetch();
            jobs.refetch();
          }}
        />
      )}
      <StatCards
        values={{
          users: users.data?.length ?? 0,
          jobs: jobs.data?.length ?? 0,
          applications: applications.data.length,
          services: activeServices,
        }}
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_1.35fr]">
        <ServiceStatusCard services={services} isLoading={health.isLoading && users.isLoading && jobs.isLoading} onRefresh={() => health.refetch()} />
        <QuickActions />
      </div>
    </div>
  );
}
