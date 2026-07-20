#!/bin/bash

echo "Creating User 1 (Admin/Recruiter)..."
curl -X POST http://localhost:9000/api/usr \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "Mario",
    "lastname": "Rossi",
    "username": "admin",
    "password": "password123",
    "email": "mario.rossi@openjob.com"
  }'

echo -e "\n\nCreating User 2 (Candidate)..."
curl -X POST http://localhost:9000/api/usr \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "Luigi",
    "lastname": "Verdi",
    "username": "luigi_dev",
    "password": "password123",
    "email": "luigi.verdi@example.com"
  }'

echo -e "\n\nCreating Job 1..."
curl -X POST http://localhost:9000/api/job \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Java Developer",
    "description": "Cerchiamo uno sviluppatore esperto in Spring Boot e Microservizi per un progetto innovativo.",
    "createdBy": 1
  }'

echo -e "\n\nCreating Job 2..."
curl -X POST http://localhost:9000/api/job \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Frontend React Engineer",
    "description": "Posizione aperta per sviluppatore UI/UX con ottima conoscenza di React e TypeScript.",
    "createdBy": 1
  }'
