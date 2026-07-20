# OpenJob frontend

SPA React per la console microservizi OpenJob. Il frontend usa il gateway tramite i path `/api/*` e `/actuator/*`; il backend resta invariato.

## Stack

- Vite, React 18, TypeScript
- Tailwind CSS, componenti locali in stile shadcn/ui, Lucide
- TanStack Query per cache, loading state e invalidazione dopo mutation
- Vitest e Testing Library

## Comandi

```powershell
npm install
npm run dev
npm run build
npm test
```

In sviluppo Vite espone `http://localhost:5173` e proxa `/api` e `/actuator` verso il gateway su `http://localhost:9000`.

## Docker

Dal folder `microservice-application`:

```powershell
docker compose up --build
```

Il servizio `frontend` resta pubblicato su `http://localhost:3000` e serve la build statica da Nginx. `nginx.conf` mantiene il fallback SPA e i proxy verso `gateway:9000`.

## Struttura

- `src/api`: chiamate tipizzate verso utenti, offerte e sistema
- `src/hooks`: hook TanStack Query
- `src/components/ui`: componenti UI base
- `src/components/shared`: componenti riusabili di pagina
- `src/features`: dashboard, utenti, offerte, candidature

## Design

Palette: Blue Violet `#5A53D6`, Exuberant Orange `#F75C2D`, Sun Glare `#E8EA2F`, Cloud Dancer `#F1EEE7`, Darkest Hour `#2A2A28`. Lo sfondo body e' il violetto chiarissimo `#F4F3FC`.

Font: Space Grotesk per titoli, logo e metriche; Inter per testo e UI.
