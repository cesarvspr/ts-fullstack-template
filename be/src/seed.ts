import 'dotenv/config';
import bcrypt from 'bcrypt';
import { prisma } from './db';
import { createLogger } from './utils/logger';
import { BCRYPT_SALT_ROUNDS, Role } from './constants';

const logger = createLogger('seed');

async function seed() {
  logger.info('Starting seed...');

  const hashedPassword = await bcrypt.hash('password123', BCRYPT_SALT_ROUNDS);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: Role.ADMIN,
    },
  });

  logger.info('Seed completed (admin@example.com / password123)');
}

seed()
  .catch(error => {
    logger.error({ error: error.message }, 'Seed failed');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
