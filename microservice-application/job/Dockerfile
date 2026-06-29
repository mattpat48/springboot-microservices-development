FROM maven:3.9.11-eclipse-temurin-25-alpine

WORKDIR /job-microservice
COPY  . .

RUN mvn clean install
CMD mvn spring-boot:run
