package it.disim.univaq.sose.examples.openjob.service;

import java.util.List;
import java.util.Optional;

import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.disim.univaq.sose.examples.openjob.model.Role;
import it.disim.univaq.sose.examples.openjob.model.User;
import it.disim.univaq.sose.examples.openjob.repository.UserRepository;
import jakarta.persistence.EntityManager;

@Service
public class UserServiceImpl implements UserService {

	protected final UserRepository repository;
	protected final EntityManager entityManager;

	public UserServiceImpl(UserRepository repository, EntityManager entityManager) {
		this.repository = repository;
		this.entityManager = entityManager;
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
		if (user.getRoles() != null) {
			Set<Role> managedRoles = new HashSet<>();
			for (Role role : user.getRoles()) {
				managedRoles.add(entityManager.getReference(Role.class, role.getId()));
			}
			user.setRoles(managedRoles);
		}
		repository.save(user);

	}

	@Override
	@Transactional
	public void update(User user) {
		if (user.getRoles() != null) {
			Set<Role> managedRoles = new HashSet<>();
			for (Role role : user.getRoles()) {
				managedRoles.add(entityManager.getReference(Role.class, role.getId()));
			}
			user.setRoles(managedRoles);
		}
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
