import {
  Award,
  BarChart3,
  BriefcaseBusiness,
  Flame,
  Percent,
  RefreshCw,
  Send,
  Snowflake,
  UserCheck,
  Users,
} from "lucide-react";
import { useJobDomainStats, useUserDomainStats } from "@/hooks/useDomainStats";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DomainAnalyticsPage() {
  const userStats = useUserDomainStats();
  const jobStats = useJobDomainStats();

  const isLoading = userStats.isLoading || jobStats.isLoading;
  const isError = userStats.isError || jobStats.isError;

  const uData = userStats.data || {
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    newUsers24h: 0,
    newUsers7d: 0,
    roleBreakdown: { admin: 0, job: 0, applicant: 0 },
  };

  const jData = jobStats.data || {
    totalJobs: 0,
    newJobs24h: 0,
    newJobs7d: 0,
    totalApplications: 0,
    newApplications24h: 0,
    newApplications7d: 0,
    averageApplicationsPerJob: 0,
    coldJobsCount: 0,
    topPopularJobs: [],
    topRecruiters: [],
  };

  const maxJobApplicants = Math.max(
    1,
    ...jData.topPopularJobs.map((j) => j.applicantCount)
  );

  const totalRolesCount =
    (uData.roleBreakdown.admin || 0) +
    (uData.roleBreakdown.job || 0) +
    (uData.roleBreakdown.applicant || 0);

  const getRolePercent = (count: number) => {
    if (!totalRolesCount) return 0;
    return Math.round((count / totalRolesCount) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Statistiche di Dominio & Business Intelligence"
          subtitle="Analisi in tempo reale della crescita utenti, popolarità delle offerte e attività dei recruiter."
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              userStats.refetch();
              jobStats.refetch();
            }}
            disabled={isLoading}
            className="flex items-center gap-1.5 shadow-2xs hover:bg-brand-soft hover:text-brand"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            <span>Aggiorna Dati</span>
          </Button>
        </div>
      </div>

      {isError && (
        <ErrorState
          message="Impossibile recuperare alcune statistiche di dominio dai microservizi."
          onRetry={() => {
            userStats.refetch();
            jobStats.refetch();
          }}
        />
      )}

      {/* Top Velocity & KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-xl border bg-white shadow-2xs transition-shadow hover:shadow-md dark:bg-zinc-900">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nuovi Utenti (7 giorni)</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-brand">+{uData.newUsers7d}</span>
                <span className="text-xs font-semibold text-emerald-600 font-mono">
                  (+{uData.newUsers24h} oggi)
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Su {uData.totalUsers} utenti totali</p>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-soft text-brand">
              <Users className="h-6 w-6" />
            </span>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-white shadow-2xs transition-shadow hover:shadow-md dark:bg-zinc-900">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nuove Offerte (7 giorni)</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-ink">+{jData.newJobs7d}</span>
                <span className="text-xs font-semibold text-emerald-600 font-mono">
                  (+{jData.newJobs24h} oggi)
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Su {jData.totalJobs} annunci attivi</p>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <BriefcaseBusiness className="h-6 w-6" />
            </span>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-white shadow-2xs transition-shadow hover:shadow-md dark:bg-zinc-900">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Candidature (7 giorni)</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-emerald-600">+{jData.newApplications7d}</span>
                <span className="text-xs font-semibold text-emerald-600 font-mono">
                  (+{jData.newApplications24h} oggi)
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{jData.totalApplications} application totali</p>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <Send className="h-6 w-6" />
            </span>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-white shadow-2xs transition-shadow hover:shadow-md dark:bg-zinc-900">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tasso Medio Candidature</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-purple-600">
                  {jData.averageApplicationsPerJob}
                </span>
                <span className="text-xs font-medium text-muted-foreground">/ offerta</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Volume di interazione</p>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-purple-50 text-purple-600">
              <BarChart3 className="h-6 w-6" />
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Middle Grid: Top Jobs & Role Breakdown */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Top 5 Trending Jobs */}
        <Card className="rounded-xl border bg-white shadow-2xs dark:bg-zinc-900">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span>Top 5 Offerte Più Richieste</span>
              </CardTitle>
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                Trending
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Classifica delle posizioni con il maggior volume di candidature ricevute
            </p>
          </CardHeader>
          <CardContent className="pt-5 space-y-5">
            {jData.topPopularJobs.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nessuna offerta con candidature presente nel sistema.
              </p>
            ) : (
              jData.topPopularJobs.map((job, idx) => {
                const widthPct = Math.min(100, Math.max(8, (job.applicantCount / maxJobApplicants) * 100));
                return (
                  <div key={job.jobId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-slate-100 text-xs font-bold font-mono text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-ink truncate">{job.title}</span>
                        <span className="text-xs text-muted-foreground font-mono shrink-0">
                          (ID #{job.jobId})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-sm font-bold text-brand">
                          {job.applicantCount}
                        </span>
                        <span className="text-xs text-muted-foreground">cand.</span>
                      </div>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand to-brand/80 transition-all duration-500"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Role Breakdown Chart */}
        <Card className="rounded-xl border bg-white shadow-2xs dark:bg-zinc-900">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Percent className="h-4 w-4 text-brand" />
                <span>Distribuzione Utenti per Ruolo RBAC</span>
              </CardTitle>
              <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand">
                {uData.totalUsers} Utenti
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ripartizione percentuale degli account attivi nella piattaforma
            </p>
          </CardHeader>
          <CardContent className="pt-5 space-y-5">
            <div className="space-y-4">
              {/* Admin Role */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                    <span className="font-semibold text-ink">Amministratore (Admin)</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-sm">
                    <span className="font-bold text-ink">{uData.roleBreakdown.admin || 0}</span>
                    <span className="text-xs text-muted-foreground">({getRolePercent(uData.roleBreakdown.admin || 0)}%)</span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-rose-500 transition-all duration-500"
                    style={{ width: `${getRolePercent(uData.roleBreakdown.admin || 0)}%` }}
                  />
                </div>
              </div>

              {/* Job Manager Role */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    <span className="font-semibold text-ink">Job Manager / Recruiter</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-sm">
                    <span className="font-bold text-ink">{uData.roleBreakdown.job || 0}</span>
                    <span className="text-xs text-muted-foreground">({getRolePercent(uData.roleBreakdown.job || 0)}%)</span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${getRolePercent(uData.roleBreakdown.job || 0)}%` }}
                  />
                </div>
              </div>

              {/* Applicant Role */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-ink">Candidato / Applicant</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-sm">
                    <span className="font-bold text-ink">{uData.roleBreakdown.applicant || 0}</span>
                    <span className="text-xs text-muted-foreground">({getRolePercent(uData.roleBreakdown.applicant || 0)}%)</span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${getRolePercent(uData.roleBreakdown.applicant || 0)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-lg border bg-slate-50 p-3 text-xs dark:bg-zinc-800/50">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-emerald-600" />
                <span className="font-medium text-ink">Stato Account:</span>
              </div>
              <div className="flex items-center gap-4 font-semibold font-mono">
                <span className="text-emerald-600">{uData.activeUsers} Attivi</span>
                {uData.inactiveUsers > 0 && <span className="text-rose-600">{uData.inactiveUsers} Inattivi</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid: Recruiter Leaderboard & Cold Jobs Alert */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Top Recruiters */}
        <Card className="rounded-xl border bg-white shadow-2xs dark:bg-zinc-900">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Award className="h-4 w-4 text-purple-600" />
                <span>Classifica Attività Recruiter</span>
              </CardTitle>
              <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 border border-purple-200">
                Performance
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              I recruiter più attivi per numero di offerte pubblicate e candidature ricevute
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="divide-y">
              {jData.topRecruiters.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Nessun recruiter con attività registrata.
                </p>
              ) : (
                jData.topRecruiters.map((rec, idx) => (
                  <div key={rec.userId} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-purple-50 text-xs font-bold font-mono text-purple-700 border border-purple-100">
                        #{idx + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink">Recruiter ID #{rec.userId}</p>
                        <p className="text-xs text-muted-foreground">{rec.jobsCount} annunci pubblicati</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm font-bold text-purple-700">
                        {rec.totalApplicationsReceived}
                      </span>
                      <p className="text-[11px] text-muted-foreground">candidature</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cold Jobs Alert */}
        <Card className="rounded-xl border bg-white shadow-2xs dark:bg-zinc-900 flex flex-col justify-between">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Snowflake className="h-4 w-4 text-sky-500" />
                <span>Monitoraggio Annunci Inattivi (Cold Jobs)</span>
              </CardTitle>
              <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-700 border border-sky-200">
                Attenzione Richiesta
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Offerte lavorative pubblicate ma che non hanno ancora ricevuto alcuna candidatura
            </p>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 shadow-2xs">
              <span className="font-display text-2xl font-bold font-mono">{jData.coldJobsCount}</span>
            </div>
            <div className="max-w-md">
              <p className="text-sm font-semibold text-ink">
                {jData.coldJobsCount === 1
                  ? "C'è 1 offerta di lavoro senza candidature"
                  : `Ci sono ${jData.coldJobsCount} offerte di lavoro senza candidature`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Questi annunci potrebbero necessitare di una revisione del titolo, una descrizione più dettagliata o una maggiore visibilità sulla dashboard dei candidati.
              </p>
            </div>
            <div className="pt-2 w-full">
              <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600 dark:bg-zinc-800/50 dark:text-zinc-400">
                💡 <strong>Suggerimento operativo:</strong> Verifica periodicamente queste offerte e incoraggia i recruiter a ottimizzare i requisiti richiesti per attrarre più talenti.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
