package it.disim.univaq.sose.examples.openjob.model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class ApplicantIdentity implements Serializable {

	private static final long serialVersionUID = 7335321122465665994L;

	@Column(name = "job_id", nullable=false)
	private Long jobId;

	@Column(name = "user_id", nullable=false)
	private Long userId;
	

	public Long getJobId() {
		return jobId;
	}

	public void setJobId(Long jobId) {
		this.jobId = jobId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

}