# Compose Layout: Full Stack vs Service-Only

The two-file convention this skill enforces. One file brings up everything; the other runs only the service(s) against external dependencies. Never a third competing file.

## The two files

| File | Runs | Use for | Dependencies |
|---|---|---|---|
| `docker-compose.yml` | Full stack: app (+ worker) **and** DB/cache/third-party | VM/prod; local full-stack smoke | Containers defined in the same file |
| `docker-compose.dev.yml` | Service(s) only | Dev against a shared or hosted DB/cache | Reached via env vars, not containers |

Both files share **service names, image tags, and build contexts**, so switching is a flag (`-f docker-compose.dev.yml`), not a rewrite.

## Rules

1. **Every published host port is env-parameterized with a default** — `${APP_HOST_PORT:-8080}:8080`, `${DB_HOST_PORT:-5432}:5432`. A hard-coded `8080:8080` collides on a teammate's machine and on the second project.
2. **Every third-party endpoint comes from env** — DB URL, cache URL, queue URL, external APIs. No `postgres://user:pass@db:5432` literal in either file.
3. **Required values fail fast** — secrets and URIs use `${VAR:?set VAR}` so compose exits with the missing name instead of booting a broken service.
4. **`.env.example` lists every interpolation variable** with a safe default; `.env` is never committed.
5. **`docker-compose.yml` stays the complete stack** — named volumes, `restart: unless-stopped`, healthchecks, and a network. `depends_on` uses `condition: service_healthy`.
6. **`docker-compose.dev.yml` defines no data containers and no data volumes** — if a service needs a DB, it points at the shared one through env.
7. **No `docker-compose.override.yml` clone** — an override that re-declares the stack defeats the split; change one of the two files instead.

## `docker-compose.yml` — full stack

```yaml
services:
  app:
    build: .
    restart: unless-stopped
    ports:
      - "${APP_HOST_PORT:-8080}:8080"
    env_file: .env
    environment:
      DATABASE_URL: ${DATABASE_URL:?set DATABASE_URL}
      REDIS_URL: ${REDIS_URL:-redis://redis:6379}
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:8080/healthz"]
      interval: 30s
      timeout: 5s
      retries: 3

  db:
    image: postgres:16-alpine
    restart: unless-stopped
    ports:
      - "${DB_HOST_PORT:-5432}:5432"
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?set POSTGRES_PASSWORD}
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "${REDIS_HOST_PORT:-6379}:6379"
    volumes:
      - redis-data:/data

volumes:
  db-data:
  redis-data:
```

## `docker-compose.dev.yml` — service only

```yaml
services:
  app:
    build: .
    ports:
      - "${APP_HOST_PORT:-8080}:8080"
    env_file: .env
    environment:
      DATABASE_URL: ${DATABASE_URL:?point at the shared dev DB}
      REDIS_URL: ${REDIS_URL:?point at the shared dev cache}
```

No `db`, no `redis`, no data volumes. If the app needs a migration step, it runs against the URL in `DATABASE_URL`.

## Interpolation cheat sheet

| Form | Meaning |
|---|---|
| `${VAR:-default}` | Use `default` when `VAR` is unset or empty. The normal case for host ports. |
| `${VAR-default}` | Use `default` only when `VAR` is unset (empty is kept). |
| `${VAR:?message}` | Required; compose fails with `message` when unset. Use for secrets and URIs. |

## Which file when

| Situation | Command |
|---|---|
| Local full-stack smoke | `docker compose -f docker-compose.yml up` |
| Dev against shared deps | `docker compose -f docker-compose.dev.yml up` |
| VM / production | `docker compose -f docker-compose.yml up -d` |

## Anti-patterns

- Hard-coded host ports (`8080:8080`) → collisions.
- Hard-coded `postgres://user:pass@db:5432/...` in either file → leaked credentials and a dev file that can't reach the shared DB.
- A third compose file that re-declares the services → drift between what dev and prod run.
- `docker-compose.dev.yml` that starts its own DB → defeats the point of calling deps via env.
