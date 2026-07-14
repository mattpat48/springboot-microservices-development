package it.disim.univaq.sose.examples.openjob.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.disim.univaq.sose.examples.openjob.model.User;
import it.disim.univaq.sose.examples.openjob.service.UserService;

@RestController
@RequestMapping("/user")
public class UserController {

	@Autowired
	private UserService userService;

	@GetMapping
	public ResponseEntity<List<User>> getAllUsers() {
		return new ResponseEntity<List<User>>(userService.findAll(), HttpStatus.OK);
	}

	@GetMapping("/id/{id}")
	public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
		return new ResponseEntity<User>(userService.findById(id), HttpStatus.OK);
	}

	@GetMapping("/username/{username}")
	public ResponseEntity<User> getUserByUsername(@PathVariable("username") String username) {
		return new ResponseEntity<User>(userService.findByUsername(username).orElse(null), HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<Void> createUser(@RequestBody User user) {
		userService.create(user);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
	}

	@PutMapping
	public ResponseEntity<Void> updateUser(@RequestBody User user) {
		userService.update(user);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
	}

	@DeleteMapping("/id/{id}")
	public ResponseEntity<Void> deleteUser(@PathVariable("id") Long id) {
		userService.delete(id);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
	}

	@GetMapping("/stats")
	public ResponseEntity<it.disim.univaq.sose.examples.openjob.model.UserDomainStats> getStats() {
		return new ResponseEntity<>(userService.getStats(), HttpStatus.OK);
	}

}
