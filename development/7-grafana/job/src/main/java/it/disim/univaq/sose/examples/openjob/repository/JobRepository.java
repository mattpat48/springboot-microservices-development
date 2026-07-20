package it.disim.univaq.sose.examples.openjob.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.disim.univaq.sose.examples.openjob.model.Job;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

}
