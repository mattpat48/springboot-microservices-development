package it.disim.univaq.sose.examples.openjob.invoker;

import java.net.URI;
import java.net.URISyntaxException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class UserMicroserviceInvoker {

	public static final String FIELD_ID = "id";
	public static final String FIELD_USERNAME = "username";
	public static final String FILD_PASSWORD = "password";
	public static final String FIELD_PASSWORD_EXPIRED = "passwordExpired";
	public static final String FIELD_ACTIVE_USER = "active";
	public static final String FIELD_ROLES = "roles";
	public static final String FIELD_ROLE_NAME = "name";

	@Value("${microservice.user.find.uri}")
	private String baseUri;

	private final RestTemplate restTemplate;
	private final ObjectMapper objectMapper;

	public UserMicroserviceInvoker(RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
		this.objectMapper = new ObjectMapper();
	}

	public JsonNode findUserByUsername(String username) {
		URI uri = null;
		try {
			uri = new URI(baseUri + username);
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}
		String response = restTemplate.getForObject(uri, String.class);
		try {
			return response != null ? objectMapper.readTree(response) : null;
		} catch (Exception e) {
			throw new RuntimeException("Error parsing JSON response", e);
		}
	}

}