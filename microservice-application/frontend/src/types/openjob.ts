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
