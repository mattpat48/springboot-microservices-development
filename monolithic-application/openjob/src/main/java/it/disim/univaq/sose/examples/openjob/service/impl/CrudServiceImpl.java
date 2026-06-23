package it.disim.univaq.sose.examples.openjob.service.impl;

import java.util.List;



import it.disim.univaq.sose.examples.openjob.repository.CrudRepository;
import it.disim.univaq.sose.examples.openjob.service.CrudService;

public class CrudServiceImpl<Entity, Key> implements CrudService<Entity, Key>{

	protected final CrudRepository<Entity, Key> repository;

	public CrudServiceImpl(CrudRepository<Entity, Key> repository) {
		this.repository = repository;
	}
	
	@Override
	public List<Entity> findAll() {
		return repository.findAll();
	}

	@Override
	public Entity findById(Key key) {
		return repository.findById(key).orElse(null);
	}

	@Override
	public void create(Entity entity) {
		repository.save(entity);
	}

	@Override
	public void update(Entity entity) {
		repository.save(entity);
	}

	@Override
	public void delete(Key key) {
		repository.deleteById(key);
	}

}
