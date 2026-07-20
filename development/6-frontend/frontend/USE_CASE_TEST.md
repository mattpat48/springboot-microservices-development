# Frontend microservice guided test

## Goal

Verificare il flusso OpenJob completo dal browser:

1. Il frontend React viene servito dal container Nginx.
2. Nginx proxa le chiamate al gateway.
3. Il gateway instrada verso `user-microservice` e `job-microservice`.
4. Utenti, offerte e candidature funzionano dalle nuove viste.

## Start

Da `microservice-application`:

```powershell
docker compose up --build -d
docker compose ps
```

Attendere circa 60 secondi dopo l'avvio, per dare tempo a Eureka e al gateway di vedere le istanze.

## Browser test

Aprire:

```text
http://localhost:3000
```

Risultato atteso:

- La shell mostra sidebar, logo OpenJob e dashboard.
- Le metriche mostrano utenti, offerte, candidature e servizi attivi.
- Il badge Gateway passa a `UP` quando `/actuator/health` risponde.

## Dashboard

1. Aprire `Dashboard`.
2. Verificare la sezione `Stato servizi`.
3. Usare `Refresh` per chiamare `/actuator/refresh`.
4. Usare `Demo` per creare recruiter, candidato, offerta e candidatura.

## Utenti

1. Aprire `Utenti`.
2. Cliccare `Nuovo utente`.
3. Compilare nome, cognome, username, email e password.
4. Cercare l'utente dalla barra di ricerca.
5. Aprire il dettaglio con l'icona occhio.
6. Modificare l'utente con l'icona matita.
7. Eliminare l'utente con l'icona cestino e confermare.

## Offerte

1. Aprire `Offerte`.
2. Cliccare `Nuova offerta`.
3. Inserire titolo, descrizione e recruiter.
4. Cercare l'offerta dalla barra di ricerca.
5. Aprire il dettaglio per vedere recruiter e candidati.
6. Modificare o eliminare l'offerta dalle azioni di riga.

## Candidature

1. Aprire `Candidature`.
2. Cliccare `Nuova candidatura`.
3. Selezionare candidato e offerta.
4. Cliccare `Invia candidatura`.
5. Verificare che la tabella mostri candidato, username, offerta, job ID, user ID e data.
6. Tornare su `Offerte` e verificare l'incremento del numero candidature.

## API verification

Da PowerShell:

```powershell
Invoke-RestMethod http://localhost:3000/api/usr
Invoke-RestMethod http://localhost:3000/api/job
```

Se queste chiamate funzionano dalla porta `3000`, il proxy del frontend verso il gateway e' configurato correttamente.
