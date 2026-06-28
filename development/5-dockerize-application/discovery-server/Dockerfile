FROM maven:3-eclipse-temurin-25-alpine

WORKDIR /discovery-server-app
COPY  . .

RUN mvn clean install
CMD mvn spring-boot:run
