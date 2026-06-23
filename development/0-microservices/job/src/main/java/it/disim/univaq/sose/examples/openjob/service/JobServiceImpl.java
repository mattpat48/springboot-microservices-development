package it.disim.univaq.sose.examples.openjob.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.disim.univaq.sose.examples.openjob.model.Job;
import it.disim.univaq.sose.examples.openjob.repository.JobRepository;

@Service
public class JobServiceImpl implements JobService {

	protected final JobRepository repository;

	public JobServiceImpl(JobRepository repository) {
		this.repository = repository;
	}
	
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
}
