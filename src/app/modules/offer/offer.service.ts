import {inject, injectable} from 'inversify';
import {DocumentType, ReturnModelType} from '@typegoose/typegoose';
import {Logger} from '../../../shared/libs/index.js';
import {City, Component} from '../../../shared/types/index.js';
import {OfferServiceInterface} from './offer-service.interface.js';
import {OfferEntity} from './offer.entity.js';
import {CreateOfferDto} from './dto/create-offer.dto.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';
import type {CommentEntity} from '../comment/comment.entity.js';
import type {UserEntity} from '../user/user.entity.js';

const DEFAULT_OFFER_COUNT = 60;
const PREMIUM_OFFER_COUNT = 3;

@injectable()
export class OfferService implements OfferServiceInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel)
    private readonly offerModel: ReturnModelType<typeof OfferEntity>,
    @inject(Component.CommentModel)
    private readonly commentModel: ReturnModelType<typeof CommentEntity>,
    @inject(Component.UserModel)
    private readonly userModel: ReturnModelType<typeof UserEntity>,
  ) {
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const {authorId, ...offerData} = dto;
    const offer = await this.offerModel.create({...offerData, author: authorId});
    this.logger.info(`Создано новое предложение: ${offer.title}`);
    return offer;
  }

  public async find(limit = DEFAULT_OFFER_COUNT): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find()
      .sort({postDate: -1})
      .limit(limit)
      .exec();
  }

  public async findById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(id)
      .populate('author')
      .exec();
  }

  public async findPremiumByCity(city: City): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({city, isPremium: true})
      .sort({postDate: -1})
      .limit(PREMIUM_OFFER_COUNT)
      .exec();
  }

  public async updateById(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(id, dto, {new: true})
      .populate('author')
      .exec();
  }

  public async deleteById(id: string): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel
      .findByIdAndDelete(id)
      .exec();

    if (offer) {
      await this.commentModel.deleteMany({offerId: id}).exec();
      await this.userModel.updateMany({favorites: id}, {$pull: {favorites: id}}).exec();
      this.logger.info(`Удалено предложение: ${offer.title}`);
    }

    return offer;
  }

  public async exists(id: string): Promise<boolean> {
    return (await this.offerModel.exists({_id: id})) !== null;
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {$inc: {commentsCount: 1}}, {new: true})
      .exec();
  }

  public async updateRating(offerId: string, rating: number): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {rating}, {new: true})
      .exec();
  }
}
