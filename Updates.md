# Project Updates

## Version Migrations (Global)
The legacy configurations in all `pom.xml` files across the project (including the monolithic application, microservices, and all development steps) have been migrated to the latest standards:
- **Spring Boot**: Upgraded from `3.x` to `4.1.0`.
- **Java**: Upgraded from `17` to `25`.
- **Spring Cloud**: Upgraded from `2022.0.2` to `2025.1.2`.
- **Dependencies**: Added `micrometer-registry-prometheus` to the `job`, `user`, and `gateway` microservices to support Grafana/Prometheus monitoring.
- **Spring Cloud Gateway Modernization**: Replaced `spring-cloud-starter-gateway` with `spring-cloud-starter-gateway-server-webflux` across all gateway `pom.xml` files. In the latest Spring Cloud versions (`2025.x`), the Gateway was split into WebFlux and MVC implementations, and the old `spring-cloud-starter-gateway` artifact was removed from the BOM. This rename resolves the "dependencies.dependency.version is missing" build error and ensures the application correctly pulls in the modern reactive gateway stack.

## Monolithic Application Code Modernization
The legacy Spring code in `monolithic-application/openjob` has been updated to align with modern best practices:
- **Constructor Injection**: Replaced outdated `@Autowired` field injections with constructor injection to improve testability and ensure immutability across controllers and services.
- **ResponseEntity Builders**: Modernized the REST controller endpoints by replacing legacy response instantiations (e.g., `new ResponseEntity<>(body, HttpStatus.OK)`) with modern Spring builder patterns such as `ResponseEntity.ok()` and `ResponseEntity.noContent().build()`.

## Development Step: 0-microservices Code Modernization
- **Constructor Injection & ResponseEntity Builders**: Applied the same modernizations used in the monolithic application to the `job` and `user` microservices.
- **Jackson Dependency Fix**: Added the missing `jackson-databind` dependency to the `job` microservice's `pom.xml` to resolve `JsonNode` processing errors.

## Development Step: 1-gateway+maven Code Modernization
- **Gateway Server Update**: Replaced the obsolete `spring-cloud-starter-gateway` dependency with `spring-cloud-starter-gateway-server-webflux`.

## Development Step: 2-decentralized_configuration Code Modernization
- **Constructor Injection & ResponseEntity Builders**: Updated the `job` and `user` microservices.
- **Jackson Dependency Fix**: Added `jackson-databind` to the `job` microservice.
- **Gateway Server Update**: Applied the `spring-cloud-starter-gateway-server-webflux` dependency update.

## Development Step: 3-service_discovery+load_balancing Code Modernization
- **Constructor Injection & ResponseEntity Builders**: Updated the `job` and `user` microservices, completely removing obsolete imports such as `org.springframework.beans.factory.annotation.Autowired` and `org.springframework.http.HttpStatus`.
- **Jackson Dependency Fix**: Added `jackson-databind` to the `job` microservice.

## Development Step: 4-openfeign_client-side_load_balancer Code Modernization & Migration
- **RestTemplate to OpenFeign Migration**: The `UserMicroserviceInvoker` in the `job` microservice was entirely rewritten. It was previously a legacy `RestTemplate` implementation, but it has now been correctly refactored into a modern `@FeignClient` interface. 
- **OpenFeign Configuration**: Introduced the `spring-cloud-starter-openfeign` dependency and activated `@EnableFeignClients` in the `JobApplication` main class.
- **Constructor Injection & ResponseEntity Builders**: Updated the `job` and `user` microservices and removed obsolete imports.
- **Jackson Dependency Fix**: Added `jackson-databind` to the `job` microservice.

## Global Modernizations: RestTemplate Anti-Pattern Fixes
During a final review of the modernization process from steps `0` through `3`, a major anti-pattern was identified and resolved:
- **RestTemplate Bean Instantiation**: The `UserMicroserviceInvoker` originally instantiated `new RestTemplate()` on every single method call. This approach is highly inefficient and bypasses the Spring context. A standard `@Bean` of type `RestTemplate` was created in the `JobApplication` for steps 0, 1, and 2, and properly injected using constructor injection.
- **Fixed Load Balancing in Step 3**: The biggest impact of the aforementioned anti-pattern was observed in step 3 (`3-service_discovery+load_balancing`). Because a raw `new RestTemplate()` was being used, client-side load balancing was completely broken and bypassed. To resolve this critical issue:
  1. The `spring-cloud-starter-loadbalancer` dependency was added to the `job` microservice.
  2. The `RestTemplate` bean was declared with the `@LoadBalanced` annotation inside `JobApplication`.
  3. This load-balanced bean was injected into `UserMicroserviceInvoker`, ensuring step 3 accurately performs service discovery and load balancing as intended.
