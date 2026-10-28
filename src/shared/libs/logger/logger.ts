import {injectable} from 'inversify';
import {pino} from 'pino';
import type {Logger as PinoLogger} from 'pino';
import type {Logger as LoggerInterface} from './logger.interface.js';

@injectable()
export class LoggerService implements LoggerInterface {
  private readonly logger: PinoLogger;

  constructor() {
    this.logger = pino();
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  public error(message: string, error?: Error, ...args: unknown[]): void {
    if (error) {
      this.logger.error(error, message, ...args);
      return;
    }
    this.logger.error(message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }
}
