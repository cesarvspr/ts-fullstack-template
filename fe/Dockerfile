FROM node:22-alpine
WORKDIR /app/fe
COPY fe/package.json fe/yarn.lock* ./
RUN yarn install
COPY fe/ .
EXPOSE 3000
CMD ["yarn", "dev"]
