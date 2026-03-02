// Role enum (must match Prisma schema)
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

// JWT configuration
export const JWT_SECRET =
  process.env.JWT_SECRET || 'change-me-in-production';
export const JWT_EXPIRES_IN = '7d';

// Bcrypt configuration
export const BCRYPT_SALT_ROUNDS = 12;
