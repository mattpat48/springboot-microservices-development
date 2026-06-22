package it.disim.univaq.sose.examples.openjob.service.impl;

import org.springframework.stereotype.Service;

import it.disim.univaq.sose.examples.openjob.model.Job;
import it.disim.univaq.sose.examples.openjob.service.JobService;

@Service
public class JobServiceImpl extends CrudServiceImpl<Job, Long> implements JobService {

	public JobServiceImpl(it.disim.univaq.sose.examples.openjob.repository.JobRepository repository) {
		super(repository);
	}
}
