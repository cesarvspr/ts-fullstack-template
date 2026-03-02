import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { builder } from '../builder';
import { prisma } from '../db';
import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  BCRYPT_SALT_ROUNDS,
  Role,
} from '../constants';
import { createLogger } from '../utils/logger';

const logger = createLogger('auth');

type UserData = NonNullable<
  Awaited<ReturnType<typeof prisma.user.findFirst>>
>;

type AuthPayloadData = {
  token: string;
  user: UserData;
};

const AuthPayload = builder
  .objectRef<AuthPayloadData>('AuthPayload')
  .implement({
    fields: t => ({
      token: t.exposeString('token'),
      user: t.prismaField({
        type: 'User',
        resolve: (query, parent) => {
          return prisma.user.findUniqueOrThrow({
            ...query,
            where: { id: parent.user.id },
          });
        },
      }),
    }),
  });

const generateToken = (user: { id: string; email: string; role: string }) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
};

// signUp mutation
builder.mutationField('signUp', t =>
  t.field({
    type: AuthPayload,
    args: {
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
      name: t.arg.string({ required: true }),
    },
    resolve: async (_root, args) => {
      logger.info({ email: args.email }, 'Sign up attempt');

      const existing = await prisma.user.findUnique({
        where: { email: args.email.toLowerCase().trim() },
      });

      if (existing) {
        throw new Error('A user with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(
        args.password,
        BCRYPT_SALT_ROUNDS,
      );

      const user = await prisma.user.create({
        data: {
          email: args.email.toLowerCase().trim(),
          password: hashedPassword,
          name: args.name,
          role: Role.USER,
        },
      });

      const token = generateToken(user);
      logger.info({ userId: user.id }, 'User signed up');

      return { token, user };
    },
  }),
);

// signIn mutation
builder.mutationField('signIn', t =>
  t.field({
    type: AuthPayload,
    args: {
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (_root, args) => {
      const email = args.email.toLowerCase().trim();
      logger.info({ email }, 'Sign in attempt');

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      const valid = await bcrypt.compare(args.password, user.password);
      if (!valid) {
        throw new Error('Invalid email or password');
      }

      const token = generateToken(user);
      logger.info({ userId: user.id }, 'User signed in');

      return { token, user };
    },
  }),
);

// me query (authenticated)
builder.queryField('me', t =>
  t.prismaField({
    type: 'User',
    nullable: true,
    resolve: async (query, _root, _args, ctx) => {
      if (!ctx.user) return null;
      return prisma.user.findUnique({
        ...query,
        where: { id: ctx.user.id },
      });
    },
  }),
);
