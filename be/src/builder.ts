import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from './generated/pothos-types';
import { getDatamodel } from './generated/pothos-types';
import { prisma } from './db';
import type { FastifyRequest, FastifyReply } from 'fastify';

export type UserContext = {
  id: string;
  email: string;
  role: string;
} | null;

export interface GraphQLContext {
  user: UserContext;
  req: FastifyRequest;
  res: FastifyReply;
}

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: GraphQLContext;
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
    dmmf: getDatamodel(),
    exposeDescriptions: {
      models: true,
      fields: true,
    },
    onUnusedQuery: process.env.NODE_ENV === 'production' ? null : 'warn',
  },
});

builder.queryType({});
builder.mutationType({});
