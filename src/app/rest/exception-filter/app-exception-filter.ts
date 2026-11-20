import type {NextFunction, Request, Response} from 'express';
import {StatusCodes, getReasonPhrase} from 'http-status-codes';
import {inject, injectable} from 'inversify';
import type {Logger} from '../../../shared/libs/index.js';
import {Component} from '../../../shared/types/index.js';
import {HttpError} from '../errors/http-error.js';
import type {ExceptionFilter} from './exception-filter.interface.js';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.logger.info('Зарегистрирован AppExceptionFilter');
  }

  public catch(error: Error, req: Request, res: Response, _next: NextFunction): void {
    if (error instanceof HttpError) {
      return this.handleHttpError(error, res);
    }

    this.handleServerError(error, req, res);
  }

  private handleHttpError(error: HttpError, res: Response): void {
    this.logger.error(`[${error.detail ?? 'HttpError'}] ${error.httpStatusCode}: ${error.message}`);
    res.status(error.httpStatusCode).json({error: error.message});
  }

  private handleServerError(error: Error, req: Request, res: Response): void {
    this.logger.error(`${req.method} ${req.originalUrl} -> ${StatusCodes.INTERNAL_SERVER_ERROR}: ${error.message}`, error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)});
  }
}
