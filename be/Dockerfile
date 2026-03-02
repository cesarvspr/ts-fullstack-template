FROM node:22-alpine
WORKDIR /app/be
COPY be/package.json be/yarn.lock* ./
RUN yarn install
COPY be/ .
ENV DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder
RUN npx prisma generate
EXPOSE 4000
CMD ["npx", "tsx", "watch", "src/index.ts"]
