FROM node:24-alpine
WORKDIR /app/fe
COPY fe/package.json fe/yarn.lock* ./
RUN yarn install --frozen-lockfile
COPY fe/ .
EXPOSE 3000
CMD ["yarn", "dev"]
