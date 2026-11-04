# ts-fullstack-template

Fullstack TypeScript template with JWT auth, ready to clone and build on.

## Stack

- **Backend:** Fastify + GraphQL Yoga + Pothos + Prisma 7 (PostgreSQL) + Pino
- **Frontend:** Next.js 16 + React 19 + styled-components 6
- **Auth:** JWT + bcrypt, manual fetch GraphQL client (no Apollo/urql)
- **Docker:** PostgreSQL 16, hot reload for both fe and be

## Quick Start (Docker)

```bash
cp .env.example .env
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000/graphql
- Seed: `docker-compose exec be npx tsx src/seed.ts`
- Login: `admin@example.com` / `password123`

After a dependency update, remove the old `node_modules` volumes so the containers get the new packages: `docker-compose down`, then `docker volume rm <project>_be_node_modules <project>_fe_node_modules` (`<project>` is the folder name by default). Do not use `down -v`, it also deletes the database volume.

## Quick Start (Local)

Requires Node 24 or Node 26+ (Node 25 is not supported) and a PostgreSQL instance. `nvm use` picks the version from `.nvmrc`.

`be/.env.example` expects Postgres on `localhost:5432` with user and password `postgres`. If yours is different, edit `DATABASE_URL` in `be/.env` after you copy it. `prisma migrate dev` creates the `app` database if it does not exist. To run only the Docker database, copy the root `.env.example` to `.env` and run `docker-compose up -d db`.

```bash
# Install deps
yarn install
cd be && yarn install && cd ..
cd fe && yarn install && cd ..

# Setup backend
cd be
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
yarn seed
cd ..

# Setup frontend
cd fe
cp .env.example .env
cd ..

# Run both
yarn dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000/graphql
- Login: `admin@example.com` / `password123`

`LOG_LEVEL` in `be/.env` must be `trace`, `debug`, `info`, `warn` or `error` (lowercase, default `info`). Any other value stops the backend at startup.

`cd fe && yarn typecheck` type-checks with TypeScript 7. `next build` and `yarn lint` still use TypeScript 6 until typescript-eslint supports 7.

## Project Structure

```
be/                     # Backend
  prisma/               # Schema & migrations
  src/
    schema/             # GraphQL types & resolvers (Pothos)
    constants/          # Enums, config
    utils/              # Logger, helpers
    builder.ts          # Pothos SchemaBuilder
    db.ts               # Prisma client
    index.ts            # Fastify server

fe/                     # Frontend
  src/
    app/                # Next.js App Router pages
    lib/
      auth/             # Auth context, GraphQL client, hooks
      theme/            # styled-components theme, GlobalStyle
      registry.tsx      # styled-components SSR
```

## Adding a New Feature

1. Add model to `be/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name your_migration`
3. Create `be/src/schema/your-feature.ts` (define types + resolvers)
4. Import it in `be/src/schema/index.ts`
5. Create pages in `fe/src/app/your-feature/`
