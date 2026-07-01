package it.disim.univaq.sose.examples.openjob.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.disim.univaq.sose.examples.openjob.model.User;
import it.disim.univaq.sose.examples.openjob.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	protected UserRepository repository;

	@Autowired
	protected it.disim.univaq.sose.examples.openjob.repository.RoleRepository roleRepository;

	@Override
	@Transactional(readOnly=true)
	public List<User> findAll() {
		return repository.findAll();
	}

	@Override
	@Transactional(readOnly=true)
	public User findById(Long id) {
		return repository.findById(id).orElse(null);
	}

	@Override
	@Transactional
	public void create(User user) {
		validateAndResolveRoles(user);
		repository.save(user);
		
	}

	@Override
	@Transactional
	public void update(User user) {
		validateAndResolveRoles(user);
		repository.save(user);
		
	}

	private void validateAndResolveRoles(User user) {
		if (user != null && user.getRoles() != null) {
			boolean isAdmin = user.getRoles().stream()
					.anyMatch(r -> r != null && r.getName() != null && "admin".equalsIgnoreCase(r.getName()));
			if (isAdmin && user.getRoles().size() > 1) {
				throw new IllegalArgumentException("An admin user cannot hold other roles.");
			}

			java.util.Set<it.disim.univaq.sose.examples.openjob.model.Role> resolvedRoles = new java.util.HashSet<>();
			for (it.disim.univaq.sose.examples.openjob.model.Role r : user.getRoles()) {
				if (r != null) {
					it.disim.univaq.sose.examples.openjob.model.Role dbRole = null;
					if (r.getName() != null) {
						dbRole = roleRepository.findByName(r.getName()).orElse(null);
					}
					if (dbRole == null && r.getId() != null) {
						dbRole = roleRepository.findById(r.getId()).orElse(null);
					}
					if (dbRole != null) {
						resolvedRoles.add(dbRole);
					} else {
						r.setId(null);
						resolvedRoles.add(roleRepository.save(r));
					}
				}
			}
			user.setRoles(resolvedRoles);
		}
	}

	@Override
	@Transactional
	public void delete(Long id) {
		repository.deleteById(id);
		
	}

	@Override
	@Transactional(readOnly=true)
	public Optional<User> findByUsername(String username) {
		return repository.findByUsername(username);
	}
}
