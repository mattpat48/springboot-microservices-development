package it.disim.univaq.sose.examples.openjob.service;

import java.util.List;
import java.util.Optional;

import it.disim.univaq.sose.examples.openjob.model.User;

public interface UserService {

	List<User> findAll();

	User findById(Long id);

	void create(User user);

	void update(User user);

	void delete(Long id);

	Optional<User> findByUsername(String username);
}
