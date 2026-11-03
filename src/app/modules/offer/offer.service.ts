import {inject, injectable} from 'inversify';
import {DocumentType, ReturnModelType} from '@typegoose/typegoose';
import {Logger} from '../../../shared/libs/index.js';
import {Component} from '../../../shared/types/index.js';
import {OfferServiceInterface} from './offer-service.interface.js';
import {OfferEntity} from './offer.entity.js';
import {CreateOfferDto} from './dto/create-offer.dto.js';

@injectable()
export class OfferService implements OfferServiceInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel)
    private readonly offerModel: ReturnModelType<typeof OfferEntity>,
  ) {
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const offer = await this.offerModel.create(dto);
    this.logger.info(`Создано новое предложение: ${offer.title}`);
    return offer;
  }

  public async findById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(id).exec();
  }
}
