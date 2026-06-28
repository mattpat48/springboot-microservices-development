package it.disim.univaq.sose.examples.openjob.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import it.disim.univaq.sose.examples.openjob.model.audit.DateAudit;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Entity
@Table(name = "job_user")
public class Applicant extends DateAudit {
	private static final long serialVersionUID = -3246829878748768308L;
	
	@EmbeddedId
    private ApplicantIdentity applicantIdentity;

	@JsonIgnore // @JsonIgnore is used to solve infinite recursion issue caused by bidirectional relationship
	@MapsId("jobId")
	@ManyToOne (fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "job_id", nullable = false, updatable = false)
	private Job job;
	
	public ApplicantIdentity getApplicantIdentity() {
		return applicantIdentity;
	}

	public void setApplicantIdentity(ApplicantIdentity applicantIdentity) {
		this.applicantIdentity = applicantIdentity;
	}

	public Job getJob() {
		return job;
	}

	public void setJob(Job job) {
		this.job = job;
	}

}