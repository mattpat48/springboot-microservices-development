package it.disim.univaq.sose.examples.openjob.invoker;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RefreshScope
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

	public Map<String, Object> findUserByUsername(String username) {
		URI uri = null;
		try {
			uri = new URI(baseUri + username);
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}
		RestTemplate restTemplate = new RestTemplate();
		return restTemplate.getForObject(uri, Map.class);
	}

}
