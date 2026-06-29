import { describe, expect, it } from "vitest";
import { deriveApplications } from "./applications";
import type { Job, User } from "@/types/openjob";

describe("deriveApplications", () => {
  it("deriva le righe candidatura facendo join con gli utenti", () => {
    const users: User[] = [
      { id: 7, firstname: "Ada", lastname: "Lovelace", username: "ada", email: "ada@example.test" },
    ];
    const jobs: Job[] = [
      {
        id: 3,
        title: "Backend developer",
        description: "Spring",
        createdBy: 1,
        applicants: [{ applicantIdentity: { jobId: 3, userId: 7 }, createdAt: "2026-06-29T10:00:00Z" }],
      },
    ];

    expect(deriveApplications(jobs, users)).toEqual([
      {
        jobId: 3,
        userId: 7,
        jobTitle: "Backend developer",
        user: users[0],
        createdAt: "2026-06-29T10:00:00Z",
      },
    ]);
  });

  it("mantiene la candidatura anche se l'utente non e' presente in cache", () => {
    const rows = deriveApplications(
      [{ id: 4, title: "Frontend", description: "React", createdBy: 1, applicants: [{ applicantIdentity: { jobId: 4, userId: 42 } }] }],
      []
    );

    expect(rows[0]).toMatchObject({ jobId: 4, userId: 42, jobTitle: "Frontend", user: undefined });
  });
});
