package it.disim.univaq.sose.examples.openjob;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@EnableDiscoveryClient
@SpringBootApplication
public class GatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(GatewayApplication.class, args);
	}

	@Bean
	RouteLocator routes(RouteLocatorBuilder builder) {
		return builder.routes()
				.route("user_route_root", route -> route
						.path("/api/usr")
						.filters(filter -> filter.setPath("/user"))
						.uri("lb://user-microservice"))
				.route("user_route_nested", route -> route
						.path("/api/usr/**")
						.filters(filter -> filter.rewritePath("/api/usr/(?<segment>.*)", "/user/${segment}"))
						.uri("lb://user-microservice"))
				.route("job_route_root", route -> route
						.path("/api/job")
						.filters(filter -> filter.setPath("/job"))
						.uri("lb://job-microservice"))
				.route("job_route_nested", route -> route
						.path("/api/job/**")
						.filters(filter -> filter.rewritePath("/api/job/(?<segment>.*)", "/job/${segment}"))
						.uri("lb://job-microservice"))
				.build();
	}

}
