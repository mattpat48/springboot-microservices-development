package it.disim.univaq.sose.examples.openjob.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.disim.univaq.sose.examples.openjob.model.Job;
import it.disim.univaq.sose.examples.openjob.repository.JobRepository;

@Service
public class JobServiceImpl implements JobService {

	@Autowired
	protected JobRepository repository;
	
	@Override
	@Transactional(readOnly=true)
	public List<Job> findAll() {
		return repository.findAll();
	}

	@Override
	@Transactional(readOnly=true)
	public Job findById(Long id) {
		return repository.findById(id).orElse(null);
	}

	@Override
	@Transactional
	public void create(Job job) {
		repository.save(job);
	}

	@Override
	@Transactional
	public void update(Job job) {
		repository.save(job);
	}

	@Override
	@Transactional
	public void delete(Long id) {
		repository.deleteById(id);
	}

	@Override
	@Transactional(readOnly=true)
	public it.disim.univaq.sose.examples.openjob.model.JobDomainStats getStats() {
		List<Job> jobs = repository.findAll();
		long totalJobs = jobs.size();

		java.time.Instant now = java.time.Instant.now();
		java.time.Instant twentyFourHoursAgo = now.minus(1, java.time.temporal.ChronoUnit.DAYS);
		java.time.Instant sevenDaysAgo = now.minus(7, java.time.temporal.ChronoUnit.DAYS);

		long newJobs24h = jobs.stream()
				.filter(j -> j.getCreatedAt() != null && !j.getCreatedAt().isBefore(twentyFourHoursAgo))
				.count();
		long newJobs7d = jobs.stream()
				.filter(j -> j.getCreatedAt() != null && !j.getCreatedAt().isBefore(sevenDaysAgo))
				.count();

		long totalApplications = 0;
		long newApps24h = 0;
		long newApps7d = 0;
		long coldJobs = 0;

		java.util.Map<Long, Long> recruiterJobCount = new java.util.HashMap<>();
		java.util.Map<Long, Long> recruiterAppCount = new java.util.HashMap<>();

		for (Job j : jobs) {
			long appsForThisJob = j.getApplicants() != null ? j.getApplicants().size() : 0;
			if (appsForThisJob == 0) {
				coldJobs++;
			}
			totalApplications += appsForThisJob;

			if (j.getCreatedBy() != null) {
				long creator = j.getCreatedBy();
				recruiterJobCount.put(creator, recruiterJobCount.getOrDefault(creator, 0L) + 1);
				recruiterAppCount.put(creator, recruiterAppCount.getOrDefault(creator, 0L) + appsForThisJob);
			}

			if (j.getApplicants() != null) {
				for (it.disim.univaq.sose.examples.openjob.model.Applicant a : j.getApplicants()) {
					if (a.getCreatedAt() != null && !a.getCreatedAt().isBefore(twentyFourHoursAgo)) {
						newApps24h++;
					}
					if (a.getCreatedAt() != null && !a.getCreatedAt().isBefore(sevenDaysAgo)) {
						newApps7d++;
					}
				}
			}
		}

		double avgApps = totalJobs > 0 ? (double) totalApplications / totalJobs : 0.0;
		avgApps = Math.round(avgApps * 100.0) / 100.0;

		List<it.disim.univaq.sose.examples.openjob.model.JobDomainStats.JobPopularityDTO> popularJobs = jobs.stream()
				.map(j -> new it.disim.univaq.sose.examples.openjob.model.JobDomainStats.JobPopularityDTO(
						j.getId(), j.getTitle(), j.getApplicants() != null ? j.getApplicants().size() : 0, j.getCreatedBy()))
				.sorted((a, b) -> Long.compare(b.getApplicantCount(), a.getApplicantCount()))
				.limit(5)
				.collect(java.util.stream.Collectors.toList());

		List<it.disim.univaq.sose.examples.openjob.model.JobDomainStats.RecruiterStatsDTO> topRecruiters = recruiterJobCount.keySet().stream()
				.map(userId -> new it.disim.univaq.sose.examples.openjob.model.JobDomainStats.RecruiterStatsDTO(
						userId, recruiterJobCount.get(userId), recruiterAppCount.getOrDefault(userId, 0L)))
				.sorted((a, b) -> Long.compare(b.getTotalApplicationsReceived(), a.getTotalApplicationsReceived()))
				.limit(5)
				.collect(java.util.stream.Collectors.toList());

		return new it.disim.univaq.sose.examples.openjob.model.JobDomainStats(totalJobs, newJobs24h, newJobs7d,
				totalApplications, newApps24h, newApps7d, avgApps, coldJobs, popularJobs, topRecruiters);
	}
}
