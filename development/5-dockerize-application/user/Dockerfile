FROM maven:3-eclipse-temurin-25-alpine

WORKDIR /user-microservice
COPY  . .

RUN mvn clean install
CMD mvn spring-boot:run
