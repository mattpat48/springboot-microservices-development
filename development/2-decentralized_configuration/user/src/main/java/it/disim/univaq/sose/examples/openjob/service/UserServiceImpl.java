package it.disim.univaq.sose.examples.openjob.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.disim.univaq.sose.examples.openjob.model.User;
import it.disim.univaq.sose.examples.openjob.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

	protected final UserRepository repository;

	public UserServiceImpl(UserRepository repository) {
		this.repository = repository;
	}

	@Override
	@Transactional(readOnly = true)
	public List<User> findAll() {
		return repository.findAll();
	}

	@Override
	@Transactional(readOnly = true)
	public User findById(Long id) {
		return repository.findById(id).orElse(null);
	}

	@Override
	@Transactional
	public void create(User user) {
		repository.save(user);

	}

	@Override
	@Transactional
	public void update(User user) {
		repository.save(user);

	}

	@Override
	@Transactional
	public void delete(Long id) {
		repository.deleteById(id);

	}

	@Override
	@Transactional(readOnly = true)
	public Optional<User> findByUsername(String username) {
		return repository.findByUsername(username);
	}
}
