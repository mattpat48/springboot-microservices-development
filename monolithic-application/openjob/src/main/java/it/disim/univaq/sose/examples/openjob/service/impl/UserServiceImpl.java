package it.disim.univaq.sose.examples.openjob.service.impl;

import java.util.Optional;

import org.springframework.stereotype.Service;

import it.disim.univaq.sose.examples.openjob.model.User;
import it.disim.univaq.sose.examples.openjob.repository.UserRepository;
import it.disim.univaq.sose.examples.openjob.service.UserService;

@Service
public class UserServiceImpl extends CrudServiceImpl<User, Long> implements UserService {

	@Override
	public Optional<User> findByUsername(String username) {
		return ((UserRepository) repository).findByUsername(username);
	}

	public UserServiceImpl(UserRepository repository) {
		super(repository);
	}

}
