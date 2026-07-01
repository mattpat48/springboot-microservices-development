package it.disim.univaq.sose.examples.openjob.controller;

import java.util.List;
import java.util.Map;
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

import it.disim.univaq.sose.examples.openjob.invoker.UserMicroserviceInvoker;
import it.disim.univaq.sose.examples.openjob.model.Applicant;
import it.disim.univaq.sose.examples.openjob.model.ApplicantIdentity;
import it.disim.univaq.sose.examples.openjob.model.Job;
import it.disim.univaq.sose.examples.openjob.service.JobService;

@RestController
@RequestMapping("/job")
public class JobController {

	@Autowired
	private JobService jobService;

	@Autowired
	private UserMicroserviceInvoker userMicroserviceInvoker;


	@Value("${server.port}")
	private String portNumber;

	@GetMapping
	public ResponseEntity<List<Job>> getAllJobs() {
		System.out.println(portNumber);
		return new ResponseEntity<List<Job>>(jobService.findAll(), HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Job> getJobById(@PathVariable("id") Long id) {
		System.out.println(portNumber);
		return new ResponseEntity<Job>(jobService.findById(id), HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<Void> createJob(@RequestBody Job job) {
		System.out.println(portNumber);
		if (job.getCreatedBy() != null) {
			Map<String, Object> userMap = userMicroserviceInvoker.findUserById(job.getCreatedBy());
			if (!hasRole(userMap, "job", "admin")) {
				return new ResponseEntity<Void>(HttpStatus.FORBIDDEN);
			}
		}
		jobService.create(job);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
	}

	@PutMapping
	public ResponseEntity<Void> updateJob(@RequestBody Job job) {
		System.out.println(portNumber);
		if (job.getCreatedBy() != null) {
			Map<String, Object> userMap = userMicroserviceInvoker.findUserById(job.getCreatedBy());
			if (!hasRole(userMap, "job", "admin")) {
				return new ResponseEntity<Void>(HttpStatus.FORBIDDEN);
			}
		}
		jobService.update(job);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteJob(@PathVariable("id") Long id) {
		System.out.println(portNumber);
		jobService.delete(id);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
	}

	@GetMapping("/apply/{username}/{id}")
	public ResponseEntity<Void> applytoJob(@PathVariable("username") String username, @PathVariable("id") Long id) {
		System.out.println(portNumber);
		Job job = jobService.findById(id);

		Map<String, Object> jsonUser = userMicroserviceInvoker.findUserByUsername(username);

		Optional.ofNullable(jsonUser).orElseThrow();

		if (!hasRole(jsonUser, "applicant", "candidate", "admin")) {
			return new ResponseEntity<Void>(HttpStatus.FORBIDDEN);
		}

		ApplicantIdentity applicantIdentity = new ApplicantIdentity();
		applicantIdentity.setJobId(job.getId());
		applicantIdentity.setUserId(((Number) jsonUser.get(UserMicroserviceInvoker.FIELD_ID)).longValue());
		Applicant applicant = new Applicant();
		applicant.setApplicantIdentity(applicantIdentity);
		applicant.setJob(job);
		job.getApplicants().add(applicant);

		jobService.update(job);

		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
	}

	@SuppressWarnings("unchecked")
	private boolean hasRole(Map<String, Object> userMap, String... allowedRoles) {
		if (userMap == null) return false;
		Object rolesObj = userMap.get(UserMicroserviceInvoker.FIELD_ROLES);
		if (!(rolesObj instanceof List)) return false;
		List<Map<String, Object>> roles = (List<Map<String, Object>>) rolesObj;
		for (Map<String, Object> r : roles) {
			Object nameObj = r.get(UserMicroserviceInvoker.FIELD_ROLE_NAME);
			if (nameObj != null) {
				String name = nameObj.toString();
				for (String allowed : allowedRoles) {
					if (allowed.equalsIgnoreCase(name)) {
						return true;
					}
				}
			}
		}
		return false;
	}

}
