import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info', // bisa diganti jadi 'debug' saat dev
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
    })
  ),
  transports: [
    new transports.Console(), // tampilkan log di console
  ],
});

export default logger;
