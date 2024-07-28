import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'verbose';

interface LogContext {
  [key: string]: any;
}

@Injectable()
export class LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext & { trace?: string }) {
    this.log('error', message, context);
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }

  verbose(message: string, context?: LogContext) {
    this.log('verbose', message, context);
  }
  private log(level: LogLevel, message: string, context?: LogContext) {
    const logContext = this.formatContext(context);
    this.logger.log(level, message, logContext);
  }

  private formatContext(context?: LogContext): string {
    if (!context) return '';
    return Object.entries(context)
      .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
      .join(' ');
  }
}
