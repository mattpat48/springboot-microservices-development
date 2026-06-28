FROM maven:3-eclipse-temurin-25-alpine

WORKDIR /config-server-app
COPY  . .

RUN mvn clean install
CMD mvn spring-boot:run
