export interface Role {
  id?: number;
  name?: string;
}

export interface User {
  id?: number;
  firstname: string;
  lastname: string;
  username: string;
  password?: string;
  email: string;
  active?: boolean;
  passwordExpired?: boolean;
  roles?: Role[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplicantIdentity {
  jobId: number;
  userId: number;
}

export interface Applicant {
  applicantIdentity: ApplicantIdentity;
  createdAt?: string;
  updatedAt?: string;
}

export interface Job {
  id?: number;
  title: string;
  description: string;
  createdBy: number;
  applicants?: Applicant[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Health {
  status: string;
  components?: Record<string, { status?: string; details?: unknown }>;
}

export interface Info {
  app?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface UserDomainStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsers24h: number;
  newUsers7d: number;
  roleBreakdown: Record<string, number>;
}

export interface JobPopularityDTO {
  jobId: number;
  title: string;
  applicantCount: number;
  createdBy: number;
}

export interface RecruiterStatsDTO {
  userId: number;
  jobsCount: number;
  totalApplicationsReceived: number;
}

export interface JobDomainStats {
  totalJobs: number;
  newJobs24h: number;
  newJobs7d: number;
  totalApplications: number;
  newApplications24h: number;
  newApplications7d: number;
  averageApplicationsPerJob: number;
  coldJobsCount: number;
  topPopularJobs: JobPopularityDTO[];
  topRecruiters: RecruiterStatsDTO[];
}
