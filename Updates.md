# Project Updates

## Version Migrations (pom.xml)
The legacy configurations in all `pom.xml` files across the project (including monolithic, microservices, and development directories) have been migrated to the latest standards:
- **Spring Boot**: Upgraded from `3.x` to `4.1.0`.
- **Java**: Upgraded from `17` to `25`.
- **Spring Cloud**: Upgraded from `2022.0.2` to `2025.1.2`.
- **Dependencies**: Added `micrometer-registry-prometheus` to the `job`, `user`, and `gateway` microservices to support Grafana/Prometheus monitoring.
- **Spring Cloud Gateway Modernization**: Replaced `spring-cloud-starter-gateway` with `spring-cloud-starter-gateway-server-webflux` across all gateway `pom.xml` files. 
  - **Motive**: In the latest Spring Cloud versions (like `2025.x`), the Gateway was split into WebFlux and MVC implementations, and the old `spring-cloud-starter-gateway` artifact was removed from the BOM. This rename resolves the "dependencies.dependency.version is missing" build error and ensures the application correctly pulls in the modern reactive gateway stack.

## Monolithic Application Code Modernization
The legacy Spring code in `monolithic-application/openjob` has been thoroughly reviewed and updated to align with modern best practices:
- **Constructor Injection**: Replaced all outdated `@Autowired` field injections with Constructor Injection to improve testability and ensure immutability. This was applied to:
  - `JobController`
  - `UserController`
  - `CrudServiceImpl`
  - `JobServiceImpl`
  - `UserServiceImpl`
- **ResponseEntity Builders**: Modernized the REST controller endpoints. Replaced legacy and verbose response instantiations (e.g., `new ResponseEntity<>(body, HttpStatus.OK)`) with modern Spring builder patterns such as `ResponseEntity.ok()` and `ResponseEntity.noContent().build()`.
- **Compilation Check**: Verified that the monolithic application compiles successfully with zero errors under Java 25 and Spring Boot 4.1.0.

## Development Step: 0-microservices Code Modernization
The legacy Spring code in `development/0-microservices/job` and `development/0-microservices/user` has been thoroughly reviewed and modernized:
- **Constructor Injection**: Replaced outdated `@Autowired` field injections with Constructor Injection to improve testability and ensure immutability across the following files:
  - `JobController`
  - `UserController`
  - `JobServiceImpl`
  - `UserServiceImpl`
- **ResponseEntity Builders**: Modernized the REST controller endpoints. Replaced legacy response instantiations (e.g., `new ResponseEntity<>(body, HttpStatus.OK)`) with modern Spring builder patterns such as `ResponseEntity.ok()` and `ResponseEntity.noContent().build()`.

## Development Step: 1-gateway+maven Code Modernization
The API Gateway application under `development/1-gateway+maven` has been reviewed and modernized:
- **Dependency Upgrades**: Upgraded the `pom.xml` to Java 25, Spring Boot 4.1.0, and Spring Cloud 2025.1.2. Replaced the obsolete `spring-cloud-starter-gateway` dependency with `spring-cloud-starter-gateway-server-webflux`.
- **Compilation Check**: Verified that the gateway application compiles successfully with zero errors. The `job` and `user` microservices in this step were also confirmed to carry over the previously applied modernizations correctly.
