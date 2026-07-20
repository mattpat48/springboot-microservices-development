FROM maven:3-eclipse-temurin-25-alpine

WORKDIR /gateway-app
COPY  . .

RUN mvn clean install
CMD mvn spring-boot:run
