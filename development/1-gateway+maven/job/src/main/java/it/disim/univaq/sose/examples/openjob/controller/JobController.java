package it.disim.univaq.sose.examples.openjob.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

import com.fasterxml.jackson.databind.JsonNode;

import it.disim.univaq.sose.examples.openjob.invoker.UserMicroserviceInvoker;
import it.disim.univaq.sose.examples.openjob.model.Applicant;
import it.disim.univaq.sose.examples.openjob.model.ApplicantIdentity;
import it.disim.univaq.sose.examples.openjob.model.Job;
import it.disim.univaq.sose.examples.openjob.service.JobService;

@RestController
@RequestMapping("/job")
public class JobController {

	private final JobService jobService;
	private final UserMicroserviceInvoker userMicroserviceInvoker;

	public JobController(JobService jobService, UserMicroserviceInvoker userMicroserviceInvoker) {
		this.jobService = jobService;
		this.userMicroserviceInvoker = userMicroserviceInvoker;
	}


	@Value("${server.port}")
	private String portNumber;

	@GetMapping
	public ResponseEntity<List<Job>> getAllJobs() {
		System.out.println(portNumber);
		return ResponseEntity.ok(jobService.findAll());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Job> getJobById(@PathVariable("id") Long id) {
		System.out.println(portNumber);
		return ResponseEntity.ok(jobService.findById(id));
	}

	@PostMapping
	public ResponseEntity<Void> createJob(@RequestBody Job job) {
		System.out.println(portNumber);
		jobService.create(job);
		return ResponseEntity.noContent().build();
	}

	@PutMapping
	public ResponseEntity<Void> updateJob(@RequestBody Job job) {
		System.out.println(portNumber);
		jobService.update(job);
		return ResponseEntity.noContent().build();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteJob(@PathVariable("id") Long id) {
		System.out.println(portNumber);
		jobService.delete(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/apply/{username}/{id}")
	public ResponseEntity<Void> applytoJob(@PathVariable("username") String username, @PathVariable("id") Long id) {
		System.out.println(portNumber);
		Job job = jobService.findById(id);

		JsonNode jsonUser = userMicroserviceInvoker.findUserByUsername(username);

		Optional.ofNullable(jsonUser).orElseThrow();

		ApplicantIdentity applicantIdentity = new ApplicantIdentity();
		applicantIdentity.setJobId(job.getId());
		applicantIdentity.setUserId(jsonUser.findValue(UserMicroserviceInvoker.FIELD_ID).asLong());
		Applicant applicant = new Applicant();
		applicant.setApplicantIdentity(applicantIdentity);
		applicant.setJob(job);
		job.getApplicants().add(applicant);

		jobService.update(job);

		return ResponseEntity.noContent().build();
	}

}