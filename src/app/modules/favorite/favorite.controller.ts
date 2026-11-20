import type {Request, Response} from 'express';
import type {ParamsDictionary} from 'express-serve-static-core';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';
import type {Logger} from '../../../shared/libs/index.js';
import {Component} from '../../../shared/types/index.js';
import {BaseController, HttpError, HttpMethod, fillDTO} from '../../rest/index.js';
import type {UserServiceInterface} from '../user/index.js';
import {OfferShortRdo, type OfferServiceInterface} from '../offer/index.js';

const MOCK_USER_HEADER = 'X-User-Id';

type FavoriteParams = {offerId: string} | ParamsDictionary;
type FavoriteRequest = Request<FavoriteParams>;

@injectable()
export class FavoriteController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.UserService) private readonly userService: UserServiceInterface,
    @inject(Component.OfferService) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.logger.info('Регистрация маршрутов FavoriteController...');
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/:offerId', method: HttpMethod.Put, handler: this.add});
    this.addRoute({path: '/:offerId', method: HttpMethod.Delete, handler: this.remove});
  }

  public async index(req: Request, res: Response): Promise<void> {
    const userId = await this.getUserId(req);
    const offers = await this.userService.findFavorites(userId);

    const favorites = offers.map((offer) => ({...fillDTO(OfferShortRdo, offer), isFavorite: true}));

    this.ok(res, favorites);
  }

  public async add(req: FavoriteRequest, res: Response): Promise<void> {
    const userId = await this.getUserId(req);
    await this.checkOfferExists(req.params.offerId);

    await this.userService.addToFavorites(userId, req.params.offerId);
    this.noContent(res);
  }

  public async remove(req: FavoriteRequest, res: Response): Promise<void> {
    const userId = await this.getUserId(req);
    await this.checkOfferExists(req.params.offerId);

    await this.userService.removeFromFavorites(userId, req.params.offerId);
    this.noContent(res);
  }

  private async getUserId(req: Request): Promise<string> {
    const userId = req.get(MOCK_USER_HEADER);

    if (!userId) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `Не передан заголовок ${MOCK_USER_HEADER} (временная замена токена)`,
        'FavoriteController',
      );
    }

    if (!await this.userService.findById(userId)) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, `Пользователь с id «${userId}» не найден`, 'FavoriteController');
    }

    return userId;
  }

  private async checkOfferExists(offerId: string): Promise<void> {
    if (!await this.offerService.exists(offerId)) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Предложение с id «${offerId}» не найдено`, 'FavoriteController');
    }
  }
}
