package it.disim.univaq.sose.examples.openjob.service;

import java.util.List;

import it.disim.univaq.sose.examples.openjob.model.Job;

public interface JobService {

	List<Job> findAll();

	Job findById(Long id);

	void create(Job job);

	void update(Job job);

	void delete(Long id);
}
