import type {Request, Response} from 'express';
import type {ParamsDictionary} from 'express-serve-static-core';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';
import type {Logger} from '../../../shared/libs/index.js';
import {Component, isCity} from '../../../shared/types/index.js';
import {BaseController, HttpError, HttpMethod, fillDTO} from '../../rest/index.js';
import type {OfferServiceInterface} from './offer-service.interface.js';
import type {CreateOfferDto} from './dto/create-offer.dto.js';
import type {UpdateOfferDto} from './dto/update-offer.dto.js';
import {OfferRdo} from './rdo/offer.rdo.js';
import {OfferShortRdo} from './rdo/offer-short.rdo.js';

type OfferParams = {offerId: string} | ParamsDictionary;
type CityParams = {city: string} | ParamsDictionary;

type IndexRequest = Request<Record<string, string>, unknown, unknown, {limit?: string}>;
type CreateRequest = Request<Record<string, string>, unknown, CreateOfferDto>;
type ShowRequest = Request<OfferParams>;
type UpdateRequest = Request<OfferParams, unknown, UpdateOfferDto>;
type CityRequest = Request<CityParams, unknown, unknown, {isPremium?: string}>;

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.logger.info('Регистрация маршрутов OfferController...');
    this.addRoute({path: '/offers', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/offers', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/offers/:offerId', method: HttpMethod.Get, handler: this.show});
    this.addRoute({path: '/offers/:offerId', method: HttpMethod.Put, handler: this.update});
    this.addRoute({path: '/offers/:offerId', method: HttpMethod.Delete, handler: this.delete});
    this.addRoute({path: '/cities/:city/offers', method: HttpMethod.Get, handler: this.indexByCity});
  }

  public async index({query}: IndexRequest, res: Response): Promise<void> {
    const limit = this.parseLimit(query.limit);
    const offers = await this.offerService.find(limit);
    this.ok(res, fillDTO(OfferShortRdo, offers));
  }

  public async create({body}: CreateRequest, res: Response): Promise<void> {
    const offer = await this.offerService.create({...body, postDate: new Date()});
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async show({params}: ShowRequest, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);

    if (!offer) {
      throw this.notFound(params.offerId);
    }

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async update({params, body}: UpdateRequest, res: Response): Promise<void> {
    const offer = await this.offerService.updateById(params.offerId, body);

    if (!offer) {
      throw this.notFound(params.offerId);
    }

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async delete({params}: ShowRequest, res: Response): Promise<void> {
    const offer = await this.offerService.deleteById(params.offerId);

    if (!offer) {
      throw this.notFound(params.offerId);
    }

    this.noContent(res);
  }

  public async indexByCity({params, query}: CityRequest, res: Response): Promise<void> {
    if (!isCity(params.city)) {
      throw new HttpError(StatusCodes.BAD_REQUEST, `Неизвестный город «${params.city}»`, 'OfferController');
    }

    const offers = query.isPremium === 'true'
      ? await this.offerService.findPremiumByCity(params.city)
      : await this.offerService.findByCity(params.city);

    this.ok(res, fillDTO(OfferShortRdo, offers));
  }

  private parseLimit(limit?: string): number | undefined {
    if (limit === undefined) {
      return undefined;
    }

    const parsedLimit = Number(limit);

    if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Параметр limit должен быть целым числом больше 0', 'OfferController');
    }

    return parsedLimit;
  }

  private notFound(offerId: string): HttpError {
    return new HttpError(StatusCodes.NOT_FOUND, `Предложение с id «${offerId}» не найдено`, 'OfferController');
  }
}
