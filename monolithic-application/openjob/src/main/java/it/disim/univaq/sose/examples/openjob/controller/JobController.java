package it.disim.univaq.sose.examples.openjob.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.disim.univaq.sose.examples.openjob.model.Job;
import it.disim.univaq.sose.examples.openjob.model.User;
import it.disim.univaq.sose.examples.openjob.service.JobService;
import it.disim.univaq.sose.examples.openjob.service.UserService;

@RestController
@RequestMapping("/job")
public class JobController {

	private final JobService jobService;
	private final UserService userService;

	public JobController(JobService jobService, UserService userService) {
		this.jobService = jobService;
		this.userService = userService;
	}

	@GetMapping
	public ResponseEntity<List<Job>> getAllJobs() {
		return ResponseEntity.ok(jobService.findAll());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Job> getJobById(@PathVariable("id") Long id) {
		return ResponseEntity.ok(jobService.findById(id));
	}

	@PostMapping
	public ResponseEntity<Void> createJob(@RequestBody Job job) {
		jobService.create(job);
		return ResponseEntity.noContent().build();
	}

	@PutMapping
	public ResponseEntity<Void> updateJob(@RequestBody Job job) {
		jobService.update(job);
		return ResponseEntity.noContent().build();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteJob(@PathVariable("id") Long id) {
		jobService.delete(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/apply/{username}/{id}")
	public ResponseEntity<Void> applytoJob(@PathVariable("username") String username, @PathVariable("id") Long id) {
		Job job = jobService.findById(id);
		User user = userService.findByUsername(username).orElseThrow();
		job.getApplicants().add(user);
		jobService.update(job);
		return ResponseEntity.noContent().build();
	}

}