package it.disim.univaq.sose.examples.openjob.model;

import java.io.Serializable;
import java.util.List;

public class JobDomainStats implements Serializable {
	private static final long serialVersionUID = 1L;

	private long totalJobs;
	private long newJobs24h;
	private long newJobs7d;
	private long totalApplications;
	private long newApplications24h;
	private long newApplications7d;
	private double averageApplicationsPerJob;
	private long coldJobsCount;
	private List<JobPopularityDTO> topPopularJobs;
	private List<RecruiterStatsDTO> topRecruiters;

	public JobDomainStats() {}

	public JobDomainStats(long totalJobs, long newJobs24h, long newJobs7d, long totalApplications,
			long newApplications24h, long newApplications7d, double averageApplicationsPerJob,
			long coldJobsCount, List<JobPopularityDTO> topPopularJobs, List<RecruiterStatsDTO> topRecruiters) {
		this.totalJobs = totalJobs;
		this.newJobs24h = newJobs24h;
		this.newJobs7d = newJobs7d;
		this.totalApplications = totalApplications;
		this.newApplications24h = newApplications24h;
		this.newApplications7d = newApplications7d;
		this.averageApplicationsPerJob = averageApplicationsPerJob;
		this.coldJobsCount = coldJobsCount;
		this.topPopularJobs = topPopularJobs;
		this.topRecruiters = topRecruiters;
	}

	public long getTotalJobs() { return totalJobs; }
	public void setTotalJobs(long totalJobs) { this.totalJobs = totalJobs; }

	public long getNewJobs24h() { return newJobs24h; }
	public void setNewJobs24h(long newJobs24h) { this.newJobs24h = newJobs24h; }

	public long getNewJobs7d() { return newJobs7d; }
	public void setNewJobs7d(long newJobs7d) { this.newJobs7d = newJobs7d; }

	public long getTotalApplications() { return totalApplications; }
	public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }

	public long getNewApplications24h() { return newApplications24h; }
	public void setNewApplications24h(long newApplications24h) { this.newApplications24h = newApplications24h; }

	public long getNewApplications7d() { return newApplications7d; }
	public void setNewApplications7d(long newApplications7d) { this.newApplications7d = newApplications7d; }

	public double getAverageApplicationsPerJob() { return averageApplicationsPerJob; }
	public void setAverageApplicationsPerJob(double averageApplicationsPerJob) { this.averageApplicationsPerJob = averageApplicationsPerJob; }

	public long getColdJobsCount() { return coldJobsCount; }
	public void setColdJobsCount(long coldJobsCount) { this.coldJobsCount = coldJobsCount; }

	public List<JobPopularityDTO> getTopPopularJobs() { return topPopularJobs; }
	public void setTopPopularJobs(List<JobPopularityDTO> topPopularJobs) { this.topPopularJobs = topPopularJobs; }

	public List<RecruiterStatsDTO> getTopRecruiters() { return topRecruiters; }
	public void setTopRecruiters(List<RecruiterStatsDTO> topRecruiters) { this.topRecruiters = topRecruiters; }

	public static class JobPopularityDTO implements Serializable {
		private static final long serialVersionUID = 1L;
		private Long jobId;
		private String title;
		private long applicantCount;
		private Long createdBy;

		public JobPopularityDTO() {}

		public JobPopularityDTO(Long jobId, String title, long applicantCount, Long createdBy) {
			this.jobId = jobId;
			this.title = title;
			this.applicantCount = applicantCount;
			this.createdBy = createdBy;
		}

		public Long getJobId() { return jobId; }
		public void setJobId(Long jobId) { this.jobId = jobId; }

		public String getTitle() { return title; }
		public void setTitle(String title) { this.title = title; }

		public long getApplicantCount() { return applicantCount; }
		public void setApplicantCount(long applicantCount) { this.applicantCount = applicantCount; }

		public Long getCreatedBy() { return createdBy; }
		public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
	}

	public static class RecruiterStatsDTO implements Serializable {
		private static final long serialVersionUID = 1L;
		private Long userId;
		private long jobsCount;
		private long totalApplicationsReceived;

		public RecruiterStatsDTO() {}

		public RecruiterStatsDTO(Long userId, long jobsCount, long totalApplicationsReceived) {
			this.userId = userId;
			this.jobsCount = jobsCount;
			this.totalApplicationsReceived = totalApplicationsReceived;
		}

		public Long getUserId() { return userId; }
		public void setUserId(Long userId) { this.userId = userId; }

		public long getJobsCount() { return jobsCount; }
		public void setJobsCount(long jobsCount) { this.jobsCount = jobsCount; }

		public long getTotalApplicationsReceived() { return totalApplicationsReceived; }
		public void setTotalApplicationsReceived(long totalApplicationsReceived) { this.totalApplicationsReceived = totalApplicationsReceived; }
	}
}
