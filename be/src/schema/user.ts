import { builder } from '../builder';
import { Role } from '../constants';
import { prisma } from '../db';

// DateTime scalar
builder.scalarType('DateTime', {
  serialize: value => (value as Date).toISOString(),
  parseValue: value => {
    if (typeof value === 'string') return new Date(value);
    throw new Error('Invalid DateTime value');
  },
});

// Role enum for GraphQL
const RoleEnum = builder.enumType('Role', {
  values: Object.values(Role) as [string, ...string[]],
});

// User type
builder.prismaObject('User', {
  fields: t => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    name: t.exposeString('name'),
    role: t.expose('role', { type: RoleEnum }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});

// Query: all users (admin only)
builder.queryField('users', t =>
  t.prismaField({
    type: ['User'],
    resolve: async (query, _root, _args, ctx) => {
      if (!ctx.user || ctx.user.role !== Role.ADMIN) {
        throw new Error('Unauthorized');
      }
      return prisma.user.findMany({
        ...query,
        orderBy: { createdAt: 'asc' },
      });
    },
  }),
);
