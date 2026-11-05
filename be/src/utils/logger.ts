import pino from 'pino';

const isDevelopment = process.env.NODE_ENV !== 'production';

// pino and the GraphQL Yoga logger (src/index.ts) both read LOG_LEVEL. The Yoga
// logger throws on any value outside this list, so pino's fatal and silent
// levels cannot be used.
const LOG_LEVELS = new Set(['trace', 'debug', 'info', 'warn', 'error']);
const logLevel = process.env.LOG_LEVEL || 'info';
if (!LOG_LEVELS.has(logLevel)) {
  throw new Error(
    `Invalid LOG_LEVEL "${logLevel}". Must be one of: ${[...LOG_LEVELS].join(', ')}`,
  );
}

export const logger = pino({
  level: logLevel,
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
          singleLine: false,
        },
      }
    : undefined,
  formatters: {
    level: label => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export const createLogger = (module: string) => {
  return logger.child({ module });
};

export default logger;
