package it.disim.univaq.sose.examples.openjob.invoker;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.fasterxml.jackson.databind.JsonNode;

@FeignClient(name = "user")
public interface UserMicroserviceInvoker {

	public static final String FIELD_ID = "id";
	public static final String FIELD_USERNAME = "username";
	public static final String FILD_PASSWORD = "password";
	public static final String FIELD_PASSWORD_EXPIRED = "passwordExpired";
	public static final String FIELD_ACTIVE_USER = "active";
	public static final String FIELD_ROLES = "roles";
	public static final String FIELD_ROLE_NAME = "name";

	@GetMapping("/user/username/{username}")
	JsonNode findUserByUsername(@PathVariable("username") String username);

}