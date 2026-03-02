import 'dotenv/config';
import fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { createYoga } from 'graphql-yoga';
import jwt from 'jsonwebtoken';
import { checkDatabaseConnection, disconnectDatabase } from './db';
import { schema } from './schema';
import { logger } from './utils/logger';
import { JWT_SECRET } from './constants';
import type { UserContext, GraphQLContext } from './builder';

const PORT = Number(process.env.PORT) || 4000;

type JWTPayload = { userId: string; email: string; role: string };

const extractUserFromToken = (
  authHeader: string | undefined,
): UserContext => {
  if (!authHeader) return null;
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return { id: decoded.userId, email: decoded.email, role: decoded.role };
  } catch {
    return null;
  }
};

let app: FastifyInstance | null = null;

const yoga = createYoga<GraphQLContext>({
  schema,
  graphiql: true,
  landingPage: false,
  maskedErrors: process.env.NODE_ENV === 'production',
  logging: {
    debug: (...args) => logger.debug(args),
    info: (...args) => logger.info(args),
    warn: (...args) => logger.warn(args),
    error: (...args) => logger.error(args),
  },
});

async function startServer() {
  const isDbConnected = await checkDatabaseConnection();
  if (!isDbConnected) {
    logger.error('Server startup aborted due to database connection failure');
    process.exit(1);
  }

  app = fastify({ logger: false });

  await app.register(cors, {
    origin: '*',
    credentials: true,
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.get('/health', async (_req, reply) => {
    return reply.status(200).send({ status: 'ok' });
  });

  app.route({
    url: yoga.graphqlEndpoint,
    method: ['GET', 'POST', 'OPTIONS'],
    handler: async (req, reply) => {
      const user = extractUserFromToken(req.headers.authorization);

      const response = await yoga.handleNodeRequestAndResponse(req, reply, {
        user,
        req,
        res: reply,
      });

      response.headers.forEach((value, key) => {
        reply.header(key, value);
      });

      reply.status(response.status);
      reply.send(response.body);
      return reply;
    },
  });

  await app.listen({ port: PORT, host: '0.0.0.0' });

  logger.info(
    {
      port: PORT,
      graphqlEndpoint: '/graphql',
      nodeEnv: process.env.NODE_ENV || 'development',
    },
    'GraphQL API started',
  );
}

startServer();

async function gracefulShutdown(signal: string) {
  logger.info(`${signal} received: closing server`);
  if (app) await app.close();
  await disconnectDatabase();
  process.exit(0);
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
