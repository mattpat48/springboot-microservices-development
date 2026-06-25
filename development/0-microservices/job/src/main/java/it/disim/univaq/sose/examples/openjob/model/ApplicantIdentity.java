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

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		ApplicantIdentity that = (ApplicantIdentity) o;
		if (jobId != null ? !jobId.equals(that.jobId) : that.jobId != null) return false;
		return userId != null ? userId.equals(that.userId) : that.userId == null;
	}

	@Override
	public int hashCode() {
		int result = jobId != null ? jobId.hashCode() : 0;
		result = 31 * result + (userId != null ? userId.hashCode() : 0);
		return result;
	}
}