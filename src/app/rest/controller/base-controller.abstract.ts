import {Response, Router} from 'express';
import asyncHandler from 'express-async-handler';
import {StatusCodes} from 'http-status-codes';
import {injectable} from 'inversify';
import type {Logger} from '../../../shared/libs/index.js';
import type {Controller} from './controller.interface.js';
import type {Route} from '../types/route.interface.js';

@injectable()
export abstract class BaseController implements Controller {
  private readonly _router: Router;

  protected constructor(protected readonly logger: Logger) {
    this._router = Router();
  }

  get router(): Router {
    return this._router;
  }

  public addRoute(route: Route): void {
    const wrappedHandler = asyncHandler(route.handler.bind(this));
    this._router[route.method](route.path, wrappedHandler);
    this.logger.info(`Зарегистрирован маршрут: ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    res.type('application/json').status(statusCode).json(data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent(res: Response): void {
    res.status(StatusCodes.NO_CONTENT).end();
  }
}
