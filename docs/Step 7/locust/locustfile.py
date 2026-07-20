import random
import time
from locust import HttpUser, task, between

FIRST_NAMES = [
    "Marco", "Sofia", "Alessandro", "Giulia", "Lorenzo", "Chiara", 
    "Matteo", "Francesca", "Andrea", "Valentina", "Davide", "Elena",
    "Luca", "Sara", "Simone", "Beatrice", "Federico", "Martina",
    "Gianluca", "Arianna", "Roberto", "Camilla", "Stefano", "Alice"
]

LAST_NAMES = [
    "Rossi", "Bianchi", "Ferrari", "Esposito", "Ricci", "Marino", 
    "Greco", "Conti", "De Luca", "Mancini", "Costa", "Rizzo",
    "Lombardi", "Moretti", "Barbieri", "Fontana", "Santoro", "Mariani",
    "Rinaldi", "Caruso", "Ferraro", "Galli", "Martini", "Leone"
]

JOB_TITLES_AND_DESCRIPTIONS = [
    (
        "Sviluppatore Java Spring Boot Senior (Milano)",
        "Ricerca Sviluppatore Senior Java con esperienza su Spring Boot, microservizi e Docker/Kubernetes. Richiesta conoscenza API RESTful."
    ),
    (
        "Frontend Engineer React & TypeScript (Remoto)",
        "Sviluppatore Frontend per interfacce moderne e design system. Ottima padronanza di React 18+, TypeScript e Tailwind CSS."
    ),
    (
        "DevOps & Cloud Architect AWS / K8s (Torino)",
        "Automazione e monitoraggio cloud AWS. Esperienza hands-on con Terraform, CI/CD pipelines, Docker e Kubernetes."
    ),
    (
        "Data Scientist Applied AI & LLMs (Roma)",
        "Implementazione di soluzioni basate su LLM, RAG e Machine Learning. Requisiti: Python, PyTorch, LangChain e DB vettoriali."
    ),
    (
        "Full Stack Engineer Node.js & Next.js (Bologna)",
        "Sviluppo di piattaforme SaaS ad alto traffico. Stack tecnologico: Node.js (NestJS), PostgreSQL, Next.js e Redis."
    ),
    (
        "Cyber Security & SOC Analyst (Milano)",
        "Gestione incidenti informatici, vulnerability assessment e penetration testing delle applicazioni web e cloud."
    ),
    (
        "Product Owner / Project Manager (Remoto)",
        "Guidare la roadmap di prodotto a stretto contatto con stakeholder e team Scrum. Gestione backlog e metriche Agile."
    ),
    (
        "Sviluppatore Mobile iOS / Flutter (Firenze)",
        "Sviluppo e rilascio di app mobile ad alte prestazioni. Competenze in Flutter/Dart oppure nativo Swift/Kotlin."
    ),
    (
        "Database Administrator & Tuning (Verona)",
        "Ottimizzazione query complesse e high availability su motori MySQL / PostgreSQL. Replica multi-master e backup."
    ),
    (
        "UI/UX Designer & Design Systems (Milano)",
        "Progettazione UX/UI in Figma, user research, wireframing e prototipazione per applicativi enterprise web e mobile."
    )
]

CACHED_RECRUITERS = []
CACHED_APPLICANTS = []
CACHED_JOBS = []

