# ts-fullstack-template

Fullstack TypeScript template with JWT auth, ready to clone and build on.

## Stack

- **Backend:** Fastify + GraphQL Yoga + Pothos + Prisma 7 (PostgreSQL) + Pino
- **Frontend:** Next.js 16 + React 19 + styled-components 6
- **Auth:** JWT + bcrypt, manual fetch GraphQL client (no Apollo/urql)
- **Docker:** PostgreSQL 16, hot reload for both fe and be

## Quick Start (Docker)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000/graphql
- Seed: `docker-compose exec be npx tsx src/seed.ts`
- Login: `admin@example.com` / `password123`

## Quick Start (Local)

Requires Node 20+ and a PostgreSQL instance.

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
