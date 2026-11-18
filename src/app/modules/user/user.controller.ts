import type {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';
import type {Logger} from '../../../shared/libs/index.js';
import {Component} from '../../../shared/types/index.js';
import type {Config, RestSchema} from '../../config/index.js';
import {BaseController, HttpError, HttpMethod, fillDTO} from '../../rest/index.js';
import type {UserServiceInterface} from './user-service.interface.js';
import type {CreateUserDto} from './dto/create-user.dto.js';
import type {LoginUserDto} from './dto/login-user.dto.js';
import {UserRdo} from './rdo/user.rdo.js';

type CreateUserRequest = Request<Record<string, string>, unknown, CreateUserDto>;
type LoginUserRequest = Request<Record<string, string>, unknown, LoginUserDto>;

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.UserService) private readonly userService: UserServiceInterface,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Регистрация маршрутов UserController...');
    this.addRoute({path: '/register', method: HttpMethod.Post, handler: this.register});
    this.addRoute({path: '/login', method: HttpMethod.Post, handler: this.login});
    this.addRoute({path: '/logout', method: HttpMethod.Post, handler: this.logout});
    this.addRoute({path: '/status', method: HttpMethod.Get, handler: this.status});
  }

  public async register({body}: CreateUserRequest, res: Response): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Пользователь с email «${body.email}» уже существует`,
        'UserController',
      );
    }

    const user = await this.userService.create(body, this.config.get('salt'));
    this.created(res, fillDTO(UserRdo, user));
  }

  public async login({body}: LoginUserRequest, _res: Response): Promise<void> {
    const user = await this.userService.verifyUser(body.email, body.password, this.config.get('salt'));

    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Неверный email или пароль', 'UserController');
    }

    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Выдача токена ещё не реализована', 'UserController');
  }

  public async logout(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Выход ещё не реализован', 'UserController');
  }

  public async status(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Проверка статуса ещё не реализована', 'UserController');
  }
}
