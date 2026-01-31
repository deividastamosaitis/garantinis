# Garantinis Monorepo Skeleton

## Stack
- API: Node.js + TypeScript (Express bootstrap)
- Web: Next.js + TypeScript
- DB: PostgreSQL + Prisma

## Run with Docker Compose
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# build and start everything
Docker_BUILDKIT=1 docker compose up --build
```

## Database migration & seed (inside the API container)
```bash
docker compose exec api npx prisma migrate deploy --schema=packages/db/prisma/schema.prisma

docker compose exec api npx prisma db seed --schema=packages/db/prisma/schema.prisma
```

The seed prints the plaintext API key once and stores only its hash in the database.
