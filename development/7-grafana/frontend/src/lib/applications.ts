import type { Job, User } from "@/types/openjob";

export interface ApplicationRow {
  jobId: number;
  userId: number;
  jobTitle: string;
  user?: User;
  createdAt?: string;
}

export function deriveApplications(jobs: Job[], users: User[]): ApplicationRow[] {
  const usersById = new Map(users.filter((user) => user.id != null).map((user) => [Number(user.id), user]));

  return jobs.flatMap((job) =>
    (job.applicants ?? []).map((applicant) => {
      const userId = Number(applicant.applicantIdentity.userId);
      return {
        jobId: Number(job.id ?? applicant.applicantIdentity.jobId),
        userId,
        jobTitle: job.title,
        user: usersById.get(userId),
        createdAt: applicant.createdAt,
      };
    })
  );
}
