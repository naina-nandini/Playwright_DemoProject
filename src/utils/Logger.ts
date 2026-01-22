import winston from 'winston';
import * as path from 'path';

/**
 * Logger - Utility Class
 * 
 * Centralized logging utility using Winston.
 * Provides different log levels and file output.
 */
class Logger {
    private logger: winston.Logger;

    constructor() {
        const logDir = path.join(process.cwd(), 'logs');

        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.errors({ stack: true }),
                winston.format.splat(),
                winston.format.json()
            ),
            defaultMeta: { service: 'playwright-framework' },
            transports: [
                // Write all logs to console
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.printf(({ timestamp, level, message, ...meta }) => {
                            return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
                                }`;
                        })
                    ),
                }),
                // Write all logs to file
                new winston.transports.File({
                    filename: path.join(logDir, 'error.log'),
                    level: 'error',
                }),
                new winston.transports.File({
                    filename: path.join(logDir, 'combined.log'),
                }),
            ],
        });
    }

    info(message: string, meta?: any): void {
        this.logger.info(message, meta);
    }

    error(message: string, meta?: any): void {
        this.logger.error(message, meta);
    }

    warn(message: string, meta?: any): void {
        this.logger.warn(message, meta);
    }

    debug(message: string, meta?: any): void {
        this.logger.debug(message, meta);
    }

    verbose(message: string, meta?: any): void {
        this.logger.verbose(message, meta);
    }
}

// Export singleton instance
export const logger = new Logger();