class OpenJobDataPopulator(HttpUser):
    """
    Locust user class designed to populate realistic Italian data across OpenJob microservices.
    Simulates real user workflows: creating recruiter/candidate profiles, publishing job offers,
    applying for jobs, and verifying domain metrics.
    """
    wait_time = between(1, 3)

    def on_start(self):
        self.refresh_caches()

    def refresh_caches(self):
        global CACHED_RECRUITERS, CACHED_APPLICANTS, CACHED_JOBS
        try:
            with self.client.get("/api/usr", name="Init - Fetch All Users", catch_response=True) as resp:
                if resp.status_code == 200:
                    users = resp.json()
                    CACHED_RECRUITERS = [
                        u for u in users if any(r.get("name", "").lower() == "job" for r in u.get("roles", []))
                    ]
                    CACHED_APPLICANTS = [
                        u for u in users if any(r.get("name", "").lower() == "applicant" for r in u.get("roles", []))
                    ]
            with self.client.get("/api/job", name="Init - Fetch All Jobs", catch_response=True) as resp:
                if resp.status_code == 200:
                    CACHED_JOBS = resp.json()
        except Exception:
            pass

    @task(3)
    def create_recruiter_or_applicant_user(self):
        """Create realistic Italian recruiter or candidate accounts."""
        global CACHED_RECRUITERS, CACHED_APPLICANTS
        firstname = random.choice(FIRST_NAMES)
        lastname = random.choice(LAST_NAMES)
        role_type = random.choices(["applicant", "job"], weights=[70, 30])[0]
        
        timestamp_suffix = int(time.time() * 1000) % 1000000
        username = f"{firstname.lower()}.{lastname.lower()}.{timestamp_suffix}"
        email = f"{username}@openjob-italia.it"

        payload = {
            "firstname": firstname,
            "lastname": lastname,
            "username": username,
            "email": email,
            "password": "PasswordSicura2026!",
            "active": True,
            "passwordExpired": False,
            "roles": [{"name": role_type}]
        }

        with self.client.post("/api/usr", json=payload, name="Create User Account", catch_response=True) as resp:
            if resp.status_code in [200, 201, 204]:
                resp.success()
                if random.random() < 0.3:
                    self.refresh_caches()
            elif resp.status_code == 409:
                resp.success()
            else:
                resp.failure(f"Failed creating user {username}: status {resp.status_code}")

    @task(4)
    def create_job_posting(self):
        """Create a realistic Italian job offer authored by a recruiter (job manager)."""
        global CACHED_RECRUITERS, CACHED_JOBS
        if not CACHED_RECRUITERS:
            self.refresh_caches()
            if not CACHED_RECRUITERS:
                return

        recruiter = random.choice(CACHED_RECRUITERS)
        recruiter_id = recruiter.get("id")
        if not recruiter_id:
            return

        title_desc = random.choice(JOB_TITLES_AND_DESCRIPTIONS)
        city = random.choice(["Milano", "Roma", "Torino", "Bologna", "Firenze", "Remoto", "Ibrido"])
        title = f"{title_desc[0]} - Rif. {random.randint(100, 999)}"
        description = f"{title_desc[1]} [Sede: {city}]"

        payload = {
            "title": title[:240],
            "description": description[:240],
            "createdBy": recruiter_id
        }

        with self.client.post("/api/job", json=payload, name="Create Job Offer", catch_response=True) as resp:
            if resp.status_code in [200, 201, 204]:
                resp.success()
                if random.random() < 0.4:
                    self.refresh_caches()
            else:
                resp.failure(f"Failed creating job by user {recruiter_id}: status {resp.status_code}")

    @task(5)
    def submit_job_application(self):
        """Simulate an applicant applying for an active job offer (`GET /api/job/apply/{username}/{jobId}`)."""
        global CACHED_APPLICANTS, CACHED_JOBS
        if not CACHED_APPLICANTS or not CACHED_JOBS:
            self.refresh_caches()
            if not CACHED_APPLICANTS or not CACHED_JOBS:
                return

        applicant = random.choice(CACHED_APPLICANTS)
        job = random.choice(CACHED_JOBS)

        username = applicant.get("username")
        job_id = job.get("id")
        if not username or not job_id:
            return

        with self.client.get(
            f"/api/job/apply/{username}/{job_id}",
            name="Submit Job Application",
            catch_response=True
        ) as resp:
            if resp.status_code in [200, 204, 400, 409]:
                resp.success()
            else:
                resp.failure(f"Failed application {username} -> Job #{job_id}: status {resp.status_code}")

    @task(2)
    def check_domain_statistics(self):
        """Browse domain statistics endpoints to verify aggregation logic under traffic."""
        self.client.get("/api/usr/stats", name="Browse - User Domain Stats")
        self.client.get("/api/job/stats", name="Browse - Job Domain Stats")
